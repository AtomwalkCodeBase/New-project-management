import React, { useEffect, useState } from 'react';
import { FlatList, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import HeaderComponent from '../components/HeaderComponent';
import ModalComponent from '../components/ModalComponent';
import DropdownPicker from '../components/DropdownPicker';
import { getActivityList } from '../services/productServices';

const { width } = Dimensions.get('window');

const GradientBackground = styled(LinearGradient).attrs({
    colors: ['#c2e9fb', '#ffdde1'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
})`
    align-items: center;
    height: 100%;
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
    margin-bottom: 2px;
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

const FilterContainer = styled.View`
    margin-top: 5px;
    width: 95%;
`;

const ClearFilterContainer = styled.View`
    margin-top: 5px;
    width: 100%;
    align-items: flex-end;
    justify-content: center;
`;

const ClearFilterButton = styled.TouchableOpacity`
    background-color: #ffc107;
    padding: 8px 15px;
    border-radius: 8px;
    border: 1px solid black;
    width: 50%;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
`;

const ClearFilterText = styled.Text`
    color: #353535;
    font-size: 14px;
    font-weight: bold;
`;

const ActivityScreen = (props) => {
    const navigation = useNavigation();
    const router = useRouter();
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const activityType = props.data;
    const project = props.id;

    useEffect(() => {
        fetchActivityDetails();
    }, []);

    useEffect(() => {
        if (project) {
            setFilterValue(project);
        } else {
            applyFilter();
        }
    }, [project, activities]);

    useEffect(() => {
        applyFilter();
    }, [filterValue, activities]);

    const fetchActivityDetails = async () => {
        try {
            const res = await getActivityList();
            let fetchedActivities = res?.data?.a_list || [];
    
            // Helper function to parse 'DD-MMM-YYYY' into a Date object
            const parseDate = (dateStr) => {
                if (!dateStr) return null; // Return null if dateStr is undefined or null
                const [day, month, year] = dateStr.split('-');
                const months = {
                    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
                };
                return new Date(year, months[month], day);
            };
    
            const currentDate = new Date(); // Current date as a Date object
    
            // Update the activities based on due_date, status, and conditions
            fetchedActivities = fetchedActivities.map((activity) => {
                const dueDate = parseDate(activity.due_date); // Parse due_date to Date object
    
                if (dueDate && dueDate < currentDate && activity.status === 'IN PROGRESS') {
                    // If due_date is valid and overdue, update status to OVER-DUE
                    return {
                        ...activity,
                        status: 'OVER-DUE',
                    };
                } else if (activity.no_hold === 0 && activity.no_pending === 0) {
                    // If no holds or pending items, update status to COMPLETED
                    return {
                        ...activity,
                        status: 'COMPLETED',
                    };
                }
    
                return activity; // Return activity as-is if no condition matches
            });
    
            // Filter activities if needed
            if (activityType === 'PENDING') {
                fetchedActivities = fetchedActivities.filter(
                    (activity) => activity.status !== 'COMPLETED' && activity.no_pending !== 0
                );
            }
    
            setActivities(fetchedActivities);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };
    
    
    
    

    

    const applyFilter = () => {
        if (!filterValue) {
            setFilteredActivities(activities);
        } else {
            const filtered = activities.filter(
                (activity) => activity.ref_num === filterValue
            );
            setFilteredActivities(filtered);
        }
    };

    const getUniqueRefNums = () => {
        const uniqueRefNums = activities.reduce((acc, curr) => {
            if (curr.ref_num && !acc.includes(curr.ref_num)) {
                acc.push(curr.ref_num);
            }
            return acc;
        }, []);
        return uniqueRefNums.map((ref_num) => ({ label: ref_num, value: ref_num }));
    };

    const handleCompleteClick = (id) => {
        router.push({
            pathname: 'MarkCompleteScreen',
            params: { ref_num: id },
        });
    };

    const handleInventoryClick = (id) => {
        router.push({
            pathname: 'InventoryData',
            params: { ref_num: id },
        });
    };

    const handleQcClick = (id) => {
        router.push({
            pathname: 'QcData',
            params: { ref_num: id },
        });
    };

    const handleViewDetails = (activity) => {
        setSelectedActivity(activity);
        setModalVisible(true);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const getBadgeColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return '#28a745'; // Green for completed
            case 'OVER-DUE':
                return '#ff4d4d'; // Red for overdue
            case 'IN PROGRESS':
                return '#ffc107'; // Yellow for in progress
            default:
                return '#6c757d'; // Gray for unknown or default status
        }
    };
    

    const dropdownData = getUniqueRefNums();

    console.log('Activity List---',activities)

    const renderItem = ({ item: activity }) => (
        <Card>
            <Row>
                <BoldText>{activity.sale_order_no || activity.ref_num}</BoldText>
                <StatusBadge bgColor={getBadgeColor(activity.status)}>
                <StatusText>{activity.status}</StatusText>
            </StatusBadge>
            </Row>
            <SubText>{activity.ref_num || 'None'}</SubText>
            <SubText>{activity.activity_name || 'None'}</SubText>
            <SubText>Due Date: {activity.due_date || 'N/A'}</SubText>

            <ButtonRow>
                {activity.status !== 'COMPLETED' && (
                    <>
                        <ActionButton
                            bgColor="#28a745"
                            // onPress={() => alert('Mark as Completed')}
                            onPress={() => handleCompleteClick(activity.activity_id)}
                        >
                            <ButtonText>Mark as Completed</ButtonText>
                        </ActionButton>
                        <ActionButton
                            bgColor="#f77f00"
                            onPress={() => handleQcClick(activity.activity_id)}
                        >
                            <ButtonText>QC Data Update</ButtonText>
                        </ActionButton>
                        <ActionButton
                            bgColor="#4285f4"
                            onPress={() => handleInventoryClick(activity.activity_id)}
                        >
                            <ButtonText>Inventory Update</ButtonText>
                        </ActionButton>
                    </>
                )}
                <ActionButton
                    bgColor="#4285f4"
                    fullWidth={
                        activity.status === 'COMPLETED'
                    }
                    onPress={() => handleViewDetails(activity)}
                >
                    <ButtonText>View Details</ButtonText>
                </ActionButton>
            </ButtonRow>
        </Card>
    );

    return (
        <GradientBackground>
            <HeaderComponent
                headerTitle={activityType === 'PENDING' ? 'Pending Activities' : 'All Activities'}
                onBackPress={handleBackPress}
            />

            <FilterContainer>
                <DropdownPicker
                    label="Filter by Project Num"
                    data={dropdownData}
                    value={filterValue}
                    setValue={setFilterValue}
                />

                {filterValue && (
                    <ClearFilterContainer>
                        <ClearFilterButton onPress={() => setFilterValue('')}>
                            <ClearFilterText>Clear Filter</ClearFilterText>
                        </ClearFilterButton>
                    </ClearFilterContainer>
                )}
            </FilterContainer>

            <FlatList
                data={filteredActivities}
                keyExtractor={(item) => item.activity_id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 10 }}
                showsVerticalScrollIndicator={false}
            />

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
