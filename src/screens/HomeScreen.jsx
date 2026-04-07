import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import SectionHeader from '../components/SectionHeader';
import { COLORS, SPACING } from '../utils/theme';
import { LISTINGS, PAGE_SIZE } from '../data/listings';

export default function HomeScreen({ navigate }) {
  const [query, setQuery] = useState('');
  const [listings, setListings] = useState(LISTINGS);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filtered = query.trim()
    ? listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query.toLowerCase()) ||
          listing.institution.toLowerCase().includes(query.toLowerCase()),
      )
    : listings.slice(0, page * PAGE_SIZE);

  const hasMore = !query.trim() && page * PAGE_SIZE < listings.length;

  const handleToggleFavourite = (id) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id
          ? { ...listing, isFavourited: !listing.isFavourited }
          : listing,
      ),
    );
  };

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);

    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 600);
  }, [hasMore, isLoadingMore]);

  const rows = [];
  for (let index = 0; index < filtered.length; index += 2) {
    rows.push(filtered.slice(index, index + 2));
  }

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading more...</Text>
        </View>
      );
    }

    if (!hasMore && listings.length > 0 && !query.trim()) {
      return (
        <View style={styles.endFooter}>
          <Text style={styles.endText}>You've seen all listings 🎉</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea} testID="home-feed-screen">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.logo}>EduCycle</Text>
        <TouchableOpacity style={styles.notifBtn} testID="home-notifications-button">
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="Search books, calculators, notes..."
                testID="search-bar"
              />
            </View>
            <SectionHeader
              title="Recently Added"
              actionText="See all"
              onActionPress={() => {}}
            />
          </>
        }
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            {row.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onToggleFavourite={handleToggleFavourite}
                onPress={() => navigate?.('PublicProfile')}
              />
            ))}
            {row.length === 1 ? <View style={styles.emptySlot} /> : null}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty} testID="empty-state">
            <Text style={styles.emptyText} testID="empty-state-text">
              No listings found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.horizontal,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  notifBtn: {
    position: 'relative',
    padding: 4,
  },
  notifIcon: {
    fontSize: 22,
  },
  notifBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  searchContainer: {
    paddingHorizontal: SPACING.horizontal,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.horizontal,
    gap: SPACING.cardGap,
    marginBottom: 0,
  },
  emptySlot: {
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  endFooter: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  endText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});