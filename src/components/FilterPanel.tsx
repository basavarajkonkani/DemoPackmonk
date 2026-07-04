import React, { useState } from 'react';
import { Modal, ScrollView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

export interface FilterOptions {
  materials: string[];
  priceRange: { min: number; max: number };
  sizes: string[];
  features: string[];
  ecoRating: number | null;
  inStockOnly: boolean;
}

interface FilterPanelProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
}

const MATERIALS = ['BOPP', 'Kraft', 'Metalized', 'Polyethylene', 'Paper', 'Corrugated'];
const SIZES = ['Small', 'Medium', 'Large', 'X-Large', 'Custom'];
const FEATURES = ['Zipper', 'Window', 'Handle', 'Resealable', 'Tear Notch', 'Hanging Hole'];
const PRICE_RANGES = [
  { label: 'Under ₹50', min: 0, max: 50 },
  { label: '₹50 - ₹100', min: 50, max: 100 },
  { label: '₹100 - ₹200', min: 100, max: 200 },
  { label: '₹200 - ₹500', min: 200, max: 500 },
  { label: 'Above ₹500', min: 500, max: 10000 },
];

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  visible, 
  onClose, 
  onApply,
  initialFilters 
}) => {
  const [materials, setMaterials] = useState<string[]>(initialFilters?.materials || []);
  const [priceRange, setPriceRange] = useState(initialFilters?.priceRange || { min: 0, max: 10000 });
  const [sizes, setSizes] = useState<string[]>(initialFilters?.sizes || []);
  const [features, setFeatures] = useState<string[]>(initialFilters?.features || []);
  const [ecoRating, setEcoRating] = useState<number | null>(initialFilters?.ecoRating || null);
  const [inStockOnly, setInStockOnly] = useState(initialFilters?.inStockOnly || false);

  const toggleMaterial = (material: string) => {
    setMaterials(prev => 
      prev.includes(material) 
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const toggleSize = (size: string) => {
    setSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleFeature = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleClearAll = () => {
    setMaterials([]);
    setPriceRange({ min: 0, max: 10000 });
    setSizes([]);
    setFeatures([]);
    setEcoRating(null);
    setInStockOnly(false);
  };

  const handleApply = () => {
    onApply({
      materials,
      priceRange,
      sizes,
      features,
      ecoRating,
      inStockOnly,
    });
    onClose();
  };

  const activeFiltersCount = 
    materials.length + 
    sizes.length + 
    features.length + 
    (ecoRating ? 1 : 0) + 
    (inStockOnly ? 1 : 0) +
    (priceRange.min > 0 || priceRange.max < 10000 ? 1 : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <Container>
        {/* Header */}
        <Header>
          <CloseButton onPress={onClose} activeOpacity={0.8}>
            <FontAwesome5 name="times" size={18} color="#111827" />
          </CloseButton>
          <HeaderTitle>Filters</HeaderTitle>
          <ClearButton onPress={handleClearAll} activeOpacity={0.8}>
            <ClearButtonText>Clear All</ClearButtonText>
          </ClearButton>
        </Header>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        >
          {/* In Stock Only */}
          <Section>
            <SectionTitle>Availability</SectionTitle>
            <CheckboxRow onPress={() => setInStockOnly(!inStockOnly)} activeOpacity={0.8}>
              <Checkbox checked={inStockOnly}>
                {inStockOnly && <FontAwesome5 name="check" size={12} color="#FFFFFF" />}
              </Checkbox>
              <CheckboxLabel>Show in-stock items only</CheckboxLabel>
            </CheckboxRow>
          </Section>

          {/* Materials */}
          <Section>
            <SectionTitle>Material Type</SectionTitle>
            <ChipGrid>
              {MATERIALS.map(material => (
                <FilterChip
                  key={material}
                  active={materials.includes(material)}
                  onPress={() => toggleMaterial(material)}
                  activeOpacity={0.8}
                >
                  <ChipText active={materials.includes(material)}>{material}</ChipText>
                </FilterChip>
              ))}
            </ChipGrid>
          </Section>

          {/* Price Range */}
          <Section>
            <SectionTitle>Price Range (per unit)</SectionTitle>
            {PRICE_RANGES.map(range => {
              const isSelected = priceRange.min === range.min && priceRange.max === range.max;
              return (
                <RadioRow
                  key={range.label}
                  onPress={() => setPriceRange({ min: range.min, max: range.max })}
                  activeOpacity={0.8}
                >
                  <RadioButton selected={isSelected}>
                    {isSelected && <RadioInner />}
                  </RadioButton>
                  <RadioLabel>{range.label}</RadioLabel>
                </RadioRow>
              );
            })}
          </Section>

          {/* Sizes */}
          <Section>
            <SectionTitle>Size</SectionTitle>
            <ChipGrid>
              {SIZES.map(size => (
                <FilterChip
                  key={size}
                  active={sizes.includes(size)}
                  onPress={() => toggleSize(size)}
                  activeOpacity={0.8}
                >
                  <ChipText active={sizes.includes(size)}>{size}</ChipText>
                </FilterChip>
              ))}
            </ChipGrid>
          </Section>

          {/* Features */}
          <Section>
            <SectionTitle>Features</SectionTitle>
            <ChipGrid>
              {FEATURES.map(feature => (
                <FilterChip
                  key={feature}
                  active={features.includes(feature)}
                  onPress={() => toggleFeature(feature)}
                  activeOpacity={0.8}
                >
                  <ChipText active={features.includes(feature)}>{feature}</ChipText>
                </FilterChip>
              ))}
            </ChipGrid>
          </Section>

          {/* Eco Rating */}
          <Section>
            <SectionTitle>Eco-Friendly Rating</SectionTitle>
            <StarRow>
              {[1, 2, 3, 4, 5].map(rating => (
                <StarButton
                  key={rating}
                  onPress={() => setEcoRating(ecoRating === rating ? null : rating)}
                  activeOpacity={0.8}
                >
                  <FontAwesome5
                    name="leaf"
                    size={20}
                    color={ecoRating && rating <= ecoRating ? '#0F8A3C' : '#D1D5DB'}
                    solid={ecoRating && rating <= ecoRating}
                  />
                </StarButton>
              ))}
            </StarRow>
            {ecoRating && (
              <RatingText>{ecoRating}+ rating</RatingText>
            )}
          </Section>
        </ScrollView>

        {/* Bottom Action Bar */}
        <BottomBar>
          <ApplyButton onPress={handleApply} activeOpacity={0.9}>
            <ApplyButtonText>
              Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </ApplyButtonText>
          </ApplyButton>
        </BottomBar>
      </Container>
    </Modal>
  );
};

export default FilterPanel;

const Container = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

const Header = styled.View`
  height: ${Platform.OS === 'ios' ? '88px' : '56px'};
  padding-top: ${Platform.OS === 'ios' ? '44px' : '0px'};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #F3F4F6;
  background-color: #FFFFFF;
`;

const CloseButton = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background-color: #F9FAFB;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

const ClearButton = styled.TouchableOpacity`
  padding: 8px;
`;

const ClearButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #0F8A3C;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CheckboxRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 10px;
`;

const Checkbox = styled.View<{ checked: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border-width: 2px;
  border-color: ${({ checked }: { checked: boolean }) => checked ? '#0F8A3C' : '#D1D5DB'};
  background-color: ${({ checked }: { checked: boolean }) => checked ? '#0F8A3C' : '#FFFFFF'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const CheckboxLabel = styled.Text`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

const ChipGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterChip = styled.TouchableOpacity<{ active: boolean }>`
  padding: 10px 16px;
  border-radius: 10px;
  background-color: ${({ active }: { active: boolean }) => active ? '#0F8A3C' : '#F9FAFB'};
  border-width: 1.5px;
  border-color: ${({ active }: { active: boolean }) => active ? '#0F8A3C' : '#E5E7EB'};
`;

const ChipText = styled.Text<{ active: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ active }: { active: boolean }) => active ? '#FFFFFF' : '#6B7280'};
`;

const RadioRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 10px;
  margin-bottom: 8px;
`;

const RadioButton = styled.View<{ selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border-width: 2px;
  border-color: ${({ selected }: { selected: boolean }) => selected ? '#0F8A3C' : '#D1D5DB'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const RadioInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #0F8A3C;
`;

const RadioLabel = styled.Text`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

const StarRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const StarButton = styled.TouchableOpacity`
  padding: 8px;
`;

const RatingText = styled.Text`
  font-size: 12px;
  color: #6B7280;
  margin-top: 8px;
  margin-left: 8px;
`;

const BottomBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px ${Platform.OS === 'ios' ? '32px' : '20px'};
  background-color: #FFFFFF;
  border-top-width: 1px;
  border-top-color: #F3F4F6;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 8;
`;

const ApplyButton = styled.TouchableOpacity`
  height: 50px;
  background-color: #0F8A3C;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
`;

const ApplyButtonText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
`;
