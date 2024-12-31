import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import InfoCard from '../components/InfoCard';
import { AppContext } from '../../context/AppContext';
import { getCompanyInfo, getProfileInfo } from '../services/authServices';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { getActivityList, getManagerActivityList } from '../services/productServices';
import InfoCardSmall from '../components/InfoCardSmall';
import Loader from '../components/old_components/Loader';

const { width } = Dimensions.get('window');

const Container = styled.View`
background-color: #f5f5f5;
`;

const GradientBackground = styled(LinearGradient).attrs({
colors: ['#ffd6b3', '#f7dce0'],
start: { x: 0, y: 0 },
end: { x: 1, y: 1 },
})`
align-items: center;
height: 100%;
`;

const CompanyContainer = styled.View`
display: flex;
flex-direction: row;
width: 100%;
padding: 0px 10px;
background-color: #fb9032;
align-items: center;
gap: 20PX;
`;
const CompanyTextContainer = styled.View`
display: flex;
align-items: flex-start;

`;
const ProfileTextContainer = styled.View`
display: flex;
align-items: center;
padding: 2px;

`;
const LogoContainer = styled.View`
width: ${width * 0.20}px;
height: ${width * 0.20}px;
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
height: 100%;
background-color: white;
border-radius: 20px 20px 0px 0px;
`;

const ActivityRow = styled.View`
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
margin-bottom: 5px;

`;

const ManagerHomePage = () => {
const router = useRouter();
const { userToken } = useContext(AppContext);
const [company, setCompany] = useState({});
const [profile, setProfile] = useState([]);
const [loading, setLoading] = useState(false);
const [activities, setActivities] = useState([]);
const [overdue, setOverdue] = useState(0);
const [total, setToday] = useState(0);
const [completed, setCompleted] = useState(0);
const [dueTotal, setDueToday] = useState(0);
const [future, setFuture] = useState(0);
const [dueTomorow, setDueTomorow] = useState(0);
const [overDueNS, setOverDueNS] = useState(0);
const [overDueAS, setOverDueAS] = useState(0);

useEffect(() => {
    setLoading(true);
    fetchActivityDetails('PROJECT');
    
    getCompanyInfo()
        .then((res) => {
            setCompany(res.data);
        })
        .catch(() => {})
}, []);



const fetchActivityDetails = () => {
    setLoading(true);
    const data = {
        call_mode: 'PROJECT',
      };
    getManagerActivityList(data)
        .then((res) => {
            // console.log('response',res?.data)
            setActivities(res?.data?.activity_list);
            setOverdue(res?.data?.over_due_count);
            setToday(res?.data?.due_today);
            setDueToday(res?.data?.due_today_completed);
            setFuture(res?.data?.future_completed);
            setCompleted(res?.data?.over_due_completed);
            setDueTomorow(res?.data?.due_tomorrow);
            setOverDueNS(res?.data?.due_7_days);
            setOverDueAS(res?.data?.not_due_count);
        })
        .catch((error) => console.log('Error', error))
        .finally(() => setLoading(false));
};

// Example functions for InfoCard clicks
const handleProjectClick = () => {
    router.push({
    pathname: 'ActivityList' 
    });
};

const handleActivityClick = (id) => {
    router.push({
        pathname: 'ActivityList',
        params: { ref_num: id },
    });
};

const handleCardClick = (callType) => {
    router.push({
        pathname: 'activity',
        params: { call_type: callType },
    });
};

const cardColors = [
    ['#FF6F61', '#D32F2F'], // Overdue
    ['#FFA726', '#FB8C00'], // Planned for Today
    ['#66BB6A', '#388E3C'], // Due Today Completed
    ['#AB47BC', '#8E24AA'], // Due Tomorrow
    ['#42A5F5', '#1976D2'], // Due Next 7 Days
    ['#26C6DA', '#0097A7'], // Due After 7 Days
    ['#81C784', '#2E7D32'], // Overdue Completed
    ['#26A69A', '#00796B'], // Future Activity Completed
];



// console.log('Activity List======',activities)

return (
    <Container>
    <StatusBar barStyle="light-content" backgroundColor="rgb(252, 128, 20)" />
    <Loader visible={loading} />
    <GradientBackground>
    <CompanyContainer>
    <LogoContainer>
    <Logo source={{ uri: company.image || 'https://home.atomwalk.com/static/media/Atom_walk_logo-removebg-preview.21661b59140f92dd7ced.png' }} />
    </LogoContainer>
        <CompanyTextContainer>
        <CompanyName>{company.name || 'Atomwalk Technologies'}</CompanyName>
        <SubHeader>Welcome to Atomwalk Office!</SubHeader>
        </CompanyTextContainer>
        
        </CompanyContainer>
        <ProfileTextContainer>
        <CompanyName>Manager Activities</CompanyName>
        
        </ProfileTextContainer>

        <Row>
        <InfoCardSmall number={overdue} label="Over Due" gradientColors={cardColors[0]} onPress={() => handleCardClick('GET_OD')} />
        <InfoCardSmall number={total} label="Planned Today" gradientColors={cardColors[1]} onPress={() => handleCardClick('GET_DT')} />
        <InfoCardSmall number={dueTotal} label="Due Today" gradientColors={cardColors[2]} onPress={() => handleCardClick('GET_DC')} />
    </Row>

    <Row>
        <InfoCardSmall number={dueTomorow} label="Due Tomorrow" gradientColors={cardColors[3]} onPress={() => handleCardClick('GET_D1')} />     
        <InfoCardSmall number={overDueNS} label="Next 7 Days" gradientColors={cardColors[4]} onPress={() => handleCardClick('GET_D7')} />
        <InfoCardSmall number={overDueAS} label="After 7 days" gradientColors={cardColors[5]} onPress={() => handleCardClick('GET_ND')} />   
    </Row>
    <Row>
    <InfoCardSmall number={completed} label="Due Completed" gradientColors={cardColors[7]} onPress={() => handleCardClick('GET_OC')} />
    <InfoCardSmall number={future} label="Future Activity" gradientColors={cardColors[2]} onPress={() => handleCardClick('GET_FC')} />
    </Row>

    {/* Scrollable Activity List */}
    <ActivityContainer>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#454545' }}>My Projects</Text>
        <FlatList
            data={[...activities].reverse()}
            keyExtractor={(item) => item.srl_num}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <ActivityRow onPress={() => handleActivityClick(item.order_ref_num)}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ActivityText style={{ flex: 1, marginRight: 10 }} numberOfLines={2}>
                      {item.order_ref_num || item.project_code}
                    </ActivityText>
                    <ActivityText style={{ color: '#555555' }}>
                      {item.start_date}
                    </ActivityText>
                  </View>
                  <ActivityText numberOfLines={2}>
                    User: {item.user_name}
                  </ActivityText>
                </View>
              </ActivityRow>
              
            )}
            style={{ maxHeight: 200 }}
        />
    </ActivityContainer>

    

        
    </GradientBackground>
    </Container>
);
};

export default ManagerHomePage;
