import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation: any;
  route: any;
}

const ProductionTimelineScreen: React.FC<Props> = ({ navigation, route }) => {
  const orderId = route.params?.orderId || 'ORD-1001';

  const timeline = [
    {
      day: 1,
      title: 'Artwork Check',
      subtitle: 'Pre-press design review',
      status: 'completed' as const,
      icon: 'file-image',
      color: '#10B981',
      details: 'Your artwork has been reviewed and approved by our design team.',
      completedDate: 'Jan 22, 2024',
    },
    {
      day: 3,
      title: 'Cylinder Making',
      subtitle: 'Printing plate preparation',
      status: 'completed' as const,
      icon: 'cog',
      color: '#10B981',
      details: 'Custom printing cylinder created for your design.',
      completedDate: 'Jan 24, 2024',
    },
    {
      day: 7,
      title: 'Printing',
      subtitle: 'High-quality printing in progress',
      status: 'in_progress' as const,
      icon: 'print',
      color: '#3B82F6',
      details: 'Your packaging is currently being printed with premium inks.',
      progress: 65,
    },
    {
      day: 12,
      title: 'Packing',
      subtitle: 'Quality check & packaging',
      status: 'pending' as const,
      icon: 'box',
      color: '#9CA3AF',
      details: 'Final quality inspection and secure packaging.',
    },
    {
      day: 15,
      title: 'Dispatch',
      subtitle: 'Ready for shipment',
      status: 'pending' as const,
      icon: 'shipping-fast',
      color: '#9CA3AF',
      details: 'Your order will be dispatched via courier.',
    },
  ];

  const currentDay = 7;
  const estimatedDelivery = 'Feb 5, 2024';

  return (
    <Wrapper>
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111827" />
        </BackBtn>
        <HeaderTitle>Production Timeline</HeaderTitle>
        <PlaceholderBtn />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <OrderInfoCard>
          <OrderInfoRow>
            <OrderLabel>Order ID:</OrderLabel>
            <OrderValue>{orderId}</OrderValue>
          </OrderInfoRow>
          <OrderInfoRow>
            <OrderLabel>Current Day:</OrderLabel>
            <OrderValue>Day {currentDay} of 15</OrderValue>
          </OrderInfoRow>
          <OrderInfoRow>
            <OrderLabel>Est. Delivery:</OrderLabel>
            <OrderValue style={{ color: '#0f8a3c', fontWeight: '700' }}>
              {estimatedDelivery}
            </OrderValue>
          </OrderInfoRow>
        </OrderInfoCard>

        <ProgressOverview>
          <ProgressTitle>Overall Progress</ProgressTitle>
          <ProgressBarBg>
            <ProgressBarFill width={(currentDay / 15) * 100} />
          </ProgressBarBg>
          <ProgressPercentage>{Math.round((currentDay / 15) * 100)}% Complete</ProgressPercentage>
        </ProgressOverview>

        <TimelineSection>
          <TimelineTitle>Manufacturing Stages</TimelineTitle>
          {timeline.map((stage, index) => (
            <TimelineItem key={stage.day}>
              <TimelineLeftColumn>
                <DayBadge status={stage.status}>
                  <DayText status={stage.status}>Day {stage.day}</DayText>
                </DayBadge>
                {index < timeline.length - 1 && (
                  <TimelineConnector
                    completed={stage.status === 'completed'}
                  />
                )}
              </TimelineLeftColumn>

              <TimelineCard status={stage.status}>
                <TimelineCardHeader>
                  <TimelineIconWrap status={stage.status} color={stage.color}>
                    <FontAwesome5 name={stage.icon} size={20} color={stage.color} />
                  </TimelineIconWrap>
                  <TimelineCardInfo>
                    <TimelineCardTitle>{stage.title}</TimelineCardTitle>
                    <TimelineCardSubtitle>{stage.subtitle}</TimelineCardSubtitle>
                  </TimelineCardInfo>
                  <StatusIcon status={stage.status} color={stage.color}>
                    {stage.status === 'completed' && (
                      <FontAwesome5 name="check" size={14} color="#FFFFFF" />
                    )}
                    {stage.status === 'in_progress' && (
                      <FontAwesome5 name="spinner" size={14} color="#FFFFFF" />
                    )}
                    {stage.status === 'pending' && (
                      <FontAwesome5 name="clock" size={14} color="#9CA3AF" />
                    )}
                  </StatusIcon>
                </TimelineCardHeader>

                <TimelineCardDetails>{stage.details}</TimelineCardDetails>

                {stage.completedDate && (
                  <CompletedDate>
                    <FontAwesome5 name="calendar-check" size={11} color="#10B981" />
                    <CompletedDateText> Completed: {stage.completedDate}</CompletedDateText>
                  </CompletedDate>
                )}

                {stage.progress && (
                  <StageProgressSection>
                    <StageProgressBar>
                      <StageProgressFill width={stage.progress} />
                    </StageProgressBar>
                    <StageProgressText>{stage.progress}% Complete</StageProgressText>
                  </StageProgressSection>
                )}
              </TimelineCard>
            </TimelineItem>
          ))}
        </TimelineSection>

        <NotificationCard>
          <NotificationIcon>
            <FontAwesome5 name="bell" size={20} color="#3B82F6" />
          </NotificationIcon>
          <NotificationContent>
            <NotificationTitle>Stay Updated</NotificationTitle>
            <NotificationText>
              We'll send you notifications at each milestone. Enable push notifications for real-time updates.
            </NotificationText>
          </NotificationContent>
        </NotificationCard>
      </ScrollView>
    </Wrapper>
  );
};

export default ProductionTimelineScreen;

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

const OrderInfoCard = styled.View`
  background-color: #ffffff;
  margin: 16px;
  padding: 16px;
  border-radius: 16px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const OrderInfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const OrderLabel = styled.Text`
  font-size: 14px;
  color: #6b7280;
`;

const OrderValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const ProgressOverview = styled.View`
  background-color: #ffffff;
  margin: 0 16px 16px;
  padding: 16px;
  border-radius: 16px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const ProgressTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`;

const ProgressBarBg = styled.View`
  height: 12px;
  background-color: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressBarFill = styled.View<{ width: number }>`
  height: 100%;
  width: ${(props: { width: number }) => props.width}%;
  background-color: #0f8a3c;
  border-radius: 6px;
`;

const ProgressPercentage = styled.Text`
  font-size: 13px;
  color: #0f8a3c;
  font-weight: 700;
  text-align: center;
`;

const TimelineSection = styled.View`
  padding: 0 16px 16px;
`;

const TimelineTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
`;

const TimelineItem = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`;

const TimelineLeftColumn = styled.View`
  align-items: center;
  margin-right: 16px;
`;

const DayBadge = styled.View<{ status: string }>`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${(props: { status: string }) =>
    props.status === 'completed'
      ? '#D1FAE5'
      : props.status === 'in_progress'
      ? '#DBEAFE'
      : '#F3F4F6'};
  border-width: 3px;
  border-color: ${(props: { status: string }) =>
    props.status === 'completed'
      ? '#10B981'
      : props.status === 'in_progress'
      ? '#3B82F6'
      : '#E5E7EB'};
  align-items: center;
  justify-content: center;
`;

const DayText = styled.Text<{ status: string }>`
  font-size: 12px;
  font-weight: 800;
  color: ${(props: { status: string }) =>
    props.status === 'completed'
      ? '#10B981'
      : props.status === 'in_progress'
      ? '#3B82F6'
      : '#9CA3AF'};
  text-align: center;
`;

const TimelineConnector = styled.View<{ completed: boolean }>`
  width: 3px;
  height: 40px;
  background-color: ${(props: { completed: boolean }) => (props.completed ? '#10B981' : '#E5E7EB')};
  margin-top: 4px;
`;

const TimelineCard = styled.View<{ status: string }>`
  flex: 1;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  border-width: 2px;
  border-color: ${(props: { status: string }) =>
    props.status === 'completed'
      ? '#D1FAE5'
      : props.status === 'in_progress'
      ? '#DBEAFE'
      : '#E5E7EB'};
`;

const TimelineCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const TimelineIconWrap = styled.View<{ status: string; color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${(props: { status: string; color: string }) =>
    props.status === 'completed'
      ? '#D1FAE5'
      : props.status === 'in_progress'
      ? '#DBEAFE'
      : '#F3F4F6'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const TimelineCardInfo = styled.View`
  flex: 1;
`;

const TimelineCardTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2px;
`;

const TimelineCardSubtitle = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const StatusIcon = styled.View<{ status: string; color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${(props: { status: string; color: string }) =>
    props.status === 'pending' ? '#F3F4F6' : props.color};
  align-items: center;
  justify-content: center;
`;

const TimelineCardDetails = styled.Text`
  font-size: 13px;
  color: #6b7280;
  line-height: 20px;
  margin-bottom: 8px;
`;

const CompletedDate = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 6px 10px;
  background-color: #D1FAE5;
  border-radius: 8px;
  align-self: flex-start;
`;

const CompletedDateText = styled.Text`
  font-size: 11px;
  color: #10B981;
  font-weight: 600;
  margin-left: 4px;
`;

const StageProgressSection = styled.View`
  margin-top: 12px;
`;

const StageProgressBar = styled.View`
  height: 8px;
  background-color: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
`;

const StageProgressFill = styled.View<{ width: number }>`
  height: 100%;
  width: ${(props: { width: number }) => props.width}%;
  background-color: #3B82F6;
  border-radius: 4px;
`;

const StageProgressText = styled.Text`
  font-size: 12px;
  color: #3B82F6;
  font-weight: 600;
  text-align: right;
`;

const NotificationCard = styled.View`
  flex-direction: row;
  background-color: #EFF6FF;
  margin: 16px;
  padding: 16px;
  border-radius: 16px;
  border-width: 1px;
  border-color: #BFDBFE;
`;

const NotificationIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #DBEAFE;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const NotificationContent = styled.View`
  flex: 1;
`;

const NotificationTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #1E40AF;
  margin-bottom: 4px;
`;

const NotificationText = styled.Text`
  font-size: 12px;
  color: #3B82F6;
  line-height: 18px;
`;
