import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, Button, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import HeaderComponent from '../components/HeaderComponent';
import { useNavigation, useRouter } from 'expo-router';

export default function QrScannerScreen(props) {
  const navigation = useNavigation();
  const router = useRouter();
  const quantity = props.qantity;
  const item = props.selectedItem;
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [scannedCodes, setScannedCodes] = useState([]);
  const [isScanning, setIsScanning] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScan, setCurrentScan] = useState('');
  const [mfgItemSerialNum, setMfgItemSerialNum] = useState('');
  const [remarks, setRemarks] = useState('');

  console.log('Pass quantity', props.qantity);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (isScanning && !scannedCodes.find((code) => code.item_serial_num === data)) {
      setCurrentScan(data); // Set the current scanned QR code
      setModalVisible(true); // Open the modal for user input
    }
  };

  const handleSaveDetails = () => {
    const newEntry = {
      item_serial_num: currentScan,
      mfg_item_serial_num: mfgItemSerialNum,
      remarks: remarks,
    };

    const updatedScannedCodes = [...scannedCodes, newEntry];
    setScannedCodes(updatedScannedCodes);
    setModalVisible(false);
    setMfgItemSerialNum('');
    setRemarks('');

    if (updatedScannedCodes.length >= quantity) {
      setIsScanning(false);
      router.replace({
        pathname: 'AddInventory',
        params: { scannedCodes: JSON.stringify(updatedScannedCodes), quantyti:quantity, item:item },
      });
    }
  };

  if (!hasPermission) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (!hasPermission.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent headerTitle="Item Scanner" onBackPress={navigation.goBack} />
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
      />
      <View style={{ padding: 10 }}>
        <Text>Scanned {scannedCodes.length} of {quantity}</Text>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Details</Text>
            <Text>Scanned QR Code: {currentScan}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter MFG Item Serial Number"
              value={mfgItemSerialNum}
              onChangeText={setMfgItemSerialNum}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Remarks"
              value={remarks}
              onChangeText={setRemarks}
            />
            <View style={styles.buttonRow}>
              <Button title="Save" onPress={handleSaveDetails} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
