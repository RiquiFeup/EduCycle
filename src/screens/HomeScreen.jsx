import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';

import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import SectionHeader from '../components/SectionHeader';
import FilterModal from '../components/FilterModal';
import { COLORS, SPACING } from '../utils/theme';
import { PAGE_SIZE } from '../data/listings';

export default function HomeScreen({ navigate }) {
  const [queryText, setQueryText] = useState('');
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    academicLevel: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const realListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setListings(realListings);
      } catch (error) {
        console.error("Erro a carregar listagem da base de dados: ", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filtered = listings.filter((listing) => {
    if (queryText.trim()) {
      const q = queryText.toLowerCase();
      const matchesSearch =
        listing.title?.toLowerCase().includes(q) ||
        listing.campus?.toLowerCase().includes(q) ||
        listing.institution?.toLowerCase().includes(q) ||
        (listing.subject && listing.subject.toLowerCase().includes(q)) ||
        (listing.isbn && listing.isbn.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // categoria
    if (filters.category && listing.subject !== filters.category) {
      return false;
    }

    // nível académico
    if (filters.academicLevel && listing.campus !== filters.academicLevel) {
      return false;
    }

    // preço
    const price = parseFloat(listing.price);
    const minPrice = parseFloat(filters.minPrice);
    const maxPrice = parseFloat(filters.maxPrice);

    if (!isNaN(minPrice) && (isNaN(price) || price < minPrice)) return false;
    if (!isNaN(maxPrice) && (isNaN(price) || price > maxPrice)) return false;

    return true;
  }).slice(0, page * PAGE_SIZE);

  const hasMore = !queryText.trim() && page * PAGE_SIZE < listings.length;

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

    if (!hasMore && listings.length > 0 && !queryText.trim()) {
      return (
        <View style={styles.endFooter}>
          <Text style={styles.endText}>You've seen all listings 🎉</Text>
        </View>
      );
    }

    return null;
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.stateText}>A procurar anúncios...</Text>
      </SafeAreaView>
    );
  }

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
        keyboardDismissMode="on-drag"
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <SearchBar
                value={queryText}
                onChangeText={setQueryText}
                placeholder="Search by title, ISBN, or subject..."
                testID="search-bar"
                onFilterPress={() => setFilterModalVisible(true)}
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
                onPress={() => navigate?.('ListingDetails', { listing: listing })}
              />
            ))}
            {row.length === 1 ? <View style={styles.emptySlot} /> : null}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty} testID="empty-state">
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle} testID="empty-state-text">
              {queryText.trim() || Object.values(filters).some(Boolean)
                ? `No results found for your filters`
                : 'No listings found.'}
            </Text>
            {queryText.trim() || Object.values(filters).some(Boolean) ? (
              <Text style={styles.emptyHint}>
                Try adjusting your search or clearing your filters.
              </Text>
            ) : null}
          </View>
        }
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => setFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  stateContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  stateText: { marginTop: SPACING.md, color: COLORS.textMuted, fontSize: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.horizontal, paddingVertical: 12, backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  logo: { fontSize: 22, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
  notifBtn: { position: 'relative', padding: 4 },
  notifIcon: { fontSize: 22 },
  notifBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.danger, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  scrollContent: { paddingBottom: SPACING.xl },
  searchContainer: { paddingHorizontal: SPACING.horizontal, paddingVertical: 12 },
  row: { flexDirection: 'row', paddingHorizontal: SPACING.horizontal, gap: SPACING.cardGap, marginBottom: 0 },
  emptySlot: { flex: 1 },
  empty: { alignItems: 'center', paddingTop: 48, paddingHorizontal: SPACING.lg },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: COLORS.text, fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 6 },
  emptyHint: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center' },
  loadingFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.md, gap: SPACING.sm },
  loadingText: { color: COLORS.textMuted, fontSize: 13 },
  endFooter: { alignItems: 'center', paddingVertical: 20 },
  endText: { color: COLORS.textMuted, fontSize: 13 },
});