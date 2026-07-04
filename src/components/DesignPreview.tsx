import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { CustomDesignConfig } from '../store/cartSlice';
import { FontAwesome5 } from '@expo/vector-icons';

interface DesignPreviewProps {
  productId: string;
  category: 'box' | 'mailer' | 'bag' | 'tape';
  design: CustomDesignConfig;
}

const getMaterialColors = (materialId: string) => {
  switch (materialId) {
    case 'white-clay':
    case 'white-bleached':
    case 'paper-tape-white':
      return { top: '#F0F0F0', front: '#E2E2E2', side: '#CACACA', accent: '#BBBBBB' };
    case 'premium-matte-black':
      return { top: '#2A2A2A', front: '#1A1A1A', side: '#111111', accent: '#333333' };
    case 'biodegradable-pbat':
      return { top: '#3A5440', front: '#2D4136', side: '#1E2D25', accent: '#4A6A50' };
    case 'paper-tape-kraft':
    case 'kraft':
    case 'premium-kraft':
    case 'kraft-bubble':
    default:
      return { top: '#D4A46A', front: '#BA8A50', side: '#9A7040', accent: '#C89A60' };
  }
};

const DesignPreview: React.FC<DesignPreviewProps> = ({ category, design }) => {
  const { length, width, height, materialId, inkColor, logoUri, logoScale, customText, textColor, textSize } = design;
  const colors = getMaterialColors(materialId);

  const maxDim = Math.max(length, width, height || 1);
  const scaleL = Math.max(0.45, length / maxDim);
  const scaleW = Math.max(0.45, width / maxDim);
  const scaleH = height ? Math.max(0.3, height / maxDim) : 0.12;

  const boxW = Math.round(160 * scaleL);
  const boxH = Math.round(110 * scaleH);
  const sideW = Math.round(38 * scaleW);
  const topH = Math.round(32 * scaleW);

  const hasDesign = logoUri !== null || (customText || '').trim() !== '';

  const renderBox = () => (
    <IsoWrap>
      {/* Top face */}
      <TopFace
        style={{
          width: boxW,
          height: topH,
          backgroundColor: colors.top,
          transform: [{ skewX: '-30deg' }, { translateX: sideW * 0.6 }],
        }}
      >
        {hasDesign && (
          <TopFaceLabel style={{ color: inkColor === '#FFFFFF' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)', fontSize: 7 }}>
            TOP
          </TopFaceLabel>
        )}
      </TopFace>

      <IsoMiddle>
        {/* Front face — main design canvas */}
        <FrontFace
          style={{
            width: boxW,
            height: boxH,
            backgroundColor: colors.front,
          }}
        >
          {/* Corner fold marks */}
          <CornerMark style={{ top: 4, left: 4 }} />
          <CornerMark style={{ top: 4, right: 4 }} />
          <CornerMark style={{ bottom: 4, left: 4 }} />
          <CornerMark style={{ bottom: 4, right: 4 }} />

          {/* Design canvas area */}
          <PrintArea>
            {logoUri ? (
              <LogoIcon style={{ transform: [{ scale: Math.max(0.6, Math.min(1.6, logoScale)) }] }}>
                <FontAwesome5
                  name={logoUri.includes('leaf') ? 'leaf' : logoUri.includes('ship') ? 'shipping-fast' : 'award'}
                  size={22}
                  color={inkColor}
                />
              </LogoIcon>
            ) : (
              <PlaceholderIcon>
                <FontAwesome5 name="box-open" size={18} color={colors.accent} />
              </PlaceholderIcon>
            )}
            {customText.trim() !== '' && (
              <PrintText
                style={{
                  color: textColor,
                  fontSize: Math.max(7, Math.min(14, textSize * scaleL * 0.7)),
                }}
                numberOfLines={2}
              >
                {customText.toUpperCase()}
              </PrintText>
            )}
          </PrintArea>

          {/* Print registration marks (decorative) */}
          <RegMark style={{ bottom: 5, right: 6 }}>
            <RegMarkCircle />
          </RegMark>
        </FrontFace>

        {/* Right side face */}
        <SideFace
          style={{
            width: sideW,
            height: boxH,
            backgroundColor: colors.side,
            transform: [{ skewY: '-40deg' }, { translateY: -(topH * 0.55) }],
          }}
        >
          {/* Vertical stripe decoration */}
          <SideStripe color={colors.accent} />
        </SideFace>
      </IsoMiddle>
    </IsoWrap>
  );

  const renderBag = () => (
    <BagWrap
      style={{
        width: Math.round(155 * scaleW),
        height: Math.round(200 * scaleL),
        backgroundColor: colors.front,
      }}
    >
      {/* Adhesive seal strip at top */}
      <BagSeal style={{ backgroundColor: colors.top }}>
        <SealDashes />
      </BagSeal>

      {/* Peel tab */}
      <PeelTab style={{ backgroundColor: colors.accent }}>
        <PeelTabLine />
      </PeelTab>

      {/* Design area */}
      <BagPrintArea>
        {logoUri ? (
          <LogoIcon style={{ transform: [{ scale: Math.max(0.6, Math.min(1.5, logoScale)) }], marginBottom: 6 }}>
            <FontAwesome5
              name={logoUri.includes('leaf') ? 'leaf' : logoUri.includes('ship') ? 'shipping-fast' : 'award'}
              size={26}
              color={inkColor}
            />
          </LogoIcon>
        ) : (
          <PlaceholderIcon style={{ marginBottom: 6 }}>
            <FontAwesome5 name="shopping-bag" size={22} color={colors.accent} />
          </PlaceholderIcon>
        )}
        {customText.trim() !== '' && (
          <PrintText style={{ color: textColor, fontSize: Math.max(8, Math.min(13, textSize * 0.75)) }} numberOfLines={2}>
            {customText.toUpperCase()}
          </PrintText>
        )}
      </BagPrintArea>

      {/* Bottom seal strip */}
      <BagBottomSeal style={{ backgroundColor: colors.side }} />
    </BagWrap>
  );

  const renderTape = () => (
    <TapeWrap>
      <TapeRoll style={{ borderColor: colors.side }}>
        <TapeRollFace style={{ backgroundColor: colors.front }}>
          <TapeCore>
            <TapeCoreInner>
              <FontAwesome5 name="circle" size={10} color={colors.side} />
            </TapeCoreInner>
          </TapeCore>
        </TapeRollFace>
        <TapeRollEdge style={{ backgroundColor: colors.top }} />
      </TapeRoll>

      <TapeStrip
        style={{
          height: Math.round(30 * scaleW),
          backgroundColor: colors.top,
          borderTopColor: colors.side,
          borderBottomColor: colors.side,
        }}
      >
        {customText.trim() !== '' ? (
          <TapeStripText style={{ color: textColor, fontSize: 8 }}>
            {customText.toUpperCase()}
          </TapeStripText>
        ) : (
          <TapeStripText style={{ color: colors.side, fontSize: 7, opacity: 0.5 }}>
            PACMONK • RECYCLABLE • FRAGILE
          </TapeStripText>
        )}
        {/* Serrated edge */}
        <TapeSerration />
      </TapeStrip>
    </TapeWrap>
  );

  return (
    <PreviewWrap>
      <Workbench>
        {/* Grid overlay */}
        <GridOverlay>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <GridLine key={`h${i}`} horizontal top={i * 42} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <GridLine key={`v${i}`} left={i * 58} />
          ))}
        </GridOverlay>

        {/* Shadow under product */}
        <ProductShadow />

        {/* The actual product */}
        <ProductContainer>
          {(category === 'box' || category === 'mailer') && renderBox()}
          {category === 'bag' && renderBag()}
          {category === 'tape' && renderTape()}
        </ProductContainer>

        {/* Material label */}
        <MaterialChip>
          <FontAwesome5 name="layer-group" size={9} color="#6B7280" style={{ marginRight: 4 }} />
          <MaterialChipText>{materialId.replace(/-/g, ' ')}</MaterialChipText>
        </MaterialChip>

        {/* Dimension badge */}
        <DimBadge>
          <DimText>
            {length}"
            {width ? ` × ${width}"` : ''}
            {height && height > 0.1 ? ` × ${height}"` : ''}
          </DimText>
        </DimBadge>
      </Workbench>

      {/* Status bar */}
      <PreviewStatusBar>
        <StatusItem>
          <FontAwesome5 name="check-circle" size={10} color="#0F8A3C" style={{ marginRight: 4 }} />
          <StatusText>Live Preview</StatusText>
        </StatusItem>
        <StatusSep />
        <StatusItem>
          <FontAwesome5 name="eye" size={10} color="#6B7280" style={{ marginRight: 4 }} />
          <StatusText>2.5D CAD Mode</StatusText>
        </StatusItem>
        <StatusSep />
        <StatusItem>
          <FontAwesome5 name={hasDesign ? 'paint-brush' : 'circle'} size={10} color={hasDesign ? '#7C3AED' : '#D1D5DB'} style={{ marginRight: 4 }} />
          <StatusText style={{ color: hasDesign ? '#7C3AED' : '#9CA3AF' }}>
            {hasDesign ? 'Custom Design' : 'No Design'}
          </StatusText>
        </StatusItem>
      </PreviewStatusBar>
    </PreviewWrap>
  );
};

export default DesignPreview;

/* ─── Wrapper ─────────────────────────────────────────────────────────────── */
const PreviewWrap = styled.View`
  width: 100%;
  margin-vertical: 8px;
`;

const Workbench = styled.View`
  width: 100%;
  height: 260px;
  background-color: #EEF2F6;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const GridOverlay = styled.View`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
`;

const GridLine = styled.View<{ horizontal?: boolean; top?: number; left?: number }>`
  position: absolute;
  ${({ horizontal }: { horizontal?: boolean }) => horizontal
    ? 'left: 0; right: 0; height: 1px;'
    : 'top: 0; bottom: 0; width: 1px;'}
  ${({ top }: { top?: number }) => top !== undefined ? `top: ${top}px;` : ''}
  ${({ left }: { left?: number }) => left !== undefined ? `left: ${left}px;` : ''}
  background-color: rgba(100,116,139,0.07);
`;

const ProductShadow = styled.View`
  position: absolute;
  bottom: 28px;
  width: 160px;
  height: 18px;
  border-radius: 50px;
  background-color: rgba(0,0,0,0.1);
`;

const ProductContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const MaterialChip = styled.View`
  position: absolute;
  top: 12px;
  left: 12px;
  flex-direction: row;
  align-items: center;
  background-color: rgba(255,255,255,0.92);
  padding: 4px 9px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #E5E7EB;
`;

const MaterialChipText = styled.Text`
  font-size: 9px;
  font-weight: 600;
  color: #6B7280;
  text-transform: capitalize;
`;

const DimBadge = styled.View`
  position: absolute;
  bottom: 12px;
  background-color: rgba(17,24,39,0.75);
  padding: 4px 12px;
  border-radius: 8px;
`;

const DimText = styled.Text`
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const PreviewStatusBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 0 2px;
`;

const StatusItem = styled.View`flex-direction: row; align-items: center;`;
const StatusText = styled.Text`font-size: 10px; color: #6B7280; font-weight: 500;`;
const StatusSep = styled.View`width: 1px; height: 12px; background-color: #E5E7EB; margin-horizontal: 10px;`;

/* ─── Box / Mailer ─────────────────────────────────────────────────────────── */
const IsoWrap = styled.View`align-items: flex-start;`;

const TopFace = styled.View`
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

const TopFaceLabel = styled.Text`
  font-size: 7px; font-weight: 700; letter-spacing: 1px;
`;

const IsoMiddle = styled.View`flex-direction: row; align-items: flex-start;`;

const FrontFace = styled.View`
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const CornerMark = styled.View`
  position: absolute;
  width: 8px; height: 8px;
  border-color: rgba(255,255,255,0.2);
  border-top-width: 1.5px;
  border-left-width: 1.5px;
`;

const PrintArea = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const LogoIcon = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const PlaceholderIcon = styled.View`
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  margin-bottom: 4px;
`;

const PrintText = styled.Text`
  text-align: center;
  font-weight: 800;
  letter-spacing: 1px;
  line-height: 14px;
`;

const RegMark = styled.View`
  position: absolute;
  width: 10px; height: 10px;
  align-items: center;
  justify-content: center;
`;

const RegMarkCircle = styled.View`
  width: 6px; height: 6px; border-radius: 3px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.2);
`;

const SideFace = styled.View`
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

const SideStripe = styled.View<{ color: string }>`
  width: 2px;
  height: 70%;
  background-color: ${({ color }: { color: string }) => color};
  opacity: 0.4;
`;

/* ─── Bag ──────────────────────────────────────────────────────────────────── */
const BagWrap = styled.View`
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

const BagSeal = styled.View`
  height: 22px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const SealDashes = styled.View`
  width: 80%;
  height: 1.5px;
  background-color: rgba(255,255,255,0.3);
  border-radius: 1px;
`;

const PeelTab = styled.View`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 22px;
  height: 8px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const PeelTabLine = styled.View`
  width: 14px; height: 1px; background-color: rgba(255,255,255,0.5);
`;

const BagPrintArea = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

const BagBottomSeal = styled.View`
  height: 14px;
  width: 100%;
`;

/* ─── Tape ─────────────────────────────────────────────────────────────────── */
const TapeWrap = styled.View`flex-direction: row; align-items: center;`;

const TapeRoll = styled.View`
  width: 100px; height: 100px; border-radius: 50px;
  border-width: 4px;
  position: relative;
  overflow: hidden;
`;

const TapeRollFace = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TapeCore = styled.View`
  width: 44px; height: 44px; border-radius: 22px;
  background-color: rgba(255,255,255,0.15);
  align-items: center;
  justify-content: center;
`;

const TapeCoreInner = styled.View`
  width: 22px; height: 22px; border-radius: 11px;
  background-color: rgba(255,255,255,0.9);
  align-items: center;
  justify-content: center;
`;

const TapeRollEdge = styled.View`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 10px;
`;

const TapeStrip = styled.View`
  flex: 1;
  min-width: 120px;
  border-top-width: 1.5px;
  border-bottom-width: 1.5px;
  margin-left: -4px;
  justify-content: center;
  padding-horizontal: 12px;
  position: relative;
`;

const TapeStripText = styled.Text`
  font-weight: 700;
  letter-spacing: 1px;
  text-align: center;
`;

const TapeSerration = styled.View`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background-color: rgba(0,0,0,0.06);
`;
