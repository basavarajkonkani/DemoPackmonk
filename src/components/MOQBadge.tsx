import React from 'react';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

interface MOQBadgeProps {
  moq: number;
  currentQuantity?: number;
  showTooltip?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const MOQBadge: React.FC<MOQBadgeProps> = ({ 
  moq, 
  currentQuantity, 
  showTooltip = false,
  size = 'medium' 
}) => {
  const isBelowMOQ = currentQuantity !== undefined && currentQuantity < moq;
  
  const sizeConfig = {
    small: { fontSize: 9, padding: '3px 6px', iconSize: 8 },
    medium: { fontSize: 10, padding: '4px 8px', iconSize: 9 },
    large: { fontSize: 11, padding: '5px 10px', iconSize: 10 },
  };

  const config = sizeConfig[size];

  return (
    <Container>
      <Badge isBelowMOQ={isBelowMOQ} size={size}>
        <FontAwesome5 
          name="layer-group" 
          size={config.iconSize} 
          color={isBelowMOQ ? '#DC2626' : '#0F8A3C'} 
          style={{ marginRight: 4 }} 
        />
        <BadgeText isBelowMOQ={isBelowMOQ} size={size}>
          MOQ: {moq}
        </BadgeText>
      </Badge>
      
      {showTooltip && (
        <Tooltip>
          <TooltipText>
            Minimum Order Quantity is {moq} units
          </TooltipText>
        </Tooltip>
      )}
      
      {isBelowMOQ && (
        <WarningText size={size}>
          Below minimum order quantity
        </WarningText>
      )}
    </Container>
  );
};

export default MOQBadge;

const Container = styled.View`
  position: relative;
`;

const Badge = styled.View<{ isBelowMOQ: boolean; size: string }>`
  flex-direction: row;
  align-items: center;
  padding: ${({ size }: { size: string }) => 
    size === 'small' ? '3px 6px' : 
    size === 'large' ? '5px 10px' : '4px 8px'};
  border-radius: 6px;
  background-color: ${({ isBelowMOQ }: { isBelowMOQ: boolean }) => 
    isBelowMOQ ? '#FEE2E2' : '#DCFCE7'};
  border-width: 1px;
  border-color: ${({ isBelowMOQ }: { isBelowMOQ: boolean }) => 
    isBelowMOQ ? '#FCA5A5' : '#BBF7D0'};
`;

const BadgeText = styled.Text<{ isBelowMOQ: boolean; size: string }>`
  font-size: ${({ size }: { size: string }) => 
    size === 'small' ? '9px' : 
    size === 'large' ? '11px' : '10px'};
  font-weight: 700;
  color: ${({ isBelowMOQ }: { isBelowMOQ: boolean }) => isBelowMOQ ? '#DC2626' : '#0F8A3C'};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const Tooltip = styled.View`
  position: absolute;
  top: -30px;
  left: 0;
  background-color: #111827;
  padding: 6px 10px;
  border-radius: 6px;
  z-index: 100;
`;

const TooltipText = styled.Text`
  font-size: 11px;
  color: #FFFFFF;
  white-space: nowrap;
`;

const WarningText = styled.Text<{ size: string }>`
  font-size: ${({ size }: { size: string }) => 
    size === 'small' ? '9px' : 
    size === 'large' ? '11px' : '10px'};
  color: #DC2626;
  margin-top: 4px;
  font-weight: 600;
`;
