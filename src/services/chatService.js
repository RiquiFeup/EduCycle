import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../utils/firebase';

const userRef = (userId) => doc(db, 'users', userId);
const conversationsRef = collection(db, 'conversations');
const conversationRef = (conversationId) => doc(db, 'conversations', conversationId);
const messagesRef = (conversationId) => collection(db, 'conversations', conversationId, 'messages');

const getStableId = (id, data = {}) => String(id || data.id || data.uid || 'unknown');

const getFallbackPhoto = (id) => `https://i.pravatar.cc/150?u=${encodeURIComponent(id || 'unknown')}`;

const cleanUser = (id, data = {}) => {
  const stableId = getStableId(id, data);

  return {
    id: stableId,
    name: data.name || data.username || data.displayName || data.email || 'Unknown User',
    email: data.email || '',
    photo: data.photo || data.photoURL || data.profilePhoto || data.profileImage || data.avatar || getFallbackPhoto(stableId),
    course: data.course || '',
    allowMessages: data.allowMessages !== false,
  };
};

const timestampToMillis = (value) => {
  if (!value) return Date.now();
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? Date.now() : parsed;
  }
  if (typeof value.toMillis === 'function') return value.toMillis();
  return Date.now();
};

const formatConversationTime = (value) => {
  const date = new Date(timestampToMillis(value));
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const mapMessageDoc = (messageDoc) => {
  const data = messageDoc.data();

  return {
    id: messageDoc.id,
    text: data.text || '',
    senderId: data.senderId,
    timestamp: timestampToMillis(data.createdAt),
  };
};

const getStoredChatUser = async (userId) => {
  if (!userId) return null;

  const snapshot = await getDoc(userRef(userId));
  return snapshot.exists() ? cleanUser(snapshot.id, snapshot.data()) : null;
};

const resolveParticipant = async (userId, storedParticipant = {}) => {
  const storedUser = await getStoredChatUser(userId).catch(() => null);
  return cleanUser(userId, {
    ...(storedUser || {}),
    ...(storedParticipant || {}),
  });
};

const buildConversationDetails = async (conversationId, data, currentUser) => {
  const currentUserId = currentUser?.id;
  const participantIds = data.participantIds || [];
  const otherUserId = participantIds.find((id) => id !== currentUserId) || participantIds[0];
  const participants = data.participants || {};
  const otherUser = await resolveParticipant(otherUserId, participants[otherUserId]);

  return {
    id: conversationId,
    ...data,
    otherUser,
  };
};

const buildConversationSummaries = async (conversationDocs, currentUser) => {
  const currentUserId = currentUser?.id;

  const conversations = await Promise.all(
    conversationDocs.map(async (conversationDoc) => {
      const data = conversationDoc.data();
      const participantIds = data.participantIds || [];
      const otherUserId = participantIds.find((id) => id !== currentUserId);

      if (!otherUserId) return null;

      const otherUser = await resolveParticipant(otherUserId, data.participants?.[otherUserId]);

      return {
        id: conversationDoc.id,
        otherUser,
        lastMessage: data.lastMessage || 'No messages yet',
        timestamp: formatConversationTime(data.lastMessageAt || data.createdAt),
        unreadCount: 0,
        sortTime: timestampToMillis(data.lastMessageAt || data.createdAt),
      };
    }),
  );

  return conversations
    .filter(Boolean)
    .sort((a, b) => b.sortTime - a.sortTime);
};

export const getChatUser = async (userId) => {
  if (!userId) throw new Error('Recipient does not exist.');

  const user = await getStoredChatUser(userId);
  if (!user) throw new Error('Recipient does not exist.');
  if (!user.allowMessages) throw new Error('This user does not allow direct messages.');

  return user;
};

export const getConversationDetails = async ({ conversationId, currentUser }) => {
  if (!conversationId) return null;

  const snapshot = await getDoc(conversationRef(conversationId));
  if (!snapshot.exists()) return null;

  return buildConversationDetails(snapshot.id, snapshot.data(), currentUser);
};

export const getOrCreateConversation = async ({ currentUser, recipientId }) => {
  const currentUserId = currentUser?.id;

  if (!currentUserId) throw new Error('You must be logged in to send messages.');
  if (!recipientId) throw new Error('Recipient does not exist.');
  if (currentUserId === recipientId) throw new Error('You cannot message yourself.');

  const recipient = await getChatUser(recipientId);
  const storedCurrentUser = await getStoredChatUser(currentUserId).catch(() => null);
  const currentParticipant = cleanUser(currentUserId, {
    ...(storedCurrentUser || {}),
    ...(currentUser || {}),
  });

  const existingQuery = query(conversationsRef, where('participantIds', 'array-contains', currentUserId));
  const existingSnapshot = await getDocs(existingQuery);
  const existing = existingSnapshot.docs.find((conversationDoc) => {
    const ids = conversationDoc.data().participantIds || [];
    return ids.includes(recipientId);
  });

  if (existing) {
    const existingData = existing.data();
    const participants = {
      ...(existingData.participants || {}),
      [currentUserId]: currentParticipant,
      [recipientId]: recipient,
    };

    await setDoc(conversationRef(existing.id), { participants }, { merge: true });

    return {
      id: existing.id,
      ...existingData,
      participants,
      otherUser: recipient,
    };
  }

  const conversationDoc = await addDoc(conversationsRef, {
    participantIds: [currentUserId, recipientId],
    participants: {
      [currentUserId]: currentParticipant,
      [recipientId]: recipient,
    },
    lastMessage: '',
    lastMessageAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  return {
    id: conversationDoc.id,
    participantIds: [currentUserId, recipientId],
    participants: {
      [currentUserId]: currentParticipant,
      [recipientId]: recipient,
    },
    otherUser: recipient,
  };
};

export const sendDirectMessage = async ({ conversationId, senderId, text }) => {
  const trimmed = text?.trim();

  if (!conversationId) throw new Error('Conversation not found.');
  if (!senderId) throw new Error('You must be logged in to send messages.');
  if (!trimmed) throw new Error('Message cannot be empty.');

  const messageDoc = await addDoc(messagesRef(conversationId), {
    text: trimmed,
    senderId,
    createdAt: serverTimestamp(),
  });

  await updateDoc(conversationRef(conversationId), {
    lastMessage: trimmed,
    lastMessageAt: serverTimestamp(),
  });

  return {
    id: messageDoc.id,
    text: trimmed,
    senderId,
    timestamp: Date.now(),
  };
};

export const loadConversationMessages = async (conversationId) => {
  if (!conversationId) return [];

  const messagesQuery = query(messagesRef(conversationId), orderBy('createdAt', 'asc'), limit(100));
  const snapshot = await getDocs(messagesQuery);

  return snapshot.docs.map(mapMessageDoc);
};

export const subscribeToConversationMessages = (conversationId, onMessages, onError) => {
  if (!conversationId) return () => {};

  const messagesQuery = query(messagesRef(conversationId), orderBy('createdAt', 'asc'), limit(100));

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      onMessages(snapshot.docs.map(mapMessageDoc));
    },
    onError,
  );
};

export const subscribeToConversationDetails = (conversationId, currentUser, onConversation, onError) => {
  if (!conversationId) return () => {};

  return onSnapshot(
    conversationRef(conversationId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onConversation(null);
        return;
      }

      buildConversationDetails(snapshot.id, snapshot.data(), currentUser)
        .then(onConversation)
        .catch(onError);
    },
    onError,
  );
};

export const loadUserConversations = async (currentUser) => {
  const currentUserId = currentUser?.id;
  if (!currentUserId) return [];

  const conversationsQuery = query(conversationsRef, where('participantIds', 'array-contains', currentUserId));
  const snapshot = await getDocs(conversationsQuery);

  return buildConversationSummaries(snapshot.docs, currentUser);
};

export const subscribeToUserConversations = (currentUser, onConversations, onError) => {
  const currentUserId = currentUser?.id;
  if (!currentUserId) return () => {};

  const conversationsQuery = query(conversationsRef, where('participantIds', 'array-contains', currentUserId));

  return onSnapshot(
    conversationsQuery,
    (snapshot) => {
      buildConversationSummaries(snapshot.docs, currentUser)
        .then(onConversations)
        .catch(onError);
    },
    onError,
  );
};

export const deleteConversation = async (conversationId) => {
  if (!conversationId) throw new Error('Conversation not found.');

  const snapshot = await getDocs(query(messagesRef(conversationId), limit(500)));

  await Promise.all(
    snapshot.docs.map((messageDoc) =>
      deleteDoc(doc(db, 'conversations', conversationId, 'messages', messageDoc.id)),
    ),
  );

  await deleteDoc(conversationRef(conversationId));
};
