import React from 'react';
import styled from 'styled-components/native';
import { Dropdown } from 'react-native-element-dropdown';
import { Text } from 'react-native';
import {colors} from '../Styles/appStyle';

const FieldContainer = styled.View`
  margin-bottom: 5px;
  margin-top: 5px;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const PickerContainer = styled.View`
  border-width: 1px;
  color: black;
  border-color: #454545;
  border-radius: 5px;
`;

const DropdownPicker = ({ error, label, data, value, setValue }) => {
  console.log('drop',data)
  return (
    <FieldContainer>
      {/* <Label>{label}</Label> */}
      <PickerContainer>
        <Dropdown
          data={(data || []).map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          labelField="label"
          valueField="value"
          placeholder={`Select ${label}`}
          value={value}
          onChange={(item) => setValue(item.value)}
          style={{
            padding: 10,
          }}
          placeholderStyle={{
            color: '#454545',
            fontSize: 16,
          }}
          selectedTextStyle={{
            fontSize: 16,
          }}
        />
      </PickerContainer>
      {error && (
        <Text style={{marginTop: 7, color: colors.red, fontSize: 12}}>
          {error}
        </Text>
      )}
    </FieldContainer>
  );
};

export default DropdownPicker;
