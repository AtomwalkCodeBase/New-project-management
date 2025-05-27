import React from 'react';
import { Modal, View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import DatePicker from '../components/DatePicker';
import Input from '../components/old_components/Input';
import { colors } from '../Styles/appStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ScannerModal = ({ 
  visible, 
  currentScan, 
  inputFields, 
  fieldValues, 
  setFieldValues, 
  onClose, 
  onSave 
}) => {
  const renderItem = ({ item }) => {
    if (item.includes('Date')) {
      return (
        <DatePicker
          label={item}
          cDate={fieldValues[item] || new Date()}
          setCDate={(date) => setFieldValues({ ...fieldValues, [item]: date })}
          containerStyle={styles.inputContainer}
        />
      );
    }
    
    return (
      <Input
        label={item}
        placeholder={`Enter ${item}`}
        value={fieldValues[item] || ''}
        onChangeText={(text) => setFieldValues({ ...fieldValues, [item]: text })}
        containerStyle={styles.inputContainer}
      />
    );
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Item Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.darkGray} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scanInfoContainer}>
            <Text style={styles.scanLabel}>Scanned Code:</Text>
            <Text style={styles.scanValue} numberOfLines={1} ellipsizeMode="tail">
              {currentScan}
            </Text>
          </View>

          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={inputFields}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              scrollEnabled={false}
              ListFooterComponent={<View style={styles.spacer} />}
            />
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={onSave}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeButton: {
    padding: 4,
  },
  scanInfoContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  scanLabel: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 4,
  },
  scanValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  spacer: {
    height: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: 'white',
  },
});

export default ScannerModal;