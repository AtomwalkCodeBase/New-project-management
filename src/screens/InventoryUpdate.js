import React, { useEffect, useState } from 'react';
import { Dimensions, Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { postActivitiQcData } from '../services/productServices';

const { width } = Dimensions.get('window');

// Gradient Background Component
const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#c2e9fb', '#ffdde1'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  align-items: center;
  height: 100%;
`;

// Main Container for the screen
const Container = styled(ScrollView).attrs({
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
})`
  flex: 1;
  padding: 10px;
`;

// Title Text
const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
`;

// Card Component for each inventory item
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

// Row component to align items horizontally
const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// Bold Text Style
const BoldText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

// Sub Text Style for additional info
const SubText = styled.Text`
  font-size: 14px;
  color: #555;
  margin-top: 5px;
`;

// Styled TextInput for consumption quantity
const TextInputStyled = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-top: 10px;
  font-size: 14px;
`;

// Action Button for triggering inventory update
const ActionButton = styled.TouchableOpacity`
  background-color: #4285f4;
  padding: 8px 15px;
  border-radius: 6px;
  margin-top: 10px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`;

const InventoryUpdate = (props) => {
  const id = props.id;
  const navigation = useNavigation();
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Fetch inventory data from the API
  const fetchInventoryData = async () => {
    try {
      const data = { activity_id: id, call_mode: 'INV_IN' };
      const response = await postActivitiQcData(data);
      setInventoryData(response.data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  // Handle change in input value for each inventory item
  const handleInputChange = (index, value) => {
    const updatedData = [...inventoryData];
    updatedData[index].curr_consumed_quantity = parseFloat(value) || 0;
    setInventoryData(updatedData);
  };

  // Handle the inventory update for a specific item
  const handleUpdateInventory = async (item) => {
    try {
      const payload = {
        item_number: item.item_number,
        curr_consumed_quantity: item.curr_consumed_quantity,
      };

      console.log('Updating inventory for item:', payload);

      // Here you can replace the console.log with an actual API call to update the inventory for the specific item
      Alert.alert('Success', `Inventory for ${item.item_name} updated successfully!`);
    } catch (error) {
      console.error('Error updating inventory:', error);
      Alert.alert('Error', 'Failed to update inventory.');
    }
  };

  return (
    <GradientBackground>
      <HeaderComponent headerTitle="Inventory In-Process" onBackPress={navigation.goBack} />
      <Container>
        {inventoryData.map((item, index) => (
          <Card key={index}>
            <Row>
              <BoldText>{item.item_name}</BoldText>
              
            </Row>
            <SubText>Batch: {item.batch_number || 'N/A'}</SubText>
            <SubText>Allocated Qty: {item.allocated_qty} {item.item_base_unit}</SubText>
            <SubText>Consumed: {item.already_consumed_qty} {item.item_base_unit}</SubText>
            <SubText>Released & Wastage: {item.released_qty} {item.item_base_unit} & {item.wastage_qty} {item.item_base_unit}</SubText>
            <TextInputStyled
              placeholder="Enter consumption quantity"
              keyboardType="numeric"
              value={String(item.curr_consumed_quantity || '')}
              onChangeText={(value) => handleInputChange(index, value)}
            />
            <ActionButton onPress={() => handleUpdateInventory(item)}>
                <ButtonText>Update Inventory</ButtonText>
              </ActionButton>
          </Card>
        ))}
      </Container>
    </GradientBackground>
  );
};

export default InventoryUpdate;
