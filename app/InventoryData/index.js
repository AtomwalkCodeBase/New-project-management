import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router'; // Use useLocalSearchParams
import InventoryUpdate from '../../src/screens/InventoryUpdate'

const Index = () => {
    const { ref_num } = useLocalSearchParams(); // Retrieve the parameter
    // console.log({ref_num})

    return (
    <View style={{ flex: 1}}>
          {/* <AllActivity/> */}
          <InventoryUpdate id={ref_num}/>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({});
