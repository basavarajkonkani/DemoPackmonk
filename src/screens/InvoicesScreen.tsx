import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchInvoices, selectInvoices } from '../store/invoicesSlice';
import type { Invoice } from '../store/invoicesSlice';

const InvoicesScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectInvoices);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    dispatch(fetchInvoices()).finally(() => setLoading(false));
  }, [dispatch]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || invoice.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'overdue':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const handleDownload = (invoice: Invoice) => {
    Alert.alert('Downloading', `Invoice for ${invoice.orderNumber} is downloading...`);
  };

  const handleView = (invoice: Invoice) => {
    Alert.alert(
      `Invoice — ${invoice.orderNumber}`,
      `Type: ${invoice.invoiceType}\nDate: ${new Date(invoice.date).toLocaleDateString()}\nAmount: ₹${invoice.amount.toLocaleString()}\nGST: ₹${invoice.gstAmount.toLocaleString()}\nTotal: ₹${invoice.totalAmount.toLocaleString()}\nStatus: ${invoice.status.toUpperCase()}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoices</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by order number or type..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'paid', 'pending', 'overdue'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, filterType === filter && styles.filterButtonActive]}
            onPress={() => setFilterType(filter)}
          >
            <Text
              style={[styles.filterButtonText, filterType === filter && styles.filterButtonTextActive]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0F8A3C" />
        </View>
      ) : (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredInvoices.map((invoice) => (
          <View key={invoice.id} style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <View>
                <Text style={styles.orderNumber}>{invoice.orderNumber}</Text>
                <Text style={styles.invoiceType}>{invoice.invoiceType}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(invoice.status) }]}>
                  {invoice.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.invoiceDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{new Date(invoice.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount:</Text>
                <Text style={styles.detailValue}>₹{invoice.amount.toLocaleString()}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>GST:</Text>
                <Text style={styles.detailValue}>₹{invoice.gstAmount.toLocaleString()}</Text>
              </View>
              <View style={[styles.detailRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>₹{invoice.totalAmount.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(invoice)}>
                <FontAwesome5 name="download" size={14} color="#0F8A3C" />
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewButton} onPress={() => handleView(invoice)}>
                <FontAwesome5 name="eye" size={14} color="#6B7280" />
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#0F8A3C',
    borderColor: '#0F8A3C',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  invoiceType: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  invoiceDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F8A3C',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F8A3C',
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default InvoicesScreen;
