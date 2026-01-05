import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

type ErrorState = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<ErrorState>({});

  const handleSignUp = () => {
    let newErrors: ErrorState = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (!confirmPassword.trim())
      newErrors.confirmPassword = 'Please confirm your password';
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Sign Up successful!');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
     <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Account Settings</Text>
            <View style={{ width: 24 }} />
          </View>


      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder="Jhon"
        placeholderTextColor="#888"
        onFocus={() => setFocusedField('name')}
        onBlur={() => setFocusedField('')}
        value={name}
        onChangeText={setName}
        style={[
          styles.input,
          focusedField === 'name' && styles.focusedInput,
          errors.name && styles.errorBorder,
        ]}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

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

      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="*******"
          placeholderTextColor="#888"
          secureTextEntry={!showConfirmPassword}
          onFocus={() => setFocusedField('confirmPassword')}
          onBlur={() => setFocusedField('')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={[
            styles.input,
            styles.passwordInput,
            focusedField === 'confirmPassword' && styles.focusedInput,
            errors.confirmPassword && styles.errorBorder,
          ]}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.iconContainer}
        >
          {showConfirmPassword ? (
            <Eye color="#888" size={scale(20)} />
          ) : (
            <EyeOff color="#888" size={scale(20)} />
          )}
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSignUp}>
        <Text style={styles.savetxt}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: scale(20),
  },
  scrollContent: {
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(40),
  },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  headerTitle: {
    color: '#FFF',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(35),
    left: scale(-7),
    zIndex: 10,
  },
  title: {
    color: '#fff',
    fontSize: moderateScale(22),
    fontWeight: '700',
    textAlign: 'center',
    paddingTop:verticalScale(25)
  },
  subtitle: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: moderateScale(13),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(30),
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
  focusedInput: {
    borderColor: '#ADE406',
  },
  errorBorder: {
    borderColor: '#ff4d4d',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: moderateScale(12),
    marginBottom: verticalScale(10),
    marginLeft: scale(4),
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: scale(40),
  },
  iconContainer: {
    position: 'absolute',
    right: scale(10),
    top: scale(10),
  },
  saveBtn: {
    backgroundColor: '#ADE406',
    borderRadius: scale(25),
    paddingVertical: verticalScale(10),
    marginTop: verticalScale(15),
  },
  savetxt: {
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
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: scale(16),
    height: scale(16),
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: scale(8),
  },
  rememberText: {
    color: '#fff',
    fontSize: moderateScale(13),
  },
  forgotText: {
    color: '#ADE406',
    fontSize: moderateScale(13),
  },
  bottomText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: verticalScale(30),
    fontSize: moderateScale(13),
    marginBottom:verticalScale(250)//will find better solution later
  },
  loginText: {
    color: '#ADE406',
    fontWeight: '800',
  },
});
