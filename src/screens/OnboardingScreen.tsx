import React from 'react';
import {
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import { IMAGES } from '../constants/images';

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
  return (
    <Wrapper>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: Platform.OS === 'ios' ? 52 : 28,
          paddingBottom: 32,
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

          <GetStartedBtn
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.9}
          >
            <GetStartedText>Get Started</GetStartedText>
          </GetStartedBtn>

          <LoginBtn
            onPress={() => navigation.navigate('SignIn')}
            activeOpacity={0.85}
          >
            <LoginBtnText>Login</LoginBtnText>
          </LoginBtn>

          <TrustText>Trusted by 5,000+ businesses across India</TrustText>
        </Card>
      </ScrollView>
    </Wrapper>
  );
};

export default OnboardingScreen;

const Wrapper = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Card = styled.View`
  width: 100%;
  max-width: 420px;
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
  background-color: #f3f4f6;
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
  color: #6b7280;
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
  background-color: #ffffff;
  border-radius: 20px;
  padding: 7px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: #e5e7eb;
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
  background-color: #0f8a3c;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const GetStartedText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

const LoginBtn = styled.TouchableOpacity`
  width: 100%;
  height: 52px;
  background-color: #ffffff;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  border-width: 1.5px;
  border-color: #0f8a3c;
  margin-bottom: 20px;
`;

const LoginBtnText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #0f8a3c;
`;

const TrustText = styled.Text`
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
  text-align: center;
`;
