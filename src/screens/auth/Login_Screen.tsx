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
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';

type LoginErrorState = {
  email?: string;
  password?: string;
};

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrorState>({});
  const { login, logging } = useContext(AuthContext);
  const [remember, setRemember] = useState(false);


  const handleLogin = async() => {
    let newErrors: LoginErrorState = {};

    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await login(email,password)
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <ChevronLeft color="#e9eae7ff" size={scale(22)} />
      </TouchableOpacity>

      <Text style={styles.title}>Sign In To Your Account</Text>
      <Text style={styles.subtitle}>
        Your Journey To A Healthier, Fitter, And{'\n'}More Confident Lifestyle
        Starts With One{'\n'}Simple Step Today.
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Jhon123@gmail.com"
        placeholderTextColor="#888"
        keyboardType="email-address"
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField('')}
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          focusedField === 'email' && styles.focusedInput,
          errors.email && styles.errorBorder,
        ]}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="*******"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField('')}
          value={password}
          onChangeText={setPassword}
          style={[
            styles.input,
            styles.passwordInput,
            focusedField === 'password' && styles.focusedInput,
            errors.password && styles.errorBorder,
          ]}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
        >
          {showPassword ? (
            <Eye color="#888" size={scale(20)} />
          ) : (
            <EyeOff color="#888" size={scale(20)} />
          )}
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={logging}
      >
        {logging ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>

    <View style={styles.optionsRow}>
  <View style={styles.rememberContainer}>
    <TouchableOpacity
      style={[
        styles.checkbox,
        remember && { backgroundColor: '#ADE406', justifyContent: 'center', alignItems: 'center' },
      ]}
      onPress={() => setRemember(!remember)}
    >
      {remember && <Text style={{ color: '#000', fontWeight: 'bold' }}>✓</Text>}
    </TouchableOpacity>
    <Text style={styles.rememberText}>Remember me</Text>
  </View>

  <TouchableOpacity
    onPress={() => navigation.navigate('ForgotPassword' as never)}
  >
    <Text style={styles.forgotText}>Forget password?</Text>
  </TouchableOpacity>
</View>


      <View style={styles.socialButtonsRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../assets/images/facebook.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../assets/images/apple.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../assets/images/google.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bottomText}>
        Don’t have an account?{' '}
        <Text
          style={styles.signUpText}
          onPress={() => navigation.navigate('SignUp' as never)}
        >
          Sign up
        </Text>
      </Text>
    </ScrollView>
  );
};

export default LoginScreen;

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
  title: {
    color: '#fff',
    fontSize: moderateScale(22),
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: verticalScale(25),
  },
  subtitle: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: moderateScale(13),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(30),
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
    marginBottom: verticalScale(10),
    borderWidth: 1.2,
    borderColor: '#1a1a1a',
  },
  focusedInput: { borderColor: '#ADE406' },
  errorBorder: { borderColor: '#ff4d4d' },
  errorText: {
    color: '#ff4d4d',
    fontSize: moderateScale(12),
    marginBottom: verticalScale(10),
    marginLeft: scale(4),
  },
  passwordContainer: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: scale(40) },
  iconContainer: { position: 'absolute', right: scale(10), top: scale(10) },
  loginButton: {
    backgroundColor: '#ADE406',
    borderRadius: scale(25),
    paddingVertical: verticalScale(10),
    marginTop: verticalScale(15),
  },
  loginText: {
    color: '#000',
    textAlign: 'center',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(15),
  },
  rememberContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: scale(16),
    height: scale(16),
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: scale(8),
  },
  rememberText: { color: '#fff', fontSize: moderateScale(13) },
  forgotText: { color: '#ADE406', fontSize: moderateScale(13) },
  socialButtonsRow: { marginTop: verticalScale(20), gap: verticalScale(10) },
  socialButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282828',
    borderRadius: scale(20),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
  },
  socialIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
    marginRight: scale(10),
  },
  socialText: { color: '#fff', fontSize: moderateScale(14) },
  bottomText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: verticalScale(30),
    fontSize: moderateScale(13),
  },
  signUpText: { color: '#ADE406', fontWeight: '600' },
});
