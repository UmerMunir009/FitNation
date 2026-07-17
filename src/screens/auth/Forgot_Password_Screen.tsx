import React, { useContext, useState } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthContext } from '../../context/AuthContext';

type RootStackParamList = {
  OTPScreen: { email: string };
};

type ForgotPasswordNavProp = StackNavigationProp<
  RootStackParamList,
  'OTPScreen'
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordNavProp>();
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const { forgetPassword, logging } = useContext(AuthContext);

  const handleContinue = async () => {
    if (email.trim()) {
      await forgetPassword(email);
      navigation.replace('OTPScreen', { email });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Forgot Password</Text>
      <Image
        source={require('../../assets/images/message_box.png')}
        style={styles.iconImage}
      />
      <Text style={styles.subtitle}>
        Please enter your email and we will send an{'\n'}OTP code in the next
        step to reset your password
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Jhon123@gmail.com"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && styles.focusedInput]}
      />

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        disabled={logging} 
      >
        {logging ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.continueText}>Continue</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingHorizontal: scale(20) },
  scrollContent: {
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(40),
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(35),
    left: scale(-5),
    zIndex: 10,
  },
  iconImage: {
    width: scale(260),
    height: scale(170),
    alignSelf: 'center',
  },
  title: {
    color: '#fff',
    fontSize: moderateScale(20),
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: moderateScale(13),
    marginBottom: verticalScale(25),
    lineHeight: verticalScale(18),
  },
  label: {
    color: '#fff',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(5),
  },
  input: {
    backgroundColor: '#282828',
    color: '#fff',
    borderRadius: scale(24),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    fontSize: moderateScale(14),
    borderWidth: 1.2,
    borderColor: '#1a1a1a',
  },
  focusedInput: { borderColor: '#ADE406' },
  continueButton: {
    backgroundColor: '#ADE406',
    borderRadius: scale(25),
    paddingVertical: verticalScale(10),
    marginTop: verticalScale(10),
  },
  continueText: {
    color: '#000',
    textAlign: 'center',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
});
