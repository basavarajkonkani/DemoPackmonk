import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch } from '../store';
import { loginAdmin } from '../store/authSlice';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const VALID_CREDENTIALS = [
    { email: 'admin@packmonk.com', password: 'Admin@123', name: 'Admin User' },
    { email: 'superadmin@packmonk.com', password: 'SuperAdmin@123', name: 'Super Admin' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = VALID_CREDENTIALS.find((c) => c.email === email && c.password === password);

    if (user) {
      const adminUser = {
        id: 'admin_001',
        name: user.name,
        email: user.email,
        role: email === 'superadmin@packmonk.com' ? ('superadmin' as const) : ('admin' as const),
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      dispatch(loginAdmin(adminUser));
      navigate('/');
    } else {
      setError('Invalid email or password');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>📦</Logo>
        <Title>PacMonk Admin</Title>
        <Subtitle>Packaging & Print Management</Subtitle>

        <Form onSubmit={handleLogin}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@packmonk.com"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitBtn type="submit" disabled={loading || !email || !password}>
            {loading ? 'Logging in...' : 'Sign In'}
          </SubmitBtn>
        </Form>

        <Divider>Demo Credentials</Divider>

        <DemoCredentials>
          <DemoItem>
            <DemoLabel>Admin:</DemoLabel>
            <DemoValue>admin@packmonk.com / Admin@123</DemoValue>
          </DemoItem>
          <DemoItem>
            <DemoLabel>Super Admin:</DemoLabel>
            <DemoValue>superadmin@packmonk.com / SuperAdmin@123</DemoValue>
          </DemoItem>
        </DemoCredentials>

        <Footer>
          <FooterText>PacMonk Admin Dashboard v1.0.0</FooterText>
          <FooterNote>Demo Mode - Using Mock Data</FooterNote>
        </Footer>
      </LoginCard>

      <BackgroundAccent />
    </LoginContainer>
  );
};

export default LoginPage;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0F8A3C 0%, #0D7A35 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundAccent = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  top: -100px;
  right: -100px;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
`;

const Logo = styled.div`
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  text-align: center;
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6B7280;
  text-align: center;
  margin: 0 0 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  transition: all 150ms ease;

  &:focus {
    outline: none;
    border-color: #0F8A3C;
    box-shadow: 0 0 0 3px rgba(15, 138, 60, 0.1);
  }

  &:disabled {
    background-color: #F9FAFB;
    color: #D1D5DB;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #D1D5DB;
  }
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #FEE2E2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  font-size: 14px;
  color: #DC2626;
`;

const SubmitBtn = styled.button`
  padding: 12px 16px;
  background-color: #0F8A3C;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover:not(:disabled) {
    background-color: #0D7A35;
    box-shadow: 0 4px 12px rgba(15, 138, 60, 0.3);
  }

  &:disabled {
    background-color: #D1D5DB;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 24px 0;
  font-size: 12px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #E5E7EB;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const DemoCredentials = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #FEF3C7;
  border-radius: 8px;
  border: 1px solid #FCD34D;
`;

const DemoItem = styled.div`
  font-size: 12px;
`;

const DemoLabel = styled.span`
  font-weight: 600;
  color: #92400E;
`;

const DemoValue = styled.span`
  color: #78350F;
  font-family: 'Monaco', 'Courier New', monospace;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #E5E7EB;
`;

const FooterText = styled.p`
  font-size: 12px;
  color: #6B7280;
  margin: 0 0 4px;
`;

const FooterNote = styled.p`
  font-size: 11px;
  color: #D97706;
  margin: 0;
  font-weight: 600;
`;
