import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useAppDispatch } from '../store';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { readValue, writeValue } from '../services/storage';

interface SettingsState {
  emailNotifications: boolean;
  orderUpdates: boolean;
  theme: 'Light' | 'Dark' | 'Auto';
  language: 'English' | 'Hindi';
}

const SETTINGS_KEY = 'app_settings';
const DEFAULT_SETTINGS: SettingsState = {
  emailNotifications: true,
  orderUpdates: true,
  theme: 'Light',
  language: 'English',
};

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SettingsState>(() => readValue(SETTINGS_KEY, DEFAULT_SETTINGS));

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    writeValue(SETTINGS_KEY, next);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Layout>
      <PageContainer>
        <PageTitle>Settings</PageTitle>

        <SettingsCard>
          <SectionTitle>Account Settings</SectionTitle>
          <SettingItem>
            <Label>Email Notifications</Label>
            <Toggle>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
              />
            </Toggle>
          </SettingItem>
          <SettingItem>
            <Label>Order Updates</Label>
            <Toggle>
              <input
                type="checkbox"
                checked={settings.orderUpdates}
                onChange={(e) => updateSetting('orderUpdates', e.target.checked)}
              />
            </Toggle>
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>System Settings</SectionTitle>
          <SettingItem>
            <Label>Theme</Label>
            <Select
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value as SettingsState['theme'])}
            >
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </Select>
          </SettingItem>
          <SettingItem>
            <Label>Language</Label>
            <Select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value as SettingsState['language'])}
            >
              <option>English</option>
              <option>Hindi</option>
            </Select>
          </SettingItem>
        </SettingsCard>

        <SettingsCard danger>
          <SectionTitle>Danger Zone</SectionTitle>
          <DangerText>Sign out of your account</DangerText>
          <LogoutBtn onClick={handleLogout}>Sign Out</LogoutBtn>
        </SettingsCard>
      </PageContainer>
    </Layout>
  );
};

export default SettingsPage;

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 32px;
`;

const SettingsCard = styled.div<{ danger?: boolean }>`
  background: #FFFFFF;
  border: 1px solid ${({ danger }) => (danger ? '#FECACA' : '#E5E7EB')};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 20px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #E5E7EB;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;

  input[type='checkbox'] {
    width: 40px;
    height: 24px;
    cursor: pointer;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
  }
`;

const DangerText = styled.p`
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 16px;
`;

const LogoutBtn = styled.button`
  padding: 10px 20px;
  background-color: #EF4444;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background-color: #DC2626;
  }
`;
