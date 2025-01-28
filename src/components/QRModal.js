import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import QRCode from 'react-native-qrcode-svg';
import { SvgXml } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Styled Components
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const QRContainer = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-radius: 10px;
  elevation: 10;
  position: relative;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  background-color: #ff5c5c;
  border-radius: 15px;
`;

const CloseButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const DownloadButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  border-radius: 10px;
`;

const DownloadButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const QRModal = ({ isVisible, onClose, qrValue }) => {
  let qrRef = null;

  const handleDownload = async () => {
    if (qrRef) {
      const svgXml = qrRef.toString(); // Get SVG as XML
      const fileUri = `${FileSystem.cacheDirectory}qr-code.svg`;
      await FileSystem.writeAsStringAsync(fileUri, svgXml, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        alert('Sharing is not available on this device.');
      }
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <ModalContainer>
        <QRContainer>
          <CloseButton onPress={onClose}>
            <CloseButtonText>X</CloseButtonText>
          </CloseButton>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Your QR Code</Text>
          <QRCode
            value={qrValue || 'No Value Provided'}
            size={200}
            getRef={(ref) => (qrRef = ref)}
          />
          {/* <DownloadButton onPress={handleDownload}>
            <DownloadButtonText>Share</DownloadButtonText>
          </DownloadButton> */}
        </QRContainer>
      </ModalContainer>
    </Modal>
  );
};

export default QRModal;