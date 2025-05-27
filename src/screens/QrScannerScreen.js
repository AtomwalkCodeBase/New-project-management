import React, { useState, useEffect } from 'react';
import { Text, View, Animated, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import HeaderComponent from '../components/HeaderComponent';
import { useNavigation, useRouter } from 'expo-router';

export default function QrScannerScreen(props) {
  const navigation = useNavigation();
  const router = useRouter();
  const mode = props.mode; // 'inventory' or other modes
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [scanAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    startScanAnimation();
  }, [hasPermission]);

  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleBarCodeScanned = ({ data }) => {
    if (isScanning) {
      setIsScanning(false);
      
      // Verify the data format matches expected inventory format
      if (data.includes('item_number:') && data.includes('batch_number:')) {
        router.replace({
          pathname: 'AddInventory',
          params: { scannedData: data }
        });
      } else {
        Alert.alert(
          'Invalid QR Code',
          'The scanned QR code does not contain valid inventory information.\n\nExpected format:\nitem_number: XXX;batch_number: XXX;bin_location_id: XXX;',
          [
            {
              text: 'Try Again',
              onPress: () => setIsScanning(true)
            },
            {
              text: 'Cancel',
              onPress: () => router.back()
            }
          ]
        );
      }
    }
  };

  if (!hasPermission) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (!hasPermission.granted) {
    return <Text>No access to camera</Text>;
  }

  const scanLineTranslateY = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent 
        headerTitle="Scan Inventory QR" 
        onBackPress={() => router.back()} 
      />
      
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        >
          <View style={styles.scanArea}>
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY: scanLineTranslateY }] }]}
            />
          </View>
        </CameraView>
      </View>
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Scan Inventory QR Code</Text>
        <Text style={styles.instructionsText}>
          Point your camera at the inventory label QR code containing:
        </Text>
        <Text style={styles.instructionsText}>
          item_number: XXX;batch_number: XXX;bin_location_id: XXX;
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    margin: 20,
    overflow: 'hidden',
  },
  scanLine: {
    width: '90%',
    height: 2,
    backgroundColor: 'red',
    position: 'absolute',
  },
  instructionsContainer: {
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});