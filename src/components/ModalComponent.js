import React from 'react';
import { Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

const ModalComponent = ({ isVisible, onClose, activityDetails }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <ModalContainer>
          <TouchableWithoutFeedback>
            <ModalContent>
              {/* Close Button at Top Right */}
              <CloseButton onPress={onClose}>
                <CloseButtonText>&times;</CloseButtonText>
              </CloseButton>

              {/* Header */}
              <ModalTitle>{activityDetails.order || activityDetails.activity}</ModalTitle>

              {/* Activity Details */}
              {activityDetails ? (
                <>
                  {activityDetails.activity && (
                    <DetailText>
                      <BoldText>Activity Name:</BoldText> {activityDetails.activity}
                    </DetailText>
                  )}
                  {activityDetails.project_num && (
                    <DetailText>
                      <BoldText>Project Num.:</BoldText> {activityDetails.project_num}
                    </DetailText>
                  )}
                  {activityDetails.user && (
                    <DetailText>
                      <BoldText>User Name:</BoldText> {activityDetails.user}
                    </DetailText>
                  )}
                  {activityDetails.plannedStart && (
                    <DetailText>
                      <BoldText>Planned Start Date:</BoldText> {activityDetails.plannedStart}
                    </DetailText>
                  )}
                  {activityDetails.actualStart && (
                    <DetailText>
                      <BoldText>Actual Start Date:</BoldText> {activityDetails.actualStart}
                    </DetailText>
                  )}
                  {activityDetails.plannedDuration && (
                    <DetailText>
                      <BoldText>Planned Duration:</BoldText> {activityDetails.plannedDuration} Days
                    </DetailText>
                  )}
                  {activityDetails.actualDuration && (
                    <DetailText>
                      <BoldText>Actual Duration:</BoldText> {activityDetails.actualDuration} Days
                    </DetailText>
                  )}
                </>
              ) : (
                <Text>No details available.</Text>
              )}
            </ModalContent>
          </TouchableWithoutFeedback>
        </ModalContainer>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Styled Components for Modal
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ModalContent = styled.View`
  background-color: #ffffff;
  padding: 25px;
  border-radius: 15px;
  width: 85%;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 6px;
  elevation: 8;
  position: relative;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: transparent;
`;

const CloseButtonText = styled.Text`
  font-size: 24px;
  color: #333333;
  font-weight: bold;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 20px;
  text-align: center;
`;

const DetailText = styled.Text`
  font-size: 16px;
  margin-bottom: 8px;
  color: #555555;
`;

const BoldText = styled.Text`
  font-weight: 700;
  font-size: 16px;
  color: #222222;
`;

export default ModalComponent;
