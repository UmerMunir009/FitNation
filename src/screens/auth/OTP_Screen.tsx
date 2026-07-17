import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../context/AuthContext';

type RootStackParamList = {
  OTPScreen: { email: string };
};

type OTPRouteProp = RouteProp<RootStackParamList, 'OTPScreen'>;

const ForgotPasswordOTPScreen = () => {
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [timer, setTimer] = useState(600);
  const route = useRoute<OTPRouteProp>();
  const { email } = route.params;
  const { verifyOTP, verifyingOTP, resendOTP } =
    useContext(AuthContext);

  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');

    if (otp.some(digit => digit.trim() === '')) {
      return;
    }

    console.log('OTP entered:', enteredOtp);
    const success = await verifyOTP(email, enteredOtp);
    if (success) {
      navigation.replace('SetNewPassword', { email, otp: enteredOtp });
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (email) {
      await resendOTP(email);
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
        We have just sent a 6 digit code to your email{'\n'}
        <Text style={{ color: '#fff' }}>{email}.</Text> Please check and enter
        the OTP below.
      </Text>

      <Text style={styles.enterCode}>Enter Code</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <LinearGradient
            key={index}
            colors={
              focusedIndex === index
                ? ['#ADE406', '#75b200']
                : ['#7e7e7eff', '#000000']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.otpGradient}
          >
            <TextInput
              ref={ref => {
                inputRefs.current[index] = ref!;
              }}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={[
                styles.otpInput,
                focusedIndex === index && {
                  borderColor: '#ADE406',
                  borderWidth: 1,
                },
              ]}
            />
          </LinearGradient>
        ))}
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn’t get the code?</Text>
        {timer > 0 && (
          <Text style={styles.timerText}>
            You can resend code again in {formatTime(timer)}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.resendButton, timer > 0 && { opacity: 0.5 }]}
          disabled={timer > 0}
          onPress={async () => {
            if (timer === 0) {
              await handleResend();
              setTimer(600);
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.resendTxt}>Resend</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.verifyButton}
        disabled={verifyingOTP}
        onPress={handleVerify}
      >
        {verifyingOTP ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.verifyText}>Verify</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ForgotPasswordOTPScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingHorizontal: scale(20) },
  scrollContent: {
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(40),
  },
  iconImage: { width: scale(260), height: scale(170), alignSelf: 'center' },
  title: {
    color: '#fff',
    fontSize: moderateScale(20),
    fontWeight: '700',
    textAlign: 'center',
  },
  otpGradient: {
    width: scale(40),
    height: scale(50),
    borderRadius: scale(18),
    padding: 1.5,
  },
  resendButton: {
    marginTop: verticalScale(8),
    backgroundColor: '#ADE406',
    borderRadius: scale(25),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(20),
  },
  otpInput: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: moderateScale(18),
    backgroundColor: '#282828',
    borderRadius: scale(16),
  },
  enterCode: {
    color: '#fff',
    fontSize: moderateScale(16),
    marginBottom: verticalScale(8),
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: moderateScale(13),
    marginBottom: verticalScale(20),
    lineHeight: verticalScale(18),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(10),
    marginBottom: verticalScale(15),
  },
  resendContainer: { alignItems: 'center', marginBottom: verticalScale(15) },
  resendText: { color: '#fff', fontSize: moderateScale(13) },
  timerText: { color: '#ADE406', fontSize: moderateScale(13), marginTop: 5 },
  verifyButton: {
    backgroundColor: '#ADE406',
    borderRadius: scale(25),
    paddingVertical: verticalScale(10),
  },
  verifyText: {
    color: '#000',
    textAlign: 'center',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  resendTxt: {
    color: '#000',
    textAlign: 'center',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
});
