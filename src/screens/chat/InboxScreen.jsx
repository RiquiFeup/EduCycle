import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING } from '../../utils/theme';
import { CONVERSATIONS } from '../../data/conversations';

export default function InboxScreen({ navigate }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      activeOpacity={0.7}
      onPress={() => navigate('Chat', { conversationId: item.id })}
      testID={`conversation-${item.id}`}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.otherUser.photo }} style={styles.avatar} />
        {item.unreadCount > 0 && (
          <View style={styles.unreadDot} />
        )}
      </View>

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
