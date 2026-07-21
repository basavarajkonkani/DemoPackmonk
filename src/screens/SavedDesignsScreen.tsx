import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../constants/images';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchDesigns, duplicateDesignThunk, deleteDesignsThunk, selectDesigns } from '../store/designsSlice';
import type { SavedDesign } from '../store/designsSlice';

const SavedDesignsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const designs = useAppSelector(selectDesigns);
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchDesigns()).finally(() => setLoading(false));
  }, [dispatch]);

  const getThumbnail = (key: string) => (IMAGES as Record<string, any>)[key] ?? IMAGES.goldStandyPouch;

  const toggleSelection = (id: string) => {
    setSelectedDesigns((prev) =>
      prev.includes(id) ? prev.filter((designId) => designId !== id) : [...prev, id]
    );
  };

  const handleEdit = (design: SavedDesign) => {
    navigation.navigate('DesignStudio', { designId: design.id });
  };

  const handleDuplicate = (design: SavedDesign) => {
    Alert.alert('Duplicate Design', `Create a copy of "${design.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Duplicate', onPress: () => dispatch(duplicateDesignThunk(design.id)) },
    ]);
  };

  const handleDelete = () => {
    if (selectedDesigns.length === 0) return;

    Alert.alert(
      'Delete Designs',
      `Are you sure you want to delete ${selectedDesigns.length} design(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteDesignsThunk(selectedDesigns));
            setSelectedDesigns([]);
          },
        },
      ]
    );
  };

  const handleAddToCart = (design: SavedDesign) => {
    navigation.navigate('StreamlinedPouchConfigurator', { designId: design.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Designs</Text>
        {selectedDesigns.length > 0 ? (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <FontAwesome5 name="trash" size={18} color="#EF4444" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {selectedDesigns.length > 0 && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>{selectedDesigns.length} selected</Text>
          <TouchableOpacity onPress={() => setSelectedDesigns([])}>
            <Text style={styles.clearSelectionText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0F8A3C" />
        </View>
      ) : (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {designs.map((design) => {
            const isSelected = selectedDesigns.includes(design.id);
            return (
              <TouchableOpacity
                key={design.id}
                style={[styles.designCard, isSelected && styles.designCardSelected]}
                onLongPress={() => toggleSelection(design.id)}
              >
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <FontAwesome5 name="check-circle" size={24} color="#0F8A3C" solid />
                  </View>
                )}

                <View style={styles.thumbnailContainer}>
                  <Image source={getThumbnail(design.thumbnailKey)} style={styles.thumbnail} resizeMode="cover" />
                </View>

                <View style={styles.designInfo}>
                  <Text style={styles.designName} numberOfLines={1}>
                    {design.name}
                  </Text>
                  <Text style={styles.productType} numberOfLines={1}>
                    {design.productType}
                  </Text>

                  <View style={styles.designMeta}>
                    <View style={styles.metaItem}>
                      <FontAwesome5 name="ruler-combined" size={10} color="#6B7280" />
                      <Text style={styles.metaText}>{design.dimensions}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <FontAwesome5 name="palette" size={10} color="#6B7280" />
                      <Text style={styles.metaText}>{design.colors} colors</Text>
                    </View>
                  </View>

                  <Text style={styles.lastModified}>
                    Modified: {new Date(design.lastModified).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(design)}
                  >
                    <FontAwesome5 name="edit" size={14} color="#0F8A3C" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDuplicate(design)}
                  >
                    <FontAwesome5 name="copy" size={14} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButtonPrimary}
                    onPress={() => handleAddToCart(design)}
                  >
                    <FontAwesome5 name="cart-plus" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {designs.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome5 name="palette" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No Saved Designs</Text>
            <Text style={styles.emptyStateText}>
              Start creating designs in the Design Studio
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('DesignStudio')}
            >
              <Text style={styles.createButtonText}>Create Design</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#DCFCE7',
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F8A3C',
  },
  clearSelectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F8A3C',
  },
  content: {
    flex: 1,
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  designCard: {
    width: (Platform.OS === 'web' ? 'calc(33.333% - 11px)' : '48%') as any,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  designCardSelected: {
    borderWidth: 2,
    borderColor: '#0F8A3C',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  designInfo: {
    padding: 12,
  },
  designName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  productType: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  designMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#6B7280',
  },
  lastModified: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  actionButtonPrimary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#0F8A3C',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#0F8A3C',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SavedDesignsScreen;
