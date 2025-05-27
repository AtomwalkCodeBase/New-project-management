import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import InventoryScanner from '../../src/screens/InventoryScanner';

const Inventory = () => {
  
  return (
    <View style={{ flex: 1 }}>
      
        {/* <ManageInventory/> */}
        <InventoryScanner/>



    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({});
