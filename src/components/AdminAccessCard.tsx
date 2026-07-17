import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const AdminAccessCard: React.FC<Props> = ({ navigation }) => {
  return (
    <Card onPress={() => navigation.navigate('AdminTabs')} activeOpacity={0.8}>
      <CardBackground>
        <BackgroundPattern>
          <FontAwesome5 name="shield-alt" size={120} color="rgba(255, 255, 255, 0.1)" />
        </BackgroundPattern>
        
        <CardContent>
          <IconBadge>
            <FontAwesome5 name="crown" size={24} color="#F59E0B" />
          </IconBadge>
          
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>
            Access full admin dashboard to manage orders, products, customers, and analytics
          </CardDescription>
          
          <FeatureRow>
            <Feature>
              <FontAwesome5 name="check-circle" size={12} color="#DCFCE7" />
              <FeatureText>Dashboard & Analytics</FeatureText>
            </Feature>
            <Feature>
              <FontAwesome5 name="check-circle" size={12} color="#DCFCE7" />
              <FeatureText>Order Management</FeatureText>
            </Feature>
          </FeatureRow>
          
          <FeatureRow>
            <Feature>
              <FontAwesome5 name="check-circle" size={12} color="#DCFCE7" />
              <FeatureText>User & Customer Control</FeatureText>
            </Feature>
            <Feature>
              <FontAwesome5 name="check-circle" size={12} color="#DCFCE7" />
              <FeatureText>Inventory Tracking</FeatureText>
            </Feature>
          </FeatureRow>
          
          <AccessButton>
            <AccessButtonText>Enter Admin Panel</AccessButtonText>
            <FontAwesome5 name="arrow-right" size={14} color="#0F8A3C" />
          </AccessButton>
        </CardContent>
      </CardBackground>
    </Card>
  );
};

export default AdminAccessCard;

const Card = styled.TouchableOpacity`
  margin: 20px;
  border-radius: 20px;
  overflow: hidden;
  elevation: 8;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
`;

const CardBackground = styled.View`
  background-color: #0F8A3C;
  padding: 24px;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.View`
  position: absolute;
  top: -20px;
  right: -20px;
  opacity: 0.15;
`;

const CardContent = styled.View`
  position: relative;
  z-index: 1;
`;

const IconBadge = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.3);
`;

const CardTitle = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
`;

const CardDescription = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 20px;
  margin-bottom: 20px;
`;

const FeatureRow = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const Feature = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-right: 8px;
`;

const FeatureText = styled.Text`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  margin-left: 6px;
  flex: 1;
`;

const AccessButton = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  padding: 14px 24px;
  border-radius: 12px;
  margin-top: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const AccessButtonText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #0F8A3C;
  margin-right: 8px;
`;
