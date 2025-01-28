import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AddInventoryItem from '../../src/screens/AddInventoryItem';
import { useLocalSearchParams } from 'expo-router';

const Inventory = () => {
  const { scannedCodes } = useLocalSearchParams(); // Get the scanned codes from the route params
  const [decodedCodes, setDecodedCodes] = useState([]);

  useEffect(() => {
    if (scannedCodes) {
      try {
        // Parse the scannedCodes JSON string back into an array
        const parsedCodes = JSON.parse(scannedCodes);
        if (Array.isArray(parsedCodes)) {
          setDecodedCodes(parsedCodes);
        } else {
          console.error('Invalid scanned codes format: Not an array');
        }
      } catch (error) {
        console.error('Failed to parse scanned codes:', error);
        setDecodedCodes([]); // Reset to an empty array in case of an error
      }
    }
  }, [scannedCodes]);

  console.log('testvfnd',decodedCodes)

  return (
    <View style={{ flex: 1 }}>
      {decodedCodes.length >= 0 ? (
        // Pass the decoded codes to the AddInventoryItem component
        <AddInventoryItem scannedCodes={decodedCodes} />
      ) : (
        // Fallback view for when no scanned codes are available
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholder}>No scanned codes available</Text>
        </View>
      )}
    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
