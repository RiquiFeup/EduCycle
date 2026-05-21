import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
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
const messagesRef = (conversationId) => collection(db, 'conversations', conversationId, 'messages');

const cleanUser = (id, data = {}) => ({
  id,
  name: data.name || data.email || 'Unknown User',
  email: data.email || '',
  photo: data.photo || `https://i.pravatar.cc/150?u=${id}`,
  allowMessages: data.allowMessages !== false,
});

const timestampToMillis = (value) => {
  if (!value) return Date.now();
  if (typeof value === 'number') return value;
  if (typeof value.toMillis === 'function') return value.toMillis();
  return Date.now();
};

const formatConversationTime = (value) => {
  const date = new Date(timestampToMillis(value));
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const getChatUser = async (userId) => {
  if (!userId) throw new Error('Recipient does not exist.');

  const snapshot = await getDoc(userRef(userId));
  if (!snapshot.exists()) throw new Error('Recipient does not exist.');

  const user = cleanUser(snapshot.id, snapshot.data());
  if (!user.allowMessages) throw new Error('This user does not allow direct messages.');

  return user;
};

export const getOrCreateConversation = async ({ currentUser, recipientId }) => {
  const currentUserId = currentUser?.id;

  if (!currentUserId) throw new Error('You must be logged in to send messages.');
  if (!recipientId) throw new Error('Recipient does not exist.');
  if (currentUserId === recipientId) throw new Error('You cannot message yourself.');

  const recipient = await getChatUser(recipientId);
  const currentParticipant = cleanUser(currentUserId, currentUser);

  const existingQuery = query(conversationsRef, where('participantIds', 'array-contains', currentUserId));
  const existingSnapshot = await getDocs(existingQuery);
  const existing = existingSnapshot.docs.find((conversationDoc) => {
    const ids = conversationDoc.data().participantIds || [];
    return ids.includes(recipientId);
  });

  if (existing) {
    return { id: existing.id, ...existing.data(), otherUser: recipient };
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

  await updateDoc(doc(db, 'conversations', conversationId), {
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

  return snapshot.docs.map((messageDoc) => {
    const data = messageDoc.data();
    return {
      id: messageDoc.id,
      text: data.text || '',
      senderId: data.senderId,
      timestamp: timestampToMillis(data.createdAt),
    };
  });
};

export const loadUserConversations = async (currentUser) => {
  const currentUserId = currentUser?.id;
  if (!currentUserId) return [];

  const conversationsQuery = query(conversationsRef, where('participantIds', 'array-contains', currentUserId));
  const snapshot = await getDocs(conversationsQuery);

  return snapshot.docs
    .map((conversationDoc) => {
      const data = conversationDoc.data();
      const otherUserId = (data.participantIds || []).find((id) => id !== currentUserId);
      const otherUser = data.participants?.[otherUserId] || cleanUser(otherUserId, {});

      return {
        id: conversationDoc.id,
        otherUser,
        lastMessage: data.lastMessage || 'No messages yet',
        timestamp: formatConversationTime(data.lastMessageAt),
        unreadCount: 0,
        sortTime: timestampToMillis(data.lastMessageAt),
      };
    })
    .sort((a, b) => b.sortTime - a.sortTime);
};
