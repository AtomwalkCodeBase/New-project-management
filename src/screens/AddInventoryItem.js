import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Keyboard, SafeAreaView, Dimensions, Text, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getBinId, getInventoryItem, processItemSrl } from '../services/productServices';
import HeaderComponent from '../components/HeaderComponent';
import DropdownPicker from '../components/DropdownPicker';
import AmountInput from '../components/AmountInput';
import SubmitButton from '../components/SubmitButton';
import Loader from '../components/old_components/Loader';
import styled from 'styled-components/native';
import { colors } from '../Styles/appStyle';
import SuccessModal from '../components/SuccessModal';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/old_components/Input';

const { width } = Dimensions.get('window');


const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#ffd6b3', '#f7dce0'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
`;

const TextInputStyled = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-top: 10px;
  font-size: 16px;
  width: 80%;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding: 10px;
  background-color: #fff;
`;

const ScannedCodesContainer = styled.View`
  margin-top: 15px;
  padding: 10px;
  border-radius: 8px;
  height: 300px;
  background-color: #f9f9f9;
`;

const ScannedTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.primary};
  margin-bottom: 10px;
`;

const ScannedCodeCardContainer = styled(ScrollView).attrs({
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
})``;

const ScannedCodeCard = styled.View`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const ScannedCodeText = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 3px;
`;

const BoldText = styled.Text`
  font-weight: bold;
  color: #000;
`;


const AddInventoryItem = () => {
  const [amount, setAmount] = useState("");
  const [claimItem, setClaimItem] = useState([]);
  const [item, setItem] = useState('');
  const [pressure, setPressure] = useState("");
  const [mfgBatch, setMfgBatch] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const call_mode = 'ITEM_NEW';
  const [binNumber, setBinNumber] = useState("");

  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();


  useEffect(() => {
    if (params?.item) {
      fetchItemList(params?.item);
    }
    else{
      fetchItemList();
    }
    if (params?.quantyti) {
      setAmount(params?.quantyti);
    }
  }, [params?.quantyti, params?.item]); 

  useEffect(() => {
    if (item) {
      fetchBinNumber(item);
    }
  }, [item]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const fetchBinNumber = async (itemId) => {
    if (!itemId) return;
    
    try {
      const response = await getBinId(itemId);
      setBinNumber(response.data?.default_bin_id || ""); 
    } catch (error) {
      console.error("Error fetching bin number:", error);
      setBinNumber("");
    }
  };

  console.log('Bin Number==',binNumber)

  const fetchItemList = async (selectedItemId) => {
    setIsLoading(true);
    try {
      const response = await getInventoryItem();
      const formattedData = response.data
        .filter(item => item.item_number.toLowerCase().includes('gas'))
        .map((item) => ({
          label: item.name,
          value: item.id,
        }));
  
        // console.log('Item response--',response.data);
      setClaimItem(formattedData);
  
      if (selectedItemId) {
        const selectedItem = formattedData.find((item) => String(item.value) === String(selectedItemId));
        if (selectedItem) {
          setItem(selectedItem.value);
          fetchBinNumber(selectedItem.value); // Fetch bin number when item is selected
        } else {
          console.warn('Selected item ID not found in the filtered list.');
        }
      }
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!item) {
      handleError('Please select an Inventory Item', 'item');
      isValid = false;
    }

    if (!amount) {
      handleError('Please enter the quantity', 'amount');
      isValid = false;
    }

    if (isValid) {
      handlePressScanQR(amount);
    }
  };

  const handlePressScanQR = (amount) => {
    router.push({
      pathname: 'QrScanner',
      params: { quantity: amount, item: item },
    });
  };


  const addItemInventory = () => {
    const itemPayload = {
      item_id: `${item}`,
      in_quantity: amount,
      mfg_batch_number: mfgBatch,
      item_srl_num_list: scannedCodes, // Now transformed correctly
      call_mode,
    };
  
  
    processItemSrl(itemPayload)
      .then(() => {
        setIsLoading(false);
        setIsSuccessModalVisible(true);
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert(
          'Item Unable to add',
          `Failed to add: ${error.response?.data?.detail || error.message}`
        );
      });
  };
  
  
  useFocusEffect(
    React.useCallback(() => {
      if (params.scannedCodes) {
        try {
          const parsedCodes = JSON.parse(params.scannedCodes);
          if (Array.isArray(parsedCodes)) {
            const formattedCodes = parsedCodes.map(code => {
              const { item_serial_num, ...rest } = code;
            
              // Extract additional fields
              const additionalFields = Object.fromEntries(
                Object.entries(rest).filter(([key]) => !['MFG. Serial No.', 'Remarks', 'Bin Id'].includes(key))
              );
            
              // Format additional_fields_value as "AF:Key1|Value1|AF:Key2|Value2..."
              const additional_fields_value = Object.entries(additionalFields)
                .map(([key, value]) => `AF:${key}|${value}`)
                .join('|');
            
              return {
                item_serial_num: item_serial_num || '',
                mfg_item_serial_num: rest['MFG. Serial No.'] || '',
                remarks: rest['Remarks'] || '',
                bin_id: binNumber,
                additional_fields: additionalFields,
                additional_fields_value,
              };
            });
            
  
            setScannedCodes(formattedCodes);
          } else {
            setScannedCodes([]);
          }
        } catch (error) {
          console.error('Failed to parse scanned codes:', error);
          setScannedCodes([]);
        }
      } else {
        setScannedCodes([]);
      }
    }, [params.scannedCodes])
  );
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderComponent headerTitle="Register Inventory" onBackPress={handleBackPress} />
      <GradientBackground>
      {isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        
        <Container>
          <DropdownPicker
            label="Inventory"
            data={claimItem}
            value={item}
            setValue={setItem}
            error={errors.item}
          />

          {/* <AmountInput
            claimAmount={amount}
            value={amount}
            label="Enter Quantity of Cylinder"
            setClaimAmount={setAmount}
            error={errors.amount}
          /> */}

          <Input label="Enter Quantity of Cylinder" value={amount} onChangeText={setAmount} error={errors.amount} />

          {scannedCodes.length > 0 && 
          <Input
            label="Enter Mfg. Batch Number"
            placeholder="Enter Mfg. Batch Number"
            value={mfgBatch}
            onChangeText={(text) => setMfgBatch(text)}
          />
        }


{scannedCodes.length > 0 && (
  <ScannedCodesContainer>
    <ScannedTitle>Scanned Codes:</ScannedTitle>
    <ScannedCodeCardContainer>
    {scannedCodes.map((code, index) => (
      
      <ScannedCodeCard key={index}>
        <ScannedCodeText><BoldText>Serial:</BoldText> {code.item_serial_num}</ScannedCodeText>
        <ScannedCodeText><BoldText>MFG. Serial No.:</BoldText> {code.mfg_item_serial_num}</ScannedCodeText>
        <ScannedCodeText><BoldText>Remarks:</BoldText> {code.remarks}</ScannedCodeText>
        <ScannedCodeText><BoldText>Bin Id:</BoldText> {code.bin_id}</ScannedCodeText>
      </ScannedCodeCard>
      
    ))}
    </ScannedCodeCardContainer>
  </ScannedCodesContainer>
)}


          <SubmitButton
            label={scannedCodes.length > 0 ? "Submit Item" : "Scan QR"}
            onPress={scannedCodes.length > 0 ? addItemInventory : validate}
            bgColor={colors.primary}
            textColor="white"
          />
        </Container>
        
      )}
      </GradientBackground>
      <SuccessModal 
        visible={isSuccessModalVisible} 
        onClose={() => {
          setIsSuccessModalVisible(false);
          navigation.goBack();
        }} 
      />
    </SafeAreaView>
  );
};

export default AddInventoryItem;
