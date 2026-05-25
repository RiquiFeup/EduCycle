import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { sortListingsData } from '../../utils/sorting';

import SearchBar from '../../components/SearchBar';
import DropdownField from '../listing/components/DropdownField';
import ListingCard from '../../components/ListingCard';
import SectionHeader from '../../components/SectionHeader';
import FilterModal from '../../components/FilterModal';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING } from '../../utils/theme';
import { PAGE_SIZE } from '../../data/listings';

export default function HomeScreen({ navigate }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [queryText, setQueryText] = useState('');
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sortField, setSortField] = useState('Date');
  const [sortDirection, setSortDirection] = useState('desc');
  const SORT_FIELDS = ['Date', 'Price', 'Title', 'Subject'];

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const getSectionTitle = () => {
    if (sortField === 'Date') return sortDirection === 'desc' ? 'Recently Added' : 'Listed for Longer';
    if (sortField === 'Price') return sortDirection === 'asc' ? 'Lowest Price First' : 'Highest Price First';
    if (sortField === 'Title') return sortDirection === 'asc' ? 'Alphabetical (A-Z)' : 'Alphabetical (Z-A)';
    if (sortField === 'Subject') return sortDirection === 'asc' ? 'Subjects (A-Z)' : 'Subjects (Z-A)';
    return 'Listings';
  };

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

  const filteredListings = useMemo(() => {
    let result = listings;

    if (filters.category) {
      result = result.filter(listing => listing.subject === filters.category);
    }
    if (filters.academicLevel) {
      result = result.filter(listing => listing.campus === filters.academicLevel);
    }
    if (filters.minPrice) {
      result = result.filter(listing => parseFloat(listing.price) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(listing => parseFloat(listing.price) <= parseFloat(filters.maxPrice));
    }
    if (queryText.trim()) {
      const q = queryText.toLowerCase();
      result = result.filter((listing) =>
        listing.title?.toLowerCase().includes(q) ||
        listing.campus?.toLowerCase().includes(q) ||
        listing.institution?.toLowerCase().includes(q) ||
        (listing.subject && listing.subject.toLowerCase().includes(q)) ||
        (listing.isbn && listing.isbn.toLowerCase().includes(q))
      );
    }

    return result;
  }, [listings, queryText, filters]);

  const processedListings = useMemo(() => {
    const sorted = sortListingsData(filteredListings, sortField, sortDirection);

    const isSearchingOrFiltering = queryText.trim() || Object.values(filters).some(Boolean);
    return isSearchingOrFiltering ? sorted : sorted.slice(0, page * PAGE_SIZE);
  }, [filteredListings, sortField, sortDirection, page, queryText, filters]);

  const hasMore = useMemo(() => {
    const isSearchingOrFiltering = queryText.trim() || Object.values(filters).some(Boolean);
    return !isSearchingOrFiltering && page * PAGE_SIZE < filteredListings.length;
  }, [filteredListings.length, page, queryText, filters]);

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
  for (let index = 0; index < processedListings.length; index += 2) {
    rows.push(processedListings.slice(index, index + 2));
  }

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading more...</Text>
        </View>
      );
    }

    if (!hasMore && listings.length > 0 && !queryText.trim()) {
      return (
        <View style={styles.endFooter}>
          <Text style={styles.endText}>You've seen all listings</Text>
        </View>
      );
    }

    return null;
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.stateText}>A procurar anúncios...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} testID="home-feed-screen">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View style={styles.header}>
        <Text style={styles.logo}>EduCycle</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity
            style={styles.notifBtn}
            testID="home-cart-button"
            onPress={() => navigate('ShoppingCart')}
          >
            <Ionicons name="cart-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifBtn} testID="home-notifications-button">
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
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

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, zIndex: 10 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingRight: 8 }}
                >
                  {SORT_FIELDS.map((field) => (
                    <TouchableOpacity
                      key={field}
                      onPress={() => {
                        if (sortField === field) {
                          toggleSortDirection();
                        } else {
                          setSortField(field);
                        }
                      }}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: sortField === field ? colors.primary : colors.background,
                        borderWidth: 1,
                        borderColor: sortField === field ? colors.primary : colors.border,
                        justifyContent: 'center'
                      }}
                    >
                      <Text style={{
                        color: sortField === field ? '#FFF' : colors.text,
                        fontWeight: sortField === field ? '600' : '400'
                      }}>
                        {field}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  onPress={toggleSortDirection}
                  testID="home-sort-toggle"
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: colors.background,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: colors.border,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 4
                  }}
                >
                  <Ionicons name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            <SectionHeader
              title={getSectionTitle()}
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
            <Ionicons name="file-tray-outline" size={40} color={colors.textMuted} style={{ marginBottom: 12 }} />
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

function createStyles(colors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    stateContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
    stateText: { marginTop: SPACING.md, color: colors.textMuted, fontSize: 15 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.horizontal, paddingVertical: 12, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border },
    logo: { fontSize: 22, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
    notifBtn: { position: 'relative', padding: 4 },
    notifBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: colors.danger, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
    notifBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
    scrollContent: { paddingBottom: SPACING.xl },
    searchContainer: { paddingHorizontal: SPACING.horizontal, paddingVertical: 12 },
    row: { flexDirection: 'row', paddingHorizontal: SPACING.horizontal, gap: 12, marginBottom: 0 },
    emptySlot: { flex: 1 },
    empty: { alignItems: 'center', paddingTop: 48, paddingHorizontal: SPACING.lg },
    emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 6 },
    emptyHint: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
    loadingFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.md, gap: SPACING.sm },
    loadingText: { color: colors.textMuted, fontSize: 13 },
    endFooter: { alignItems: 'center', paddingVertical: 20 },
    endText: { color: colors.textMuted, fontSize: 13 },
  });
}
