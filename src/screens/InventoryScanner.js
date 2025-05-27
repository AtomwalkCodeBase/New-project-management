import React, { useState, useEffect } from 'react';
import { Keyboard, SafeAreaView, View, Text, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import HeaderComponent from '../components/HeaderComponent';
import SubmitButton from '../components/SubmitButton';
import Loader from '../components/old_components/Loader';
import Input from '../components/old_components/Input';
import SuccessModal from '../components/SuccessModal';
import ConfirmationModal from '../components/ConfirmationModal';

// Services and Styles
import { getQty, processInspection } from '../services/productServices';
import { colors } from '../Styles/appStyle';
import { getProfileInfo } from '../services/authServices';
import RemarksInput from '../components/RemarkInput';

const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#ffd6b3', '#f7dce0'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
})`
  flex: 1;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const Section = styled.View`
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 12px;
  background-color: #ffffff;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.primaryDark};
  margin-bottom: 12px;
`;

const InfoContainer = styled.View`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  color: #6c757d;
  width: 40%;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: #343a40;
  width: 60%;
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
`;

const Divider = styled.View`
  height: 1px;
  background-color: #e9ecef;
  margin-vertical: 8px;
`;

const ScannerContainer = styled.View`
  height: 250px;
  width: 100%;
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px dashed ${colors.primary};
`;

const InventoryScanner = () => {
  // State management
  const [formData, setFormData] = useState({
    amount: "",
    item: '',
    mfgBatch: "",
    binNumber: "",
    remarks: ""
  });
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState({});
  const [profileName, setProfileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [quantityData, setQuantityData] = useState(null);
  const [hasConfirmedProceed, setHasConfirmedProceed] = useState(false);
  
  const navigation = useNavigation();
  const router = useRouter();
  const call_mode = 'BATCH_INSPECT';

  // Get current date in DD-MM-YYYY format
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Handle permission request on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  useEffect(() => {
    getProfileInfo().then((res) => {
      setProfile(res.data);
      setProfileName(res.data?.emp_data?.name || "");
    });
  }, []);

  // Check if last scan was within 30 days
  const isLastScanWithin30Days = (lastScanDate) => {
    if (!lastScanDate || lastScanDate === "") return false;
    
    try {
      const [day, month, year] = lastScanDate.split('-').map(Number);
      const lastScan = new Date(year, month - 1, day);
      const today = new Date();
      const diffTime = today - lastScan;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      return diffDays < 30;
    } catch (error) {
      console.error('Error parsing date:', error);
      return false;
    }
  };

  // Handle QR code scanning
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setShowScanner(false);
    
    try {
      const parsedData = parseScannedData(data);
      updateFormData(parsedData);
      
      if (parsedData.item_number && parsedData.batch_number) {
        fetchQuantity(parsedData.item_number, parsedData.batch_number, parsedData.bin_location_id);
      } else {
        Alert.alert(
          'Incomplete Scan',
          'The scanned QR code is missing required information. Please ensure it contains both item number and batch number.'
        );
      }
    } catch (error) {
      console.error('Failed to parse scanned data:', error);
      Alert.alert('Error', 'Failed to process scanned QR code');
    }
  };

  // Parse scanned QR data
  const parseScannedData = (data) => {
    const parsedData = {};
    
    if (data.includes(';') && data.includes(':')) {
      data.split(';').forEach(pair => {
        const [key, value] = pair.split(':').map(item => item.trim());
        if (key && value) parsedData[key] = value;
      });
    } else if (data.includes(',')) {
      const parts = data.split(',').map(item => item.trim());
      if (parts.length >= 1) parsedData.item_number = parts[0];
      if (parts.length >= 2) parsedData.batch_number = parts[1];
      if (parts.length >= 3) parsedData.bin_location_id = parts[2];
    } else {
      parsedData.item_number = data.trim();
    }
    
    return parsedData;
  };

  // Update form data from scanned values
  const updateFormData = (parsedData) => {
    const updates = {};
    if (parsedData.item_number) updates.item = parsedData.item_number;
    if (parsedData.batch_number) updates.mfgBatch = parsedData.batch_number;
    if (parsedData.bin_location_id) updates.binNumber = parsedData.bin_location_id;
    
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Fetch item quantity
  const fetchQuantity = async (itemId, batchNum, binNumber) => {
    if (!itemId || !batchNum) {
      console.log("Skipping quantity fetch - missing required fields");
      return;
    }

    try {
      const response = await getQty(itemId, batchNum, binNumber);
      console.log("Quantity data:", response.data);
      setQuantityData(response.data);
      setFormData(prev => ({ ...prev, amount: String(response.data.current_qty) }));

      
      if (isLastScanWithin30Days(response.data.last_scan_date)) {
        setShowConfirmationModal(true);
      } else {
        setHasConfirmedProceed(true);
      }
    } catch (error) {
      console.error("Error fetching item quantity:", error.message);
      Alert.alert(
        'Error',
        `Failed to fetch quantity: ${error.response?.data?.message || error.message}`
      );
    }
  };

  // Handle form input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Navigation handlers
  const handleBackPress = () => navigation.goBack();

  // Scanner handlers
  const handlePressScanQR = () => {
    if (!hasPermission?.granted) {
      Alert.alert('Permission required', 'Camera permission is needed to scan QR codes');
      return;
    }
    setScanned(false);
    setShowScanner(true);
  };

  // Form validation
  const validateForm = () => {
    Keyboard.dismiss();
    let isValid = true;
    const newErrors = {};

    if (!formData.item) {
      newErrors.item = 'Please scan a valid item QR code';
      isValid = false;
    }

    if (!formData.amount) {
      newErrors.amount = 'Please enter the quantity';
      isValid = false;
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid quantity';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission
  const submitInventory = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const itemPayload = {
      item_number: formData.item,
      scan_qty: formData.amount,
      batch_number: formData.mfgBatch,
      bin_location_id: formData.binNumber,
      call_mode,
      scan_date: getCurrentDate(),
      scan_by: profileName,
      remarks: formData.remarks || 'No remarks'
    };

    processInspection(itemPayload)
      .then(() => {
        setIsLoading(false);
        setIsSuccessModalVisible(true);
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert(
          'Error',
          `Failed to add inventory: ${error.response?.data?.detail || error.message}`
        );
      });
  };

  // Handle confirmation modal actions
  const handleConfirmSubmit = () => {
    setShowConfirmationModal(false);
    setHasConfirmedProceed(true);
  };

  const handleCancelSubmit = () => {
    setShowConfirmationModal(false);
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
  setIsSuccessModalVisible(false);
  // Reset all scanner-related states
  setFormData({
    amount: "1",
    item: '',
    mfgBatch: "",
    binNumber: "",
    remarks: ""
  });
  setQuantityData(null);
  setHasConfirmedProceed(false);
  setScanned(false);  // Add this line
  setShowScanner(true);
};

  // Permission handling UI
  if (hasPermission === null) {
    return <View style={styles.center}><Text>Requesting for camera permission</Text></View>;
  }
  if (hasPermission === false || !hasPermission.granted) {
    return <View style={styles.center}><Text>No access to camera</Text></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderComponent 
        headerTitle="Inventory Inspection" 
        onBackPress={handleBackPress} 
      />
      
      <GradientBackground>
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <Container contentContainerStyle={{ paddingBottom: 20 }}>
            {showScanner ? (
              <Section>
                <SectionTitle>Scan Item QR Code</SectionTitle>
                <ScannerContainer>
                  <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                  />
                </ScannerContainer>
                <SubmitButton
                  label="Cancel Scan"
                  onPress={() => setShowScanner(false)}
                  bgColor={colors.danger}
                  textColor="white"
                />
              </Section>
            ) : (
              <>
                <Section>
                  <SectionTitle>Scanned Item Details</SectionTitle>
                  <InfoContainer>
                    <InfoRow>
                      <InfoLabel>Item Number:</InfoLabel>
                      <InfoValue bold>{formData.item || 'Not scanned'}</InfoValue>
                    </InfoRow>
                    
                    <Divider />
                    
                    <InfoRow>
                      <InfoLabel>Batch Number:</InfoLabel>
                      <InfoValue bold>{formData.mfgBatch || 'Not scanned'}</InfoValue>
                    </InfoRow>
                    
                    {formData.binNumber && (
                      <>
                        <Divider />
                        <InfoRow>
                          <InfoLabel>Bin Location:</InfoLabel>
                          <InfoValue>{formData.binNumber}</InfoValue>
                        </InfoRow>
                      </>
                    )}
                    
                    {quantityData && (
                      <>
                        <Divider />
                        <InfoRow>
                          <InfoLabel>Available Qty:</InfoLabel>
                          <InfoValue>{quantityData.current_qty}</InfoValue>
                        </InfoRow>
                        
                        {quantityData.last_scan_date && (
                          <>
                            <Divider />
                            <InfoRow>
                              <InfoLabel>Last Scanned:</InfoLabel>
                              <InfoValue>{quantityData.last_scan_date}</InfoValue>
                            </InfoRow>
                          </>
                        )}
                      </>
                    )}
                  </InfoContainer>
                </Section>

                {hasConfirmedProceed && (
                  <>
                    <Section>
                      <Input
                        label="Inspection Quantity"
                        placeholder={`Enter quantity (Available: ${quantityData?.current_qty || 0})`}
                        value={formData.amount}
                        onChangeText={(value) => handleInputChange('amount', value)}
                        keyboardType="numeric"
                        error={errors.amount}
                      />
                      
                      <RemarksInput
                        remark={formData.remarks}
                        setRemark={(value) => handleInputChange('remarks', value)}
                        placeholder="Enter inspection remarks"
                      />
                    </Section>

                    <SubmitButton
                      label="Submit Inspection"
                      onPress={submitInventory}
                      bgColor={colors.primary}
                      textColor="white"
                      icon="check-circle"
                    />
                  </>
                )}

                <SubmitButton
                  label={formData.item ? "Scan Another Item" : "Scan Item QR Code"}
                  onPress={handlePressScanQR}
                  bgColor={colors.secondary}
                  textColor="white"
                  icon="qrcode-scan"
                />
              </>
            )}
          </Container>
        )}
      </GradientBackground>
      
      <SuccessModal 
        visible={isSuccessModalVisible} 
        onClose={handleSuccessModalClose}
        message="Inventory inspected successfully!"
      />
      
      <ConfirmationModal
        visible={showConfirmationModal}
        message="This item was scanned within the last 30 days. Are you sure you want to inspect it again?"
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        confirmText="Inspect Again"
        cancelText="Cancel"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});

export default InventoryScanner;