import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { IMAGES } from '../../constants/images';

const AdminBannersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [banners, setBanners] = useState([
    {
      id: '1',
      title: 'New Year Sale',
      subtitle: 'Up to 30% off on all products',
      image: IMAGES.offerBanner,
      position: 1,
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      ctaText: 'Shop Now',
      ctaLink: '/products',
    },
    {
      id: '2',
      title: 'Eco-Friendly Pouches',
      subtitle: 'Sustainable packaging solutions',
      image: IMAGES.bannerDesign,
      position: 2,
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      ctaText: 'Learn More',
      ctaLink: '/products/kraft',
    },
    {
      id: '3',
      title: 'Custom Printing',
      subtitle: 'Get your brand printed',
      image: IMAGES.bannerPrint,
      position: 3,
      isActive: true,
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      ctaText: 'Start Design',
      ctaLink: '/design-studio',
    },
    {
      id: '4',
      title: 'Premium Gold Standy Pouches',
      subtitle: 'Luxury packaging for premium products',
      image: IMAGES.goldStandyZipperPouch,
      position: 4,
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      ctaText: 'View Products',
      ctaLink: '/products/pouches',
    },
  ]);

  const handleToggleBanner = (bannerId: string) => {
    setBanners(banners.map(b => 
      b.id === bannerId ? { ...b, isActive: !b.isActive } : b
    ));
  };

  const handleReorder = (bannerId: string, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === bannerId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === banners.length - 1)
    ) {
      return;
    }

    const newBanners = [...banners];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newBanners[currentIndex], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[currentIndex]];
    
    // Update positions
    newBanners.forEach((banner, index) => {
      banner.position = index + 1;
    });
    
    setBanners(newBanners);
  };

  const handleDelete = (bannerId: string) => {
    Alert.alert(
      'Delete Banner',
      'Are you sure you want to delete this banner?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete',
          style: 'destructive',
          onPress: () => setBanners(banners.filter(b => b.id !== bannerId))
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Banner Management</HeaderTitle>
        <AddButton onPress={() => Alert.alert('Add Banner', 'Upload new banner image')}>
          <FontAwesome5 name="plus" size={18} color="#FFF" />
        </AddButton>
      </Header>

      <InfoBanner>
        <FontAwesome5 name="info-circle" size={16} color="#3B82F6" style={{ marginRight: 10 }} />
        <InfoText>Drag to reorder banners. Changes are reflected immediately on homepage.</InfoText>
      </InfoBanner>

      <ScrollView showsVerticalScrollIndicator={false}>
        <BannersList>
          {banners.map((banner, index) => (
            <BannerCard key={banner.id} active={banner.isActive}>
              <BannerPosition>
                <PositionBadge>
                  <PositionText>#{banner.position}</PositionText>
                </PositionBadge>
              </BannerPosition>

              <BannerImageContainer>
                <BannerImage source={banner.image} resizeMode="cover" />
                {!banner.isActive && (
                  <InactiveOverlay>
                    <InactiveText>INACTIVE</InactiveText>
                  </InactiveOverlay>
                )}
              </BannerImageContainer>

              <BannerInfo>
                <BannerTitle>{banner.title}</BannerTitle>
                <BannerSubtitle>{banner.subtitle}</BannerSubtitle>

                <BannerMeta>
                  <MetaRow>
                    <MetaLabel>CTA:</MetaLabel>
                    <MetaValue>{banner.ctaText}</MetaValue>
                  </MetaRow>
                  <MetaRow>
                    <MetaLabel>Link:</MetaLabel>
                    <MetaValue>{banner.ctaLink}</MetaValue>
                  </MetaRow>
                  <MetaRow>
                    <MetaLabel>Duration:</MetaLabel>
                    <MetaValue>
                      {new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}
                    </MetaValue>
                  </MetaRow>
                </BannerMeta>
              </BannerInfo>

              <BannerActions>
                <ActionRow>
                  <ToggleButton onPress={() => handleToggleBanner(banner.id)}>
                    <FontAwesome5 
                      name={banner.isActive ? 'toggle-on' : 'toggle-off'} 
                      size={24} 
                      color={banner.isActive ? '#0F8A3C' : '#9CA3AF'} 
                    />
                    <ToggleText>{banner.isActive ? 'Active' : 'Inactive'}</ToggleText>
                  </ToggleButton>

                  <ReorderButtons>
                    <ReorderButton 
                      disabled={index === 0}
                      onPress={() => handleReorder(banner.id, 'up')}
                    >
                      <FontAwesome5 name="arrow-up" size={14} color={index === 0 ? '#D1D5DB' : '#6B7280'} />
                    </ReorderButton>
                    <ReorderButton 
                      disabled={index === banners.length - 1}
                      onPress={() => handleReorder(banner.id, 'down')}
                    >
                      <FontAwesome5 name="arrow-down" size={14} color={index === banners.length - 1 ? '#D1D5DB' : '#6B7280'} />
                    </ReorderButton>
                  </ReorderButtons>
                </ActionRow>

                <ActionButtons>
                  <ActionButton onPress={() => Alert.alert('Edit', `Edit banner: ${banner.title}`)}>
                    <FontAwesome5 name="edit" size={14} color="#0F8A3C" />
                    <ActionButtonText>Edit</ActionButtonText>
                  </ActionButton>
                  <ActionButton onPress={() => Alert.alert('Preview', 'Show banner preview')}>
                    <FontAwesome5 name="eye" size={14} color="#3B82F6" />
                    <ActionButtonText>Preview</ActionButtonText>
                  </ActionButton>
                  <ActionButton onPress={() => handleDelete(banner.id)}>
                    <FontAwesome5 name="trash" size={14} color="#EF4444" />
                    <ActionButtonText>Delete</ActionButtonText>
                  </ActionButton>
                </ActionButtons>
              </BannerActions>
            </BannerCard>
          ))}
        </BannersList>

        <AddBannerCard onPress={() => Alert.alert('Add Banner', 'Upload new banner')}>
          <FontAwesome5 name="plus-circle" size={32} color="#0F8A3C" />
          <AddBannerText>Add New Banner</AddBannerText>
          <AddBannerSubtext>Recommended size: 1200x400px</AddBannerSubtext>
        </AddBannerCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminBannersScreen;

const Header = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 16px 20px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const BackButton = styled.TouchableOpacity`width: 40px; height: 40px; align-items: center; justify-content: center;`;
const HeaderTitle = styled.Text`font-size: 18px; font-weight: 700; color: #1F2937;`;
const AddButton = styled.TouchableOpacity`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: #0F8A3C; align-items: center; justify-content: center;
`;

const InfoBanner = styled.View`
  flex-direction: row; align-items: center; background-color: #EFF6FF;
  padding: 12px 16px; margin: 16px; border-radius: 12px;
  border-width: 1px; border-color: #DBEAFE;
`;
const InfoText = styled.Text`flex: 1; font-size: 12px; color: #1E40AF; line-height: 18px;`;

const BannersList = styled.View`padding: 0 16px;`;
const BannerCard = styled.View<{ active: boolean }>`
  background-color: #FFFFFF; border-radius: 16px; padding: 16px;
  margin-bottom: 16px; border-width: 2px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
`;

const BannerPosition = styled.View`
  position: absolute; top: 16px; right: 16px; z-index: 10;
`;
const PositionBadge = styled.View`
  background-color: #0F8A3C; padding: 4px 12px; border-radius: 8px;
`;
const PositionText = styled.Text`font-size: 12px; font-weight: 800; color: #FFF;`;

const BannerImageContainer = styled.View`
  width: 100%; height: 140px; border-radius: 12px; overflow: hidden;
  margin-bottom: 12px; position: relative;
`;
const BannerImage = styled.Image`width: 100%; height: 100%;`;
const InactiveOverlay = styled.View`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); align-items: center; justify-content: center;
`;
const InactiveText = styled.Text`
  font-size: 18px; font-weight: 800; color: #FFF; letter-spacing: 2px;
`;

const BannerInfo = styled.View`margin-bottom: 16px;`;
const BannerTitle = styled.Text`
  font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 4px;
`;
const BannerSubtitle = styled.Text`
  font-size: 13px; color: #6B7280; margin-bottom: 12px;
`;

const BannerMeta = styled.View``;
const MetaRow = styled.View`
  flex-direction: row; margin-bottom: 6px;
`;
const MetaLabel = styled.Text`
  font-size: 11px; color: #9CA3AF; width: 70px;
`;
const MetaValue = styled.Text`
  flex: 1; font-size: 11px; font-weight: 600; color: #111827;
`;

const BannerActions = styled.View`
  padding-top: 16px; border-top-width: 1px; border-top-color: #F3F4F6;
`;

const ActionRow = styled.View`
  flex-direction: row; justify-content: space-between; align-items: center;
  margin-bottom: 12px;
`;

const ToggleButton = styled.TouchableOpacity`
  flex-direction: row; align-items: center;
`;
const ToggleText = styled.Text`
  font-size: 13px; font-weight: 600; color: #111827; margin-left: 8px;
`;

const ReorderButtons = styled.View`flex-direction: row; gap: 8px;`;
const ReorderButton = styled.TouchableOpacity`
  width: 36px; height: 36px; border-radius: 10px;
  background-color: #F3F4F6; align-items: center; justify-content: center;
`;

const ActionButtons = styled.View`flex-direction: row; gap: 8px;`;
const ActionButton = styled.TouchableOpacity`
  flex: 1; flex-direction: row; align-items: center; justify-content: center;
  padding: 10px; border-radius: 8px; background-color: #F3F4F6; gap: 6px;
`;
const ActionButtonText = styled.Text`
  font-size: 12px; font-weight: 600; color: #111827;
`;

const AddBannerCard = styled.TouchableOpacity`
  background-color: #FFFFFF; border-radius: 16px; padding: 40px;
  margin: 0 16px 24px; border-width: 2px; border-color: #E5E7EB;
  border-style: dashed; align-items: center;
`;
const AddBannerText = styled.Text`
  font-size: 16px; font-weight: 700; color: #0F8A3C; margin-top: 12px;
`;
const AddBannerSubtext = styled.Text`
  font-size: 12px; color: #9CA3AF; margin-top: 4px;
`;
