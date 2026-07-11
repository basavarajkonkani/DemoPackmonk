import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { IMAGES } from '../constants/images';
import { AUTH_KEY } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const getResponsiveWidth = () => Math.min(SCREEN_WIDTH - 32, 900);
const BANNER_WIDTH = SCREEN_WIDTH - 32;

const BANNERS = [
  {
    id: '1',
    image: IMAGES.offerBanner,
    tag: 'Limited Time Offer',
    title: 'Premium Custom Pouches — From ₹2/unit',
    cta: 'Get Quotation',
    route: 'RequestQuote',
  },
  {
    id: '2',
    image: IMAGES.bannerDesign,
    tag: 'New Arrival',
    title: 'Custom Printed Packaging — From ₹3/unit',
    cta: 'Get Quotation',
    route: 'RequestQuote',
  },
];

const QUICK_ACTIONS = [
  { id: 'quote', label: 'Get Quotation', icon: 'file-alt', color: '#0F8A3C', bg: '#DCFCE7', route: 'RequestQuote' },
  { id: 'upload', label: 'Upload Design', icon: 'cube', color: '#2563EB', bg: '#DBEAFE', route: 'DesignStudio' },
  { id: 'reorder', label: 'Reorder', icon: 'sync', color: '#D97706', bg: '#FEF3C7', route: 'Orders' },
  { id: 'track', label: 'Track Shipment', icon: 'truck', color: '#7C3AED', bg: '#EDE9FE', route: 'ShipmentTracking' },
];

const CATEGORIES = [
  { id: 'standup', label: 'Stand Up\nPouches', image: IMAGES.printedStandupPouch, bg: '#FEF3C7' },
  { id: 'flat', label: 'Flat\nBottom', image: IMAGES.kraftStandyPouchBrown, bg: '#FEF9C3' },
  { id: 'rolls', label: 'Laminated\nRolls', image: IMAGES.centerSealPouch, bg: '#F3F4F6' },
  { id: 'boxes', label: 'Corr.\nBoxes', image: IMAGES.boxes, bg: '#DBEAFE' },
  { id: 'window', label: 'Window\nPouches', image: IMAGES.kraftWindowStandyPouchBrown, bg: '#E0E7FF' },
];

const FEATURED = [
  {
    id: 'batter',
    title: 'PRINTED IDLI / DOSA BATTER PACKAGING',
    image: IMAGES.batterPouch,
    bg: '#1D4ED8',
    route: 'StreamlinedPouchConfigurator',
  },
  {
    id: 'center-seal',
    title: 'PRINTED CENTER SEAL POUCH ROLL',
    image: IMAGES.centerSealPouch,
    bg: '#EA580C',
    route: 'StreamlinedPouchConfigurator',
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const [userName, setUserName] = useState('Rahul Sharma');
  const [bannerWidth, setBannerWidth] = useState(getResponsiveWidth());

  // Animation values for smooth interactions
  const scaleAnims = useRef(
    QUICK_ACTIONS.map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    const updateWidth = () => {
      const { width } = Dimensions.get('window');
      setBannerWidth(Math.min(width - 32, 900));
    };

    const subscription = Dimensions.addEventListener('change', updateWidth);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then((raw) => {
      if (!raw) return;
      try {
        const user = JSON.parse(raw);
        if (user?.name) setUserName(user.name);
      } catch {
        /* ignore */
      }
    });
  }, []);

  const handleBannerScroll = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / bannerWidth);
    setActiveBanner(index);
  };

  const handleQuickActionPress = (action: typeof QUICK_ACTIONS[0], index: number) => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate
    if (action.route === 'DesignStudio' || action.route === 'Orders') {
      navigation.navigate('MainTabs', { screen: action.route });
    } else {
      navigation.navigate(action.route);
    }
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 100 : 90, alignItems: 'center' }}>
        <ContentWrapper>
        {/* Header */}
        <HeaderRow>
          <HeaderLeft>
            <GreetingText>{getGreeting()} 👋</GreetingText>
            <UserName>{userName}</UserName>
          </HeaderLeft>
          <HeaderRight>
            <IconCircle onPress={() => navigation.navigate('Notifications')} activeOpacity={0.8}>
              <FontAwesome5 name="bell" size={16} color="#374151" />
              <NotifDot />
            </IconCircle>
            <AvatarCircle onPress={() => navigation.navigate('Account')} activeOpacity={0.8}>
              <AvatarText>RS</AvatarText>
            </AvatarCircle>
          </HeaderRight>
        </HeaderRow>

        {/* Search */}
        <SearchWrap>
          <FontAwesome5 name="search" size={14} color="#9CA3AF" style={{ marginRight: 10 }} />
          <SearchInput
            placeholder="Search packaging products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => navigation.navigate('Products')}
          />
        </SearchWrap>

        {/* Promo carousel */}
        <BannerSection>
          <FlatList
            data={BANNERS}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={bannerWidth}
            decelerationRate="fast"
            onScroll={handleBannerScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            renderItem={({ item }) => (
              <BannerCard
                style={{ width: bannerWidth }}
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.92}
              >
                <BannerImage source={item.image} resizeMode="cover" />
                <BannerOverlay />
                <BannerContent>
                  <OfferTag>
                    <OfferTagText>{item.tag}</OfferTagText>
                  </OfferTag>
                  <BannerTitle>{item.title}</BannerTitle>
                  <QuotationBtn>
                    <QuotationBtnText>{item.cta}</QuotationBtnText>
                  </QuotationBtn>
                </BannerContent>
              </BannerCard>
            )}
          />
          <DotsRow>
            {BANNERS.map((b, i) => (
              <Dot key={b.id} active={i === activeBanner} />
            ))}
          </DotsRow>
        </BannerSection>

        {/* Quick Actions */}
        <SectionHeader>
          <SectionTitle>Quick Actions</SectionTitle>
        </SectionHeader>
        <QuickActionsRow>
          {QUICK_ACTIONS.map((action, index) => (
            <Animated.View
              key={action.id}
              style={{ transform: [{ scale: scaleAnims[index] }] }}
            >
              <QuickActionCard
                onPress={() => handleQuickActionPress(action, index)}
                activeOpacity={0.85}
              >
                <QuickIconWrap bgColor={action.bg}>
                  <FontAwesome5 name={action.icon as any} size={18} color={action.color} />
                </QuickIconWrap>
                <QuickLabel>{action.label}</QuickLabel>
              </QuickActionCard>
            </Animated.View>
          ))}
        </QuickActionsRow>

        {/* Categories */}
        <SectionHeader>
          <SectionTitle>Categories</SectionTitle>
          <SeeAllBtn onPress={() => navigation.navigate('Products')}>
            <SeeAllText>View All</SeeAllText>
            <FontAwesome5 name="chevron-right" size={10} color="#0F8A3C" style={{ marginLeft: 2 }} />
          </SeeAllBtn>
        </SectionHeader>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4 }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              onPress={() => navigation.navigate('StreamlinedPouchConfigurator')}
              activeOpacity={0.85}
            >
              <CategoryIconWrap bgColor={cat.bg}>
                <CategoryImg source={cat.image} resizeMode="contain" />
              </CategoryIconWrap>
              <CategoryLabel>{cat.label}</CategoryLabel>
            </CategoryCard>
          ))}
        </ScrollView>

        {/* Featured Products */}
        <SectionHeader style={{ marginTop: 8 }}>
          <SectionTitle>Featured Products</SectionTitle>
          <SeeAllBtn onPress={() => navigation.navigate('Products')}>
            <SeeAllText>See All</SeeAllText>
            <FontAwesome5 name="chevron-right" size={10} color="#0F8A3C" style={{ marginLeft: 2 }} />
          </SeeAllBtn>
        </SectionHeader>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
        >
          {FEATURED.map((product) => (
            <FeaturedCard
              key={product.id}
              bgColor={product.bg}
              onPress={() => navigation.navigate(product.route)}
              activeOpacity={0.9}
            >
              <FeaturedImage source={product.image} resizeMode="cover" />
              <FeaturedOverlay bgColor={product.bg} />
              <FeaturedTitle>{product.title}</FeaturedTitle>
            </FeaturedCard>
          ))}
        </ScrollView>
        </ContentWrapper>
      </ScrollView>
    </Container>
  );
};

export default HomeScreen;

/* ─── Styles ─────────────────────────────────────────────────────────── */

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fb;
`;

const ContentWrapper = styled.View`
  width: 100%;
  max-width: 900px;
  align-self: center;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${Platform.OS === 'ios' ? '54px' : '16px'} 16px 12px;
`;

const HeaderLeft = styled.View`flex: 1;`;
const GreetingText = styled.Text`font-size: 13px; color: #9ca3af; margin-bottom: 2px;`;
const UserName = styled.Text`font-size: 22px; font-weight: 800; color: #111827;`;

const HeaderRight = styled.View`flex-direction: row; align-items: center;`;
const IconCircle = styled.TouchableOpacity`
  width: 40px; height: 40px; border-radius: 20px;
  background-color: #ffffff; align-items: center; justify-content: center;
  margin-right: 10px; position: relative;
  shadow-color: #000; shadow-offset: 0px 1px; shadow-opacity: 0.06; shadow-radius: 4px; elevation: 2;
`;
const NotifDot = styled.View`
  position: absolute; top: 9px; right: 10px;
  width: 8px; height: 8px; border-radius: 4px;
  background-color: #ef4444; border-width: 1.5px; border-color: #ffffff;
`;
const AvatarCircle = styled.TouchableOpacity`
  width: 40px; height: 40px; border-radius: 20px;
  background-color: #0f8a3c; align-items: center; justify-content: center;
`;
const AvatarText = styled.Text`font-size: 14px; font-weight: 800; color: #ffffff;`;

const SearchWrap = styled.View`
  flex-direction: row; align-items: center;
  margin: 0 16px 18px; height: 48px; border-radius: 24px;
  background-color: #ffffff; padding-horizontal: 16px;
  shadow-color: #000; shadow-offset: 0px 2px; shadow-opacity: 0.05; shadow-radius: 8px; elevation: 2;
`;
const SearchInput = styled.TextInput`flex: 1; font-size: 14px; color: #111827;`;

const BannerSection = styled.View`margin: 0 16px 20px;`;
const BannerCard = styled.TouchableOpacity`
  height: 168px; border-radius: 18px; overflow: hidden; position: relative;
`;
const BannerImage = styled.Image`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;
`;
const BannerOverlay = styled.View`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(107, 15, 15, 0.72);
`;
const BannerContent = styled.View`
  flex: 1; justify-content: center; padding: 20px 22px;
`;
const OfferTag = styled.View`
  align-self: flex-start; background-color: rgba(255, 255, 255, 0.22);
  border-radius: 6px; padding: 4px 10px; margin-bottom: 10px;
`;
const OfferTagText = styled.Text`font-size: 11px; font-weight: 600; color: #ffffff;`;
const BannerTitle = styled.Text`
  font-size: 17px; font-weight: 800; color: #ffffff; line-height: 24px; margin-bottom: 14px;
`;
const QuotationBtn = styled.View`
  align-self: flex-start; background-color: #0f8a3c; border-radius: 10px;
  padding: 10px 18px;
`;
const QuotationBtnText = styled.Text`font-size: 13px; font-weight: 700; color: #ffffff;`;

const DotsRow = styled.View`
  flex-direction: row; justify-content: center; align-items: center; margin-top: 12px;
`;
const Dot = styled.View<{ active: boolean }>`
  width: 7px; height: 7px; border-radius: 4px; margin-horizontal: 3px;
  background-color: ${({ active }) => (active ? '#0f8a3c' : '#d1d5db')};
`;

const SectionHeader = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 0 16px 12px;
`;
const SectionTitle = styled.Text`font-size: 17px; font-weight: 800; color: #111827;`;
const SeeAllBtn = styled.TouchableOpacity`flex-direction: row; align-items: center;`;
const SeeAllText = styled.Text`font-size: 13px; color: #0f8a3c; font-weight: 600;`;

const QuickActionsRow = styled.View`
  flex-direction: row;
  padding: 0 16px 22px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const QuickActionCard = styled.TouchableOpacity`
  width: ${(SCREEN_WIDTH - 56) / 4}px;
  min-width: 70px;
  max-width: 100px;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 14px 6px 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 2;
`;
const QuickIconWrap = styled.View<{ bgColor: string }>`
  width: 44px; height: 44px; border-radius: 22px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-bottom: 8px;
`;
const QuickLabel = styled.Text`
  font-size: 10px; font-weight: 600; color: #374151; text-align: center; line-height: 13px;
`;

const CategoryCard = styled.TouchableOpacity`
  align-items: center; margin-right: 14px; width: 72px;
`;
const CategoryIconWrap = styled.View<{ bgColor: string }>`
  width: 64px; height: 64px; border-radius: 16px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-bottom: 8px;
  overflow: hidden;
  shadow-color: #000; shadow-offset: 0px 1px; shadow-opacity: 0.04; shadow-radius: 4px; elevation: 1;
`;
const CategoryImg = styled.Image`width: 52px; height: 52px;`;
const CategoryLabel = styled.Text`
  font-size: 11px; font-weight: 600; color: #374151; text-align: center; line-height: 14px;
`;

const FeaturedCard = styled.TouchableOpacity<{ bgColor: string }>`
  width: 220px; height: 130px; border-radius: 16px; overflow: hidden;
  margin-right: 12px; position: relative;
`;
const FeaturedImage = styled.Image`
  position: absolute; top: 0; right: 0; width: 55%; height: 100%;
`;
const FeaturedOverlay = styled.View<{ bgColor: string }>`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background-color: ${({ bgColor }) => bgColor};
  opacity: 0.92;
`;
const FeaturedTitle = styled.Text`
  position: absolute; top: 16px; left: 14px; right: 80px;
  font-size: 12px; font-weight: 800; color: #ffffff; line-height: 17px;
`;
