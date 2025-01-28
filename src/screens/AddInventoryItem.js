import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Keyboard, SafeAreaView, Dimensions, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenseItem, getInventoryItem } from '../services/productServices';
import HeaderComponent from '../components/HeaderComponent';
import DropdownPicker from '../components/DropdownPicker';
import AmountInput from '../components/AmountInput';
import SubmitButton from '../components/SubmitButton';
import Loader from '../components/old_components/Loader';
import styled from 'styled-components/native';
import { colors } from '../Styles/appStyle';

const { width } = Dimensions.get('window');

const Container = styled.ScrollView`
  flex: 1;
  padding: 10px;
  background-color: #fff;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${(props) => props.bgColor || '#007bff'};
  width: ${(props) => (props.fullWidth ? `${width * 0.85}px` : `${width * 0.4}px`)};
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
`;

const AddInventoryItem = () => {
  const [amount, setAmount] = useState("");
  const [claimItem, setClaimItem] = useState([]);
  const [item, setItem] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const call_mode = 'ITEM_NEW';

  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();

  console.log('Item hhje===', item);

  useEffect(() => {
    fetchItemList();
    if (params?.quantyti) {
      setAmount(params?.quantyti);
      setItem(params?.item);
    }
  }, [params?.quantyti]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    fetchItemList();
  }, []);

  const fetchItemList = async () => {
    setIsLoading(true);
    try {
      const response = await getInventoryItem();
      const formattedData = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      if (item) {
        const filteredData = formattedData.filter((entry) => entry.value === item);
        setClaimItem(filteredData.length > 0 ? filteredData : formattedData);
      } else {
        setClaimItem(formattedData);
      }

      console.log('Response Item==', response.data);
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
    console.log('Quantity to scan:', amount);
    router.push({
      pathname: 'QrScanner',
      params: { quantity: amount, item: item },
    });
  };

  console.log('Sacn cd==',scannedCodes)

  const addItemInventory = (res) => {
    // setIsLoading(true); // Show loader before submission
    const itemPayload = {
      item_id: `${item}`,
      in_quantity: amount,
      mfg_batch_number: '0001',
      item_srl_num_list: scannedCodes,
      call_mode,
    };

    console.log('Payload',itemPayload)

    // postEmpLeave(leavePayload)
    //   .then(() => {
    //     setIsLoading(false);
    //     setIsSuccessModalVisible(true);
    //   })
    //   .catch(() => {
    //     setIsLoading(false); // Hide loader on error
    //     Alert.alert(
    //       'Leave Application Failed',
    //       'Please verify the selected dates. Either the dates are already approved or fall on a holiday.'
    //     );
    //   });
  };



  useFocusEffect(
    React.useCallback(() => {
      if (params.scannedCodes) {
        try {
          const parsedCodes = JSON.parse(params.scannedCodes);
          setScannedCodes(Array.isArray(parsedCodes) ? parsedCodes : []);
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

          <AmountInput
            claimAmount={amount}
            value={amount}
            label="Enter Quantity"
            setClaimAmount={setAmount}
          />
          {/* <ActionButton bgColor="#4285f4" onPress={validate}>
            <ButtonText>Scan QR</ButtonText>
          </ActionButton>
           */}

          {scannedCodes.length > 0 && (
            <Container>
              <Text>Scanned Codes:</Text>
              {scannedCodes.map((code, index) => (
                <Text key={index}>{`Serial: ${code.item_serial_num}, MFG: ${code.mfg_item_serial_num}, Remarks: ${code.remarks}`}</Text>
              ))}
            </Container>
          )}

          <SubmitButton
            label={scannedCodes.length > 0 ? "Submit Claim" : "Scan QR"}
            onPress={scannedCodes.length > 0 ? addItemInventory : validate}
            bgColor={colors.primary}
            textColor="white"
          />

          {/* <SubmitButton
            label="Submit Claim"
            onPress={validate}
            bgColor={colors.primary}
            textColor="white"
          /> */}
          
          
        </Container>
      )}
    </SafeAreaView>
  );
};

export default AddInventoryItem;
