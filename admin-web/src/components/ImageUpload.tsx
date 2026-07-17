/**
 * Professional Image Upload Component
 * 
 * Reusable for:
 * - Products
 * - Banners
 * - Categories
 * - Customer Artwork
 * 
 * Features:
 * - System file picker
 * - Instant preview
 * - Multi-file upload
 * - Remove, reorder, set primary
 * - File validation
 * - Error handling
 */

import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { imageStorage } from '../services/imageStorage';
import { ProductImage } from '../types';

interface ImageUploadProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Initialize image storage service
  useEffect(() => {
    imageStorage.init().catch((err) => {
      console.error('Failed to initialize image storage:', err);
    });
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const newImages: ProductImage[] = [...images];

      for (let i = 0; i < files.length; i++) {
        if (newImages.length >= maxImages) {
          setError(`Maximum ${maxImages} images allowed`);
          break;
        }

        const file = files[i];

        // Upload to storage service
        const storedImage = await imageStorage.uploadFile(file);

        // Create product image object
        const productImage: ProductImage = {
          id: storedImage.id,
          url: storedImage.url,
          fileName: storedImage.fileName,
          isPrimary: newImages.length === 0, // First image is primary
          uploadedAt: storedImage.uploadedAt,
        };

        newImages.push(productImage);
      }

      onImagesChange(newImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = images.filter((img) => img.id !== imageId);

    // Ensure at least one primary image
    if (updatedImages.length > 0 && !updatedImages.some((img) => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }

    onImagesChange(updatedImages);
  };

  const handleSetPrimary = (imageId: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isPrimary: img.id === imageId,
    }));
    onImagesChange(updatedImages);
  };

  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    onImagesChange(updatedImages);
  };

  return (
    <Container>
      <Label>
        Product Images
        {images.length > 0 && (
          <ImageCount>
            {' '}
            ({images.length}/{maxImages})
          </ImageCount>
        )}
      </Label>

      {/* Upload Area */}
      <UploadArea
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        isDragActive={dragActive}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
          disabled={loading || images.length >= maxImages}
        />

        <UploadContent>
          <UploadIcon>📸</UploadIcon>
          <UploadTitle>
            {loading ? 'Uploading...' : 'Upload Images'}
          </UploadTitle>
          <UploadDescription>
            {dragActive
              ? 'Drop files here'
              : 'Drag & drop or click to select (JPG, PNG, WEBP)'}
          </UploadDescription>
          {images.length < maxImages && (
            <UploadButton type="button" disabled={loading}>
              {loading ? 'Processing...' : 'Select Files'}
            </UploadButton>
          )}
          {images.length >= maxImages && (
            <LimitText>Maximum images reached</LimitText>
          )}
        </UploadContent>
      </UploadArea>

      {/* Error Message */}
      {error && (
        <ErrorMessage>
          <ErrorIcon>⚠️</ErrorIcon>
          {error}
          <CloseError onClick={() => setError(null)}>×</CloseError>
        </ErrorMessage>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <ImagesGrid>
          <GridTitle>
            {images.length === 1 ? '1 image' : `${images.length} images`}
          </GridTitle>
          <ImagesList>
            {images.map((image, index) => (
              <ImageCard key={image.id} isPrimary={image.isPrimary}>
                <ImageContainer>
                  <Image src={image.url} alt={image.fileName} />
                  {image.isPrimary && <PrimaryBadge>Primary</PrimaryBadge>}
                </ImageContainer>

                <ImageInfo>
                  <FileName title={image.fileName}>
                    {image.fileName}
                  </FileName>
                  <FileSize>
                    {(
                      image.url.length /
                      1024
                    ).toFixed(1)} KB
                  </FileSize>
                </ImageInfo>

                <Actions>
                  {images.length > 1 && !image.isPrimary && (
                    <ActionButton
                      title="Set as primary"
                      onClick={() => handleSetPrimary(image.id)}
                    >
                      ⭐
                    </ActionButton>
                  )}
                  {index > 0 && (
                    <ActionButton
                      title="Move up"
                      onClick={() =>
                        handleReorderImages(index, index - 1)
                      }
                    >
                      ↑
                    </ActionButton>
                  )}
                  {index < images.length - 1 && (
                    <ActionButton
                      title="Move down"
                      onClick={() =>
                        handleReorderImages(index, index + 1)
                      }
                    >
                      ↓
                    </ActionButton>
                  )}
                  <ActionButton
                    danger
                    title="Remove"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    🗑️
                  </ActionButton>
                </Actions>
              </ImageCard>
            ))}
          </ImagesList>
        </ImagesGrid>
      )}

      {/* Info Box */}
      <InfoBox>
        <InfoTitle>💡 Supported Formats</InfoTitle>
        <InfoList>
          <li>JPG / JPEG - Best for photographs</li>
          <li>PNG - Best for graphics with transparency</li>
          <li>WEBP - Best for web optimization</li>
          <li>Maximum file size: 10MB per image</li>
          <li>Recommended: At least 300x300px resolution</li>
        </InfoList>
      </InfoBox>
    </Container>
  );
};

export default ImageUpload;

/* ─── Styles ──────────────────────────────────────────────────────── */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ImageCount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  background-color: #F3F4F6;
  padding: 2px 8px;
  border-radius: 12px;
`;

const UploadArea = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${(props) => (props.isDragActive ? '#0F8A3C' : '#E5E7EB')};
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.isDragActive ? 'rgba(15, 138, 60, 0.05)' : '#F9FAFB'};
  transition: all 200ms ease;

  &:hover {
    border-color: #0F8A3C;
    background-color: rgba(15, 138, 60, 0.03);
  }
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const UploadIcon = styled.div`
  font-size: 36px;
`;

const UploadTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const UploadDescription = styled.p`
  font-size: 13px;
  color: #6B7280;
  margin: 0;
`;

const UploadButton = styled.button`
  padding: 8px 16px;
  background-color: #0F8A3C;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover:not(:disabled) {
    background-color: #0D7A35;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LimitText = styled.p`
  font-size: 12px;
  color: #6B7280;
  margin: 0;
  font-style: italic;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: #FEE2E2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  font-size: 13px;
  color: #DC2626;
  position: relative;
`;

const ErrorIcon = styled.span`
  font-size: 16px;
  flex-shrink: 0;
`;

const CloseError = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  color: #DC2626;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

const ImagesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GridTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ImagesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
`;

const ImageCard = styled.div<{ isPrimary: boolean }>`
  border: 2px solid ${(props) => (props.isPrimary ? '#0F8A3C' : '#E5E7EB')};
  border-radius: 8px;
  overflow: hidden;
  background-color: #FFFFFF;
  transition: all 150ms ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1 aspect ratio */
  background-color: #F9FAFB;
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PrimaryBadge = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #0F8A3C;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 4px;
`;

const ImageInfo = styled.div`
  padding: 8px;
  border-top: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FileName = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileSize = styled.p`
  font-size: 10px;
  color: #9CA3AF;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px;
  border-top: 1px solid #E5E7EB;
  background-color: #F9FAFB;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ danger?: boolean }>`
  flex: 1;
  min-width: 28px;
  height: 28px;
  padding: 4px;
  border: 1px solid #E5E7EB;
  background-color: ${(props) =>
    props.danger ? '#FEE2E2' : '#F3F4F6'};
  color: ${(props) => (props.danger ? '#DC2626' : '#374151')};
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 100ms ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) =>
      props.danger ? '#FECACA' : '#E5E7EB'};
  }
`;

const InfoBox = styled.div`
  background-color: #FEF3C7;
  border: 1px solid #FCD34D;
  border-radius: 8px;
  padding: 12px;
`;

const InfoTitle = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: #92400E;
  margin: 0 0 6px;
`;

const InfoList = styled.ul`
  font-size: 12px;
  color: #92400E;
  margin: 0;
  padding-left: 16px;

  li {
    margin-bottom: 3px;
    line-height: 1.4;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
