import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
import React, { useContext } from 'react';
import ActivityScreen from '../../src/screens/AllActivity';

const profile = () => {
  return (
    <View style={{ flex: 1}}>
      {/* <ProfileScreen/> */}
     <ActivityScreen data='PENDING'/>
      </View>
  )
}

export default profile

const styles = StyleSheet.create({})