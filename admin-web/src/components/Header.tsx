import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, RootState } from '../store';

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const products = useAppSelector((state: RootState) => state.products.items);
  const orders = useAppSelector((state: RootState) => state.orders.items);
  const customers = useAppSelector((state: RootState) => state.customers.items);

  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return { products: [], orders: [], customers: [] };
    const q = query.toLowerCase();
    return {
      products: products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4),
      orders: orders.filter((o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)).slice(0, 4),
      customers: customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [query, products, orders, customers]);

  const notifications = useMemo(() => {
    const lowStock = products.filter((p) => p.stock < p.lowStockThreshold);
    const pending = orders.filter((o) => o.status === 'pending_review');
    return [
      ...lowStock.map((p) => ({ id: `low_${p.id}`, text: `Low stock: ${p.name} (${p.stock} left)`, type: 'warning' as const })),
      ...pending.map((o) => ({ id: `pending_${o.id}`, text: `Order ${o.id} awaiting review`, type: 'info' as const })),
    ];
  }, [products, orders]);

  const goTo = (path: string) => {
    setShowResults(false);
    setQuery('');
    navigate(path);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <ToggleBtn onClick={onSidebarToggle} title="Toggle Sidebar">
          ☰
        </ToggleBtn>
      </LeftSection>

      <RightSection>
        <SearchWrapper ref={searchRef}>
          <SearchBox>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              placeholder="Search products, orders, customers..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
            />
          </SearchBox>
          {showResults && query.trim() && (
            <ResultsDropdown>
              {searchResults.products.length === 0 && searchResults.orders.length === 0 && searchResults.customers.length === 0 ? (
                <NoResults>No results for "{query}"</NoResults>
              ) : (
                <>
                  {searchResults.products.length > 0 && (
                    <ResultGroup>
                      <ResultGroupTitle>Products</ResultGroupTitle>
                      {searchResults.products.map((p) => (
                        <ResultItem key={p.id} onClick={() => goTo('/products')}>{p.name}</ResultItem>
                      ))}
                    </ResultGroup>
                  )}
                  {searchResults.orders.length > 0 && (
                    <ResultGroup>
                      <ResultGroupTitle>Orders</ResultGroupTitle>
                      {searchResults.orders.map((o) => (
                        <ResultItem key={o.id} onClick={() => goTo(`/orders/${o.id}`)}>{o.id} — {o.customerName}</ResultItem>
                      ))}
                    </ResultGroup>
                  )}
                  {searchResults.customers.length > 0 && (
                    <ResultGroup>
                      <ResultGroupTitle>Customers</ResultGroupTitle>
                      {searchResults.customers.map((c) => (
                        <ResultItem key={c.id} onClick={() => goTo(`/customers/${c.id}`)}>{c.name}</ResultItem>
                      ))}
                    </ResultGroup>
                  )}
                </>
              )}
            </ResultsDropdown>
          )}
        </SearchWrapper>

        <NotifWrapper ref={notifRef}>
          <NotificationBell title="Notifications" onClick={() => setShowNotifications((v) => !v)}>
            🔔
            {notifications.length > 0 && <NotifBadge>{notifications.length}</NotifBadge>}
          </NotificationBell>
          {showNotifications && (
            <NotifDropdown>
              {notifications.length === 0 ? (
                <NoResults>No notifications</NoResults>
              ) : (
                notifications.map((n) => (
                  <NotifItem key={n.id} type={n.type}>{n.text}</NotifItem>
                ))
              )}
            </NotifDropdown>
          )}
        </NotifWrapper>

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

const SearchWrapper = styled.div`
  position: relative;
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

const ResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 320px;
  max-height: 360px;
  overflow-y: auto;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  z-index: 200;
  padding: 8px;
`;

const ResultGroup = styled.div`
  margin-bottom: 6px;
`;

const ResultGroupTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #9CA3AF;
  text-transform: uppercase;
  padding: 6px 8px 2px;
`;

const ResultItem = styled.div`
  padding: 8px;
  font-size: 13px;
  color: #111827;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #F3F4F6;
  }
`;

const NoResults = styled.div`
  padding: 16px;
  font-size: 13px;
  color: #9CA3AF;
  text-align: center;
`;

const NotifWrapper = styled.div`
  position: relative;
`;

const NotifBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #EF4444;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
`;

const NotifDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 300px;
  max-height: 360px;
  overflow-y: auto;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  z-index: 200;
  padding: 8px;
`;

const NotifItem = styled.div<{ type: 'warning' | 'info' }>`
  padding: 10px 8px;
  font-size: 13px;
  color: #111827;
  border-radius: 6px;
  border-left: 3px solid ${({ type }) => (type === 'warning' ? '#F59E0B' : '#0284C7')};
  margin-bottom: 4px;
  background-color: ${({ type }) => (type === 'warning' ? '#FFFBEB' : '#F0F9FF')};
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
  position: relative;
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
