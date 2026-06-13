import React from 'react';
import {
  ScrollView,
  StatusBar,
  Platform,
  Image,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ONBOARDING_KEY } from '../constants';

/* ── Local assets ──────────────────────────────────────────────── */
const LOGO       = require('../../assets/logo (1).png');
const HERO_IMAGE = require('../../assets/banner-design-1.jpg.jpeg');

/* ── Benefit pills ─────────────────────────────────────────────── */
const BENEFITS = [
  { emoji: '🏆', label: 'Premium Quality' },
  { emoji: '🎨', label: 'Custom Packaging' },
  { emoji: '🚀', label: 'Fast Delivery' },
  { emoji: '🌿', label: 'Sustainable Materials' },
  { emoji: '🤝', label: 'Expert Support' },
];

interface Props {
  navigation: any;
}

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const finishOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    navigation.replace('MainTabs');
  };

  return (
    <Wrapper>
      <StatusBar barStyle="dark-content" backgroundColor="#EAEDE9" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          paddingTop: Platform.OS === 'ios' ? 60 : 40,
          paddingBottom: 40,
          backgroundColor: '#EAEDE9',
        }}
        bounces={false}
      >
        {/* ── Card ── */}
        <Card>

          {/* Logo + Brand */}
          <BrandRow>
            <Image
              source={LOGO}
              style={{ width: 34, height: 34 }}
              resizeMode="contain"
            />
            <BrandName>PACKMONK</BrandName>
          </BrandRow>

          {/* Hero image */}
          <HeroWrap>
            <HeroImage source={HERO_IMAGE} resizeMode="cover" />
          </HeroWrap>

          {/* Headline */}
          <Title>End-to-End Packaging &{'\n'}Print Solutions</Title>

          {/* Subtitle */}
          <Subtitle>
            Your one-stop platform for premium custom packaging — from design to doorstep, powered by AI.
          </Subtitle>

          {/* Benefit pills */}
          <PillsWrap>
            {BENEFITS.map((b) => (
              <BenefitPill key={b.label}>
                <PillEmoji>{b.emoji}</PillEmoji>
                <PillLabel>{b.label}</PillLabel>
              </BenefitPill>
            ))}
          </PillsWrap>

          {/* CTA buttons */}
          <GetStartedBtn onPress={finishOnboarding} activeOpacity={0.9}>
            <GetStartedText>Get Started</GetStartedText>
          </GetStartedBtn>

          <LoginBtn onPress={finishOnboarding} activeOpacity={0.85}>
            <LoginBtnText>Login</LoginBtnText>
          </LoginBtn>

          {/* Trust text */}
          <TrustText>Trusted by 5,000+ businesses across India</TrustText>

        </Card>
      </ScrollView>
    </Wrapper>
  );
};

export default OnboardingScreen;

/* ── Styles ─────────────────────────────────────────────────────── */

const Wrapper = styled.View`
  flex: 1;
  background-color: #EAEDE9;
`;

const Card = styled.View`
  width: 100%;
  background-color: #FFFFFF;
  border-radius: 28px;
  padding: 24px 20px 28px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 20px;
  elevation: 6;
`;

const BrandRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
`;

const BrandName = styled.Text`
  font-size: 20px;
  font-weight: 900;
  color: #111827;
  letter-spacing: 2px;
  margin-left: 10px;
`;

const HeroWrap = styled.View`
  width: 100%;
  height: 200px;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 22px;
  background-color: #DCFCE7;
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
  margin-bottom: 26px;
`;

const BenefitPill = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #F9FAFB;
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

const GetStartedBtn = styled.TouchableOpacity`
  width: 100%;
  height: 52px;
  background-color: #1A7A3C;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const GetStartedText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 0.2px;
`;

const LoginBtn = styled.TouchableOpacity`
  width: 100%;
  height: 52px;
  background-color: #FFFFFF;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  border-width: 1.5px;
  border-color: #1A7A3C;
  margin-bottom: 20px;
`;

const LoginBtnText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #1A7A3C;
`;

const TrustText = styled.Text`
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
  text-align: center;
`;
