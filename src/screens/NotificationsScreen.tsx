import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchNotifications,
  markNotificationReadThunk,
  markAllNotificationsReadThunk,
  selectNotifications,
  selectUnreadCount,
} from '../store/notificationsSlice';
import type { AppNotification } from '../store/notificationsSlice';

const TYPE_FILTERS = ['All', 'Orders', 'Shipments', 'Designs', 'Promos'];

const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filtered = notifications.filter((n) => {
    if (filter === 'All') return true;
    if (filter === 'Orders') return n.type === 'order';
    if (filter === 'Shipments') return n.type === 'shipment';
    if (filter === 'Designs') return n.type === 'design';
    if (filter === 'Promos') return n.type === 'promo';
    return true;
  });

  const handleNotifPress = (notif: AppNotification) => {
    markRead(notif.id);
    if (notif.type === 'order' || notif.type === 'shipment') {
      navigation.navigate('MainTabs', { screen: 'Orders' });
    }
  };

  const markAllRead = () => {
    dispatch(markAllNotificationsReadThunk());
  };

  const markRead = (id: string) => {
    dispatch(markNotificationReadThunk(id));
  };

  return (
    <Container>
      <NavBar>
        <NavBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBtn>
        <NavTitleWrap>
          <NavTitle>Notifications</NavTitle>
          {unreadCount > 0 && (
            <UnreadBadge>
              <UnreadBadgeText>{unreadCount}</UnreadBadgeText>
            </UnreadBadge>
          )}
        </NavTitleWrap>
        <MarkAllBtn onPress={markAllRead}>
          <MarkAllText>Mark all read</MarkAllText>
        </MarkAllBtn>
      </NavBar>

      {/* Filter chips */}
      <FilterRow>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          {TYPE_FILTERS.map((f) => (
            <FilterChip key={f} active={filter === f} onPress={() => setFilter(f)} activeOpacity={0.8}>
              <FilterChipText active={filter === f}>{f}</FilterChipText>
            </FilterChip>
          ))}
        </ScrollView>
      </FilterRow>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {filtered.length === 0 ? (
          <EmptyWrap>
            <FontAwesome5 name="bell-slash" size={40} color="#D1D5DB" style={{ marginBottom: 14 }} />
            <EmptyTitle>No notifications</EmptyTitle>
            <EmptyDesc>You're all caught up!</EmptyDesc>
          </EmptyWrap>
        ) : (
          filtered.map((notif) => (
            <NotifCard
              key={notif.id}
              read={notif.read}
              onPress={() => handleNotifPress(notif)}
              activeOpacity={0.85}
              style={notif.read ? {} : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}
            >
              <NotifIconWrap bgColor={notif.iconBg}>
                <FontAwesome5 name={notif.icon as any} size={16} color={notif.iconColor} />
              </NotifIconWrap>
              <NotifBody>
                <NotifTitleRow>
                  <NotifTitle read={notif.read}>{notif.title}</NotifTitle>
                  {!notif.read && <UnreadDot />}
                </NotifTitleRow>
                <NotifMsg numberOfLines={2}>{notif.body}</NotifMsg>
                <NotifTime>{notif.time}</NotifTime>
              </NotifBody>
              <FontAwesome5 name="chevron-right" size={11} color="#D1D5DB" />
            </NotifCard>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default NotificationsScreen;

const Container = styled.View`flex: 1; background-color: #F8F9FA;`;

const NavBar = styled.View`
  height: 56px; flex-direction: row; align-items: center; justify-content: space-between;
  padding-horizontal: 16px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #F3F4F6;
`;
const NavBtn = styled.TouchableOpacity`
  width: 38px; height: 38px; border-radius: 12px;
  background-color: #F9FAFB; align-items: center; justify-content: center;
  border-width: 1px; border-color: #F3F4F6;
`;
const NavTitleWrap = styled.View`flex-direction: row; align-items: center;`;
const NavTitle = styled.Text`font-size: 16px; font-weight: 700; color: #111827;`;
const UnreadBadge = styled.View`
  background-color: #0F8A3C; border-radius: 10px; min-width: 20px; height: 20px;
  align-items: center; justify-content: center; padding-horizontal: 5px; margin-left: 8px;
`;
const UnreadBadgeText = styled.Text`font-size: 10px; font-weight: 800; color: #FFF;`;
const MarkAllBtn = styled.TouchableOpacity`padding: 6px 10px;`;
const MarkAllText = styled.Text`font-size: 12px; font-weight: 600; color: #0F8A3C;`;

const FilterRow = styled.View`background-color: #FFFFFF; border-bottom-width: 1px; border-bottom-color: #F3F4F6;`;
const FilterChip = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 16px; border-radius: 20px; margin-right: 8px;
  background-color: ${({ active }) => active ? '#0F8A3C' : '#F9FAFB'};
  border-width: 1.5px; border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
`;
const FilterChipText = styled.Text<{ active: boolean }>`
  font-size: 12px; font-weight: 600;
  color: ${({ active }) => active ? '#FFFFFF' : '#6B7280'};
`;

const NotifCard = styled.TouchableOpacity<{ read: boolean }>`
  flex-direction: row; align-items: center;
  background-color: ${({ read }) => read ? '#FFFFFF' : '#F0FDF4'};
  border-radius: 16px; padding: 14px 12px 14px 14px;
  border-width: 1px;
  border-color: ${({ read }) => read ? '#F3F4F6' : '#BBF7D0'};
  margin-bottom: 10px;
`;
const NotifIconWrap = styled.View<{ bgColor: string }>`
  width: 44px; height: 44px; border-radius: 14px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;
`;
const NotifBody = styled.View`flex: 1;`;
const NotifTitleRow = styled.View`flex-direction: row; align-items: center; margin-bottom: 3px;`;
const NotifTitle = styled.Text<{ read: boolean }>`
  font-size: 13px; font-weight: ${({ read }) => read ? '600' : '800'};
  color: #111827; flex: 1;
`;
const UnreadDot = styled.View`
  width: 8px; height: 8px; border-radius: 4px;
  background-color: #0F8A3C; margin-left: 6px; flex-shrink: 0;
`;
const NotifMsg = styled.Text`font-size: 12px; color: #6B7280; line-height: 17px; margin-bottom: 5px;`;
const NotifTime = styled.Text`font-size: 10px; color: #9CA3AF; font-weight: 500;`;

const EmptyWrap = styled.View`align-items: center; padding-vertical: 60px;`;
const EmptyTitle = styled.Text`font-size: 17px; font-weight: 700; color: #374151; margin-bottom: 6px;`;
const EmptyDesc = styled.Text`font-size: 14px; color: #9CA3AF;`;
