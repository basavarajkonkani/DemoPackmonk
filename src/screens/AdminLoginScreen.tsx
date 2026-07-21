import React, { useState } from 'react';
import { View, Alert, Platform, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch } from '../store';
import { loginAsAdmin } from '../store/authSlice';

// TEMPORARY: hardcoded credentials for demo/offline use only. This app has no
// backend yet, so there is nowhere else to authenticate against. Before
// shipping to production, replace this with a real authentication API call
// (e.g. POST /auth/admin/login) and remove these constants entirely — do not
// ship a client bundle with admin credentials embedded in it.
const ADMIN_CREDENTIALS = [
  { username: 'admin@packmonk.com', password: 'Admin@123' },
  { username: 'superadmin@packmonk.com', password: 'SuperAdmin@123' },
];

const AdminLoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateCredentials = (user: string, pass: string): boolean => {
    return ADMIN_CREDENTIALS.some(cred => 
      cred.username === user && cred.password === pass
    );
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!username.trim()) {
      setError('Please enter your email/username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (validateCredentials(username, password)) {
        // Login successful
        const adminUser = {
          id: 'admin_001',
          name: 'Admin User',
          email: username,
          role: 'admin' as const,
          phone: '+91-1234567890',
          companyAddress: 'Bangalore, India',
          createdAt: new Date().toISOString(),
          isActive: true,
        };

        dispatch(loginAsAdmin(adminUser));
        setIsLoading(false);
        
        // Navigation will be handled by auth state change
        Alert.alert('Success', 'Admin login successful!', [
          { text: 'OK', onPress: () => navigation.replace('AdminTabs') }
        ]);
      } else {
        // Login failed
        setIsLoading(false);
        setError('Invalid email or password. Please try again.');
        setPassword('');
      }
    }, 500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        >
          {/* Header */}
          <HeaderSection>
            <BackBtn onPress={() => navigation.goBack()}>
              <FontAwesome5 name="arrow-left" size={16} color="#0F8A3C" />
            </BackBtn>
          </HeaderSection>

          {/* Logo & Title */}
          <LogoSection>
            <AdminIcon>
              <FontAwesome5 name="user-shield" size={48} color="#0F8A3C" />
            </AdminIcon>
            <Title>Admin Portal</Title>
            <Subtitle>Secure admin access</Subtitle>
          </LogoSection>

          {/* Form */}
          <FormSection>
            {/* Email/Username Input */}
            <InputGroup>
              <Label>Email / Username</Label>
              <InputWrapper>
                <EmailIcon>
                  <FontAwesome5 name="envelope" size={16} color="#9CA3AF" />
                </EmailIcon>
                <TextInput
                  placeholder="admin@packmonk.com"
                  placeholderTextColor="#D1D5DB"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    setError('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                  style={{ flex: 1, color: '#111827', fontSize: 14 }}
                />
              </InputWrapper>
            </InputGroup>

            {/* Password Input */}
            <InputGroup>
              <Label>Password</Label>
              <InputWrapper>
                <PasswordIcon>
                  <FontAwesome5 name="lock" size={16} color="#9CA3AF" />
                </PasswordIcon>
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#D1D5DB"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                  style={{ flex: 1, color: '#111827', fontSize: 14 }}
                />
                <ShowPasswordBtn onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesome5 
                    name={showPassword ? 'eye' : 'eye-slash'} 
                    size={16} 
                    color="#9CA3AF" 
                  />
                </ShowPasswordBtn>
              </InputWrapper>
            </InputGroup>

            {/* Error Message */}
            {error ? (
              <ErrorMessage>
                <FontAwesome5 name="exclamation-circle" size={14} color="#EF4444" />
                <ErrorText>{error}</ErrorText>
              </ErrorMessage>
            ) : null}

            {/* Login Button */}
            <LoginButton 
              onPress={handleLogin} 
              disabled={isLoading}
              activeOpacity={0.9}
            >
              {isLoading ? (
                <>
                  <FontAwesome5 name="spinner" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <LoginButtonText>Logging in...</LoginButtonText>
                </>
              ) : (
                <>
                  <FontAwesome5 name="sign-in-alt" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <LoginButtonText>Admin Login</LoginButtonText>
                </>
              )}
            </LoginButton>

          </FormSection>

          {/* Footer */}
          <FooterSection>
            <BackToUserBtn onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <FontAwesome5 name="arrow-left" size={14} color="#0F8A3C" />
              <BackToUserText>Back to User Mode</BackToUserText>
            </BackToUserBtn>
          </FooterSection>
        </ScrollView>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default AdminLoginScreen;

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #F8F9FA;
`;

const HeaderSection = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  padding-horizontal: 4px;
`;

const BackBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E5E7EB;
  align-items: center;
  justify-content: center;
`;

const LogoSection = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const AdminIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #ECFDF5;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-width: 2px;
  border-color: #0F8A3C;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
`;

const FormSection = styled.View`
  margin-bottom: 30px;
`;

const InputGroup = styled.View`
  margin-bottom: 18px;
`;

const Label = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-width: 1.5px;
  border-color: #E5E7EB;
  border-radius: 12px;
  padding-horizontal: 12px;
  height: 48px;
`;

const EmailIcon = styled.View`
  margin-right: 10px;
`;

const PasswordIcon = styled.View`
  margin-right: 10px;
`;

const TextInput = styled.TextInput`
  flex: 1;
  color: #111827;
  font-size: 14px;
`;

const ShowPasswordBtn = styled.TouchableOpacity`
  padding: 8px;
`;

const ErrorMessage = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FEE2E2;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: #FECACA;
`;

const ErrorText = styled.Text`
  font-size: 13px;
  color: #DC2626;
  margin-left: 8px;
  flex: 1;
`;

const LoginButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex-direction: row;
  height: 52px;
  background-color: ${({ disabled }) => disabled ? '#D1D5DB' : '#0F8A3C'};
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

const LoginButtonText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
`;

const FooterSection = styled.View`
  align-items: center;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: #E5E7EB;
  margin-top: 20px;
`;

const BackToUserBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 16px;
  border-radius: 10px;
  background-color: #FFFFFF;
  border-width: 1.5px;
  border-color: #0F8A3C;
`;

const BackToUserText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #0F8A3C;
  margin-left: 8px;
`;
