import { Stack } from "expo-router";
import {AppProvider} from '../context/AppContext'
import { StyleSheet, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function TopInsetBackground() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: 'rgb(252, 128, 20)', zIndex: 1, pointerEvents: 'none' }} />
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
    <SafeAreaProvider>
    <StatusBar style="light" />
    <TopInsetBackground />
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="AuthScreen/index" options={{headerShown:false}}/> 
      <Stack.Screen name="PinScreen/index" options={{headerShown:false}}/> 
      <Stack.Screen name="ResetPassword/index" options={{headerShown:false}}/>
      <Stack.Screen name="ActivityList/index" options={{headerShown:false}}/>
      <Stack.Screen name="OverDue/index" options={{headerShown:false}}/>
      <Stack.Screen name="InventoryData/index" options={{headerShown:false}}/>
      <Stack.Screen name="QcData/index" options={{headerShown:false}}/>
      <Stack.Screen name="ActivityCompleted/index" options={{headerShown:false}}/>
      <Stack.Screen name="MarkCompleteScreen/index" options={{headerShown:false}}/>
      <Stack.Screen name="QrScanner/index" options={{headerShown:false}}/>
      <Stack.Screen name="AddInventory/index" options={{headerShown:false}}/>
    </Stack>
    </SafeAreaProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa', // Your screen background color
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa', // Ensure content has proper background
  },
});