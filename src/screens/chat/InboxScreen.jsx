import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING } from '../../utils/theme';
import { CONVERSATIONS } from '../../data/conversations';
import {
  deleteConversation,
  loadUserConversations,
  subscribeToUserConversations,
} from '../../services/chatService';

export default function InboxScreen({ navigate, currentUser }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const hasCurrentUser = Boolean(currentUser?.id);
  const [conversations, setConversations] = useState(hasCurrentUser ? [] : CONVERSATIONS);
  const [loading, setLoading] = useState(hasCurrentUser);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = null;

    if (!hasCurrentUser) {
      setConversations(CONVERSATIONS);
      setLoading(false);
      return undefined;
    }

    const handleLoadedConversations = (realConversations) => {
      if (!isMounted) return;
      setConversations(realConversations.length > 0 ? realConversations : CONVERSATIONS);
      setLoading(false);
    };

    const handleLoadError = (error) => {
      console.error('Erro ao carregar conversas:', error);
      if (isMounted) {
        setConversations(CONVERSATIONS);
        setLoading(false);
      }
    };

    const loadConversations = async () => {
      try {
        setLoading(true);
        const realConversations = await loadUserConversations(currentUser);
        handleLoadedConversations(realConversations);

        unsubscribe = subscribeToUserConversations(
          currentUser,
          handleLoadedConversations,
          handleLoadError,
        );
      } catch (error) {
        handleLoadError(error);
      }
    };

    loadConversations();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [currentUser, hasCurrentUser]);

  const handleOpenProfile = useCallback((otherUserId) => {
    if (!otherUserId || otherUserId === 'unknown') {
      Alert.alert('Profile', 'This profile is not available.');
      return;
    }

    navigate('PublicProfile', { sellerId: otherUserId });
  }, [navigate]);

  const handleDeleteConversation = useCallback((conversationId) => {
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
              await deleteConversation(conversationId);
              setConversations((prev) => prev.filter((conversation) => conversation.id !== conversationId));
            } catch (error) {
              Alert.alert('Delete chat', error.message || 'Could not delete this conversation.');
            }
          },
        },
      ],
    );
  }, []);

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      activeOpacity={0.7}
      onPress={() => navigate('Chat', { conversationId: item.id })}
      testID={`conversation-${item.id}`}
    >
      <TouchableOpacity
        style={styles.avatarContainer}
        activeOpacity={0.75}
        onPress={(event) => {
          event?.stopPropagation?.();
          handleOpenProfile(item.otherUser.id);
        }}
        testID={`conversation-profile-${item.id}`}
        accessibilityLabel={`Open ${item.otherUser.name} profile`}
      >
        <Image source={{ uri: item.otherUser.photo }} style={styles.avatar} />
        {item.unreadCount > 0 && (
          <View style={styles.unreadDot} />
        )}
      </TouchableOpacity>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text
            style={[
              styles.userName,
              item.unreadCount > 0 && styles.userNameUnread,
            ]}
            numberOfLines={1}
          >
            {item.otherUser.name}
          </Text>
          <Text
            style={[
              styles.timestamp,
              item.unreadCount > 0 && styles.timestampUnread,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.lastMessageUnread,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(event) => {
          event?.stopPropagation?.();
          handleDeleteConversation(item.id);
        }}
        testID={`conversation-delete-${item.id}`}
        accessibilityLabel="Delete chat"
      >
        <Text style={styles.deleteButtonText}>⌫</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} testID="inbox-screen">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.logo}>EduCycle</Text>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight} />
      </View>

<<<<<<< HEAD
      <FlatList
        data={CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer} testID="inbox-empty-state">
            <Ionicons name="chatbubble-outline" size={48} color={colors.textMuted} style={{ marginBottom: SPACING.md }} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyDescription}>
              When you contact a seller or receive a message, it will appear here.
            </Text>
          </View>
        }
      />
=======
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer} testID="inbox-empty-state">
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptyDescription}>
                When you contact a seller or receive a message, it will appear here.
              </Text>
            </View>
          }
        />
      )}
>>>>>>> 44c57db57fa6f40d5bf8a43da55dc0886877b6b4
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.horizontal,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    logo: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: -0.5,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
    },
    headerRight: {
      width: 60,
    },
    listContent: {
      flexGrow: 1,
    },
    conversationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.horizontal,
      paddingVertical: 14,
    },
    avatarContainer: {
      position: 'relative',
      marginRight: 14,
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.border,
    },
    unreadDot: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.background,
    },
    conversationContent: {
      flex: 1,
    },
    deleteButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    deleteButtonText: {
      color: colors.danger || colors.text,
      fontSize: 16,
      fontWeight: '700',
    },
    conversationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    userNameUnread: {
      fontWeight: '800',
    },
    timestamp: {
      fontSize: 13,
      color: colors.textMuted,
    },
    timestampUnread: {
      color: colors.primary,
      fontWeight: '600',
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    lastMessage: {
      fontSize: 14,
      color: colors.textMuted,
      flex: 1,
      marginRight: 8,
    },
    lastMessageUnread: {
      color: colors.textSecondary,
      fontWeight: '600',
    },
    unreadBadge: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    unreadBadgeText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: SPACING.horizontal + 52 + 14,
      marginRight: SPACING.horizontal,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPACING.lg,
      paddingTop: 80,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 15,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
}
