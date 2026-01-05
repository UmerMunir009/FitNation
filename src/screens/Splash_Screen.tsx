import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  const handleLogin = () => navigation.navigate('Login');
  const handleSignUp = () => navigation.navigate('SignUp');
  return (
    <ImageBackground
      source={require('../assets/images/splash_bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Stronger every day.{'\n'}
              Start your journey{'\n'}
              now.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSignUp}
              style={[styles.button, styles.signUpButton]}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.button, styles.loginButton]}
            >
              <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: verticalScale(450),
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(34),
    color: '#FFFFFF',
    lineHeight: verticalScale(38),
    fontWeight: '400',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: scale(15),
    marginTop: verticalScale(40),
  },
  button: {
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(50),
    borderRadius: scale(18),
    borderWidth: scale(2),
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderColor: '#ADE406',
  },
  signUpButton: {
    backgroundColor: '#ADE406',
    borderColor: '#ADE406',
  },
  buttonText: {
    color: 'black',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  loginText: {
    color: '#ADE406',
  },
});
