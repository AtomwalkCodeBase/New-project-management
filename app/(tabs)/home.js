import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import HomeScreen from '../../src/screens/HomeScreen';
import PinPopup from '../../src/screens/PinPopup';
import { getProfileInfo } from '../../src/services/authServices';
import ManagerHomePage from '../../src/screens/ManagerHomeScreen';
import { Text } from 'react-native';
import FingerPopup from '../../src/screens/FingerPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../src/components/old_components/Loader';

const Home = () => {
  const [isManager, setIsManager] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  const handleLoaderTimeout = () => {
    setLoadingTimeout(true);
    setLoading(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileInfo();
        setProfile(res.data);
        setIsManager(res?.data?.user_group?.is_manager || false);
        
        // Save profile data to AsyncStorage
        await AsyncStorage.setItem('profile', JSON.stringify(res.data));
        if (res.data?.emp_data?.name) {
          await AsyncStorage.setItem('profilename', res.data.emp_data.name);
        }
        
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setIsManager(false);
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (loadingTimeout) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading timeout occurred. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Loader visible={loading} onTimeout={handleLoaderTimeout} />
      
      {!loading && (
        <>
          {isManager ? <ManagerHomePage /> : <HomeScreen />}
          <PinPopup />      
          <FingerPopup/>
        </>
      )}
    </View>
  );
};

export default Home;