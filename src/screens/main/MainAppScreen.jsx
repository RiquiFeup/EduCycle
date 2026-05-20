import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewListingScreen from '../listing/NewListingScreen.jsx';
import ListingDetailsScreen from '../listing/ListingDetailsScreen.jsx';
import HomeScreen from './HomeScreen.jsx';
import WishlistScreen from '../listing/WishlistScreen.jsx';
import PrivateProfileScreen from '../profile/PrivateProfileScreen';
import PublicProfileScreen from '../profile/PublicProfileScreen';
import InboxScreen from '../chat/InboxScreen';
import ChatScreen from '../chat/ChatScreen';
import ShoppingCartScreen from './ShoppingCartScreen';
import { UserProvider } from '../../contexts/UserContext.jsx';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, RADIUS } from '../../utils/theme.js';

function PlaceholderTabScreen({
  title,
  description,
  badge,
  primaryActionLabel,
  secondaryActionLabel,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView
      style={styles.placeholderSafeArea}
      testID={`placeholder-${title.toLowerCase()}-screen`}
    >
      <StatusBar barStyle={colors.text === '#DFF0E8' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={styles.placeholderContainer}>
        <View style={styles.placeholderBadge}>
          <Text style={styles.placeholderBadgeText}>{badge}</Text>
        </View>

        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderDescription}>{description}</Text>

        <View style={styles.placeholderActions}>
          <View style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>{primaryActionLabel}</Text>
          </View>

          <View style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>{secondaryActionLabel}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const TABS = [
  { key: 'Home', label: 'Home', icon: '⌂' },
  { key: 'Saved', label: 'Wishlist', icon: '♡' },
  { key: 'Sell', label: 'Sell', icon: '+' },
  { key: 'Messages', label: 'Inbox', icon: '✉' },
  { key: 'Profile', label: 'Profile', icon: '◉' },
];

const ROOT_TABS = new Set(['Home', 'Saved', 'Sell', 'Messages', 'Profile']);

export default function MainAppScreen({ user, onUserUpdate, onLogout }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [activeScreen, setActiveScreen] = useState('Home');
  const [screenParams, setScreenParams] = useState({});
  const [screenHistory, setScreenHistory] = useState([]);

  const contextInitialUser = useMemo(() => user, [user]);

  const goBack = () => {
    setScreenHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = prev.slice(0, -1);
      const previous = newHistory[newHistory.length - 1] ?? { screen: 'Home', params: {} };
      setActiveScreen(previous.screen);
      setScreenParams(previous.params);
      return newHistory;
    });
  };

  const navigate = (screen, params = {}) => {
    if (screen === 'Menu' || screen === 'Home') {
      setActiveScreen('Home');
      setScreenParams({});
      setScreenHistory([]);
      return;
    }

    if (screen === 'PrivateProfile') {
      setActiveScreen('Profile');
      setScreenParams({});
      setScreenHistory([]);
      return;
    }

    if (screen === 'PublicProfile') {
      setScreenHistory((prev) => [...prev, { screen: activeScreen, params: screenParams }]);
      setActiveScreen('PublicProfile');
      setScreenParams(params);
      return;
    }

    if (screen === 'Chat') {
      setScreenHistory((prev) => [...prev, { screen: activeScreen, params: screenParams }]);
      setActiveScreen('Chat');
      setScreenParams(params);
      return;
    }

    if (screen === 'ListingDetails') {
      setScreenHistory((prev) => [...prev, { screen: activeScreen, params: screenParams }]);
      setActiveScreen('ListingDetails');
      setScreenParams(params);
      return;
    }

    if (screen === 'ShoppingCart') {
      setScreenHistory((prev) => [...prev, { screen: activeScreen, params: screenParams }]);
      setActiveScreen('ShoppingCart');
      setScreenParams(params);
      return;
    }

    setActiveScreen(screen);
    setScreenParams(params);
    if (!ROOT_TABS.has(screen)) {
      setScreenHistory((prev) => [...prev, { screen: activeScreen, params: screenParams }]);
    } else {
      setScreenHistory([]);
    }
  };

  const swipeRef = useRef(null);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          gestureState.dx > 20 &&
          Math.abs(gestureState.dy) < 80 &&
          gestureState.moveX - gestureState.x0 < 60
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 60 && gestureState.vx > 0.3) {
          swipeRef.current?.();
        }
      },
    }),
  ).current;

  swipeRef.current = goBack;

  const renderCurrentScreen = () => {
    switch (activeScreen) {
      case 'Saved':
        return <WishlistScreen navigate={navigate} />;

      case 'Sell':
        return (
          <NewListingScreen
            onPublish={(newListing) => {
              console.log('Published listing:', newListing);
              setActiveScreen('Home');
              setScreenParams({});
            }}
          />
        );

      case 'Messages':
        return <InboxScreen navigate={navigate} />;

      case 'Chat':
        return (
          <ChatScreen
            conversationId={screenParams?.conversationId}
            navigate={navigate}
          />
        );

      case 'Profile':
        return <PrivateProfileScreen navigate={navigate} />;

      case 'PublicProfile':
        return (
          <PublicProfileScreen
            isPreview={screenParams?.isPreview}
            sellerId={screenParams?.sellerId}
            navigate={navigate}
          />
        );

      case 'ListingDetails':
        return (
          <ListingDetailsScreen
            listing={screenParams?.listing}
            navigate={navigate}
          />
        );

      case 'ShoppingCart':
        return <ShoppingCartScreen navigate={navigate} />;

      case 'Home':
      default:
        return <HomeScreen navigate={navigate} />;
    }
  };

  const selectedTabKey =
    activeScreen === 'PublicProfile'
      ? 'Profile'
      : activeScreen === 'Chat'
        ? 'Messages'
        : activeScreen;

  return (
    <UserProvider
      initialUser={contextInitialUser}
      onUserUpdate={onUserUpdate}
      onLogout={onLogout}
    >
      <View
        style={styles.appContainer}
        testID="main-app-screen"
        {...(screenHistory.length > 0 ? panResponder.panHandlers : {})}
      >
        <View style={styles.screenContainer}>{renderCurrentScreen()}</View>

        <View style={styles.tabBar} testID="main-tab-bar">
          {TABS.map((tab) => {
            const isActive = selectedTabKey === tab.key;

            return (
              <Pressable
                key={tab.key}
                testID={`tab-${tab.key.toLowerCase()}`}
                style={({ pressed }) => [
                  styles.tabItem,
                  isActive && styles.tabItemActive,
                  pressed && styles.tabItemPressed,
                ]}
                onPress={() => navigate(tab.key)}
              >
                <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                  {tab.icon}
                </Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </UserProvider>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenContainer: {
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      paddingTop: 10,
      paddingBottom: Platform.OS === 'ios' ? 24 : 12,
      paddingHorizontal: SPACING.sm,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.button,
      minHeight: 52,
      gap: 4,
    },
    tabItemActive: {
      backgroundColor: colors.primarySoft,
    },
    tabItemPressed: {
      opacity: 0.85,
    },
    tabIcon: {
      fontSize: 18,
      color: colors.textMuted,
      fontWeight: '700',
    },
    tabIconActive: {
      color: colors.primary,
    },
    tabLabel: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '600',
    },
    tabLabelActive: {
      color: colors.primary,
    },
    placeholderSafeArea: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    placeholderContainer: {
      flex: 1,
      paddingHorizontal: SPACING.lg,
      justifyContent: 'center',
    },
    placeholderBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primarySoft,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginBottom: SPACING.md,
    },
    placeholderBadgeText: {
      color: colors.primary,
      fontWeight: '700',
      fontSize: 12,
    },
    placeholderTitle: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.7,
      marginBottom: 12,
    },
    placeholderDescription: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.textSecondary,
    },
    placeholderActions: {
      marginTop: SPACING.xl,
      gap: SPACING.sm,
    },
    primaryAction: {
      minHeight: 50,
      backgroundColor: colors.primary,
      borderRadius: RADIUS.button,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryActionText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 15,
    },
    secondaryAction: {
      minHeight: 50,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.button,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.borderDark,
    },
    secondaryActionText: {
      color: colors.text,
      fontWeight: '600',
      fontSize: 14,
    },
  });
}
