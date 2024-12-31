import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, Dimensions, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from 'expo-router';
import HeaderComponent from '../components/HeaderComponent';
import ModalComponent from '../components/ModalComponent';
import DropdownPicker from '../components/DropdownPicker';
import { getManagerActivityList } from '../services/productServices';
import Loader from '../components/old_components/Loader';
import EmptyMessage from '../components/EmptyMessage';

const { width } = Dimensions.get('window');

// Styled Components
const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#ffd6b3', '#f7dce0'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  align-items: center;
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
  margin-bottom: 5px;
  width: 90%;
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

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 10px;
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
  margin: 10px 0;
  width: 95%;
`;

const ClearFilterButton = styled.TouchableOpacity`
  background-color: #ffc107;
  padding: 8px 15px;
  border-radius: 8px;
  width: 50%;
  align-self: flex-end;
`;

const ClearFilterText = styled.Text`
  color: #353535;
  font-size: 14px;
  font-weight: bold;
`;

const LoadMoreButton = styled.TouchableOpacity`
  margin: 15px 0;
  padding: 10px;
  background-color: #28a745;
  border-radius: 5px;
`;

const LoadMoreButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  text-align: center;
`;

const ManagerActivityScreen = ({ activityType = 'PROJECT' }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 20;

  const dropdownData = useMemo(
    () =>
      activities
        .filter(({ order_ref_num }) => order_ref_num)
        .map(({ order_ref_num }) => ({ label: order_ref_num, value: order_ref_num })),
    [activities]
  );

  

  const fetchActivityDetails = React.useCallback(async (type) => {
    try {
      setLoading(true);
      const response = await getManagerActivityList({ call_mode: type });
      const fetchedActivities = response?.data?.activity_list || [];
      const currentDate = new Date();
  
      const updatedActivities = fetchedActivities.map((activity) => {
        const dueDate = new Date(activity.due_date);
        return {
          ...activity,
          status:
            dueDate < currentDate && activity.status === 'IN PROGRESS'
              ? 'OVER-DUE'
              : activity.no_hold === 0 && activity.no_pending === 0
              ? 'COMPLETED'
              : activity.status,
        };
      });
  
      setActivities(updatedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchActivityDetails(activityType);
      return () => setActivities([]); // Clear activities when the screen loses focus
    }, [activityType, fetchActivityDetails])
  );

  const filteredActivities = useMemo(
    () => (filterValue ? activities.filter((act) => act.order_ref_num === filterValue) : activities),
    [filterValue, activities]
  );

  const paginatedActivities = useMemo(
    () => {
      const start = 0;
      const end = currentPage * ITEMS_PER_PAGE;
      return filteredActivities.slice(start, end);
    },
    [filteredActivities, currentPage]
  );

  const handleBackPress = () => {
    setActivities([]); // Clear the activity list
    setFilterValue('');
    navigation.goBack();
  };

  const loadMoreActivities = () => setCurrentPage((prev) => prev + 1);

  const renderActivity = ({ item }) => (
    <Card>
      <Row>
        <BoldText>{item.order_ref_num || item.project_code}</BoldText>
      </Row>
      <BoldText>{item.user_name}</BoldText>
      <SubText>{item.activity_name}</SubText>
      <SubText>Planned Start: {item.start_date || 'N/A'}</SubText>
      <SubText>Actual Start: {item.actual_start_date || 'N/A'}</SubText>
      <ButtonRow>
        <ActionButton fullWidth onPress={() => handleViewDetails(item)}>
          <ButtonText>View Details</ButtonText>
        </ActionButton>
      </ButtonRow>
    </Card>
  );

  return (
    <GradientBackground>
      <HeaderComponent headerTitle="Manager Activities" onBackPress={handleBackPress} />
      <FilterContainer>
        <DropdownPicker
          label="Filter by Order Num"
          data={dropdownData}
          value={filterValue}
          setValue={setFilterValue}
        />
        {filterValue && (
          <ClearFilterButton onPress={() => setFilterValue('')}>
            <ClearFilterText>Clear Filter</ClearFilterText>
          </ClearFilterButton>
        )}
      </FilterContainer>
      {loading ? (
        <Loader visible={loading} />
      ) : filteredActivities.length === 0 ? (
        <EmptyMessage data="activity" />
      ) : (
        <>
          <FlatList
            data={paginatedActivities}
            keyExtractor={(item, index) => `${item.order_ref_num || item.project_code}_${index}`}
            renderItem={renderActivity}
            contentContainerStyle={{ padding: 10 }}
          />
          {filteredActivities.length > paginatedActivities.length && (
            <LoadMoreButton onPress={loadMoreActivities}>
              <LoadMoreButtonText>Load More</LoadMoreButtonText>
            </LoadMoreButton>
          )}
        </>
      )}
      {isModalVisible && selectedActivity && (
        <ModalComponent
          isVisible={isModalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedActivity(null);
          }}
          activityDetails={{
            activity: selectedActivity?.activity_name || 'N/A',
            order: selectedActivity?.order_ref_num || 'N/A',
            user: selectedActivity?.user_name || 'N/A',
            plannedStart: selectedActivity?.start_date || 'N/A',
            actualStart: selectedActivity?.actual_start_date || 'N/A',
            plannedDuration: selectedActivity?.duration || 'N/A',
          }}
        />
      )}
    </GradientBackground>
  );
};

export default ManagerActivityScreen;
