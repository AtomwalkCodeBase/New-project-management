import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import { LinearGradient } from 'expo-linear-gradient';

// Dimensions for button widths
const { width } = Dimensions.get('window');

// Styled Components
const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#c2e9fb', '#ffdde1'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  /* flex: 1; */
  align-items: center;
  height: 100%;
`;
const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
  width: 95%;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BoldText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const SubText = styled.Text`
  font-size: 14px;
  color: #555;
  margin-top: 5px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: #4285f4;
  padding: 8px 15px;
  border-radius: 6px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`;

const InventoryUpdate = () => {
  // const route = useRoute();
  const navigation = useNavigation();
  const activityId = 1; // Retrieve activity ID passed during navigation

  // State to store fetched inventory data
  const [inventoryItems, setInventoryItems] = useState([]);

  // Mock inventory data (replace this with API calls)
  const mockInventoryData = {
    1: [
      { sku: 'SKU-WIP-00001', description: 'Semi Finished Output 1', allocatedQty: '78.00 [KG]' },
      { sku: 'SKU-PKG-00001', description: 'Packaging Material - 01', allocatedQty: '1.50 [Nos]' },
    ],
    5: [
      { sku: 'SKU-RM-00002', description: 'Raw Material 2', allocatedQty: '50.00 [KG]' },
    ],
  };

  // Fetch data based on activity ID
  useEffect(() => {
    if (mockInventoryData[activityId]) {
      setInventoryItems(mockInventoryData[activityId]);
    }
  }, [activityId]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <>
    
    {/* <HeaderComponent headerTitle="Item Consumption List" onBackPress={handleBackPress} /> */}
    <GradientBackground>
    <HeaderComponent headerTitle="Item Consumption List" onBackPress={handleBackPress} />
      <Container>
      {/* <Title>Item Consumption List</Title> */}
      {inventoryItems.map((item, index) => (
        <Card key={index}>
          <Row>
            <BoldText>{item.sku}</BoldText>
            <ActionButton onPress={() => alert('Action Button Pressed')}>
              <ButtonText>ACTION</ButtonText>
            </ActionButton>
          </Row>
          <SubText>{item.description}</SubText>
          <SubText>Allocated Qty: {item.allocatedQty}</SubText>
        </Card>
      ))}
      </Container>
    </GradientBackground>
    </>
  );
};

export default InventoryUpdate;
