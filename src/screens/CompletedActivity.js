import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import HeaderComponent from '../components/HeaderComponent';
import ModalComponent from '../components/ModalComponent';
import { getActivityList } from '../services/productServices';

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
  background-color: ${(props) => props.bgColor || '#28a745'};
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
  justify-content: center;
  margin-top: 10px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${(props) => props.bgColor || '#007bff'};
  width: ${(props) => (props.fullWidth ? `${width * 0.85}px` : `${width * 0.4}px`)};
  padding: 10px;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
`;

// Main Screen Component
const ActivityScreen = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetchCompletedActivities();
    }, []);

    const fetchCompletedActivities = async () => {
        try {
            const res = await getActivityList();
            const completedActivities = (res?.data?.a_list || []).filter(
                (activity) => activity.status === 'COMPLETED' || (activity.no_completed !== 0 && activity.no_pending == 0 && activity.no_hold == 0)
            );
            setActivities(completedActivities);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const handleViewDetails = (activity) => {
        setSelectedActivity(activity);
        setModalVisible(true);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <GradientBackground>
            <HeaderComponent
                headerTitle="Completed Activities"
                onBackPress={handleBackPress}
            />

            <Container>
                {activities.map((activity) => (
                    <Card key={activity.activity_id}>
                        <Row>
                            <BoldText>{activity.ref_num}</BoldText>
                            <StatusBadge>
                                <StatusText>COMPLETED</StatusText>
                            </StatusBadge>
                        </Row>
                        <SubText>Due Date: {activity.due_date || 'N/A'}</SubText>
                        <SubText>Sale Order: {activity.sale_order_no || 'None'}</SubText>

                        <ButtonRow>
                            <ActionButton
                                bgColor="#4285f4"
                                fullWidth
                                onPress={() => handleViewDetails(activity)}
                            >
                                <ButtonText>View Details</ButtonText>
                            </ActionButton>
                        </ButtonRow>
                    </Card>
                ))}
            </Container>

            {selectedActivity && (
                <ModalComponent
                    isVisible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    activityDetails={{
                        order: selectedActivity.ref_num,
                        plannedStart: 'Planned Start Date Placeholder',
                        actualStart: 'Actual Start Date Placeholder',
                        plannedDuration: 'Planned Duration Placeholder',
                        actualDuration: 'Actual Duration Placeholder',
                    }}
                />
            )}
        </GradientBackground>
    );
};

export default ActivityScreen;
