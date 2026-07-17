import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch } from '../store';
import { logout } from '../store/authSlice';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/' },
    { icon: '📦', label: 'Products', path: '/products' },
    { icon: '📋', label: 'Orders', path: '/orders' },
    { icon: '👥', label: 'Customers', path: '/customers' },
    { icon: '🏭', label: 'Inventory', path: '/inventory' },
    { icon: '💰', label: 'Pricing', path: '/pricing' },
    { icon: '🎨', label: 'Banners', path: '/banners' },
    { icon: '📈', label: 'Analytics', path: '/analytics' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <BrandSection>
        <BrandLogo>📦</BrandLogo>
        {isOpen && <BrandName>PacMonk Admin</BrandName>}
      </BrandSection>

      <NavMenu>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            isActive={location.pathname === item.path}
            title={item.label}
          >
            <NavIcon>{item.icon}</NavIcon>
            {isOpen && <NavLabel>{item.label}</NavLabel>}
          </NavLink>
        ))}
      </NavMenu>

      <FooterSection>
        <LogoutBtn onClick={handleLogout} title="Logout">
          <LogoutIcon>🚪</LogoutIcon>
          {isOpen && <LogoutLabel>Logout</LogoutLabel>}
        </LogoutBtn>
      </FooterSection>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  width: ${({ isOpen }) => (isOpen ? '280px' : '80px')};
  background-color: #FFFFFF;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  transition: width 300ms ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const BrandSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandLogo = styled.div`
  font-size: 28px;
`;

const BrandName = styled.h1`
  font-size: 16px;
  font-weight: 800;
  color: #0F8A3C;
  margin: 0;
`;

const NavMenu = styled.nav`
  flex: 1;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: ${({ isActive }) => (isActive ? '#FFFFFF' : '#6B7280')};
  background-color: ${({ isActive }) => (isActive ? '#0F8A3C' : 'transparent')};
  font-weight: ${({ isActive }) => (isActive ? '600' : '500')};
  text-decoration: none;
  transition: all 150ms ease;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#0D7A35' : '#F3F4F6')};
    color: ${({ isActive }) => (isActive ? '#FFFFFF' : '#111827')};
  }
`;

const NavIcon = styled.span`
  font-size: 20px;
`;

const NavLabel = styled.span`
  font-size: 14px;
`;

const FooterSection = styled.div`
  padding: 16px 8px;
  border-top: 1px solid #E5E7EB;
`;

const LogoutBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: #EF4444;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background-color: #FEE2E2;
    color: #DC2626;
  }
`;

const LogoutIcon = styled.span`
  font-size: 20px;
`;

const LogoutLabel = styled.span`
  font-size: 14px;
`;
