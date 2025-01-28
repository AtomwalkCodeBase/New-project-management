import React from 'react';
import { StyleSheet, View } from 'react-native';
import QrScannerScreen from '../../src/screens/QrScannerScreen';
import { useLocalSearchParams } from 'expo-router';

const Index = () => {

  
      const { quantity, item } = useLocalSearchParams(); 

      console.log('Refkmfbg',item)

  return (
    <View style={styles.container}>
      <QrScannerScreen qantity={quantity} selectedItem= {item}/>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
