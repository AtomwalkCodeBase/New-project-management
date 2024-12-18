import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
import React, { useContext } from 'react';
import ProfileScreen from '../../src/screens/ProfileScreen'

const profile = () => {
  return (
    <View style={{ flex: 1}}>
      <ProfileScreen/>
     
      </View>
  )
}

export default profile

const styles = StyleSheet.create({})