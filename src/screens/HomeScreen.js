import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import InfoCard from '../components/InfoCard';
import { AppContext } from '../../context/AppContext';
import { getCompanyInfo } from '../services/authServices';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { getActivityList } from '../services/productServices';

const { width } = Dimensions.get('window');

const Container = styled.View`
  /* flex: 1; */
  background-color: #f5f5f5;
`;

const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#c2e9fb', '#ffdde1'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  /* flex: 1; */
  align-items: center;
  height: 100%;
`;

const LogoContainer = styled.View`
  width: ${width * 0.25}px;
  height: ${width * 0.25}px;
  background-color: #ffffff;
  border-radius: ${width * 0.25}px;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  margin-top: 5%;
`;

const Logo = styled.Image.attrs(() => ({
  resizeMode: 'contain',
}))`
  width: 95%;
  height: 95%;
  border-radius: ${width * 0.35}px;
`;

const CompanyName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin: 10px 0;
  color: #333333;
`;

const SubHeader = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
  color: #555555;
`;

const ActivityContainer = styled.View`
  width: 95%;
  padding: 20px;
  background-color: white;
  border-radius: 20px 20px 0px 0px;
`;

const ActivityRow = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 16px;
  background-color: #ffffff;
  margin-bottom: 5px;
  border-radius: 10px;
  elevation: 2;
  border: 1px solid #353535;
`;

const ActivityText = styled.Text`
  font-size: 14px;
  color: #333333;
`;

const StatusText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #e63946;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-bottom: 10px;
  
`;

const HomePage = () => {
  const router = useRouter();
  const { userToken } = useContext(AppContext);
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [total, setTotal] = useState(0);
  const [review, setReview] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);
  const [overdue, setOverdue] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchActivityDetails();
    getCompanyInfo()
      .then((res) => {
        setCompany(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  

  // const activities = [
  //   { id: '1', reference: 'PROJECT-2021-00002', status: 'IN PROGRESS' },
  //   { id: '2', reference: 'PROJECT-2023-00004', status: 'IN PROGRESS' },
  //   { id: '3', reference: 'PTAX-2020-00005', status: 'IN PROGRESS' },
  //   { id: '4', reference: 'PROJECT-2021-00002', status: 'IN PROGRESS' },
  //   { id: '5', reference: 'PROJECT-2023-00004', status: 'IN PROGRESS' },
  //   { id: '6', reference: 'PTAX-2020-00005', status: 'IN PROGRESS' },
  //   { id: '7', reference: 'PROJECT-2021-00002', status: 'IN PROGRESS' },
  //   { id: '8', reference: 'PROJECT-2023-00004', status: 'IN PROGRESS' },
  //   { id: '9', reference: 'PTAX-2020-00005', status: 'IN PROGRESS' },
  // ];


      
  
      const fetchActivityDetails = () => {
          getActivityList().then(res => {
            setActivities(res?.data?.a_list)
            setTotal(res?.data?.project_count)
            setReview(res?.data?.review_count)
            setCompleted(res?.data?.completed_count)
            setPending(res?.data?.pending_count)
            setOverdue(res?.data?.over_due_count)
              // console.log('Response Data==', res.data);
          }).catch((res) => {
              console.log(res);
          });
      };

  // Example functions for InfoCard clicks
  const handleProjectClick = () => {
    router.push({
      pathname: 'ActivityList' 
    });
  };
  const handleReviewsClick = () => alert('Reviews Clicked');
  const handleCompletedClick = () => {
    router.push({
      pathname: 'ActivityCompleted' 
    });
  };
  const handlePendingClick = () => {
    router.push('activity');
  };
  const handleOverdueClick = () => alert('Overdue Activities Clicked');

  // console.log('Activity List======',activities)

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#c2e9fb" />
      <GradientBackground>
        <LogoContainer>
          <Logo source={{ uri: company.image || 'https://home.atomwalk.com/static/media/Atom_walk_logo-removebg-preview.21661b59140f92dd7ced.png' }} />
        </LogoContainer>
        <CompanyName>{company.name || 'Atomwalk Technologies'}</CompanyName>
        <SubHeader>Welcome to Atomwalk Office!</SubHeader>

        {/* Cards Layout */}
        <Row>
          <InfoCard number={total} label="Project Activities" gradientColors={['#007bff', '#00c6ff']} onPress={handleProjectClick} />
          <InfoCard number={review} label="Reviews" gradientColors={['#6dd5ed', '#2193b0']} onPress={handleReviewsClick} />
        </Row>

        <Row>
          <InfoCard number={completed} label="Completed Activities" gradientColors={['#38ef7d', '#11998e']} onPress={handleCompletedClick} />
          <InfoCard number={pending} label="Pending/On Hold" gradientColors={['#f09819', '#ff512f']} onPress={handlePendingClick} />
          <InfoCard number={overdue} label="Over Due Activities" gradientColors={['#e52d27', '#b31217']} onPress={handleOverdueClick} />
        </Row>

        {/* Scrollable Activity List */}
        <ActivityContainer>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#454545' }}>Activity Reference</Text>
          <FlatList
            data={activities}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ActivityRow onPress={() => alert(`You clicked on ${item.ref_num}`)}>
                <ActivityText>{item.ref_num}</ActivityText>
                <StatusText>{item.status}</StatusText>
              </ActivityRow>
            )}
            style={{ maxHeight: 200 }}
          />
        </ActivityContainer>
      </GradientBackground>
    </Container>
  );
};

export default HomePage;
