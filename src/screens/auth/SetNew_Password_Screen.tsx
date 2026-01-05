import React, { useContext, useState } from 'react';
import {
  View,
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
import { useRoute, RouteProp } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';

type RootStackParamList = {
  SetNewPassword: { email: string; otp: string };
};

type SetNewPasswordRouteProp = RouteProp<RootStackParamList, 'SetNewPassword'>;

const SetNewPasswordScreen = () => {
  const route = useRoute<SetNewPasswordRouteProp>();
  const navigation = useNavigation<any>();
  const { email, otp } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { resetPassword, resetting } = useContext(AuthContext);

  const handleContinue = async () => {
    if (!password || !confirmPassword) {
      setError('Both fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    const success = await resetPassword(email, otp, password, confirmPassword);
    if (success) {
      navigation.replace('Login');
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

      <Text style={styles.label}>New Password</Text>
      <TextInput
        placeholder="Enter new password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onFocus={() => setFocusedField('password')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'password' && styles.focusedInput,
        ]}
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        placeholder="Re-Enter password"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onFocus={() => setFocusedField('confirm')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'confirm' && styles.focusedInput,
        ]}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.continueButton}
        disabled={resetting}
        onPress={handleContinue}
      >
        {resetting ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.continueText}>Reset</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SetNewPasswordScreen;

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
    marginBottom: verticalScale(10),
  },
  focusedInput: { borderColor: '#ADE406' },
  errorText: {
    color: 'red',
    fontSize: moderateScale(12),
    marginBottom: verticalScale(10),
    marginLeft: scale(5),
  },
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
