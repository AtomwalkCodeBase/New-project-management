import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ActivityScreen from '../../src/screens/AllActivity';
import ManageInventory from '../../src/screens/ManageInventory';

const Inventory = () => {
  
  // console.log('Profile==', user);

  return (
    <View style={{ flex: 1 }}>
      
        {/* <ActivityScreen data="PENDING" /> */}
        <ManageInventory/>

    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({});
