import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

const WalletScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const transactions = [
    { id: '1', type: 'credit', amount: 500, desc: 'Added funds', date: '2024-01-15', status: 'completed' },
    { id: '2', type: 'debit', amount: 250, desc: 'Order #102345', date: '2024-01-14', status: 'completed' },
    { id: '3', type: 'credit', amount: 1000, desc: 'Refund for Order #102340', date: '2024-01-12', status: 'completed' },
    { id: '4', type: 'debit', amount: 450, desc: 'Order #102338', date: '2024-01-10', status: 'completed' },
  ];

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleAddFunds = () => {
    const amountToAdd = selectedAmount || parseInt(amount);
    if (amountToAdd && amountToAdd > 0) {
      Alert.alert('Add Funds', `Add $${amountToAdd} to your wallet?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => {
          Alert.alert('Success', 'Funds added successfully!');
          setAmount('');
          setSelectedAmount(null);
        }},
      ]);
    } else {
      Alert.alert('Error', 'Please enter a valid amount');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </BackButton>
        <HeaderTitle>Wallet</HeaderTitle>
        <Placeholder />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <BalanceCard>
          <BalanceLabel>Available Balance</BalanceLabel>
          <BalanceAmount>$2,450.00</BalanceAmount>
          <BalanceRow>
            <BalanceItem>
              <BalanceItemLabel>Total Added</BalanceItemLabel>
              <BalanceItemValue>$5,200</BalanceItemValue>
            </BalanceItem>
            <BalanceDivider />
            <BalanceItem>
              <BalanceItemLabel>Total Spent</BalanceItemLabel>
              <BalanceItemValue>$2,750</BalanceItemValue>
            </BalanceItem>
          </BalanceRow>
        </BalanceCard>

        {/* Add Funds Section */}
        <SectionTitle>Add Funds</SectionTitle>
        <AddFundsCard>
          <QuickAmountLabel>Quick Select:</QuickAmountLabel>
          <QuickAmountsRow>
            {quickAmounts.map((amt) => (
              <QuickAmountButton
                key={amt}
                active={selectedAmount === amt}
                onPress={() => {
                  setSelectedAmount(amt);
                  setAmount('');
                }}
              >
                <QuickAmountText active={selectedAmount === amt}>${amt}</QuickAmountText>
              </QuickAmountButton>
            ))}
          </QuickAmountsRow>
          
          <OrText>Or enter custom amount:</OrText>
          
          <AmountInput
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text: string) => {
              setAmount(text);
              setSelectedAmount(null);
            }}
          />
          
          <AddFundsButton onPress={handleAddFunds}>
            <FontAwesome5 name="plus-circle" size={16} color="#FFF" style={{ marginRight: 8 }} />
            <AddFundsButtonText>Add Funds</AddFundsButtonText>
          </AddFundsButton>
        </AddFundsCard>

        {/* Transaction History */}
        <SectionTitle>Transaction History</SectionTitle>
        <TransactionsList>
          {transactions.map((txn) => (
            <TransactionCard key={txn.id}>
              <TransactionIcon bgColor={txn.type === 'credit' ? '#DCFCE7' : '#FEE2E2'}>
                <FontAwesome5 
                  name={txn.type === 'credit' ? 'arrow-down' : 'arrow-up'} 
                  size={14} 
                  color={txn.type === 'credit' ? '#0F8A3C' : '#EF4444'} 
                />
              </TransactionIcon>
              <TransactionInfo>
                <TransactionDesc>{txn.desc}</TransactionDesc>
                <TransactionDate>{txn.date}</TransactionDate>
              </TransactionInfo>
              <TransactionAmount type={txn.type}>
                {txn.type === 'credit' ? '+' : '-'}${txn.amount}
              </TransactionAmount>
            </TransactionCard>
          ))}
        </TransactionsList>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;

const Header = styled.View`
  flex-direction: row; align-items: center; justify-content: space-between;
  padding: 16px 20px; background-color: #FFFFFF;
  border-bottom-width: 1px; border-bottom-color: #E5E7EB;
`;
const BackButton = styled.TouchableOpacity`width: 40px; height: 40px; align-items: center; justify-content: center;`;
const HeaderTitle = styled.Text`font-size: 18px; font-weight: 700; color: #1F2937;`;
const Placeholder = styled.View`width: 40px;`;
const BalanceCard = styled.View`
  background-color: #0F8A3C; border-radius: 20px; padding: 24px;
  margin: 16px; shadow-color: #000; shadow-offset: 0px 4px;
  shadow-opacity: 0.15; shadow-radius: 12px; elevation: 5;
`;
const BalanceLabel = styled.Text`font-size: 13px; color: #DCFCE7; margin-bottom: 8px;`;
const BalanceAmount = styled.Text`font-size: 40px; font-weight: 800; color: #FFFFFF; margin-bottom: 20px;`;
const BalanceRow = styled.View`flex-direction: row; align-items: center;`;
const BalanceItem = styled.View`flex: 1;`;
const BalanceItemLabel = styled.Text`font-size: 11px; color: #DCFCE7; margin-bottom: 4px;`;
const BalanceItemValue = styled.Text`font-size: 16px; font-weight: 700; color: #FFFFFF;`;
const BalanceDivider = styled.View`width: 1px; height: 30px; background-color: rgba(255, 255, 255, 0.3); margin: 0 16px;`;
const SectionTitle = styled.Text`
  font-size: 16px; font-weight: 700; color: #111827;
  padding: 16px 16px 12px; text-transform: uppercase; letter-spacing: 0.5px;
`;
const AddFundsCard = styled.View`
  background-color: #FFFFFF; border-radius: 16px; padding: 20px;
  margin: 0 16px; border-width: 1px; border-color: #F3F4F6;
`;
const QuickAmountLabel = styled.Text`font-size: 13px; font-weight: 600; color: #6B7280; margin-bottom: 12px;`;
const QuickAmountsRow = styled.View`flex-direction: row; gap: 8px; margin-bottom: 16px;`;
const QuickAmountButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1; padding: 12px; border-radius: 10px; align-items: center;
  background-color: ${({ active }: { active: boolean }) => active ? '#0F8A3C' : '#F3F4F6'};
  border-width: 2px; border-color: ${({ active }: { active: boolean }) => active ? '#0F8A3C' : '#F3F4F6'};
`;
const QuickAmountText = styled.Text<{ active: boolean }>`
  font-size: 14px; font-weight: 700;
  color: ${({ active }: { active: boolean }) => active ? '#FFFFFF' : '#6B7280'};
`;
const OrText = styled.Text`
  font-size: 12px; color: #9CA3AF; text-align: center;
  margin: 8px 0 12px;
`;
const AmountInput = styled.TextInput`
  background-color: #F9FAFB; border-width: 1px; border-color: #E5E7EB;
  border-radius: 10px; padding: 14px; font-size: 15px;
  color: #111827; margin-bottom: 16px;
`;
const AddFundsButton = styled.TouchableOpacity`
  background-color: #0F8A3C; padding: 14px; border-radius: 12px;
  flex-direction: row; align-items: center; justify-content: center;
`;
const AddFundsButtonText = styled.Text`font-size: 15px; font-weight: 700; color: #FFFFFF;`;
const TransactionsList = styled.View`padding: 0 16px 24px;`;
const TransactionCard = styled.View`
  flex-direction: row; align-items: center; background-color: #FFFFFF;
  border-radius: 12px; padding: 14px; margin-bottom: 10px;
  border-width: 1px; border-color: #F3F4F6;
`;
const TransactionIcon = styled.View<{ bgColor: string }>`
  width: 40px; height: 40px; border-radius: 12px;
  background-color: ${({ bgColor }: { bgColor: string }) => bgColor};
  align-items: center; justify-content: center; margin-right: 12px;
`;
const TransactionInfo = styled.View`flex: 1;`;
const TransactionDesc = styled.Text`font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px;`;
const TransactionDate = styled.Text`font-size: 11px; color: #9CA3AF;`;
const TransactionAmount = styled.Text<{ type: string }>`
  font-size: 16px; font-weight: 700;
  color: ${({ type }: { type: string }) => type === 'credit' ? '#0F8A3C' : '#EF4444'};
`;
