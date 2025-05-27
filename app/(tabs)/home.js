import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import HomeScreen from '../../src/screens/HomeScreen';
import PinPopup from '../../src/screens/PinPopup';
import { getProfileInfo } from '../../src/services/authServices';
import ManagerHomePage from '../../src/screens/ManagerHomeScreen';
import FingerPopup from '../../src/screens/FingerPopup';
import { SafeAreaView } from 'react-native-safe-area-context';

const home = () => {
  const { state } = useContext(AppContext);

  const [isManager, setIsManager] = useState(false);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileInfo()
      .then((res) => {
        setProfile(res.data);
        setIsManager(res?.data?.user_group?.is_manager || false);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setIsManager(false);
      });
  }, []);


  return (
    <SafeAreaView>
      {isManager ? <ManagerHomePage /> : <HomeScreen />}
      <PinPopup />      
      <FingerPopup/>
    </SafeAreaView>
  )
}

export default home

const styles = StyleSheet.create({})