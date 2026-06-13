import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

const INDUSTRIES = ['Food & Bev', 'Cosmetics', 'E-Commerce', 'Electronics', 'Pharma', 'Fashion'];

const RECS = [
  {
    id: 1, name: 'Coffee Stand Up Pouches', icon: 'coffee',
    category: 'Food & Bev', tags: ['Eco-Friendly', 'Premium Look', 'Resealable'],
    tagColors: ['#0F8A3C', '#7C3AED', '#D97706'],
    benefit: 'High-barrier Kraft film keeps coffee fresh for 18 months. Ideal for specialty roasters.',
    price: '$0.68/unit', moq: '500 units', bg: '#FEF3C7', iconColor: '#D97706',
  },
  {
    id: 2, name: 'Cosmetic Rigid Boxes', icon: 'star',
    category: 'Cosmetics', tags: ['Luxury', 'Premium Look', 'Soft Touch'],
    tagColors: ['#DB2777', '#7C3AED', '#6B7280'],
    benefit: 'Magnetic closure rigid boxes with soft-touch laminate for skincare and fragrance brands.',
    price: '$2.10/unit', moq: '100 units', bg: '#FDF2F8', iconColor: '#DB2777',
  },
  {
    id: 3, name: 'Kraft Mailer Boxes', icon: 'box-open',
    category: 'E-Commerce', tags: ['Eco-Friendly', 'Cost Effective', 'Lightweight'],
    tagColors: ['#0F8A3C', '#D97706', '#0F8A3C'],
    benefit: 'Corrugated mailers that need no tape. Perfect for e-commerce fulfillment.',
    price: '$1.45/unit', moq: '100 units', bg: '#DCFCE7', iconColor: '#0F8A3C',
  },
  {
    id: 4, name: 'Biodegradable Poly Bags', icon: 'leaf',
    category: 'Fashion', tags: ['Eco-Friendly', 'Lightweight', 'Compostable'],
    tagColors: ['#0F8A3C', '#0F8A3C', '#22C55E'],
    benefit: 'PBAT compostable mailers break down in 180 days. Perfect for apparel shipping.',
    price: '$0.42/unit', moq: '200 units', bg: '#F0FDF4', iconColor: '#0F8A3C',
  },
  {
    id: 5, name: 'Pharma Blister Packs', icon: 'pills',
    category: 'Pharma', tags: ['Tamper-Evident', 'Regulatory', 'Sterile'],
    tagColors: ['#EF4444', '#0F8A3C', '#6B7280'],
    benefit: 'FDA-compliant blister packaging with child-resistant and tamper-evident features.',
    price: '$0.95/unit', moq: '1000 units', bg: '#DCFCE7', iconColor: '#0F8A3C',
  },
  {
    id: 6, name: 'Anti-Static Foam Inserts', icon: 'microchip',
    category: 'Electronics', tags: ['Anti-Static', 'Protective', 'Custom Cut'],
    tagColors: ['#D97706', '#7C3AED', '#0F8A3C'],
    benefit: 'Custom-cut EPE foam inserts protect electronics from static & impact during transit.',
    price: '$3.20/unit', moq: '50 units', bg: '#F5F3FF', iconColor: '#7C3AED',
  },
];

const INSIGHT_TAGS = [
  { label: 'Eco-Friendly', icon: 'leaf', color: '#0F8A3C', bg: '#DCFCE7' },
  { label: 'Cost Effective', icon: 'dollar-sign', color: '#D97706', bg: '#FEF3C7' },
  { label: 'Lightweight', icon: 'feather', color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Premium Look', icon: 'gem', color: '#DB2777', bg: '#FDF2F8' },
  { label: 'High Shelf Appeal', icon: 'star', color: '#0284C7', bg: '#E0F2FE' },
];

const AIRecommendationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [industry, setIndustry] = useState('Food & Bev');
  const [loading, setLoading] = useState(false);

  const filtered = RECS.filter((r) => r.category === industry);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <Container>
      <NavBar>
        <NavBtn onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#111827" />
        </NavBtn>
        <NavTitle>AI Recommendations</NavTitle>
        <RefreshBtn onPress={refresh}>
          <FontAwesome5 name="sync-alt" size={14} color="#7C3AED" />
        </RefreshBtn>
      </NavBar>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* AI Engine Banner */}
        <AIBanner>
          <AIBannerLeft>
            <AIIconCircle>
              <FontAwesome5 name="robot" size={22} color="#FFFFFF" />
            </AIIconCircle>
            <AIBannerContent>
              <AIBannerTitle>PacMonk AI Engine</AIBannerTitle>
              <AIBannerDesc>Personalized packaging based on your industry & order history</AIBannerDesc>
            </AIBannerContent>
          </AIBannerLeft>
          <AIStatusDot active={!loading} />
        </AIBanner>

        {/* Industry Chips */}
        <SectionBlock>
          <SectionTitle>Your Industry</SectionTitle>
        </SectionBlock>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          {INDUSTRIES.map((ind) => (
            <IndustryChip key={ind} active={industry === ind} onPress={() => setIndustry(ind)} activeOpacity={0.8}>
              <IndustryChipText active={industry === ind}>{ind}</IndustryChipText>
            </IndustryChip>
          ))}
        </ScrollView>

        {/* Insight Tags */}
        <SectionBlock>
          <SectionTitle>Smart Insights</SectionTitle>
        </SectionBlock>
        <InsightTagsWrap>
          {INSIGHT_TAGS.map((t) => (
            <InsightTag key={t.label} bgColor={t.bg}>
              <FontAwesome5 name={t.icon as any} size={11} color={t.color} style={{ marginRight: 5 }} />
              <InsightTagText color={t.color}>{t.label}</InsightTagText>
            </InsightTag>
          ))}
        </InsightTagsWrap>

        {/* Cards */}
        <SectionBlock>
          <SectionTitle>Top Picks for You</SectionTitle>
          <SectionCount>{RECS.filter((r) => r.category === industry).length} products</SectionCount>
        </SectionBlock>

        {loading ? (
          <LoadingWrap>
            <FontAwesome5 name="robot" size={48} color="#7C3AED" style={{ opacity: 0.4, marginBottom: 14 }} />
            <LoadingText>AI analyzing your preferences...</LoadingText>
          </LoadingWrap>
        ) : RECS.filter((r) => r.category === industry).length === 0 ? (
          <LoadingWrap>
            <FontAwesome5 name="search-minus" size={48} color="#D1D5DB" style={{ marginBottom: 14 }} />
            <LoadingText>No recommendations for this industry yet.</LoadingText>
          </LoadingWrap>
        ) : (
          RECS.filter((r) => r.category === industry).map((rec) => (
            <RecCard key={rec.id} style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 }}>
              <RecTop bgColor={rec.bg}>
                <RecIconCircle>
                  <FontAwesome5 name={rec.icon as any} size={32} color={rec.iconColor} />
                </RecIconCircle>
                <AIBadge>
                  <FontAwesome5 name="robot" size={9} color="#7C3AED" style={{ marginRight: 3 }} />
                  <AIBadgeText>AI Pick</AIBadgeText>
                </AIBadge>
              </RecTop>
              <RecBody>
                <RecTitle>{rec.name}</RecTitle>
                <RecBenefit>{rec.benefit}</RecBenefit>
                <RecTagsRow>
                  {rec.tags.map((tag, i) => (
                    <RecTag key={tag} bgColor={rec.tagColors[i] + '18'}>
                      <RecTagText color={rec.tagColors[i]}>{tag}</RecTagText>
                    </RecTag>
                  ))}
                </RecTagsRow>
                <RecFooter>
                  <RecPriceCol>
                    <RecPrice>{rec.price}</RecPrice>
                    <RecMOQ>MOQ: {rec.moq}</RecMOQ>
                  </RecPriceCol>
                  <GetQuoteBtn onPress={() => navigation.navigate('RequestQuote', { productId: rec.category === 'Food & Bev' ? 'stand-up-pouch' : rec.category === 'E-Commerce' ? 'mailer-box' : rec.category === 'Cosmetics' ? 'mailer-box' : 'stand-up-pouch' })} activeOpacity={0.85}>
                    <GetQuoteBtnText>Get Quote</GetQuoteBtnText>
                    <FontAwesome5 name="arrow-right" size={11} color="#FFF" style={{ marginLeft: 5 }} />
                  </GetQuoteBtn>
                </RecFooter>
              </RecBody>
            </RecCard>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default AIRecommendationsScreen;

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
const NavTitle = styled.Text`font-size: 16px; font-weight: 700; color: #111827;`;
const RefreshBtn = styled.TouchableOpacity`
  width: 38px; height: 38px; border-radius: 12px;
  background-color: #F5F3FF; align-items: center; justify-content: center;
`;

const AIBanner = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  background-color: #052E16; margin: 16px; border-radius: 20px; padding: 18px 16px;
  overflow: hidden;
`;
const AIBannerLeft = styled.View`flex-direction: row; align-items: center; flex: 1;`;
const AIIconCircle = styled.View`
  width: 48px; height: 48px; border-radius: 15px;
  background-color: #7C3AED; align-items: center; justify-content: center; margin-right: 14px;
`;
const AIBannerContent = styled.View`flex: 1;`;
const AIBannerTitle = styled.Text`font-size: 15px; font-weight: 700; color: #FFFFFF; margin-bottom: 3px;`;
const AIBannerDesc = styled.Text`font-size: 11px; color: #86EFAC; line-height: 15px;`;
const AIStatusDot = styled.View<{ active: boolean }>`
  width: 10px; height: 10px; border-radius: 5px;
  background-color: ${({ active }) => active ? '#22C55E' : '#F59E0B'};
`;

const SectionBlock = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between; padding: 0 16px 10px;
`;
const SectionTitle = styled.Text`font-size: 16px; font-weight: 800; color: #111827;`;
const SectionCount = styled.Text`font-size: 12px; color: #9CA3AF;`;

const IndustryChip = styled.TouchableOpacity<{ active: boolean }>`
  padding: 9px 16px; border-radius: 20px; margin-right: 8px;
  border-width: 1.5px;
  border-color: ${({ active }) => active ? '#0F8A3C' : '#E5E7EB'};
  background-color: ${({ active }) => active ? '#0F8A3C' : '#FFFFFF'};
`;
const IndustryChipText = styled.Text<{ active: boolean }>`
  font-size: 13px; font-weight: 600;
  color: ${({ active }) => active ? '#FFFFFF' : '#6B7280'};
`;

const InsightTagsWrap = styled.View`flex-direction: row; flex-wrap: wrap; padding-horizontal: 16px; margin-bottom: 16px;`;
const InsightTag = styled.View<{ bgColor: string }>`
  flex-direction: row; align-items: center;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 20px; padding: 7px 13px; margin-right: 8px; margin-bottom: 8px;
`;
const InsightTagText = styled.Text<{ color: string }>`
  font-size: 12px; font-weight: 600; color: ${({ color }) => color};
`;

const LoadingWrap = styled.View`padding: 60px; align-items: center;`;
const LoadingText = styled.Text`font-size: 14px; color: #9CA3AF;`;

const RecCard = styled.View`
  background-color: #FFFFFF; border-radius: 20px;
  border-width: 1px; border-color: #F3F4F6; overflow: hidden; margin: 0 16px 16px;
  shadow-color: #000; shadow-offset: 0px 4px; shadow-opacity: 0.07; shadow-radius: 12px; elevation: 4;
`;
const RecTop = styled.View<{ bgColor: string }>`
  height: 130px; background-color: ${({ bgColor }) => bgColor};
  align-items: center; justify-content: center; position: relative;
`;
const RecIconCircle = styled.View`
  width: 80px; height: 80px; border-radius: 40px;
  background-color: #FFFFFF; align-items: center; justify-content: center;
  shadow-color: #000; shadow-offset: 0px 4px; shadow-opacity: 0.1; shadow-radius: 12px; elevation: 5;
`;
const AIBadge = styled.View`
  position: absolute; top: 10px; right: 10px;
  flex-direction: row; align-items: center;
  background-color: #F5F3FF; border-radius: 20px; padding: 4px 9px;
  border-width: 1px; border-color: #DDD6FE;
`;
const AIBadgeText = styled.Text`font-size: 9px; font-weight: 700; color: #7C3AED;`;

const RecBody = styled.View`padding: 16px;`;
const RecTitle = styled.Text`font-size: 16px; font-weight: 800; color: #111827; margin-bottom: 6px;`;
const RecBenefit = styled.Text`font-size: 13px; color: #6B7280; line-height: 19px; margin-bottom: 12px;`;
const RecTagsRow = styled.View`flex-direction: row; flex-wrap: wrap; margin-bottom: 14px;`;
const RecTag = styled.View<{ bgColor: string }>`
  background-color: ${({ bgColor }) => bgColor}; border-radius: 20px;
  padding: 4px 10px; margin-right: 6px; margin-bottom: 5px;
`;
const RecTagText = styled.Text<{ color: string }>`
  font-size: 10px; font-weight: 700; color: ${({ color }) => color};
`;
const RecFooter = styled.View`flex-direction: row; align-items: center; justify-content: space-between;`;
const RecPriceCol = styled.View``;
const RecPrice = styled.Text`font-size: 17px; font-weight: 800; color: #111827;`;
const RecMOQ = styled.Text`font-size: 10px; color: #9CA3AF; margin-top: 2px;`;
const GetQuoteBtn = styled.TouchableOpacity`
  flex-direction: row; align-items: center;
  background-color: #0F8A3C; padding: 10px 18px; border-radius: 12px;
`;
const GetQuoteBtnText = styled.Text`font-size: 13px; font-weight: 700; color: #FFF;`;
