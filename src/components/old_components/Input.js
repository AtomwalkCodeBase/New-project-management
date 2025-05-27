import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import { colors } from './../../Styles/appStyle'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Input = ({
  label,
  iconName,
  error,
  password,
  onFocus = () => {},
  ...props
}) => {
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={{marginBottom: 5}}>
      <Text style={style.label}>{label}</Text>
      <View
        style={[
          style.inputContainer,
          {
            borderColor: error
              ? colors.red
              : isFocused
              ? colors.lightblack
              : colors.lightblack,
            alignItems: 'center',
          },
        ]}>
        <Icon
          name={iconName}
          style={{color: colors.darkBlue, fontSize: 22, marginRight: 10}}
        />
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={{color: colors.black, flex: 1, fontSize: 16}}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
            style={{color: colors.darkBlue, fontSize: 22}}
          />
        )}
      </View>
      {error && (
        <Text style={{marginTop: 7, color: colors.red, fontSize: 12}}>
          {error}
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 16,
    color: colors.black,
  },
  inputContainer: {
    height: 50,
    width: '95%',
    color: colors.black,
    // backgroundColor: colors.light,
    flexDirection: 'row',
    // paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    // borderStyle: 'dashed'
  },
});

export default Input;