import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateBanner, deleteBanner, updateBannerStatus } from '../../store/adminSlice';

interface Props {
  navigation: any;
}

const AdminBannersScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const banners = useAppSelector((state) => state.admin.banners);

  const statusConfig = {
    active: { label: 'Active', color: '#10B981', bg: '#D1FAE5' },
    inactive: { label: 'Inactive', color: '#9CA3AF', bg: '#F3F4F6' },
    scheduled: { label: 'Scheduled', color: '#3B82F6', bg: '#DBEAFE' },
  };

  const ctr = (impressions: number, clicks: number) => {
    if (impressions === 0) return 0;
    return ((clicks / impressions) * 100).toFixed(2);
  };

  const handleEditBanner = (banner: any) => {
    Alert.alert('Edit Banner', `Edit: ${banner.title}`, [
      {
        text: 'Edit',
        onPress: () => Alert.alert('Success', 'Banner updated successfully'),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleAddBanner = () => {
    Alert.alert('Add New Banner', 'Create a new promotional banner', [
      {
        text: 'Create',
        onPress: () => Alert.alert('Success', 'Banner created successfully'),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDeleteBanner = (banner: any) => {
    Alert.alert('Delete Banner', `Are you sure you want to delete "${banner.title}"?`, [
      {
        text: 'Delete',
        onPress: () => {
          dispatch(deleteBanner(banner.id));
          Alert.alert('Success', 'Banner deleted');
        },
        style: 'destructive',
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleActivateBanner = (banner: any) => {
    dispatch(updateBannerStatus({ id: banner.id, status: 'active' }));
    Alert.alert('Success', `${banner.title} is now active`);
  };

  const stats = {
    totalImpressions: banners.reduce((sum, b) => sum + b.impressions, 0),
    totalClicks: banners.reduce((sum, b) => sum + b.clicks, 0),
    averageCTR:
      banners.length > 0
        ? ((banners.reduce((sum, b) => sum + b.clicks, 0) /
            banners.reduce((sum, b) => sum + b.impressions, 0)) *
            100).toFixed(2) || '0'
        : '0',
    activeBanners: banners.filter((b) => b.status === 'active').length,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Banner Management</HeaderTitle>
        <AddButton onPress={handleAddBanner}>
          <FontAwesome5 name="plus" size={18} color="#FFF" />
        </AddButton>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <StatsGrid>
          <StatCard>
            <StatIcon bgColor="#D1FAE5">
              <FontAwesome5 name="eye" size={18} color="#10B981" />
            </StatIcon>
            <StatValue>{stats.totalImpressions.toLocaleString()}</StatValue>
            <StatLabel>Total Views</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon bgColor="#DBEAFE">
              <FontAwesome5 name="mouse" size={18} color="#3B82F6" />
            </StatIcon>
            <StatValue>{stats.totalClicks.toLocaleString()}</StatValue>
            <StatLabel>Total Clicks</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon bgColor="#FEF3C7">
              <FontAwesome5 name="chart-pie" size={18} color="#D97706" />
            </StatIcon>
            <StatValue>{stats.averageCTR}%</StatValue>
            <StatLabel>Avg CTR</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon bgColor="#FCE7F3">
              <FontAwesome5 name="broadcast-tower" size={18} color="#EC4899" />
            </StatIcon>
            <StatValue>{stats.activeBanners}</StatValue>
            <StatLabel>Active</StatLabel>
          </StatCard>
        </StatsGrid>

        <SectionTitle>Active & Scheduled Banners</SectionTitle>

        {banners.map((banner) => {
          const config = statusConfig[banner.status];
          return (
            <BannerCard key={banner.id}>
              <BannerHeader>
                <BannerTitle>{banner.title}</BannerTitle>
                <StatusBadge style={{ backgroundColor: config.bg }}>
                  <StatusText style={{ color: config.color }}>{config.label}</StatusText>
                </StatusBadge>
              </BannerHeader>

              <BannerDescription>{banner.description}</BannerDescription>

              <ImagePreview style={{ backgroundColor: '#E5E7EB' }}>
                <ImageIcon>
                  <FontAwesome5 name="image" size={24} color="#9CA3AF" />
                </ImageIcon>
                <ImageText>{banner.imageUrl}</ImageText>
              </ImagePreview>

              <DateRange>
                <DateLabel>
                  <FontAwesome5 name="calendar" size={12} color="#6B7280" />
                  <DateText> {banner.startDate} to {banner.endDate}</DateText>
                </DateLabel>
              </DateRange>

              {banner.status === 'active' && (
                <PerformanceRow>
                  <PerformanceItem>
                    <PerformanceLabel>Impressions</PerformanceLabel>
                    <PerformanceValue>{banner.impressions.toLocaleString()}</PerformanceValue>
                  </PerformanceItem>
                  <PerformanceItem>
                    <PerformanceLabel>Clicks</PerformanceLabel>
                    <PerformanceValue>{banner.clicks.toLocaleString()}</PerformanceValue>
                  </PerformanceItem>
                  <PerformanceItem>
                    <PerformanceLabel>CTR</PerformanceLabel>
                    <PerformanceValue>{ctr(banner.impressions, banner.clicks)}%</PerformanceValue>
                  </PerformanceItem>
                </PerformanceRow>
              )}

              <Actions>
                <ActionBtn onPress={() => handleEditBanner(banner)}>
                  <FontAwesome5 name="edit" size={14} color="#0F8A3C" />
                  <ActionText style={{ color: '#0F8A3C' }}>Edit</ActionText>
                </ActionBtn>
                <ActionBtn onPress={() => handleDeleteBanner(banner)}>
                  <FontAwesome5 name="trash" size={14} color="#EF4444" />
                  <ActionText style={{ color: '#EF4444' }}>Delete</ActionText>
                </ActionBtn>
                {banner.status !== 'active' && (
                  <ActionBtn onPress={() => handleActivateBanner(banner)}>
                    <FontAwesome5 name="play" size={14} color="#3B82F6" />
                    <ActionText style={{ color: '#3B82F6' }}>Activate</ActionText>
                  </ActionBtn>
                )}
              </Actions>
            </BannerCard>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminBannersScreen;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #E5E7EB;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;
`;

const AddButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #0F8A3C;
  align-items: center;
  justify-content: center;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0px;
  margin: -3px;
`;

const StatCard = styled.View`
  width: 48%;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 10px;
  margin: 3px;
  border-width: 1px;
  border-color: #E5E7EB;
  align-items: center;
  shadow-color: rgba(0, 0, 0, 0.04);
  shadow-offset: 0px 1px;
  shadow-opacity: 1;
  shadow-radius: 2;
  elevation: 1;
`;

const StatIcon = styled.View<{ bgColor: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const StatValue = styled.Text`
  font-size: 16px;
  font-weight: 900;
  color: #111827;
  margin-bottom: 2px;
`;

const StatLabel = styled.Text`
  font-size: 10px;
  color: #9CA3AF;
  text-align: center;
  font-weight: 700;
`;

const SectionTitle = styled.Text`
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  padding: 8px 12px;
`;

const BannerCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 10px;
  margin: 0 8px 6px;
  border-width: 1px;
  border-color: #E5E7EB;
  shadow-color: rgba(0, 0, 0, 0.04);
  shadow-offset: 0px 1px;
  shadow-opacity: 1;
  shadow-radius: 2;
  elevation: 1;
`;

const BannerHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const BannerTitle = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  flex: 1;
  margin-right: 8px;
`;

const StatusBadge = styled.View`
  padding: 4px 8px;
  border-radius: 6px;
`;

const StatusText = styled.Text`
  font-size: 9px;
  font-weight: 700;
`;

const BannerDescription = styled.Text`
  font-size: 11px;
  color: #6B7280;
  margin-bottom: 8px;
`;

const ImagePreview = styled.View`
  border-radius: 8px;
  padding: 30px;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: #E5E7EB;
  border-style: dashed;
`;

const ImageIcon = styled.View`
  margin-bottom: 6px;
`;

const ImageText = styled.Text`
  font-size: 10px;
  color: #9CA3AF;
`;

const DateRange = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const DateLabel = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #F9FAFB;
  border-radius: 6px;
  padding: 6px 10px;
`;

const DateText = styled.Text`
  font-size: 11px;
  color: #6B7280;
`;

const PerformanceRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: #F9FAFB;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
`;

const PerformanceItem = styled.View`
  align-items: center;
`;

const PerformanceLabel = styled.Text`
  font-size: 10px;
  color: #9CA3AF;
  margin-bottom: 2px;
`;

const PerformanceValue = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #111827;
`;

const Actions = styled.View`
  flex-direction: row;
  gap: 4px;
`;

const ActionBtn = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #F3F4F6;
  border-radius: 6px;
  padding: 6px;
`;

const ActionText = styled.Text`
  font-size: 10px;
  font-weight: 700;
  margin-left: 4px;
`;
