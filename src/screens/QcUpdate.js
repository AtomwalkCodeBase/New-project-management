import React, { useEffect, useState } from 'react';
import { View, Dimensions, TextInput, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import HeaderComponent from '../components/HeaderComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { getActivitiQcData, postActivtyInventory } from '../services/productServices';
import SubmitButton from '../components/SubmitButton';
import { colors } from '../Styles/appStyle';

const { width, height } = Dimensions.get('window');

// Styled Components
const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#c2e9fb', '#ffdde1'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
`;

const Container = styled(ScrollView).attrs({
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
})`
  flex: 1;
  padding: 20px;
  padding-bottom: 40px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
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

const TextInputStyled = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-top: 10px;
  font-size: 14px;
  width: 100%;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding: 12px 18px;
  border-radius: 6px;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

// Main Component
const QcUpdate = (props) => {
  const id = props.id;
  const navigation = useNavigation();
  const [qcData, setQcData] = useState([]);

  useEffect(() => {
    fetchQcData();
  }, []);

  const data = {
    activity_id: id,
    call_mode: 'QC_DATA',
  };

  const fetchQcData = async () => {
    try {
      const response = await getActivitiQcData(data);
      setQcData(response.data);
    } catch (error) {
      console.error('Error fetching QC data:', error);
    }
  };

  // const handleUpdateQcData = () => {
  //   console.log('Updating QC data with:', qcData);
  //   // Add logic to save QC data
  // };
  const handleUpdateQcData = async (item) => {
      
      
      const payload = {
        activity_id: id, 
        call_mode: 'QC_DATA',
        qc_actual: 'test'
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

  const handleInputChange = (index, value) => {
    const updatedData = [...qcData];
    updatedData[index].qc_actual = value;
    setQcData(updatedData);
  };

  console.log('Fetched Qc Data==',qcData)
  return (
    <GradientBackground>
      <HeaderComponent headerTitle="Quality Check Data" onBackPress={navigation.goBack} />
      <Container>
        {qcData.map((item, index) => (
          <Card key={index}>
            <BoldText>{item.qc_name}</BoldText>
            <SubText>Permissible Value: {item.qc_value}</SubText>
            <TextInputStyled
              placeholder="Enter actual value"
              value={String(item.qc_actual || '')}
              onChangeText={(value) => handleInputChange(index, value)}
            />
            <SubmitButton
              label="Update QC Data"
              onPress={(value) => handleUpdateQcData(index, value)}
              bgColor={colors.primary}
              textColor="white"
            />
          </Card>
        ))}
      </Container>
    </GradientBackground>
  );
};

export default QcUpdate;
