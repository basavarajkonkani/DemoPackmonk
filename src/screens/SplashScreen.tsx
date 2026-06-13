import React, { useEffect, useRef } from 'react';
import { Animated, View, Image, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ExpoSplashScreen from 'expo-splash-screen';

// Only call preventAutoHideAsync on native — it throws on web
if (Platform.OS !== 'web') {
  ExpoSplashScreen.preventAutoHideAsync().catch(() => {});
}

const LOGO = require('../../assets/logo (1).png');

interface Props {
  onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // Brand name fades in
      Animated.timing(textOpacity, { toValue: 1, duration: 350, delay: 100, useNativeDriver: true }),
      // Tagline fades in
      Animated.timing(tagOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      // Loading dots
      Animated.timing(dotsOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      // Hold for 800ms then fade out
      Animated.delay(800),
      Animated.timing(screenOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      if (Platform.OS !== 'web') {
        ExpoSplashScreen.hideAsync().catch(() => {});
      }
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
      <Container>
        {/* Background decorative circles */}
        <Decor size={400} top={-120} right={-100} />
        <Decor size={250} bottom={-60} left={-80} />
        <Decor size={150} top={200} left={-40} />

        {/* Logo Mark */}
        <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
          <LogoMark>
            <LogoMarkInner>
              <Image
                source={LOGO}
                style={{ width: 70, height: 70 }}
                resizeMode="contain"
              />
            </LogoMarkInner>
            <LogoRing />
          </LogoMark>
        </Animated.View>

        {/* Brand Name */}
        <Animated.View style={{ opacity: textOpacity, alignItems: 'center', marginTop: 24 }}>
          <BrandName>PacMonk</BrandName>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: tagOpacity, alignItems: 'center', marginTop: 8 }}>
          <Tagline>End-to-End Packaging & Print Solutions</Tagline>
        </Animated.View>

        {/* Loading dots */}
        <Animated.View style={{ opacity: dotsOpacity, marginTop: 48 }}>
          <DotsRow>
            <Dot delay={0} />
            <Dot delay={1} />
            <Dot delay={2} />
          </DotsRow>
        </Animated.View>

        {/* Powered by */}
        <PoweredBy>
          <FontAwesome5 name="leaf" size={10} color="rgba(255,255,255,0.5)" style={{ marginRight: 5 }} />
          <PoweredByText>Powered by sustainable packaging</PoweredByText>
        </PoweredBy>
      </Container>
    </Animated.View>
  );
};

export default SplashScreen;

const Container = styled.View`
  flex: 1;
  background-color: #0F8A3C;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Decor = styled.View<{ size: number; top?: number; bottom?: number; left?: number; right?: number }>`
  position: absolute;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: rgba(255,255,255,0.06);
  ${({ top }) => top !== undefined ? `top: ${top}px;` : ''}
  ${({ bottom }) => bottom !== undefined ? `bottom: ${bottom}px;` : ''}
  ${({ left }) => left !== undefined ? `left: ${left}px;` : ''}
  ${({ right }) => right !== undefined ? `right: ${right}px;` : ''}
`;

const LogoMark = styled.View`
  width: 110px;
  height: 110px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const LogoMarkInner = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 30px;
  background-color: rgba(255,255,255,0.15);
  border-width: 2px;
  border-color: rgba(255,255,255,0.3);
  align-items: center;
  justify-content: center;
`;

const LogoRing = styled.View`
  position: absolute;
  width: 110px;
  height: 110px;
  border-radius: 55px;
  border-width: 1.5px;
  border-color: rgba(255,255,255,0.15);
`;

const BrandName = styled.Text`
  font-size: 42px;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: -1px;
`;

const Tagline = styled.Text`
  font-size: 14px;
  color: rgba(255,255,255,0.75);
  font-weight: 500;
  letter-spacing: 0.3px;
  text-align: center;
  padding-horizontal: 32px;
`;

const DotsRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

/* Simple animated dot — uses opacity pulsing via Animated API */
const Dot: React.FC<{ delay: number }> = ({ delay }) => {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.delay(delay * 180),
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View style={{ opacity: anim, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF', marginHorizontal: 4 }} />
  );
};

const PoweredBy = styled.View`
  position: absolute;
  bottom: 40px;
  flex-direction: row;
  align-items: center;
`;

const PoweredByText = styled.Text`
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  font-weight: 500;
`;
