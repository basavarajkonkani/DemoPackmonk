import React, { useState } from 'react';
import { ScrollView, View, Dimensions, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector, useAppDispatch } from '../store';
import { selectConfigurableProductsList } from '../store/configurableCatalogSlice';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { FontAwesome5 } from '@expo/vector-icons';
import { IMAGES, POUCH_TYPE_IMAGES } from '../constants/images';
import FilterPanel, { FilterOptions } from '../components/FilterPanel';
import { getScrollViewBottomPaddingWithTabBar } from '../utils/layoutUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CategoryFilter = 'all' | 'pouch' | 'box' | 'mailer' | 'bag' | 'tape';

const CATEGORIES: { key: CategoryFilter; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: 'border-all' },
  { key: 'pouch', label: 'Pouches', icon: 'shopping-bag' },
  { key: 'box', label: 'Boxes', icon: 'box-open' },
  { key: 'mailer', label: 'Mailers', icon: 'mail-bulk' },
  { key: 'bag', label: 'Bags', icon: 'shopping-bag' },
  { key: 'tape', label: 'Tapes', icon: 'tape' },
];

// Pouch sub-type cards shown when 'pouch' category is selected
const POUCH_TYPES = [
  {
    key: 'gold',
    label: 'Gold Standy Pouch',
    subtitle: 'Premium • From ₹5.50/pc',
    image: POUCH_TYPE_IMAGES.gold,
    recommended: true,
  },
  {
    key: 'silver',
    label: 'Silver Standy Pouch',
    subtitle: 'Classic • From ₹4.80/pc',
    image: POUCH_TYPE_IMAGES.silver,
  },
  {
    key: 'milky',
    label: 'Milky Standy Pouch',
    subtitle: 'Elegant • From ₹4.20/pc',
    image: POUCH_TYPE_IMAGES.milky,
  },
  {
    key: 'kraft-brown',
    label: 'Kraft Standy (Brown)',
    subtitle: 'Eco-Friendly • From ₹4.50/pc',
    image: POUCH_TYPE_IMAGES['kraft-brown'],
  },
  {
    key: 'kraft-window-brown',
    label: 'Kraft Window (Brown)',
    subtitle: 'With Window • From ₹5.80/pc',
    image: POUCH_TYPE_IMAGES['kraft-window-brown'],
  },
  {
    key: 'kraft-window-white',
    label: 'Kraft Window (White)',
    subtitle: 'Premium Eco • From ₹6.20/pc',
    image: POUCH_TYPE_IMAGES['kraft-window-white'],
  },
];

const SORT_OPTIONS = ['Popular', 'Price: Low', 'Price: High', 'Eco Rating', 'Newest'];

const ProductsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectConfigurableProductsList);
  const [selectedCat, setSelectedCat] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Popular');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    materials: [],
    priceRange: { min: 0, max: 10000 },
    sizes: [],
    features: [],
    ecoRating: null,
    inStockOnly: false,
  });

  const handleSelectProduct = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handlePouchTypeSelect = () => {
    // Navigate to the streamlined pouch configurator
    navigation.navigate('StreamlinedPouchConfigurator');
  };

  const handleReadyStock = () => {
    navigation.navigate('ReadyStockProducts');
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  const activeFiltersCount = 
    activeFilters.materials.length + 
    activeFilters.sizes.length + 
    activeFilters.features.length + 
    (activeFilters.ecoRating ? 1 : 0) + 
    (activeFilters.inStockOnly ? 1 : 0) +
    (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000 ? 1 : 0);

  const filtered = products
    .filter((p) => {
      // 'pouch' category shows bag products (existing data) but we redirect to configurator
      const matchCat =
        selectedCat === 'all' ||
        selectedCat === 'pouch'
          ? p.category === 'bag'
          : p.category === selectedCat;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply advanced filters
      const matchPrice = p.basePrice >= activeFilters.priceRange.min && p.basePrice <= activeFilters.priceRange.max;
      const matchEcoRating = !activeFilters.ecoRating || p.ecoFriendlyRating >= activeFilters.ecoRating;
      
      return matchCat && matchSearch && matchPrice && matchEcoRating;
    })
    .sort((a, b) => {
      if (sortOption === 'Price: Low') return a.basePrice - b.basePrice;
      if (sortOption === 'Price: High') return b.basePrice - a.basePrice;
      if (sortOption === 'Eco Rating') return b.ecoFriendlyRating - a.ecoFriendlyRating;
      if (sortOption === 'Newest') return 0; // Would sort by creation date if available
      return 0;
    });

  return (
    <Container>
      <Header navigation={navigation} />

      {/* Search + Filter */}
      <SearchBar>
        <SearchInner>
          <FontAwesome5 name="search" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
          <SearchInput
            placeholder="Search packaging products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </SearchInner>
        <FilterIconBtn onPress={() => setShowFilterPanel(true)}>
          <FontAwesome5 name="sliders-h" size={15} color="#0F8A3C" />
          {activeFiltersCount > 0 && (
            <FilterBadge>
              <FilterBadgeText>{activeFiltersCount}</FilterBadgeText>
            </FilterBadge>
          )}
        </FilterIconBtn>
      </SearchBar>

      {/* Active Filters Pills */}
      {activeFiltersCount > 0 && (
        <ActiveFiltersRow>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}>
            {activeFilters.materials.map(material => (
              <ActiveFilterPill key={material}>
                <ActiveFilterText>{material}</ActiveFilterText>
                <RemoveFilterBtn onPress={() => {
                  setActiveFilters(prev => ({
                    ...prev,
                    materials: prev.materials.filter(m => m !== material)
                  }));
                }}>
                  <FontAwesome5 name="times" size={8} color="#0F8A3C" />
                </RemoveFilterBtn>
              </ActiveFilterPill>
            ))}
            {activeFilters.inStockOnly && (
              <ActiveFilterPill>
                <ActiveFilterText>In Stock</ActiveFilterText>
                <RemoveFilterBtn onPress={() => {
                  setActiveFilters(prev => ({ ...prev, inStockOnly: false }));
                }}>
                  <FontAwesome5 name="times" size={8} color="#0F8A3C" />
                </RemoveFilterBtn>
              </ActiveFilterPill>
            )}
          </ScrollView>
        </ActiveFiltersRow>
      )}

      {/* Category Chips */}
      <ChipRow>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}>
          {CATEGORIES.map((cat) => {
            const active = selectedCat === cat.key;
            return (
              <CategoryChip key={cat.key} active={active} onPress={() => setSelectedCat(cat.key)} activeOpacity={0.8}>
                <FontAwesome5 name={cat.icon as any} size={11} color={active ? '#FFFFFF' : '#6B7280'} style={{ marginRight: 5 }} />
                <ChipText active={active}>{cat.label}</ChipText>
              </CategoryChip>
            );
          })}
        </ScrollView>
      </ChipRow>

      {/* Pouch configurator shortcut — shown when Pouches tab is active */}
      {selectedCat === 'pouch' && (
        <>
          {/* Ready Stock Banner */}
          <ReadyStockBanner onPress={handleReadyStock} activeOpacity={0.92}>
            <ReadyStockContent>
              <ReadyStockIcon>
                <FontAwesome5 name="shipping-fast" size={20} color="#0F8A3C" />
              </ReadyStockIcon>
              <ReadyStockText>
                <ReadyStockTitle>Ready Stock Products</ReadyStockTitle>
                <ReadyStockDesc>Plain pouches • Ships within 24hrs • No MOQ</ReadyStockDesc>
              </ReadyStockText>
              <FontAwesome5 name="chevron-right" size={16} color="#0F8A3C" />
            </ReadyStockContent>
          </ReadyStockBanner>

          <PouchBanner onPress={handlePouchTypeSelect} activeOpacity={0.92}>
            <PouchBannerImage source={IMAGES.goldStandyZipperPouch} resizeMode="cover" />
            <PouchBannerOverlay />
            <PouchBannerContent>
              <PouchBannerTitle>Configure Your Pouch</PouchBannerTitle>
              <PouchBannerDesc>Type → window → material → capacity → order</PouchBannerDesc>
              <PouchBannerBtn>
                <PouchBannerBtnText>Start</PouchBannerBtnText>
                <FontAwesome5 name="arrow-right" size={11} color="#FFF" style={{ marginLeft: 5 }} />
              </PouchBannerBtn>
            </PouchBannerContent>
          </PouchBanner>
        </>
      )}

      {/* Pouch type cards — shown when Pouches tab is active */}
      {selectedCat === 'pouch' && (
        <PouchTypeSection>
          <PouchTypeSectionTitle>Select Pouch Category</PouchTypeSectionTitle>
          {POUCH_TYPES.map((pt) => (
            <PouchTypeCard
              key={pt.key}
              onPress={handlePouchTypeSelect}
              activeOpacity={0.85}
            >
              <PouchTypeIconWrap>
                <PouchTypeImg source={pt.image} resizeMode="contain" />
              </PouchTypeIconWrap>
              <PouchTypeBody>
                <PouchTypeLabel>{pt.label}</PouchTypeLabel>
                <PouchTypeSubtitle>{pt.subtitle}</PouchTypeSubtitle>
              </PouchTypeBody>
              {pt.recommended && (
                <RecommendedBadge>
                  <RecommendedBadgeText>Popular</RecommendedBadgeText>
                </RecommendedBadge>
              )}
              <FontAwesome5 name="chevron-right" size={14} color="#D1D5DB" style={{ marginLeft: 8 }} />
            </PouchTypeCard>
          ))}
        </PouchTypeSection>
      )}

      {/* Sort Row — only for non-pouch categories */}
      {selectedCat !== 'pouch' && (
        <SortRow>
          <ResultCount>{filtered.length} Products</ResultCount>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
            {SORT_OPTIONS.map((s) => (
              <SortChip key={s} active={sortOption === s} onPress={() => setSortOption(s)} activeOpacity={0.8}>
                <SortChipText active={sortOption === s}>{s}</SortChipText>
              </SortChip>
            ))}
          </ScrollView>
        </SortRow>
      )}

      {/* Product List — only for non-pouch categories */}
      {selectedCat !== 'pouch' && (
        <ProductList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: getScrollViewBottomPaddingWithTabBar() }}
        >
          {filtered.length === 0 ? (
            <EmptyWrap>
              <FontAwesome5 name="search-minus" size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
              <EmptyTitle>No products found</EmptyTitle>
              <EmptyDesc>Try adjusting your search or filters</EmptyDesc>
            </EmptyWrap>
          ) : (
            filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleSelectProduct(product.id)}
              />
            ))
          )}
        </ProductList>
      )}

      {/* Filter Panel Modal */}
      <FilterPanel
        visible={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </Container>
  );
};

export default ProductsScreen;

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

const ContentWrapper = styled.View`
  width: 100%;
  max-width: 900px;
  align-self: center;
`;

const SearchBar = styled.View`
  flex-direction: row; align-items: center; padding: 14px 16px 8px;
`;
const SearchInner = styled.View`
  flex: 1; flex-direction: row; align-items: center;
  background-color: #FFFFFF; height: 46px; border-radius: 14px;
  padding-horizontal: 14px; margin-right: 10px;
  border-width: 1px; border-color: #E5E7EB;
`;
const SearchInput = styled.TextInput`
  flex: 1; font-size: 14px; color: #111827;
`;
const FilterIconBtn = styled.TouchableOpacity`
  width: 46px; height: 46px; border-radius: 14px;
  background-color: #DCFCE7; align-items: center; justify-content: center;
  border-width: 1px; border-color: #BBF7D0;
  position: relative;
`;

const FilterBadge = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: #DC2626;
  align-items: center;
  justify-content: center;
`;

const FilterBadgeText = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: #FFFFFF;
`;

const ActiveFiltersRow = styled.View`
  height: 36px;
  justify-content: center;
`;

const ActiveFilterPill = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 6px 10px;
  border-radius: 16px;
  background-color: #DCFCE7;
  border-width: 1px;
  border-color: #BBF7D0;
  margin-right: 8px;
`;

const ActiveFilterText = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: #0F8A3C;
  margin-right: 6px;
`;

const RemoveFilterBtn = styled.TouchableOpacity`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #FFFFFF;
  align-items: center;
  justify-content: center;
`;

const ReadyStockBanner = styled.TouchableOpacity`
  margin: 12px 16px 8px;
  border-radius: 16px;
  background-color: #FFFFFF;
  border-width: 2px;
  border-color: #0F8A3C;
  overflow: hidden;
`;

const ReadyStockContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
`;

const ReadyStockIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #DCFCE7;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const ReadyStockText = styled.View`
  flex: 1;
`;

const ReadyStockTitle = styled.Text`
  font-size: 15px;
  font-weight: 800;
  color: #0F8A3C;
  margin-bottom: 3px;
`;

const ReadyStockDesc = styled.Text`
  font-size: 12px;
  color: #6B7280;
  font-weight: 500;
`;

const ChipRow = styled.View`height: 46px; justify-content: center;`;

const CategoryChip = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row; align-items: center;
  padding: 8px 14px; border-radius: 20px; margin-right: 8px;
  background-color: ${({ active }) => active ? '#0F8A3C' : '#FFFFFF'};
  border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
`;
const ChipText = styled.Text<{ active: boolean }>`
  font-size: 12px; font-weight: 600;
  color: ${({ active }) => active ? '#FFFFFF' : '#6B7280'};
`;

// ── Pouch banner & type cards ───────────────────────────────────────────────
const PouchBanner = styled.TouchableOpacity`
  margin: 12px 16px 8px; border-radius: 16px; overflow: hidden; height: 120px;
`;
const PouchBannerImage = styled.Image`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;
`;
const PouchBannerOverlay = styled.View`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 138, 60, 0.82);
`;
const PouchBannerContent = styled.View`
  flex: 1; justify-content: center; padding: 18px 20px;
`;
const PouchBannerTitle = styled.Text`font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 4px;`;
const PouchBannerDesc = styled.Text`font-size: 12px; color: rgba(255,255,255,0.88); margin-bottom: 12px;`;
const PouchBannerBtn = styled.View`
  flex-direction: row; align-items: center; align-self: flex-start;
  background-color: #ffffff; padding: 8px 14px; border-radius: 10px;
`;
const PouchBannerBtnText = styled.Text`font-size: 13px; font-weight: 700; color: #0f8a3c;`;

const PouchTypeSection = styled.ScrollView`flex: 1;`;
const PouchTypeSectionTitle = styled.Text`
  font-size: 13px; font-weight: 700; color: #374151;
  text-transform: uppercase; letter-spacing: 0.5px;
  padding: 8px 16px 12px;
`;
const PouchTypeCard = styled.TouchableOpacity`
  flex-direction: row; align-items: center;
  background-color: #FFFFFF; border-radius: 16px; margin: 0 16px 10px;
  padding: 16px; border-width: 1px; border-color: #F3F4F6;
`;
const PouchTypeIconWrap = styled.View`
  width: 52px; height: 52px; border-radius: 14px;
  background-color: #f9fafb; align-items: center; justify-content: center;
  margin-right: 14px; overflow: hidden;
`;
const PouchTypeImg = styled.Image`width: 48px; height: 48px;`;
const PouchTypeBody = styled.View`flex: 1;`;
const PouchTypeLabel = styled.Text`font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 3px;`;
const PouchTypeSubtitle = styled.Text`font-size: 12px; color: #9CA3AF;`;
const RecommendedBadge = styled.View`
  background-color: #DCFCE7; padding: 4px 8px; border-radius: 8px; margin-right: 6px;
`;
const RecommendedBadgeText = styled.Text`font-size: 10px; font-weight: 700; color: #0F8A3C;`;

const SortRow = styled.View`
  flex-direction: row; align-items: center; padding: 8px 16px 4px;
`;
const ResultCount = styled.Text`
  font-size: 13px; font-weight: 600; color: #6B7280; margin-right: 12px; min-width: 80px;
`;
const SortChip = styled.TouchableOpacity<{ active: boolean }>`
  padding: 6px 14px; border-radius: 20px; margin-right: 8px;
  background-color: ${({ active }) => active ? '#111827' : '#FFFFFF'};
  border-width: 1px; border-color: ${({ active }) => active ? '#111827' : '#E5E7EB'};
`;
const SortChipText = styled.Text<{ active: boolean }>`
  font-size: 12px; font-weight: 600;
  color: ${({ active }) => active ? '#FFFFFF' : '#6B7280'};
`;

const ProductList = styled.ScrollView`flex: 1;`;

const EmptyWrap = styled.View`
  align-items: center; justify-content: center; padding-vertical: 80px;
`;
const EmptyTitle = styled.Text`font-size: 17px; font-weight: 700; color: #374151; margin-bottom: 6px;`;
const EmptyDesc = styled.Text`font-size: 14px; color: #9CA3AF;`;
