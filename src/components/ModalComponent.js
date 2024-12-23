import React from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';


const ModalComponent = ({ isVisible, onClose, activityDetails }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <ModalContainer>
        <ModalContent>
          {/* Header */}
          <ModalTitle>{activityDetails.order}</ModalTitle>

          {/* Activity Details */}
          {activityDetails ? (
            <>
              <DetailText>
                <BoldText>Project for Order:</BoldText> {activityDetails.order}
              </DetailText>
              <DetailText>
                <BoldText>Planned Start Date:</BoldText> {activityDetails.plannedStart}
              </DetailText>
              <DetailText>
                <BoldText>Actual Start Date:</BoldText> {activityDetails.actualStart}
              </DetailText>
              <DetailText>
                <BoldText>Planned Duration:</BoldText> {activityDetails.plannedDuration} Days
              </DetailText>
              <DetailText>
                <BoldText>Actual Duration:</BoldText> {activityDetails.actualDuration} Days
              </DetailText>
            </>
          ) : (
            <Text>No details available.</Text>
          )}

          {/* Close Button */}
          <CancelButton onPress={onClose}>
            <ButtonText>Back</ButtonText>
          </CancelButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

// Styled Components for Modal
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  elevation: 5;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
`;

const DetailText = styled.Text`
  font-size: 14px;
  margin-bottom: 5px;
`;

const BoldText = styled.Text`
  font-weight: bold;
  font-size: 14px;
`;

const CancelButton = styled.TouchableOpacity`
  background-color: #4491FE;
  padding: 10px;
  border-radius: 8px;
  margin-top: 20px;
  align-self: stretch;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
`;

export default ModalComponent;
