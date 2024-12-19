import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AllActivity from '../../src/screens/AllActivity'
import CompletedActivity from '../../src/screens/CompletedActivity'

const index = () => {

  return (
    <View style={{ flex: 1}}>
          {/* <AllActivity/> */}
          <CompletedActivity/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})