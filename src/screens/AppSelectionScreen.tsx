import React from 'react';
import { ScrollView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

const AppSelectionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <Container>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}
      >
        {/* Logo */}
        <LogoSection>
          <LogoBox>
            <FontAwesome5 name="box" size={40} color="#FFFFFF" />
          </LogoBox>
          <AppName>PacMonk</AppName>
          <AppTagline>Enterprise Packaging Solutions</AppTagline>
        </LogoSection>

        {/* Selection Cards */}
        <SelectionContainer>
          {/* Buyer App Card */}
          <SelectionCard onPress={() => navigation.replace('MainTabs')} activeOpacity={0.85}>
            <CardHeader bgColor="#DCFCE7">
              <CardIcon bgColor="#0F8A3C">
                <FontAwesome5 name="shopping-bag" size={32} color="#FFFFFF" />
              </CardIcon>
              <CardTitle>Buyer App</CardTitle>
              <CardBadge>
                <CardBadgeText>FOR CUSTOMERS</CardBadgeText>
              </CardBadge>
            </CardHeader>
            <CardBody>
              <FeatureList>
                <Feature>
                  <FeatureIcon>
                    <FontAwesome5 name="box-open" size={14} color="#0F8A3C" />
                  </FeatureIcon>
                  <FeatureText>Browse & Order Products</FeatureText>
                </Feature>
                <Feature>
                  <FeatureIcon>
                    <FontAwesome5 name="paint-brush" size={14} color="#0F8A3C" />
                  </FeatureIcon>
                  <FeatureText>Design Your Packaging</FeatureText>
                </Feature>
                <Feature>
                  <FeatureIcon>
                    <FontAwesome5 name="clipboard-list" size={14} color="#0F8A3C" />
                  </FeatureIcon>
                  <FeatureText>Track Your Orders</FeatureText>
                </Feature>
                <Feature>
                  <FeatureIcon>
                    <FontAwesome5 name="user-circle" size={14} color="#0F8A3C" />
                  </FeatureIcon>
                  <FeatureText>Manage Your Account</FeatureText>
                </Feature>
              </FeatureList>
            </CardBody>
            <CardFooter>
              <ActionText>Start Shopping</ActionText>
              <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" />
            </CardFooter>
          </SelectionCard>

          {/* Admin App Card */}
          <SelectionCard onPress={() => navigation.replace('AdminLogin')} activeOpacity={0.85}>
            <CardHeader bgColor="#E0E7FF">
              <CardIcon bgColor="#6366F1">
                <FontAwesome5 name="user-shield" size={32} color="#FFFFFF" />
              </CardIcon>
              <CardTitle>Admin Panel</CardTitle>
              <CardBadge adminBadge>
                <CardBadgeText>FOR ADMINISTRATORS</CardBadgeText>
              </CardBadge>
            </CardHeader>
            <CardBody>
              <FeatureList>
                <Feature>
                  <FeatureIcon adminIcon>
                    <FontAwesome5 name="warehouse" size={14} color="#6366F1" />
                  </FeatureIcon>
                  <FeatureText>Manage Inventory</FeatureText>
                </Feature>
                <Feature>
                  <FeatureIcon adminIcon>
                    <FontAwesome5 name="chart-line" size={14} color="#6366F1" />
                  </FeatureIcon>
                  <FeatureText>View Analytics</FeatureText>
                </Feature>
                <Feature>
                  <FeatureIcon adminIcon>
                    <FontAwesome5 name="users" size={14} color="#6366F1" />
                  </FeatureIcon>
                  <FeatureText>Manage Customers</FeatureText>
                </Feature>
                <Feature>
                  <FeatureIcon adminIcon>
                    <FontAwesome5 name="cogs" size={14} color="#6366F1" />
                  </FeatureIcon>
                  <FeatureText>System Settings</FeatureText>
                </Feature>
              </FeatureList>
            </CardBody>
            <CardFooter adminFooter>
              <ActionText>Admin Access</ActionText>
              <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" />
            </CardFooter>
          </SelectionCard>
        </SelectionContainer>

        {/* Footer Info */}
        <FooterInfo>
          <InfoText>Choose your app to get started</InfoText>
        </FooterInfo>
      </ScrollView>
    </Container>
  );
};

export default AppSelectionScreen;

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #F8F9FA;
`;

const LogoSection = styled.View`
  align-items: center;
  margin-bottom: 50px;
`;

const LogoBox = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background-color: #0F8A3C;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  elevation: 8;
`;

const AppName = styled.Text`
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
`;

const AppTagline = styled.Text`
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
`;

const SelectionContainer = styled.View`
  width: 100%;
  margin-bottom: 40px;
`;

const SelectionCard = styled.TouchableOpacity`
  background-color: #FFFFFF;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: #E5E7EB;
  elevation: 4;
`;

const CardHeader = styled.View<{ bgColor: string; adminBadge?: boolean }>`
  background-color: ${({ bgColor }) => bgColor};
  padding: 20px;
  align-items: center;
`;

const CardIcon = styled.View<{ bgColor: string }>`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const CardTitle = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
`;

const CardBadge = styled.View<{ adminBadge?: boolean }>`
  background-color: ${({ adminBadge }) => adminBadge ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 138, 60, 0.15)'};
  padding: 6px 12px;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${({ adminBadge }) => adminBadge ? 'rgba(99, 102, 241, 0.3)' : 'rgba(15, 138, 60, 0.3)'};
`;

const CardBadgeText = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: #374151;
  letter-spacing: 0.5px;
`;

const CardBody = styled.View`
  padding: 20px;
`;

const FeatureList = styled.View``;

const Feature = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const FeatureIcon = styled.View<{ adminIcon?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background-color: ${({ adminIcon }) => adminIcon ? '#E0E7FF' : '#DCFCE7'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const FeatureText = styled.Text`
  font-size: 13px;
  color: #374151;
  font-weight: 500;
  flex: 1;
`;

const CardFooter = styled.View<{ adminFooter?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ adminFooter }) => adminFooter ? '#6366F1' : '#0F8A3C'};
  padding: 14px 20px;
`;

const ActionText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
`;

const FooterInfo = styled.View`
  align-items: center;
  padding: 20px;
  margin-top: 20px;
`;

const InfoText = styled.Text`
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 500;
`;
