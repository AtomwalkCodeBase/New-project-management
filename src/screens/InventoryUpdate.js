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
  colors: ['#ffd6b3', '#f7dce0'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
/* flex: 1; */
  align-items: center;
  height: 100%;
`;

// Main Container for the screen
const Container = styled(ScrollView).attrs({
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
})`
  /* flex: 1; */
  padding: 15px;
  height: 100%;
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
  const call_type = props.type;
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
  // Handle change in input value for each inventory item
const handleInputChange = (itemNumber, value) => {
  // Allow only numbers and a single decimal point
  const sanitizedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
  
  const updatedData = inventoryData.map((item) =>
    item.item_number === itemNumber
      ? { ...item, curr_consumed_quantity: sanitizedValue } // Update the specific item's quantity
      : item
  );

  setInventoryData(updatedData);
};

  

  // Handle the inventory update for a specific item
  const handleUpdateInventory = async (item) => {
    // Check condition only for INV_IN
    if (call_type === 'INV_IN') {
      const totalConsumed = item.already_consumed_qty + item.curr_consumed_quantity;
  
      if (totalConsumed > item.allocated_qty) {
        Alert.alert(
          'Error',
          `Entered consumption exceeds allocated quantity. Allocated: ${item.allocated_qty} ${item.item_base_unit}, Already Consumed: ${item.already_consumed_qty} ${item.item_base_unit}.`
        );
        return;
      }
    }
  
    const item_list = [
      {
        curr_quantity: `${item.curr_consumed_quantity}`,
        item_number: item.item_number,
      },
    ];
  
    const payload = {
      activity_id: id,
      call_mode: call_type,
      item_list,
    };
  
    console.log('Updating inventory for item:', payload);
  
    try {
      const res = await postActivtyInventory(payload);
      console.log('Success Response:', res.data);
      Alert.alert('Success', `Inventory for ${item.item_name} updated successfully!`);
      // Refresh inventory data
      fetchInventoryData();
    } catch (error) {
      console.error('Error updating inventory:', error);
      Alert.alert('Error', 'Failed to update inventory. Please try again later.');
    }
  };
  

  const handleUpdateAllItems = async () => {
    // Determine which flow_type to filter based on call_type
    const flowType = call_type === 'INV_IN' ? 'C' : 'P';
  
    // Filter items where flow_type matches and curr_consumed_quantity is greater than 0
    const itemsToUpdate = inventoryData.filter(item => item.flow_type === flowType && item.curr_consumed_quantity > 0);
  
    // If `call_type` is 'INV_IN', check if any item exceeds its allocated quantity
    if (call_type === 'INV_IN') {
      for (let item of itemsToUpdate) {
        // Ensure the values are numbers (parse and default to 0 if NaN)
        const alreadyConsumed = parseFloat(item.already_consumed_qty) || 0;
        const currentConsumed = parseFloat(item.curr_consumed_quantity) || 0;
        const allocatedQty = parseFloat(item.allocated_qty) || 0;
  
        // Calculate the total consumed
        const totalConsumed = alreadyConsumed + currentConsumed;
  
        if (totalConsumed > allocatedQty) {
          Alert.alert(
            'Error',
            `Entered consumption for ${item.item_name} exceeds allocated quantity. Allocated: ${allocatedQty} ${item.item_base_unit}, Already Consumed: ${alreadyConsumed} ${item.item_base_unit}.`
          );
          return; // Stop the update if any item exceeds the allocated quantity
        }
      }
    }
  
    // Map the items to be updated into the required payload structure
    const item_list = itemsToUpdate.map(item => ({
      curr_quantity: `${item.curr_consumed_quantity}`,
      item_number: item.item_number,
    }));
  
    if (item_list.length === 0) {
      Alert.alert('No Items to Update', 'Please enter valid quantities for at least one item.');
      return;
    }
  
    const payload = {
      activity_id: id,
      call_mode: call_type,
      item_list,
    };
  
    console.log(`Updating inventory for all items with call_mode: ${call_type}`, payload);
  
    try {
      const res = await postActivtyInventory(payload);
      console.log('Success Response:', res.data);
      Alert.alert('Success', `Inventory updated successfully for all items!`);
      // Refresh inventory data
      fetchInventoryData();
    } catch (error) {
      console.error('Error updating inventory:', error);
      Alert.alert('Error', 'Failed to update inventory. Please try again later.');
    }
  };
  
  
  
  
  
  

 
  
  console.log('Call type===',call_type)

  console.log('Fetched Inventory--',inventoryData)

  return (
    <GradientBackground>
      <HeaderComponent headerTitle={call_type === 'INV_IN' ? 'Inventory-In Process' : 'Inventory-Out Process'} onBackPress={navigation.goBack} />
      <Container>
        {inventoryData
          .filter((item) =>
            call_type === 'INV_IN' ? item.flow_type === 'C' : item.flow_type === 'P'
          )
          .map((item, index) => (
            <Card key={index}>
              <Row>
                <BoldText>{item.item_number} [{item.item_name}]</BoldText>
              </Row>
              {item.flow_type === 'C' &&(
                <>
                  <SubText>Batch: {item.bin_location || item.batch_number || 'N/A'}</SubText>
                  <SubText>Allocated Qty: {item.allocated_qty} {item.item_base_unit}</SubText>
                  </>
                )}
              
              <SubText>
                {item.flow_type === 'C' 
                  ? `Already Consumed Qty: ${item.already_consumed_qty} ${item.item_base_unit}` 
                  : `Estimated Qty: ${item.estimated_qty || 'N/A'} ${item.item_base_unit}`
                }
              </SubText>
              <SubText>
                {item.flow_type === 'C' 
                  ? `Released & Wastage: ${item.released_qty} ${item.item_base_unit} & ${item.wastage_qty} ${item.item_base_unit}` 
                  : `Produced Qty: ${item.already_consumed_qty || 'N/A'} ${item.item_base_unit}`
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
                value={String(item.curr_consumed_quantity || '')} // Ensure it's a string
                onChangeText={(value) => handleInputChange(item.item_number, value)}
              />


                <UnitText>{item.item_base_unit}</UnitText>
              </InputRow>
              
              <ActionButton onPress={() => 
                   handleUpdateInventory(item)}>
            <ButtonText>{item.flow_type === 'C' ? "Update Consumption" : "Update Production"}</ButtonText>
          </ActionButton>
            </Card>
          ))}
         

          {call_type === 'INV_IN' || call_type === 'INV_OUT' ? (
            <SubmitButton
              label={call_type === 'INV_IN' ? 'Update Inventory' : 'Update Production'}
              onPress={handleUpdateAllItems}
              bgColor={colors.primary}
              textColor="white"
            />
          ) : null}



          
      </Container>
    </GradientBackground>
  );
  
};

export default InventoryUpdate;
