import React from 'react';
import styled from 'styled-components';
import { useAppSelector, RootState } from '../store';

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const user = useAppSelector((state: RootState) => state.auth.user);

  return (
    <HeaderContainer>
      <LeftSection>
        <ToggleBtn onClick={onSidebarToggle} title="Toggle Sidebar">
          ☰
        </ToggleBtn>
      </LeftSection>

      <RightSection>
        <SearchBox>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput placeholder="Search..." />
        </SearchBox>

        <NotificationBell title="Notifications">🔔</NotificationBell>

        <UserProfile>
          <UserAvatar>{user?.name.charAt(0) || 'A'}</UserAvatar>
          <UserInfo>
            <UserName>{user?.name || 'Admin'}</UserName>
            <UserRole>{user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</UserRole>
          </UserInfo>
        </UserProfile>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6B7280;
  padding: 8px;
  border-radius: 6px;
  transition: all 150ms ease;

  &:hover {
    background-color: #F3F4F6;
    color: #111827;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #F3F4F6;
  border-radius: 8px;
  padding: 8px 12px;
  gap: 8px;
  flex: 0 1 240px;
`;

const SearchIcon = styled.span`
  font-size: 16px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #111827;

  &::placeholder {
    color: #9CA3AF;
  }
`;

const NotificationBell = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 150ms ease;

  &:hover {
    background-color: #F3F4F6;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: #F3F4F6;
  border-radius: 8px;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #0F8A3C;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
`;

const UserRole = styled.div`
  font-size: 11px;
  color: #9CA3AF;
`;
