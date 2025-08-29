import React from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  StyleSheet,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const HeaderComponent = ({ headerTitle, onBackPress }) => {
  const insets = useSafeAreaInsets();
  const dynamicStyles = {
    container: { paddingTop: insets.top + 8 },
    text: { fontSize: width < 360 ? 18 : 20 },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <TouchableOpacity 
        onPress={onBackPress}
        activeOpacity={0.6}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      
      <Text style={[styles.headerText, dynamicStyles.text]}>{headerTitle}</Text>
      
      {/* Empty view to balance the flex space-between */}
      <View style={styles.emptyView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fb9032',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
    }),
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  emptyView: {
    width: 24, // Same as icon size for balance
  },
});

export default HeaderComponent;