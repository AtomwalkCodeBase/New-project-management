import React from 'react';
import styled from 'styled-components/native';
import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EmptyMessageContainer = styled.View`
  width: 80%;
  min-height: 633px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: transparent;
`;

const IconContainer = styled.View`
  margin-bottom: 0px;
`;

const MessageText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const SubText = styled.Text`
  font-size: 14px;
  color: #888;
  text-align: center;
`;

const EmptyMessage = (res) => {
  return (
    <EmptyMessageContainer>
      <IconContainer>
        <MaterialCommunityIcons name="file-remove-outline" size={96} color="#ff8833" />
      </IconContainer>
      <MessageText>Nothing to Display</MessageText>
      <SubText>There are no {res.data} data found.</SubText>
      
    </EmptyMessageContainer>
  );
};

export default EmptyMessage;
