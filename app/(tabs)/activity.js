import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
import React, { useContext } from 'react';
import PendingActivities from '../../src/screens/PendingActivity';

const profile = () => {
  return (
    <View style={{ flex: 1}}>
      {/* <ProfileScreen/> */}
     <PendingActivities/>
      </View>
  )
}

export default profile

const styles = StyleSheet.create({})