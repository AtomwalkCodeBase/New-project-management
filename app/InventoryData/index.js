import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import InventoryUpdate from '../../src/screens/InventoryUpdate'

const index = () => {

  return (
    <View style={{ flex: 1}}>
          {/* <AllActivity/> */}
          <InventoryUpdate/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})