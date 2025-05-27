import React from 'react';
import { Dimensions, StyleSheet, View, ImageBackground, Text } from 'react-native';
import styled from 'styled-components/native';
import InfoCard from '../components/InfoCard';
import { useRouter } from 'expo-router';
import HeaderComponent from '../components/HeaderComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const BackgroundImage = styled.View`

  flex: 1;
  resize-mode: cover;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 20px 0;
  width: 100%;
`;

// const GradientOverlay = styled.View`
//   flex: 1;
//   background-color: rgba(255, 255, 255, 0.8); /* Subtle overlay for readability */
//   justify-content: center;
//   align-items: center;
// `;

const GradientOverlay = styled(LinearGradient).attrs({
  colors: ['#ffd6b3', '#f7dce0'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  })`
  align-items: center;
  height: 100%;
  `;
  

const ManageInventory = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleButtonPress = (route) => {
    router.push({ pathname: route });
  };

  return (
    <Container>
      <HeaderComponent headerTitle="Item Tracking" onBackPress={handleBackPress} />
      <BackgroundImage>
        <GradientOverlay>
          <View style={styles.titleContainer}>
            {/* <Text style={styles.title}>Manage Your Inventory</Text> */}
          </View>
          <ButtonRow>
            <InfoCard
              number="Register"
              label="Item"
              iconName="store-plus"
              gradientColors={['#007bff', '#00c6ff']}
              onPress={() => handleButtonPress('AddInventory')}
            />
            <InfoCard
              number="Fill"
              label="Item"
              iconName="store-check"
              gradientColors={['#38ef7d', '#11998e']}
              onPress={() => handleButtonPress('AddInventory')}
            />
          </ButtonRow>
          <ButtonRow>
            <InfoCard
              number="Dilivery"
              label="Item"
              iconName="truck-delivery"
              gradientColors={['#f7971e', '#ffd200']}
              onPress={() => handleButtonPress('AddInventory')}
            />
            <InfoCard
              number="Return"
              label="Tracking"
              iconName="dolly"
              gradientColors={['#81C784', '#2E7D32']}
              onPress={() => handleButtonPress('AddInventory')}
            />
          </ButtonRow>
          
        </GradientOverlay>
      </BackgroundImage>
    </Container>
  );
};

export default ManageInventory;

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});
