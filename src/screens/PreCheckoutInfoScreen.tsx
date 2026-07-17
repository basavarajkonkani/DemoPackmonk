import React from 'react';
import {
  ScrollView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { IMAGES } from '../constants/images';
import { getTabBarHeight } from '../utils/layoutUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BENEFITS = [
  { emoji: '🏆', label: 'Premium Quality' },
  { emoji: '🎨', label: 'Custom Packaging' },
  { emoji: '🚀', label: 'Fast Delivery' },
  { emoji: '🌿', label: 'Sustainable Materials' },
  { emoji: '🤝', label: 'Expert Support' },
];

interface Props {
  navigation: any;
  route: any;
}

const PreCheckoutInfoScreen: React.FC<Props> = ({ navigation, route }) => {
  // Calculate proper bottom padding
  const tabBarHeight = getTabBarHeight();
  const bottomBarHeight = 90;
  const totalBottomPadding = tabBarHeight + bottomBarHeight + 20;

  const handleContinueToCheckout = () => {
    navigation.navigate('Checkout', route.params);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <Wrapper>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <NavBar>
        <NavBtn onPress={handleGoBack}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBtn>
        <NavTitle>Before You Checkout</NavTitle>
        <SkipBtn onPress={handleContinueToCheckout}>
          <SkipBtnText>Skip</SkipBtnText>
        </SkipBtn>
      </NavBar>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: totalBottomPadding,
        }}
        bounces={false}
      >
        <Card>
          <BrandRow>
            <LogoImage source={IMAGES.logo} resizeMode="contain" />
          </BrandRow>

          <HeroWrap>
            <HeroImage source={IMAGES.offerBanner} resizeMode="cover" />
          </HeroWrap>

          <Title>End-to-End Packaging &{'\n'}Print Solutions</Title>

          <Subtitle>
            Your one-stop platform for premium custom packaging — from design to doorstep, powered by AI.
          </Subtitle>

          <PillsWrap>
            {BENEFITS.map((b) => (
              <BenefitPill key={b.label}>
                <PillEmoji>{b.emoji}</PillEmoji>
                <PillLabel>{b.label}</PillLabel>
              </BenefitPill>
            ))}
          </PillsWrap>

          <InfoSection>
            <InfoCard>
              <InfoIconWrap>
                <FontAwesome5 name="shield-alt" size={18} color="#0F8A3C" solid />
              </InfoIconWrap>
              <InfoContent>
                <InfoTitle>Secure Payment</InfoTitle>
                <InfoText>Your payment information is encrypted and secure</InfoText>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIconWrap>
                <FontAwesome5 name="truck" size={18} color="#0F8A3C" solid />
              </InfoIconWrap>
              <InfoContent>
                <InfoTitle>Fast Delivery</InfoTitle>
                <InfoText>Production begins within 24-48 hours of approval</InfoText>
              </InfoContent>
            </InfoCard>

            <InfoCard>
              <InfoIconWrap>
                <FontAwesome5 name="headset" size={18} color="#0F8A3C" solid />
              </InfoIconWrap>
              <InfoContent>
                <InfoTitle>24/7 Support</InfoTitle>
                <InfoText>Our team is always here to help you</InfoText>
              </InfoContent>
            </InfoCard>
          </InfoSection>

          <TrustText>Trusted by 5,000+ businesses across India</TrustText>
        </Card>
      </ScrollView>

      <BottomBar tabBarHeight={tabBarHeight}>
        <ContinueBtn onPress={handleContinueToCheckout} activeOpacity={0.9}>
          <ContinueBtnText>Continue to Checkout</ContinueBtnText>
          <FontAwesome5 name="arrow-right" size={14} color="#FFFFFF" style={{ marginLeft: 10 }} />
        </ContinueBtn>
      </BottomBar>
    </Wrapper>
  );
};

export default PreCheckoutInfoScreen;

const Wrapper = styled.View`
  flex: 1;
  background-color: #F8F9FA;
`;

const NavBar = styled.View`
  height: ${Platform.OS === 'ios' ? '94px' : '56px'};
  padding-top: ${Platform.OS === 'ios' ? '48px' : '0px'};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #E5E7EB;
`;

const NavBtn = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #F9FAFB;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const NavTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`;

const SkipBtn = styled.TouchableOpacity`
  padding: 8px 12px;
`;

const SkipBtnText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #0F8A3C;
`;

const Card = styled.View`
  width: 100%;
  max-width: 480px;
  background-color: #FFFFFF;
  border-radius: 18px;
  padding: 24px;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const BrandRow = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const LogoImage = styled.Image`
  width: 120px;
  height: 36px;
`;

const HeroWrap = styled.View`
  width: 100%;
  height: 210px;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 22px;
  background-color: #F3F4F6;
`;

const HeroImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  line-height: 32px;
  letter-spacing: -0.4px;
  margin-bottom: 10px;
`;

const Subtitle = styled.Text`
  font-size: 13px;
  color: #6B7280;
  line-height: 21px;
  margin-bottom: 20px;
`;

const PillsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const BenefitPill = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 7px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const PillEmoji = styled.Text`
  font-size: 13px;
  margin-right: 5px;
`;

const PillLabel = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
`;

const InfoSection = styled.View`
  margin-bottom: 24px;
`;

const InfoCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #F9FAFB;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const InfoIconWrap = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #DCFCE7;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const InfoContent = styled.View`
  flex: 1;
`;

const InfoTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2px;
`;

const InfoText = styled.Text`
  font-size: 12px;
  color: #6B7280;
  line-height: 18px;
`;

const TrustText = styled.Text`
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
  text-align: center;
`;

const BottomBar = styled.View<{ tabBarHeight: number }>`
  position: absolute;
  bottom: ${({ tabBarHeight }) => `${tabBarHeight}px`};
  left: 0;
  right: 0;
  width: 100%;
  padding: 12px 16px;
  background-color: #FFFFFF;
  border-top-width: 1px;
  border-top-color: #E5E7EB;
  z-index: 1000;
  elevation: 10;
  box-sizing: border-box;
`;

const ContinueBtn = styled.TouchableOpacity`
  flex-direction: row;
  height: 52px;
  background-color: #0F8A3C;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
`;

const ContinueBtnText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
`;
