import React, { useState } from 'react';
import { ScrollView, View, Alert, Switch, Linking, Platform } from 'react-native';
import styled from 'styled-components/native';
import { CommonActions } from '@react-navigation/native';
import Header from '../components/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../store';
import { selectOrdersList, selectTotalBusinessSpending } from '../store/ordersSlice';
import { logout } from '../store/authSlice';
import { SUPPORT_EMAIL, SUPPORT_PHONE, WHATSAPP_NUMBER, AUTH_KEY, ONBOARDING_KEY } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFS = [
  { label: 'Quote Approved', desc: 'When your quote is approved' },
  { label: 'Design Approved', desc: 'When pre-press approves your artwork' },
  { label: 'Production Started', desc: 'When printing begins' },
  { label: 'Shipment Dispatched', desc: 'When order is handed to carrier' },
  { label: 'Delivered', desc: 'When package is delivered' },
];

const AccountScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [ecoTarget, setEcoTarget] = useState(500);
  const [notifToggles, setNotifToggles] = useState([true, true, true, true, true]);
  const [showNotifs, setShowNotifs] = useState(false);

  const orders = useAppSelector(selectOrdersList);
  const totalSpent = useAppSelector(selectTotalBusinessSpending);
  const authUser = useAppSelector((state) => state.auth.user);
  
  // Get user role from auth state, default to 'user'
  const userRole = authUser?.role || 'user';

  // Role-based menu items
  const USER_MENU_ITEMS = [
    { icon: 'tachometer-alt', label: 'Dashboard', badge: null, color: '#DBEAFE', iconColor: '#3B82F6', screen: 'Dashboard' },
    { icon: 'clipboard-list', label: 'Order History', badge: null, color: '#DCFCE7', iconColor: '#0F8A3C', screen: 'Orders' },
    { icon: 'file-invoice-dollar', label: 'Invoices & Billing', badge: '2', color: '#FEF3C7', iconColor: '#D97706', screen: 'Invoices' },
    { icon: 'paint-brush', label: 'Saved Designs', badge: '3', color: '#F5F3FF', iconColor: '#7C3AED', screen: 'SavedDesigns' },
    { icon: 'heart', label: 'Wishlist', badge: '5', color: '#FCE7F3', iconColor: '#EC4899', screen: 'Wishlist' },
    { icon: 'wallet', label: 'Wallet', badge: null, color: '#DBEAFE', iconColor: '#3B82F6', screen: 'Wallet' },
    { icon: 'map-marker-alt', label: 'Manage Addresses', badge: null, color: '#FEE2E2', iconColor: '#DC2626', screen: 'ManageAddresses' },
    { icon: 'id-card', label: 'GST Details', badge: null, color: '#DCFCE7', iconColor: '#0F8A3C', screen: 'GSTDetails' },
    { icon: 'users', label: 'Team Members', badge: null, color: '#DBEAFE', iconColor: '#3B82F6', screen: 'ManageTeam' },
    { icon: 'headset', label: 'Support Tickets', badge: '1', color: '#FEF3C7', iconColor: '#D97706', screen: 'SupportTickets' },
    { icon: 'bell', label: 'Notifications', badge: '5', color: '#FEE2E2', iconColor: '#EF4444', screen: 'Notifications' },
  ];

  const ADMIN_MENU_ITEMS = [
    { icon: 'tachometer-alt', label: 'Admin Dashboard', badge: null, color: '#DBEAFE', iconColor: '#3B82F6', screen: 'AdminDashboard' },
    { icon: 'warehouse', label: 'Inventory', badge: '15', color: '#E0E7FF', iconColor: '#6366F1', screen: 'AdminInventory' },
    { icon: 'dollar-sign', label: 'Price Management', badge: null, color: '#FEF3C7', iconColor: '#D97706', screen: 'AdminPricing' },
    { icon: 'box', label: 'Manage Products', badge: null, color: '#DCFCE7', iconColor: '#10B981', screen: 'AdminProducts' },
    { icon: 'clipboard-list', label: 'Orders', badge: '12', color: '#DCFCE7', iconColor: '#10B981', screen: 'AdminOrders' },
    { icon: 'users', label: 'Customers', badge: null, color: '#FCE7F3', iconColor: '#EC4899', screen: 'AdminCustomers' },
    { icon: 'image', label: 'Artwork Review', badge: '3', color: '#FEF3C7', iconColor: '#F59E0B', screen: 'AdminArtwork' },
    { icon: 'chart-line', label: 'Analytics', badge: null, color: '#FEE2E2', iconColor: '#EF4444', screen: 'AdminAnalytics' },
    { icon: 'tags', label: 'Promotions', badge: null, color: '#FCE7F3', iconColor: '#EC4899', screen: 'AdminPromotions' },
    { icon: 'images', label: 'Banners', badge: null, color: '#E0E7FF', iconColor: '#8B5CF6', screen: 'AdminBanners' },
    { icon: 'headset', label: 'Support Tickets', badge: '8', color: '#DBEAFE', iconColor: '#3B82F6', screen: 'AdminSupport' },
    { icon: 'bell', label: 'Notifications', badge: '5', color: '#FEE2E2', iconColor: '#EF4444', screen: 'Notifications' },
  ];

  const MENU_ITEMS = userRole === 'admin' ? ADMIN_MENU_ITEMS : USER_MENU_ITEMS;

  // CO2 savings: 0.3kg per order as a rough estimate based on eco packaging
  const co2Saved = Math.round(orders.length * 0.3 * 100 + 240); // 240 = baseline from past orders
  const ecoGoalPct = Math.min(100, Math.round((co2Saved / ecoTarget) * 100));

  const handleMenu = (label: string, screen: string | null) => {
    if (screen) {
      navigation.navigate(screen);
    } else if (label === 'Order History') {
      navigation.navigate('Orders');
    } else if (label === 'Notifications') {
      navigation.navigate('Notifications');
    } else {
      Alert.alert(label, `${label} settings are coming in the next update.`);
    }
  };

  const handleSignOut = () => {
    console.log('Sign Out button clicked');
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            console.log('Sign out confirmed - starting sign out process');
            try {
              // Step 1: Clear AsyncStorage
              console.log('Clearing AsyncStorage...');
              await AsyncStorage.multiRemove([AUTH_KEY, ONBOARDING_KEY]);
              console.log('AsyncStorage cleared successfully');
              
              // Step 2: Dispatch logout action to clear Redux state
              // This will trigger the App component to redirect to Onboarding
              console.log('Dispatching logout action...');
              dispatch(logout());
              console.log('Sign out complete - App will handle navigation');
              
            } catch (error) {
              console.error('Error during sign out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <Container>
      <Header navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 120 : 100 }}>

        {/* Profile Card */}
        <ProfileCard style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4 }}>
          <ProfileAccentBar />
          <ProfileTop>
            <AvatarWrap>
              <AvatarRing>
                <Avatar>
                  <AvatarText>RS</AvatarText>
                </Avatar>
              </AvatarRing>
              <OnlineDot />
            </AvatarWrap>
            <ProfileInfo>
              <ProfileName>ZenTech Logistics</ProfileName>
              <TierBadge>
                <FontAwesome5 name="medal" size={9} color="#D97706" style={{ marginRight: 4 }} />
                <TierBadgeText>Premium Enterprise</TierBadgeText>
              </TierBadge>
              <ProfileMeta>
                <FontAwesome5 name="envelope" size={10} color="#9CA3AF" style={{ marginRight: 5 }} />
                <ProfileMetaText>ops@zentech.io</ProfileMetaText>
              </ProfileMeta>
              <ProfileMeta>
                <FontAwesome5 name="id-badge" size={10} color="#9CA3AF" style={{ marginRight: 5 }} />
                <ProfileMetaText>GST: 29ABCDE1234F1Z5</ProfileMetaText>
              </ProfileMeta>
            </ProfileInfo>
            <EditBtn onPress={() => Alert.alert('Edit Profile', 'Profile editing will be available once you connect to your account backend. Contact support@pacmonk.com to update your details.')}>
              <FontAwesome5 name="edit" size={14} color="#0F8A3C" />
            </EditBtn>
          </ProfileTop>
          <ClientIDRow>
            <FontAwesome5 name="fingerprint" size={11} color="#9CA3AF" style={{ marginRight: 5 }} />
            <ClientIDText>Client ID: PM-ZENT-94107</ClientIDText>
          </ClientIDRow>
        </ProfileCard>

        {/* Stats */}
        <StatsRow>
          {[
            { val: String(orders.length), lab: 'Orders', icon: 'box', color: '#DCFCE7', ic: '#0F8A3C' },
            { val: `$${totalSpent.toFixed(0)}`, lab: 'Total Spent', icon: 'wallet', color: '#FEF3C7', ic: '#D97706' },
            { val: `${co2Saved}kg`, lab: 'CO₂ Saved', icon: 'leaf', color: '#DCFCE7', ic: '#0F8A3C' },
          ].map((s, i) => (
            <StatCard
              key={s.lab}
              style={{
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
                marginRight: i === 2 ? 0 : 8,
              }}
            >
              <StatIcon bgColor={s.color}>
                <FontAwesome5 name={s.icon as any} size={14} color={s.ic} />
              </StatIcon>
              <StatVal>{s.val}</StatVal>
              <StatLab>{s.lab}</StatLab>
            </StatCard>
          ))}
        </StatsRow>

        {/* Menu */}
        <MenuCard style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          {MENU_ITEMS.map((item, idx) => (
            <React.Fragment key={item.label}>
              <MenuItem onPress={() => handleMenu(item.label, item.screen)} activeOpacity={0.7}>
                <MenuIconBox bgColor={item.color}>
                  <FontAwesome5 name={item.icon as any} size={14} color={item.iconColor} />
                </MenuIconBox>
                <MenuLabel>{item.label}</MenuLabel>
                <MenuRight>
                  {item.badge && (
                    <MenuBadge>
                      <MenuBadgeText>{item.badge}</MenuBadgeText>
                    </MenuBadge>
                  )}
                  <FontAwesome5 name="chevron-right" size={12} color="#D1D5DB" />
                </MenuRight>
              </MenuItem>
              {idx < MENU_ITEMS.length - 1 && <MenuDivider />}
            </React.Fragment>
          ))}
        </MenuCard>

        {/* Notifications */}
        {showNotifs && (
          <NotifCard>
            <NotifCardTitle>Notification Preferences</NotifCardTitle>
            {NOTIFS.map((n, i) => (
              <NotifRow key={n.label}>
                <NotifContent>
                  <NotifLabel>{n.label}</NotifLabel>
                  <NotifDesc>{n.desc}</NotifDesc>
                </NotifContent>
                <Switch
                  value={notifToggles[i]}
                  onValueChange={() => {
                    const updated = [...notifToggles];
                    updated[i] = !updated[i];
                    setNotifToggles(updated);
                  }}
                  trackColor={{ true: '#0F8A3C', false: '#E5E7EB' }}
                  thumbColor="#FFFFFF"
                />
              </NotifRow>
            ))}
          </NotifCard>
        )}

        {/* Eco Goal */}
        <BlockHeader>
          <BlockHeaderIcon>
            <FontAwesome5 name="seedling" size={14} color="#0F8A3C" />
          </BlockHeaderIcon>
          <BlockHeaderTitle>Sustainability Goals</BlockHeaderTitle>
        </BlockHeader>
        <GoalCard>
          <GoalTopRow>
            <GoalLabel>Annual CO₂ Offset Target</GoalLabel>
            <GoalValue>{ecoTarget} kg</GoalValue>
          </GoalTopRow>
          <ProgressBg>
            <ProgressFill pct={ecoGoalPct} />
          </ProgressBg>
          <GoalSubRow>
            <GoalProgress>{co2Saved} kg offset ({ecoGoalPct}%)</GoalProgress>
            <GoalDaysLeft>205 days remaining</GoalDaysLeft>
          </GoalSubRow>
          <GoalDivider />
          <GoalPickLabel>Set Annual Target:</GoalPickLabel>
          <GoalOptions>
            {[250, 500, 1000, 2500].map((val) => (
              <GoalOpt key={val} active={ecoTarget === val} onPress={() => setEcoTarget(val)}>
                <GoalOptText active={ecoTarget === val}>{val}kg</GoalOptText>
              </GoalOpt>
            ))}
          </GoalOptions>
        </GoalCard>

        {/* Address */}
        <BlockHeader>
          <BlockHeaderIcon>
            <FontAwesome5 name="map-marker-alt" size={14} color="#0F8A3C" />
          </BlockHeaderIcon>
          <BlockHeaderTitle>Saved Addresses</BlockHeaderTitle>
        </BlockHeader>
        <AddressCard>
          <AddressTagRow>
            <AddressTag>Default Shipping</AddressTag>
            <FontAwesome5 name="edit" size={12} color="#9CA3AF" />
          </AddressTagRow>
          <AddressLine bold>ZenTech Logistics — Main Hub</AddressLine>
          <AddressLine>104 Innovation Way, Suite B</AddressLine>
          <AddressLine>San Francisco, CA 94107, USA</AddressLine>
        </AddressCard>

        {/* Support */}
        <BlockHeader>
          <BlockHeaderIcon>
            <FontAwesome5 name="headset" size={14} color="#0F8A3C" />
          </BlockHeaderIcon>
          <BlockHeaderTitle>Customer Support</BlockHeaderTitle>
        </BlockHeader>
        <SupportCard>
          {[
            { icon: 'paint-brush', color: '#0F8A3C', label: 'Chat with pre-press design expert' },
            { icon: 'comments', color: '#22C55E', label: 'WhatsApp Live Support' },
            { icon: 'file-invoice-dollar', color: '#0F8A3C', label: 'Request Net-30 invoice terms' },
          ].map((item, idx) => (
            <React.Fragment key={item.label}>
              <SupportRow onPress={() => {
                if (item.label === 'WhatsApp Live Support') {
                  Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`).catch(() =>
                    Alert.alert('WhatsApp', `Please contact us on WhatsApp: ${WHATSAPP_NUMBER}`)
                  );
                } else if (item.label === 'Chat with pre-press design expert') {
                  Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Pre-press Design Query`).catch(() =>
                    Alert.alert('Email Support', SUPPORT_EMAIL)
                  );
                } else {
                  Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Net-30 Invoice Terms Request`).catch(() =>
                    Alert.alert('Email Support', SUPPORT_EMAIL)
                  );
                }
              }} activeOpacity={0.7}>
                <SupportIconWrap bgColor={idx === 1 ? '#DCFCE7' : '#DCFCE7'}>
                  <FontAwesome5 name={item.icon as any} size={14} color={item.color} />
                </SupportIconWrap>
                <SupportLabel>{item.label}</SupportLabel>
                <FontAwesome5 name="chevron-right" size={12} color="#D1D5DB" />
              </SupportRow>
              {idx < 2 && <SupportDivider />}
            </React.Fragment>
          ))}
        </SupportCard>

        {/* Sign Out */}
        <SignOutBtn onPress={handleSignOut} activeOpacity={0.8}>
          <FontAwesome5 name="sign-out-alt" size={14} color="#EF4444" style={{ marginRight: 8 }} />
          <SignOutText>Sign Out</SignOutText>
        </SignOutBtn>

        <AppVersion>PacMonk v1.0.0 · Enterprise Edition</AppVersion>
      </ScrollView>

    </Container>
  );
};

export default AccountScreen;

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

const ProfileCard = styled.View`
  background-color: #FFFFFF; border-radius: 20px;
  margin: 12px 16px 0; border-width: 1px; border-color: #F3F4F6;
  overflow: hidden;
`;
const ProfileAccentBar = styled.View`
  height: 4px; background-color: #0F8A3C; width: 100%;
`;
const ProfileTop = styled.View`flex-direction: row; align-items: flex-start; padding: 16px 20px 12px;`;
const AvatarWrap = styled.View`position: relative; margin-right: 14px;`;
const AvatarRing = styled.View`
  width: 68px;
  height: 68px;
  border-radius: 34px;
  border-width: 2.5px;
  border-color: #0F8A3C;
  padding: 2.5px;
  align-items: center;
  justify-content: center;
`;
const Avatar = styled.View`
  width: 59px;
  height: 59px;
  border-radius: 30px;
  background-color: #0F8A3C;
  align-items: center;
  justify-content: center;
`;
const AvatarText = styled.Text`font-size: 20px; font-weight: 800; color: #FFFFFF;`;
const OnlineDot = styled.View`
  position: absolute; bottom: 2px; right: 2px;
  width: 12px; height: 12px; border-radius: 6px;
  background-color: #22C55E; border-width: 2px; border-color: #FFFFFF;
`;
const ProfileInfo = styled.View`flex: 1;`;
const ProfileName = styled.Text`font-size: 17px; font-weight: 800; color: #111827; margin-bottom: 4px;`;
const TierBadge = styled.View`
  flex-direction: row; align-items: center;
  background-color: #FEF3C7; padding: 3px 8px; border-radius: 6px;
  align-self: flex-start; margin-bottom: 6px;
`;
const TierBadgeText = styled.Text`font-size: 9px; font-weight: 700; color: #D97706;`;
const ProfileMeta = styled.View`flex-direction: row; align-items: center; margin-bottom: 3px;`;
const ProfileMetaText = styled.Text`font-size: 11px; color: #9CA3AF;`;
const EditBtn = styled.TouchableOpacity`
  width: 34px; height: 34px; border-radius: 10px;
  background-color: #DCFCE7; align-items: center; justify-content: center;
`;
const ClientIDRow = styled.View`
  flex-direction: row; align-items: center;
  padding: 10px 20px 16px;
  border-top-width: 1px; border-top-color: #F9FAFB;
`;
const ClientIDText = styled.Text`font-size: 11px; color: #D1D5DB;`;

const StatsRow = styled.View`flex-direction: row; padding: 16px 16px 0;`;
const StatCard = styled.View`
  flex: 1; background-color: #FFFFFF; border-radius: 16px;
  padding: 16px 10px; align-items: center;
  border-width: 1px; border-color: #F3F4F6;
  margin-right: 8px;
`;
const StatIcon = styled.View<{ bgColor: string }>`
  width: 32px; height: 32px; border-radius: 10px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-bottom: 8px;
`;
const StatVal = styled.Text`font-size: 18px; font-weight: 800; color: #111827;`;
const StatLab = styled.Text`font-size: 10px; color: #9CA3AF; margin-top: 2px; text-align: center;`;

const MenuCard = styled.View`
  background-color: #FFFFFF; border-radius: 20px; margin: 16px 16px 0;
  border-width: 1px; border-color: #F3F4F6; overflow: hidden;
`;
const MenuItem = styled.TouchableOpacity`flex-direction: row; align-items: center; padding: 15px 16px;`;
const MenuIconBox = styled.View<{ bgColor: string }>`
  width: 36px; height: 36px; border-radius: 11px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-right: 14px;
`;
const MenuLabel = styled.Text`flex: 1; font-size: 14px; font-weight: 500; color: #111827;`;
const MenuRight = styled.View`flex-direction: row; align-items: center;`;
const MenuBadge = styled.View`
  background-color: #EF4444; border-radius: 10px; min-width: 20px; height: 20px;
  align-items: center; justify-content: center; padding-horizontal: 5px; margin-right: 8px;
`;
const MenuBadgeText = styled.Text`font-size: 10px; font-weight: 800; color: #FFF;`;
const MenuDivider = styled.View`height: 1px; background-color: #F9FAFB; margin-left: 66px;`;

const NotifCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; margin: 12px 16px 0;
  border-width: 1px; border-color: #F3F4F6; padding: 16px;
`;
const NotifCardTitle = styled.Text`font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 14px;`;
const NotifRow = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding-vertical: 10px; border-bottom-width: 1px; border-bottom-color: #F9FAFB;
`;
const NotifContent = styled.View`flex: 1; margin-right: 12px;`;
const NotifLabel = styled.Text`font-size: 13px; font-weight: 600; color: #111827;`;
const NotifDesc = styled.Text`font-size: 11px; color: #9CA3AF; margin-top: 2px;`;

const BlockHeader = styled.View`
  flex-direction: row; align-items: center; padding: 20px 16px 10px;
`;
const BlockHeaderIcon = styled.View`
  width: 28px; height: 28px; border-radius: 8px;
  background-color: #DCFCE7; align-items: center; justify-content: center; margin-right: 10px;
`;
const BlockHeaderTitle = styled.Text`font-size: 13px; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.5px;`;

const GoalCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 16px; margin: 0 16px;
  border-width: 1px; border-color: #F3F4F6;
`;
const GoalTopRow = styled.View`flex-direction: row; justify-content: space-between; margin-bottom: 10px;`;
const GoalLabel = styled.Text`font-size: 13px; color: #6B7280; font-weight: 500;`;
const GoalValue = styled.Text`font-size: 15px; font-weight: 800; color: #0F8A3C;`;
const ProgressBg = styled.View`
  height: 8px; border-radius: 4px; background-color: #F3F4F6; overflow: hidden; margin-bottom: 8px;
`;
const ProgressFill = styled.View<{ pct: number }>`
  height: 100%; width: ${({ pct }) => pct}%; background-color: #0F8A3C; border-radius: 4px;
`;
const GoalSubRow = styled.View`flex-direction: row; justify-content: space-between;`;
const GoalProgress = styled.Text`font-size: 11px; color: #0F8A3C; font-weight: 700;`;
const GoalDaysLeft = styled.Text`font-size: 11px; color: #9CA3AF;`;
const GoalDivider = styled.View`height: 1px; background-color: #F3F4F6; margin-vertical: 12px;`;
const GoalPickLabel = styled.Text`font-size: 11px; font-weight: 700; color: #9CA3AF; margin-bottom: 8px;`;
const GoalOptions = styled.View`flex-direction: row; justify-content: space-between;`;
const GoalOpt = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1; border-radius: 10px; padding-vertical: 8px; align-items: center; margin-horizontal: 3px;
  border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  background-color: ${({ active }) => active ? '#DCFCE7' : '#FAFAFA'};
`;
const GoalOptText = styled.Text<{ active: boolean }>`
  font-size: 12px; font-weight: 700;
  color: ${({ active }) => active ? '#0F8A3C' : '#9CA3AF'};
`;

const AddressCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 16px; margin: 0 16px;
  border-width: 1px; border-color: #F3F4F6;
`;
const AddressTagRow = styled.View`flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 10px;`;
const AddressTag = styled.Text`
  font-size: 9px; font-weight: 700; color: #0F8A3C;
  background-color: #DCFCE7; padding: 3px 8px; border-radius: 5px;
`;
const AddressLine = styled.Text<{ bold?: boolean }>`
  font-size: 13px;
  color: ${({ bold }) => bold ? '#111827' : '#6B7280'};
  font-weight: ${({ bold }) => bold ? '700' : '400'};
  margin-bottom: 2px;
`;

const SupportCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; margin: 0 16px;
  border-width: 1px; border-color: #F3F4F6; overflow: hidden;
`;
const SupportRow = styled.TouchableOpacity`flex-direction: row; align-items: center; padding: 14px 16px;`;
const SupportIconWrap = styled.View<{ bgColor: string }>`
  width: 32px; height: 32px; border-radius: 10px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-right: 12px;
`;
const SupportLabel = styled.Text`flex: 1; font-size: 13px; font-weight: 500; color: #111827;`;
const SupportDivider = styled.View`height: 1px; background-color: #F9FAFB; margin-left: 60px;`;

const SignOutBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center; justify-content: center;
  margin: 20px 16px 0; height: 50px; background-color: #FEF2F2;
  border-radius: 16px; border-width: 1px; border-color: #FECACA;
`;
const SignOutText = styled.Text`font-size: 15px; font-weight: 700; color: #EF4444;`;
const AppVersion = styled.Text`text-align: center; font-size: 11px; color: #D1D5DB; margin-top: 16px;`;
