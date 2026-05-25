import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, RADIUS } from '../../utils/theme';
import { CONVERSATIONS, MESSAGES } from '../../data/conversations';
import {
  deleteConversation,
  getConversationDetails,
  getOrCreateConversation,
  loadConversationMessages,
  sendDirectMessage,
  subscribeToConversationDetails,
  subscribeToConversationMessages,
} from '../../services/chatService';

export default function ChatScreen({ conversationId, recipientId, navigate, currentUser }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [activeConversationId, setActiveConversationId] = useState(conversationId || null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(Boolean(recipientId || conversationId));
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const flatListRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeMessages = null;
    let unsubscribeConversation = null;

    const fallbackForConversation = (targetConversationId) => {
      const fallbackConversation = CONVERSATIONS.find((conversation) => conversation.id === targetConversationId);

      return {
        otherUser: fallbackConversation?.otherUser || {
          id: recipientId || 'unknown',
          name: 'Unknown User',
          photo: 'https://i.pravatar.cc/150?u=unknown',
        },
        messages: MESSAGES[targetConversationId] || [],
      };
    };

    const attachRealtimeListeners = (targetConversationId, fallbackMessages = [], listenToConversation = true) => {
      unsubscribeMessages?.();
      unsubscribeConversation?.();

      unsubscribeMessages = subscribeToConversationMessages(
        targetConversationId,
        (liveMessages) => {
          if (!isMounted) return;
          setMessages(liveMessages.length > 0 ? liveMessages : fallbackMessages);
        },
        (error) => {
          console.error('Erro ao acompanhar mensagens:', error);
          if (isMounted && fallbackMessages.length > 0) setMessages(fallbackMessages);
        },
      );

      if (listenToConversation) {
        unsubscribeConversation = subscribeToConversationDetails(
          targetConversationId,
          currentUser,
          (conversation) => {
            if (!isMounted) return;

            if (!conversation) {
              Alert.alert('Message', 'This conversation was deleted.');
              navigate('Messages');
              return;
            }

            setOtherUser(conversation.otherUser);
          },
          (error) => {
            console.error('Erro ao acompanhar conversa:', error);
          },
        );
      }
    };

    const loadChat = async () => {
      try {
        setLoading(true);

        let targetConversationId = conversationId;
        let loadedOtherUser = null;
        let fallbackMessages = [];
        let hasRealConversation = false;

        if (recipientId) {
          const conversation = await getOrCreateConversation({ currentUser, recipientId });
          targetConversationId = conversation.id;
          loadedOtherUser = conversation.otherUser;
          hasRealConversation = true;
        } else if (conversationId) {
          const conversation = await getConversationDetails({ conversationId, currentUser });

          if (conversation) {
            loadedOtherUser = conversation.otherUser;
            hasRealConversation = true;
          } else {
            const fallback = fallbackForConversation(conversationId);
            loadedOtherUser = fallback.otherUser;
            fallbackMessages = fallback.messages;
          }
        }

        if (!isMounted) return;

        setActiveConversationId(targetConversationId || null);
        setOtherUser(loadedOtherUser);

        const loadedMessages = targetConversationId
          ? await loadConversationMessages(targetConversationId)
          : [];

        if (!isMounted) return;

        const initialMessages = loadedMessages.length > 0 ? loadedMessages : fallbackMessages;
        setMessages(initialMessages);

        if (targetConversationId) {
          attachRealtimeListeners(targetConversationId, fallbackMessages, hasRealConversation);
        }
      } catch (error) {
        Alert.alert('Message', error.message || 'Could not open this conversation.');
        navigate('Messages');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadChat();

    return () => {
      isMounted = false;
      unsubscribeMessages?.();
      unsubscribeConversation?.();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [conversationId, currentUser, navigate, recipientId]);

  const displayOtherUser = otherUser || {
    name: 'Unknown User',
    photo: 'https://i.pravatar.cc/150?u=unknown',
  };

  const handleSend = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      Alert.alert('Message', 'Message cannot be empty.');
      return;
    }

    try {
      setSending(true);

      let targetConversationId = activeConversationId;
      if (!targetConversationId && recipientId) {
        const conversation = await getOrCreateConversation({ currentUser, recipientId });
        targetConversationId = conversation.id;
        setActiveConversationId(conversation.id);
        setOtherUser(conversation.otherUser);
      }

      const newMessage = await sendDirectMessage({
        conversationId: targetConversationId,
        senderId: currentUser?.id,
        text: trimmed,
      });

      setMessages((prev) => [...prev, newMessage]);
      setInputText('');

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert('Message', error.message || 'Could not send this message.');
    } finally {
      setSending(false);
    }
  }, [activeConversationId, currentUser, inputText, recipientId]);

  const handleOpenProfile = useCallback(() => {
    const profileUserId = displayOtherUser?.id || recipientId;

    if (!profileUserId || profileUserId === 'unknown') {
      Alert.alert('Profile', 'This profile is not available.');
      return;
    }

    navigate('PublicProfile', { sellerId: profileUserId });
  }, [displayOtherUser?.id, navigate, recipientId]);

  const handleDeleteConversation = useCallback(() => {
    if (!activeConversationId) {
      navigate('Messages');
      return;
    }

    Alert.alert(
      'Delete chat',
      'This will delete the conversation for everyone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteConversation(activeConversationId);
              setMessages([]);
              navigate('Messages');
            } catch (error) {
              Alert.alert('Delete chat', error.message || 'Could not delete this conversation.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  }, [activeConversationId, navigate]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderMessage = ({ item, index }) => {
    const isMe = item.senderId === currentUser?.id || item.senderId === 'me';
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isMe && (!prevMessage || prevMessage.senderId === currentUser?.id || prevMessage.senderId === 'me');

    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.messageRowMe : styles.messageRowOther,
        ]}
      >
        {!isMe && (
          <View style={styles.avatarSlot}>
            {showAvatar ? (
              <Image source={{ uri: displayOtherUser.photo }} style={styles.messageAvatar} />
            ) : null}
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isMe ? styles.bubbleMe : styles.bubbleOther,
          ]}
        >
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isMe ? styles.messageTimeMe : styles.messageTimeOther]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} testID="chat-screen">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigate('Messages')}
          testID="chat-back-button"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerCenter}
          activeOpacity={0.75}
          onPress={handleOpenProfile}
          testID="chat-profile-button"
        >
          <Image source={{ uri: displayOtherUser.photo }} style={styles.headerAvatar} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName} numberOfLines={1}>{displayOtherUser.name}</Text>
            <Text style={styles.headerStatus}>{loading ? 'Loading...' : 'Online'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.headerAction, deleting && styles.headerActionDisabled]}
          onPress={handleDeleteConversation}
          disabled={deleting}
          testID="chat-delete-button"
          accessibilityLabel="Delete chat"
        >
          <Text style={styles.headerActionText}>⌫</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {loading ? (
          <View style={styles.emptyChat}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatIcon}>👋</Text>
                <Text style={styles.emptyChatText}>
                  Say hello to {displayOtherUser.name}!
                </Text>
              </View>
            }
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
            testID="chat-message-input"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            testID="chat-send-button"
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    flex: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.horizontal,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    backBtn: {
      padding: 4,
      width: 36,
    },
    backIcon: {
      fontSize: 24,
      color: colors.text,
    },
    headerCenter: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    headerTextContainer: {
      flex: 1,
    },
    headerAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.border,
    },
    headerName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    headerStatus: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    headerAction: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerActionDisabled: {
      opacity: 0.5,
    },
    headerActionText: {
      fontSize: 18,
      color: colors.danger || colors.text,
      fontWeight: '700',
    },
    messageList: {
      paddingHorizontal: SPACING.horizontal,
      paddingVertical: SPACING.md,
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    messageRow: {
      flexDirection: 'row',
      marginBottom: 6,
      alignItems: 'flex-end',
    },
    messageRowMe: {
      justifyContent: 'flex-end',
    },
    messageRowOther: {
      justifyContent: 'flex-start',
    },
    avatarSlot: {
      width: 30,
      marginRight: 8,
    },
    messageAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.border,
    },
    messageBubble: {
      maxWidth: '75%',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 18,
    },
    bubbleMe: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: 4,
    },
    bubbleOther: {
      backgroundColor: colors.surface,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    messageText: {
      fontSize: 15,
      lineHeight: 20,
    },
    messageTextMe: {
      color: '#FFFFFF',
    },
    messageTextOther: {
      color: colors.text,
    },
    messageTime: {
      fontSize: 11,
      marginTop: 4,
    },
    messageTimeMe: {
      color: 'rgba(255,255,255,0.7)',
      textAlign: 'right',
    },
    messageTimeOther: {
      color: colors.textMuted,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: SPACING.horizontal,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
      gap: 10,
    },
    textInput: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      borderWidth: 1,
      borderColor: colors.borderDark,
      borderRadius: RADIUS.input,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: colors.borderDark,
    },
    sendButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
    },
    emptyChat: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 60,
    },
    emptyChatIcon: {
      fontSize: 48,
      marginBottom: 12,
    },
    emptyChatText: {
      fontSize: 16,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
}
