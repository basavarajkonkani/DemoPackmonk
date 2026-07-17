import React, { useState } from 'react';
import { ScrollView, Alert, Switch } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

const AdminSettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderAlerts: true,
    lowStockAlerts: true,
    paymentAlerts: true,
    maintenanceMode: false,
    autoApproveOrders: false,
    requireArtworkApproval: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    if (key === 'maintenanceMode') {
      Alert.alert(
        'Maintenance Mode',
        'This will disable the platform for all users. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: () => setSettings((prev) => ({ ...prev, [key]: !prev[key] })),
          },
        ]
      );
    } else {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const configItems = [
    { title: 'General', data: [
      { label: 'Platform Name', value: 'PackMonk', type: 'text', icon: 'box' },
      { label: 'Admin Email', value: 'admin@packmonk.com', type: 'text', icon: 'envelope' },
      { label: 'Support Phone', value: '+91 98765 43210', type: 'text', icon: 'phone' },
      { label: 'Currency', value: 'INR (₹)', type: 'text', icon: 'rupee-sign' },
    ]},
    { title: 'Business', data: [
      { label: 'Business Model', value: 'B2B', type: 'text', icon: 'briefcase' },
      { label: 'Minimum Order Quantity', value: '500 units', type: 'text', icon: 'shopping-cart' },
      { label: 'Order Processing Time', value: '7-10 days', type: 'text', icon: 'clock' },
      { label: 'Free Shipping Above', value: '₹5,000', type: 'text', icon: 'truck' },
    ]},
    { title: 'Payment', data: [
      { label: 'Payment Gateway', value: 'Razorpay', type: 'text', icon: 'credit-card' },
      { label: 'Accept COD', value: 'Yes', type: 'text', icon: 'money-bill' },
      { label: 'Payment Terms', value: 'Net 30', type: 'text', icon: 'calendar' },
    ]},
  ];

  const notificationSettings = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
    { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive alerts via SMS' },
    { key: 'orderAlerts', label: 'New Order Alerts', description: 'Get notified of new orders' },
    { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Alert when inventory is low' },
    { key: 'paymentAlerts', label: 'Payment Alerts', description: 'Notify on payment received' },
  ];

  const systemSettings = [
    { key: 'maintenanceMode', label: 'Maintenance Mode', description: 'Disable platform for users', warning: true },
    { key: 'autoApproveOrders', label: 'Auto-Approve Orders', description: 'Skip manual approval step' },
    { key: 'requireArtworkApproval', label: 'Require Artwork Approval', description: 'Manual artwork review required' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Settings</HeaderTitle>
        <Placeholder />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Configuration Sections */}
        {configItems.map((section) => (
          <Section key={section.title}>
            <SectionTitle>{section.title} Settings</SectionTitle>
            <SettingsCard>
              {section.data.map((item, idx) => (
                <SettingRow key={idx} last={idx === section.data.length - 1}>
                  <SettingLeft>
                    <SettingIcon>
                      <FontAwesome5 name={item.icon as any} size={14} color="#6B7280" />
                    </SettingIcon>
                    <SettingLabel>{item.label}</SettingLabel>
                  </SettingLeft>
                  <SettingRight>
                    <SettingValue>{item.value}</SettingValue>
                    <FontAwesome5 name="chevron-right" size={12} color="#9CA3AF" />
                  </SettingRight>
                </SettingRow>
              ))}
            </SettingsCard>
          </Section>
        ))}

        {/* Notification Settings */}
        <Section>
          <SectionTitle>Notification Settings</SectionTitle>
          <SettingsCard>
            {notificationSettings.map((item, idx) => (
              <SettingRow key={item.key} last={idx === notificationSettings.length - 1}>
                <SettingLeft>
                  <SettingInfo>
                    <SettingLabel>{item.label}</SettingLabel>
                    <SettingDescription>{item.description}</SettingDescription>
                  </SettingInfo>
                </SettingLeft>
                <Switch
                  value={settings[item.key as keyof typeof settings] as boolean}
                  onValueChange={() => toggleSetting(item.key as keyof typeof settings)}
                  trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                  thumbColor={settings[item.key as keyof typeof settings] ? '#0F8A3C' : '#F3F4F6'}
                />
              </SettingRow>
            ))}
          </SettingsCard>
        </Section>

        {/* System Settings */}
        <Section>
          <SectionTitle>System Settings</SectionTitle>
          <SettingsCard>
            {systemSettings.map((item, idx) => (
              <SettingRow key={item.key} last={idx === systemSettings.length - 1}>
                <SettingLeft>
                  <SettingInfo>
                    <SettingLabel warning={item.warning}>{item.label}</SettingLabel>
                    <SettingDescription>{item.description}</SettingDescription>
                  </SettingInfo>
                </SettingLeft>
                <Switch
                  value={settings[item.key as keyof typeof settings] as boolean}
                  onValueChange={() => toggleSetting(item.key as keyof typeof settings)}
                  trackColor={{ false: '#E5E7EB', true: item.warning ? '#FCA5A5' : '#86EFAC' }}
                  thumbColor={settings[item.key as keyof typeof settings] 
                    ? (item.warning ? '#EF4444' : '#0F8A3C') 
                    : '#F3F4F6'}
                />
              </SettingRow>
            ))}
          </SettingsCard>
        </Section>

        {/* Quick Actions */}
        <Section>
          <SectionTitle>Quick Actions</SectionTitle>
          <ActionButton onPress={() => Alert.alert('Database', 'Database backup initiated')}>
            <ActionButtonIcon bgColor="#DBEAFE">
              <FontAwesome5 name="database" size={16} color="#3B82F6" />
            </ActionButtonIcon>
            <ActionButtonText>Backup Database</ActionButtonText>
          </ActionButton>

          <ActionButton onPress={() => Alert.alert('Cache', 'Cache cleared successfully')}>
            <ActionButtonIcon bgColor="#DCFCE7">
              <FontAwesome5 name="broom" size={16} color="#0F8A3C" />
            </ActionButtonIcon>
            <ActionButtonText>Clear Cache</ActionButtonText>
          </ActionButton>

          <ActionButton onPress={() => Alert.alert('Logs', 'Viewing system logs')}>
            <ActionButtonIcon bgColor="#FEF3C7">
              <FontAwesome5 name="file-alt" size={16} color="#D97706" />
            </ActionButtonIcon>
            <ActionButtonText>View Logs</ActionButtonText>
          </ActionButton>

          <ActionButton onPress={() => Alert.alert('Export', 'Exporting all data')}>
            <ActionButtonIcon bgColor="#FCE7F3">
              <FontAwesome5 name="download" size={16} color="#EC4899" />
            </ActionButtonIcon>
            <ActionButtonText>Export Data</ActionButtonText>
          </ActionButton>
        </Section>

        {/* Danger Zone */}
        <Section>
          <SectionTitle danger>Danger Zone</SectionTitle>
          <DangerCard>
            <DangerButton onPress={() => Alert.alert('Reset', 'This action cannot be undone')}>
              <DangerButtonText>Reset All Settings</DangerButtonText>
              <FontAwesome5 name="undo" size={14} color="#EF4444" />
            </DangerButton>
            <Divider />
            <DangerButton onPress={() => Alert.alert('Clear', 'This will delete all analytics data')}>
              <DangerButtonText>Clear Analytics Data</DangerButtonText>
              <FontAwesome5 name="trash" size={14} color="#EF4444" />
            </DangerButton>
          </DangerCard>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminSettingsScreen;

const Header = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 16px 20px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const BackButton = styled.TouchableOpacity`width: 40px; height: 40px; align-items: center; justify-content: center;`;
const HeaderTitle = styled.Text`font-size: 18px; font-weight: 700; color: #1F2937;`;
const Placeholder = styled.View`width: 40px;`;

const Section = styled.View`padding: 16px;`;
const SectionTitle = styled.Text<{ danger?: boolean }>`
  font-size: 14px; font-weight: 700; color: ${({ danger }) => danger ? '#EF4444' : '#6B7280'};
  text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
`;

const SettingsCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px;
  border-width: 1px; border-color: #F3F4F6;
`;

const SettingRow = styled.View<{ last?: boolean }>`
  flex-direction: row; justify-content: space-between; align-items: center;
  padding: 16px; border-bottom-width: ${({ last }) => last ? 0 : 1}px;
  border-bottom-color: #F3F4F6;
`;

const SettingLeft = styled.View`
  flex-direction: row; align-items: center; flex: 1;
`;

const SettingIcon = styled.View`
  width: 32px; height: 32px; border-radius: 10px;
  background-color: #F3F4F6; align-items: center; justify-content: center;
  margin-right: 12px;
`;

const SettingInfo = styled.View`flex: 1;`;

const SettingLabel = styled.Text<{ warning?: boolean }>`
  font-size: 14px; font-weight: 600;
  color: ${({ warning }) => warning ? '#EF4444' : '#111827'};
  margin-bottom: 2px;
`;

const SettingDescription = styled.Text`
  font-size: 11px; color: #9CA3AF; line-height: 16px;
`;

const SettingRight = styled.View`
  flex-direction: row; align-items: center;
`;

const SettingValue = styled.Text`
  font-size: 13px; color: #6B7280; margin-right: 8px;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row; align-items: center;
  background-color: #FFFFFF; border-radius: 12px; padding: 16px;
  margin-bottom: 8px; border-width: 1px; border-color: #F3F4F6;
`;

const ActionButtonIcon = styled.View<{ bgColor: string }>`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-right: 12px;
`;

const ActionButtonText = styled.Text`
  font-size: 14px; font-weight: 600; color: #111827; flex: 1;
`;

const DangerCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px;
  border-width: 2px; border-color: #FEE2E2;
`;

const DangerButton = styled.TouchableOpacity`
  flex-direction: row; justify-content: space-between; align-items: center;
  padding: 16px;
`;

const DangerButtonText = styled.Text`
  font-size: 14px; font-weight: 600; color: #EF4444;
`;

const Divider = styled.View`
  height: 1px; background-color: #FEE2E2;
`;
