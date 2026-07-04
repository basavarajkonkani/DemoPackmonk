import React from 'react';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface StockIndicatorProps {
  inStock: boolean;
  stockCount?: number;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const StockIndicator: React.FC<StockIndicatorProps> = ({ 
  inStock, 
  stockCount,
  showCount = true,
  size = 'medium'
}) => {
  const getStockStatus = () => {
    if (!inStock || stockCount === 0) {
      return { label: 'Out of Stock', color: '#DC2626', bgColor: '#FEE2E2', icon: 'times-circle' };
    }
    if (stockCount && stockCount < 100) {
      return { label: `Only ${stockCount} left`, color: '#F59E0B', bgColor: '#FEF3C7', icon: 'exclamation-triangle' };
    }
    if (stockCount && stockCount < 500) {
      return { label: `${stockCount} in stock`, color: '#10B981', bgColor: '#D1FAE5', icon: 'check-circle' };
    }
    return { label: 'In Stock', color: '#0F8A3C', bgColor: '#DCFCE7', icon: 'check-circle' };
  };

  const status = getStockStatus();

  const sizeConfig = {
    small: { fontSize: 9, padding: '3px 6px', iconSize: 8 },
    medium: { fontSize: 10, padding: '4px 8px', iconSize: 9 },
    large: { fontSize: 11, padding: '5px 10px', iconSize: 10 },
  };

  const config = sizeConfig[size];

  return (
    <Badge bgColor={status.bgColor} size={size}>
      <FontAwesome5 
        name={status.icon as any} 
        size={config.iconSize} 
        color={status.color} 
        style={{ marginRight: 4 }} 
      />
      <BadgeText color={status.color} size={size}>
        {showCount && stockCount ? status.label : (inStock ? 'In Stock' : 'Out of Stock')}
      </BadgeText>
    </Badge>
  );
};

export default StockIndicator;

const Badge = styled.View<{ bgColor: string; size: string }>`
  flex-direction: row;
  align-items: center;
  padding: ${({ size }: { size: string }) => 
    size === 'small' ? '3px 6px' : 
    size === 'large' ? '5px 10px' : '4px 8px'};
  border-radius: 6px;
  background-color: ${({ bgColor }: { bgColor: string }) => bgColor};
  align-self: flex-start;
`;

const BadgeText = styled.Text<{ color: string; size: string }>`
  font-size: ${({ size }: { size: string }) => 
    size === 'small' ? '9px' : 
    size === 'large' ? '11px' : '10px'};
  font-weight: 700;
  color: ${({ color }: { color: string }) => color};
`;
