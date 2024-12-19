import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import HeaderComponent from '../components/HeaderComponent';

// Screen Dimensions
const { width } = Dimensions.get('window');
const GradientBackground = styled(LinearGradient).attrs({
    colors: ['#c2e9fb', '#ffdde1'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
})`
    align-items: center;
    height: 100%;
`;

// Styled Components
const Container = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    showsHorizontalScrollIndicator: false,
})`
  flex: 1;
  padding: 20px 10px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 20px;
  padding: 15px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BoldText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const SubText = styled.Text`
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
`;

const StatusBadge = styled.View`
  background-color: ${(props) => props.bgColor || '#ffca28'};
  border-radius: 5px;
  padding: 4px 8px;
`;

const StatusText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #333;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-top: 10px;
  align-items: center;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${(props) => props.bgColor || '#007bff'};
  width: ${(props) => (props.fullWidth ? `${width * 0.85}px` : `${width * 0.4}px`)};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;


const ButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
`;

// Main Screen Component
const CompletedActivity = () => {
    const navigation = useNavigation();
      const router = useRouter();
    const activities = [
      { id: 4, title: 'Packaging and Inspection', project: 'Lab Management Project - 1', date: 'Nov. 8, 2020', status: 'COMPLETED' },
      { id: 5, title: 'Packaging and Inspection', project: 'Lab Management Project - 1', date: 'Nov. 8, 2020', status: 'COMPLETED' },
  ];

  const handleInventoryClick = (id) => {
    router.push({
      pathname: 'InventoryData',
      // params: id,
    });
    console.log('Dat====+',id)
  };

  const getBadgeColor = (status) => {
      switch (status) {
          case 'COMPLETED':
              return '#28a745';
          case 'OVER-DUE':
              return '#ff4d4d';
          default:
              return '#ffca28';
      }
  };
    const handleBackPress = () => {
        navigation.goBack();
    };


    return (
      <GradientBackground>
      <HeaderComponent headerTitle="Activities Completed" onBackPress={handleBackPress}/>

      <Container>
          {activities.map((activity) => (
              <Card key={activity.id}>
                  <Row>
                      <BoldText>{activity.title}</BoldText>
                      <StatusBadge bgColor={getBadgeColor(activity.status)}>
                          <StatusText>{activity.status}</StatusText>
                      </StatusBadge>
                  </Row>
                  <SubText>{activity.project}</SubText>
                  <SubText>{activity.date}</SubText>

                  <ButtonRow>
                      {activity.status !== 'COMPLETED' && activity.status !== 'OVER-DUE' && (
                          <>
                              <ActionButton bgColor="#28a745" onPress={() => alert('Mark as Completed')}>
                                  <ButtonText>Mark as Completed</ButtonText>
                              </ActionButton>
                              <ActionButton bgColor="#f77f00" onPress={() => alert('QC Data Update')}>
                                  <ButtonText>QC Data Update</ButtonText>
                              </ActionButton>
                              <ActionButton bgColor="#4285f4" onPress={() => handleInventoryClick(activity?.id)}>
                                  <ButtonText>Inventory Update</ButtonText>
                              </ActionButton>
                          </>
                      )}
                      <ActionButton
                          bgColor="#4285f4"
                          fullWidth={activity.status === 'COMPLETED' || activity.status === 'OVER-DUE'}
                          onPress={() => alert('View Details')}
                      >
                          <ButtonText>View Details</ButtonText>
                      </ActionButton>
                  </ButtonRow>
              </Card>
          ))}
      </Container>
  </GradientBackground>
    );
};

export default CompletedActivity;
