import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const AdminArtworkScreen: React.FC<Props> = ({ navigation }) => {
  const [artworks, setArtworks] = useState([
    {
      id: '1',
      customerName: 'Rahul Sharma',
      orderId: 'ORD-1001',
      fileName: 'logo-design-v2.ai',
      uploadedAt: '2024-01-20',
      status: 'pending' as const,
    },
    {
      id: '2',
      customerName: 'Priya Patel',
      orderId: 'ORD-1002',
      fileName: 'package-artwork.pdf',
      uploadedAt: '2024-01-19',
      status: 'approved' as const,
    },
    {
      id: '3',
      customerName: 'Amit Kumar',
      orderId: 'ORD-1003',
      fileName: 'brand-logo.eps',
      uploadedAt: '2024-01-18',
      status: 'rejected' as const,
    },
  ]);

  const statusConfig = {
    pending: { label: 'Pending Review', color: '#F59E0B', bg: '#FEF3C7' },
    approved: { label: 'Approved', color: '#10B981', bg: '#D1FAE5' },
    rejected: { label: 'Rejected', color: '#EF4444', bg: '#FEE2E2' },
  };

  const updateArtworkStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setArtworks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    Alert.alert('Success', `Artwork ${newStatus}`);
  };

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Artwork Review</HeaderTitle>
        <PlaceholderBtn />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {artworks.map((artwork) => {
          const config = statusConfig[artwork.status];
          return (
            <ArtworkCard key={artwork.id}>
              <CardHeader>
                <FileIconWrap>
                  <FontAwesome5 name="file-image" size={24} color="#3B82F6" />
                </FileIconWrap>
                <FileInfo>
                  <FileName>{artwork.fileName}</FileName>
                  <FileDetails>Order: {artwork.orderId}</FileDetails>
                  <FileDetails>Customer: {artwork.customerName}</FileDetails>
                </FileInfo>
              </CardHeader>

              <StatusBadge style={{ backgroundColor: config.bg }}>
                <StatusText style={{ color: config.color }}>{config.label}</StatusText>
              </StatusBadge>

              <UploadDate>Uploaded: {artwork.uploadedAt}</UploadDate>

              {artwork.status === 'pending' && (
                <ActionRow>
                  <ApproveBtn
                    onPress={() => updateArtworkStatus(artwork.id, 'approved')}
                  >
                    <FontAwesome5 name="check-circle" size={16} color="#ffffff" />
                    <ActionText>Approve</ActionText>
                  </ApproveBtn>
                  <RejectBtn
                    onPress={() => updateArtworkStatus(artwork.id, 'rejected')}
                  >
                    <FontAwesome5 name="times-circle" size={16} color="#ffffff" />
                    <ActionText>Reject</ActionText>
                  </RejectBtn>
                </ActionRow>
              )}

              {artwork.status !== 'pending' && (
                <ViewBtn onPress={() => Alert.alert('View', 'Download artwork file')}>
                  <FontAwesome5 name="download" size={14} color="#3B82F6" />
                  <ViewText>Download File</ViewText>
                </ViewBtn>
              )}
            </ArtworkCard>
          );
        })}
      </ScrollView>
    </Wrapper>
  );
};

export default AdminArtworkScreen;

const Wrapper = styled.View`
  flex: 1;
  background-color: #f9fafb;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

const BackBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f9fafb;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  flex: 1;
  text-align: center;
`;

const PlaceholderBtn = styled.View`
  width: 40px;
`;

const ArtworkCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const CardHeader = styled.View`
  flex-direction: row;
  margin-bottom: 12px;
`;

const FileIconWrap = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: #DBEAFE;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const FileInfo = styled.View`
  flex: 1;
  justify-content: center;
`;

const FileName = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

const FileDetails = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
`;

const StatusBadge = styled.View`
  padding: 6px 12px;
  border-radius: 12px;
  align-self: flex-start;
  margin-bottom: 8px;
`;

const StatusText = styled.Text`
  font-size: 12px;
  font-weight: 600;
`;

const UploadDate = styled.Text`
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 12px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  margin-top: 8px;
`;

const ApproveBtn = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
  background-color: #10B981;
  margin-right: 8px;
`;

const RejectBtn = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
  background-color: #EF4444;
`;

const ActionText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-left: 6px;
`;

const ViewBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
  background-color: #f9fafb;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const ViewText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #3B82F6;
  margin-left: 6px;
`;
