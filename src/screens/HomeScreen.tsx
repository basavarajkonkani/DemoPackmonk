import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import styled from 'styled-components/native';
import { useAppSelector, useAppDispatch } from '../store';
import Header from '../components/Header';
import CartModal from '../components/CartModal';
import { FontAwesome5 } from '@expo/vector-icons';
import { selectOrdersList } from '../store/ordersSlice';
import { POUCH_TYPE_LABELS, WINDOW_LABELS, MATERIAL_LABELS } from '../store/pouchSlice';

// Local assets
const LOGO              = require('../../assets/logo (1).png');
const IMG_BANNER_DESIGN = require('../../assets/banner-design.jpg.jpeg');
const IMG_BATTER_POUCH  = require('../../assets/batter-pouch.jpg.jpeg');
const IMG_CENTER_SEAL   = require('../../assets/center-seal-pouch.jpg.jpeg');
const IMG_OFFER_BANNER  = require('../../assets/offer-banner.jpg.jpeg');

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [cartVisible, setCartVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartItemsCount = useAppSelector((state) => state.cart.items.length);
  const orders = useAppSelector(selectOrdersList);
  const recentOrders = orders.slice(0, 2);
  // Unread notification count — show active orders count as indicator
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered').length;

  return (
    <Container>
      {/* Top bar */}
      <TopBar>
        <LogoImg source={LOGO} resizeMode="contain" />
        <View style={{ flex: 1 }} />
        <NotifBtn onPress={() => navigation.navigate('Notifications')}>
          <FontAwesome5 name="bell" size={16} color="#374151" />
          {activeOrdersCount > 0 && (
            <NBadge><NBadgeText>{activeOrdersCount > 9 ? '9+' : activeOrdersCount}</NBadgeText></NBadge>
          )}
        </NotifBtn>
      </TopBar>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Greeting */}
        <GreetSection>
          <Hello>Hello, Customer <HelloEmoji>👋</HelloEmoji></Hello>
          <GoodText>Good to see you again!</GoodText>
        </GreetSection>

        {/* Search */}
        <SearchWrap>
          <FontAwesome5 name="search" size={13} color="#9CA3AF" style={{ marginRight: 8 }} />
          <SearchInput
            placeholder="Search for pouches, sizes..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => navigation.navigate('Products')}
          />
        </SearchWrap>

        {/* Hero Banner */}
        <HeroBanner onPress={() => navigation.navigate('PouchConfigurator')} activeOpacity={0.93}>
          <HeroBannerBg>
            <HeroBannerLeft>
              <HeroTitle>Premium Packaging{'\n'}For Every Product</HeroTitle>
              <HeroSubtitle>High quality | Customisable | Reliable</HeroSubtitle>
              <ExploreBtn activeOpacity={0.9}>
                <ExploreBtnText>Explore Now</ExploreBtnText>
              </ExploreBtn>
            </HeroBannerLeft>
            <HeroBannerRight>
              <BannerProductImg source={IMG_OFFER_BANNER} resizeMode="cover" />
            </HeroBannerRight>
          </HeroBannerBg>
        </HeroBanner>

        {/* Shop by Category */}
        <SectionRow>
          <SectionTitle>Shop by Category</SectionTitle>
        </SectionRow>
        <CatRow>
          <CatItem onPress={() => { navigation.navigate('PouchConfigurator'); }} activeOpacity={0.8}>
            <CatIconBox bgColor="#F3F4F6">
              <CatImg source={IMG_BATTER_POUCH} resizeMode="cover" />
            </CatIconBox>
            <CatLabel>Plain{'\n'}Pouches</CatLabel>
          </CatItem>
          <CatItem onPress={() => { navigation.navigate('PouchConfigurator'); }} activeOpacity={0.8}>
            <CatIconBox bgColor="#DCFCE7">
              <CatImg source={IMG_BANNER_DESIGN} resizeMode="cover" />
            </CatIconBox>
            <CatLabel>Printed{'\n'}Pouches</CatLabel>
          </CatItem>
          <CatItem onPress={() => { navigation.navigate('PouchConfigurator'); }} activeOpacity={0.8}>
            <CatIconBox bgColor="#FEF3C7">
              <CatImg source={IMG_CENTER_SEAL} resizeMode="cover" />
            </CatIconBox>
            <CatLabel>Kraft{'\n'}Pouches</CatLabel>
          </CatItem>
        </CatRow>

        {/* Quick Reorder */}
        <SectionRow>
          <SectionTitle>Quick Reorder</SectionTitle>
          <SeeAllBtn onPress={() => navigation.navigate('Orders')}>
            <SeeAllText>View All</SeeAllText>
          </SeeAllBtn>
        </SectionRow>

        {recentOrders.length === 0 ? (
          <NoOrdersCard>
            <FontAwesome5 name="box-open" size={28} color="#D1D5DB" style={{ marginBottom: 8 }} />
            <NoOrdersText>No orders yet. Configure your first pouch!</NoOrdersText>
            <ConfigurePouchBtn onPress={() => navigation.navigate('PouchConfigurator')} activeOpacity={0.9}>
              <ConfigurePouchBtnText>Configure Pouch</ConfigurePouchBtnText>
            </ConfigurePouchBtn>
          </NoOrdersCard>
        ) : (
          recentOrders.map((order) => {
            const firstItem = order.items[0];
            if (!firstItem) return null;
            const isPouch = firstItem.category === 'pouch';
            const specText = isPouch && firstItem.pouchConfig
              ? `${WINDOW_LABELS[firstItem.pouchConfig.windowOption]} • ${firstItem.pouchConfig.capacity} • ${MATERIAL_LABELS[firstItem.pouchConfig.materialType]}`
              : `${firstItem.design.length}" × ${firstItem.design.width}" · ${firstItem.design.materialId.replace(/-/g, ' ')}`;
            const currency = isPouch ? '₹' : '$';
            return (
              <ReorderCard key={order.id}>
                <ReorderImgWrap>
                  <ReorderImg source={IMG_BANNER_DESIGN} resizeMode="cover" />
                </ReorderImgWrap>
                <ReorderBody>
                  <ReorderName>{firstItem.name}</ReorderName>
                  <ReorderSpec>{specText}</ReorderSpec>
                  <ReorderSpec>Qty: {firstItem.quantity.toLocaleString()} pcs</ReorderSpec>
                  <ReorderPrice>{currency}{order.total.toLocaleString()}</ReorderPrice>
                </ReorderBody>
                <ReorderBtn onPress={() => navigation.navigate('PouchConfigurator')} activeOpacity={0.85}>
                  <ReorderBtnText>Reorder</ReorderBtnText>
                </ReorderBtn>
              </ReorderCard>
            );
          })
        )}

        {/* Spacer for bottom tab */}
        <View style={{ height: 8 }} />
      </ScrollView>

      <CartModal
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        onCheckoutSuccess={() => navigation.navigate('Checkout')}
        navigation={navigation}
      />
    </Container>
  );
};

export default HomeScreen;

const Container = styled.View`flex: 1; background-color: #FFFFFF;`;

const TopBar = styled.View`
  flex-direction: row; align-items: center;
  padding: ${Platform.OS === 'ios' ? '54px' : '16px'} 16px 12px;
  background-color: #FFFFFF;
`;
const LogoImg = styled.Image`
  width: 120px; height: 40px;
`;
const NotifBtn = styled.TouchableOpacity`
  width: 38px; height: 38px; border-radius: 10px;
  background-color: #F9FAFB; align-items: center; justify-content: center;
  border-width: 1px; border-color: #E5E7EB; position: relative;
`;
const NBadge = styled.View`
  position: absolute; top: 5px; right: 5px;
  width: 14px; height: 14px; border-radius: 7px;
  background-color: #EF4444; align-items: center; justify-content: center;
  border-width: 1.5px; border-color: #FFFFFF;
`;
const NBadgeText = styled.Text`font-size: 8px; font-weight: 800; color: #FFFFFF;`;

const GreetSection = styled.View`padding: 4px 16px 14px;`;
const Hello = styled.Text`font-size: 22px; font-weight: 800; color: #111827;`;
const HelloEmoji = styled.Text`font-size: 22px;`;
const GoodText = styled.Text`font-size: 13px; color: #9CA3AF; margin-top: 2px;`;

const SearchWrap = styled.View`
  flex-direction: row; align-items: center;
  margin: 0 16px 16px; height: 44px; border-radius: 12px;
  background-color: #F9FAFB; border-width: 1px; border-color: #E5E7EB;
  padding-horizontal: 14px;
`;
const SearchInput = styled.TextInput`flex: 1; font-size: 14px; color: #111827;`;

const HeroBanner = styled.TouchableOpacity`
  margin: 0 16px 20px; border-radius: 18px; overflow: hidden;
`;
const HeroBannerBg = styled.View`
  background-color: #0F8A3C; flex-direction: row;
  padding: 20px 18px; min-height: 130px;
`;
const HeroBannerLeft = styled.View`flex: 1;`;
const HeroTitle = styled.Text`
  font-size: 18px; font-weight: 800; color: #FFFFFF; line-height: 25px; margin-bottom: 4px;
`;
const HeroSubtitle = styled.Text`font-size: 11px; color: rgba(255,255,255,0.78); margin-bottom: 14px;`;
const ExploreBtn = styled.View`
  background-color: #FFFFFF; border-radius: 8px;
  padding: 8px 16px; align-self: flex-start;
`;
const ExploreBtnText = styled.Text`font-size: 13px; font-weight: 700; color: #0F8A3C;`;
const HeroBannerRight = styled.View`justify-content: center; align-items: center; width: 90px; height: 110px; border-radius: 12px; overflow: hidden;`;
const BannerProductImg = styled.Image`width: 100%; height: 100%; border-radius: 12px;`;

const SectionRow = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 4px 16px 10px;
`;
const SectionTitle = styled.Text`font-size: 16px; font-weight: 700; color: #111827;`;
const SeeAllBtn = styled.TouchableOpacity``;
const SeeAllText = styled.Text`font-size: 13px; color: #0F8A3C; font-weight: 600;`;

const CatRow = styled.View`flex-direction: row; padding: 0 16px 20px;`;
const CatItem = styled.TouchableOpacity`flex: 1; align-items: center; margin-right: 8px;`;
const CatIconBox = styled.View<{ bgColor: string }>`
  width: 64px; height: 64px; border-radius: 16px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-bottom: 8px;
  border-width: 1px; border-color: #E5E7EB; overflow: hidden;
`;
const CatImg = styled.Image`width: 64px; height: 64px; border-radius: 16px;`;
const CatLabel = styled.Text`font-size: 12px; font-weight: 600; color: #374151; text-align: center; line-height: 16px;`;

const ReorderCard = styled.View`
  flex-direction: row; align-items: center;
  background-color: #FFFFFF; border-radius: 14px; padding: 14px 16px;
  margin: 0 16px 10px; border-width: 1px; border-color: #E5E7EB;
  shadow-color: #000; shadow-offset: 0px 2px; shadow-opacity: 0.05; shadow-radius: 6px; elevation: 2;
`;
const ReorderImgWrap = styled.View`
  width: 50px; height: 50px; border-radius: 14px; overflow: hidden; margin-right: 12px;
`;
const ReorderImg = styled.Image`width: 50px; height: 50px;`;
const ReorderBody = styled.View`flex: 1;`;
const ReorderName = styled.Text`font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 2px;`;
const ReorderSpec = styled.Text`font-size: 11px; color: #9CA3AF;`;
const ReorderPrice = styled.Text`font-size: 15px; font-weight: 800; color: #111827; margin-top: 4px;`;
const ReorderBtn = styled.TouchableOpacity`
  background-color: #F0FDF4; border-radius: 10px; padding: 8px 14px;
  border-width: 1px; border-color: #DCFCE7;
`;
const ReorderBtnText = styled.Text`font-size: 13px; font-weight: 700; color: #0F8A3C;`;

const NoOrdersCard = styled.View`
  flex-direction: column; align-items: center; justify-content: center;
  background-color: #F9FAFB; border-radius: 14px; padding: 24px 16px;
  margin: 0 16px 10px; border-width: 1px; border-color: #E5E7EB;
`;
const NoOrdersText = styled.Text`font-size: 13px; color: #9CA3AF; text-align: center; margin-bottom: 14px;`;
const ConfigurePouchBtn = styled.TouchableOpacity`
  background-color: #0F8A3C; border-radius: 10px; padding: 10px 20px;
`;
const ConfigurePouchBtnText = styled.Text`font-size: 13px; font-weight: 700; color: #FFFFFF;`;


