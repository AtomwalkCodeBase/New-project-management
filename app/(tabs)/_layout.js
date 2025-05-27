import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="industry" size={24} color={color} />,
        }}
      />
      {/* {isUser && ( */}
        <Tabs.Screen
          name="inventory"
          options={{
            title: 'Scan Item',
            headerShown: false,
            tabBarIcon: ({ color }) => <FontAwesome name="qrcode" size={24} color={color} />,
          }}
        />
      {/* )} */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})