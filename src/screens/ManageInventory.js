import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import InfoCard from '../components/InfoCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Loader from '../components/old_components/Loader';
import HeaderComponent from '../components/HeaderComponent';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Container = styled.View`
  /* flex: 1; */
  background-color: #f5f5f5;
`;

const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#ffd6b3', '#f7dce0'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  /* flex: 1; */
  align-items: center;
  height: 100%;
`;



const Row = styled.View`
  /* flex-direction: row; */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* margin: 10px; */
  
`;

const ManageInventory = () => {
  const router = useRouter();
//   const [loaderVisible, setLoaderVisible] = useState(true);
  const navigation = useNavigation();

  

  const handleAddClick = () => {
    router.push({
      pathname: 'AddInventory' 
    });
  };
  // const handleReviewsClick = () => alert('Reviews Clicked');
  
  
  
  const handleBackPress = () => {
    navigation.goBack();
  };

  // console.log('Activity List======',activities)

  return (
    <Container>
    <HeaderComponent headerTitle='Manage Inventory' onBackPress={handleBackPress} />
      <GradientBackground>
      {/* <Loader visible={loaderVisible} /> */}
      

        
          
        <Row>
          <InfoCard number='Add' label="Item" iconName="plus-circle-multiple" gradientColors={['#007bff', '#00c6ff']} onPress={handleAddClick} />
          <InfoCard number='Process' label="Item" iconName="check-circle" gradientColors={['#38ef7d', '#11998e']} onPress={handleAddClick} />
        </Row>

        
        

      </GradientBackground>
    </Container>
  );
};

export default ManageInventory;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fb9032', // Green color
  },
});