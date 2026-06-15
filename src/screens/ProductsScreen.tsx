import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector, useAppDispatch } from '../store';
import { selectProductsList, selectProduct } from '../store/productsSlice';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { FontAwesome5 } from '@expo/vector-icons';
import { IMAGES, POUCH_TYPE_IMAGES } from '../constants/images';

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
    key: 'plain',
    label: 'Plain Pouches',
    subtitle: 'No Printing',
    image: POUCH_TYPE_IMAGES.plain,
  },
  {
    key: 'printed',
    label: 'Printed Pouches',
    subtitle: 'Custom Printing',
    image: POUCH_TYPE_IMAGES.printed,
    recommended: true,
  },
  {
    key: 'kraft',
    label: 'Kraft Pouches',
    subtitle: 'Natural & Premium Look',
    image: POUCH_TYPE_IMAGES.kraft,
  },
];

const SORT_OPTIONS = ['Popular', 'Price: Low', 'Price: High', 'Eco Rating'];

const ProductsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProductsList);
  const [selectedCat, setSelectedCat] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Popular');

  const handleSelectProduct = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handlePouchTypeSelect = () => {
    // Navigate to the step-by-step pouch configurator
    navigation.navigate('PouchConfigurator');
  };

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
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortOption === 'Price: Low') return a.basePrice - b.basePrice;
      if (sortOption === 'Price: High') return b.basePrice - a.basePrice;
      if (sortOption === 'Eco Rating') return b.ecoFriendlyRating - a.ecoFriendlyRating;
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
        <FilterIconBtn onPress={() => setSelectedCat('all')}>
          <FontAwesome5 name="sliders-h" size={15} color="#0F8A3C" />
        </FilterIconBtn>
      </SearchBar>

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
        <PouchBanner onPress={handlePouchTypeSelect} activeOpacity={0.92}>
          <PouchBannerImage source={IMAGES.batterPouch} resizeMode="cover" />
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
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
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
    </Container>
  );
};

export default ProductsScreen;

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

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
const PouchTypeImg = styled.Image`width: 44px; height: 44px;`;
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
