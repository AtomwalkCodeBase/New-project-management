import React, { useEffect, useState } from 'react';
import { Dimensions, Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { getActivitiQcData, postActivtyInventory} from '../services/productServices';
import { colors } from '../Styles/appStyle';
import SubmitButton from '../components/SubmitButton';

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
  padding: 15px;
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
  width: 100%;
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
  width: 80%;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 10px;
`;

// Unit Text Style
const UnitText = styled.Text`
  font-size: 14px;
  color: #555;
  margin-right: 10px;
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
      const response = await getActivitiQcData(data);
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
    const item_list = [{ 
      curr_consumed_quantity: item.curr_consumed_quantity, 
      item_number: item.item_number 
    }];
    
    const payload = {
      item_number: item.item_number,
      curr_consumed_quantity: `${item.curr_consumed_quantity}`,
      activity_id: id, 
      call_mode: 'INV_IN',
      item_list: item_list,
    };
  
    console.log('Updating inventory for item:', payload);
  
    try {
      const res = await postActivtyInventory(payload);
      console.log('Success Response:', res.data);
      Alert.alert('Success', `Inventory for ${item.item_name} updated successfully!`);
    } catch (error) {
      console.error('Error updating inventory:', error.response || error.message);
      Alert.alert(
        'Error',
        `Failed to update inventory. ${error.response?.data?.message || 'Please try again later.'}`
      );
    }
  };

  const handleUpdateProduction = async (item) => {
    const payload = {
      item_number: item.item_number,
      produced_qty: `${item.curr_consumed_quantity}`,
      activity_id: id,
      call_mode: 'INV_IN',
    };
  
    console.log('Updating production for item:', payload);
  
    try {
      const res = await postActivtyInventory(payload);
      console.log('Success Response ==', res.data);
  
      Alert.alert('Success', `Production for ${item.item_name} updated successfully!`);
    } catch (error) {
      console.error('Error updating production:', error);
  
      Alert.alert(
        'Error',
        'Failed to update production. Please try again later.'
      );
    }
  };
  
  

  console.log('Fetched Inventory--',inventoryData)

  return (
    <GradientBackground>
    <HeaderComponent headerTitle="Inventory Process" onBackPress={navigation.goBack} />
    <Container>
      {inventoryData.map((item, index) => (
        <Card key={index}>
          <Row>
            <BoldText>{item.item_name}</BoldText>
          </Row>
          <SubText>Batch: {item.bin_location || item.batch_number || 'N/A'}</SubText>
          <SubText>Allocated Qty: {item.allocated_qty} {item.item_base_unit}</SubText>
          {/* <SubText>Already Consumed Qty: {item.already_consumed_qty} {item.item_base_unit}</SubText> */}
          <SubText>
            {item.flow_type === 'C' 
              ? `Already Consumed Qty: ${item.already_consumed_qty} ${item.item_base_unit}` 
              : `Already Produced Qty: ${item.already_consumed_qty || 'N/A'} ${item.item_base_unit}`
            }
          </SubText>
          <SubText>
            {item.flow_type === 'C' 
              ? `Released & Wastage: ${item.released_qty} ${item.item_base_unit} & ${item.wastage_qty} ${item.item_base_unit}` 
              : `Produced Qty: ${item.released_qty || 'N/A'} ${item.item_base_unit}`
            }
          </SubText>
          <InputRow>
            <TextInputStyled
              placeholder={
                item.flow_type === 'C' 
                  ? "Enter consumption quantity" 
                  : "Enter production quantity"
              }
              keyboardType="numeric"
              value={String(item.curr_consumed_quantity || '')}
              onChangeText={(value) => handleInputChange(index, value)}
            />
            <UnitText>{item.item_base_unit}</UnitText>
          </InputRow>
          <SubmitButton
            label={item.flow_type === 'C' ? "Update Consumption" : "Update Production"}
            onPress={() => 
              item.flow_type === 'C'
                ? handleUpdateInventory(item)
                : handleUpdateProduction(item)
            }
            bgColor={colors.primary}
            textColor="white"
          />
        </Card>
      ))}
    </Container>
  </GradientBackground>
);
};

export default InventoryUpdate;
