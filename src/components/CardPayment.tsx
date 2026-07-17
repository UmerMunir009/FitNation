import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const CardPayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (text: string) => {
    const value = text.replace(/\s/g, '');
    if (value.length <= 16) {
      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (text: string) => {
    const value = text.replace(/\D/g, '');
    if (value.length <= 4) {
      const formatted =
        value.length >= 3 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (text: string) => {
    const value = text.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  return (
    <View style={styles.grayContainer}>
      <View style={{ marginBottom: verticalScale(20) }}>
        <Text style={styles.label}>Credit or Debit Card Number</Text>
        <View style={styles.cardInputWrapper}>
          <View style={styles.cardIcon}>
            <View style={styles.cardRect} />
            <View style={styles.cardCircles}>
              <View style={[styles.circle, { backgroundColor: '#FFA500' }]} />
              <View style={[styles.circle, { backgroundColor: '#FF6B6B' }]} />
            </View>
          </View>
          <TextInput
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            placeholder="XXXX XXXX XXXX XXXX"
            placeholderTextColor="#777"
            keyboardType="numeric"
            style={styles.textInputWithIcon}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Expiry Date</Text>
          <TextInput
            value={expiryDate}
            onChangeText={handleExpiryChange}
            placeholder="MM/YY"
            placeholderTextColor="#777"
            keyboardType="numeric"
            style={styles.textInput}
          />
        </View>
        <View style={{ width: scale(10) }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>CVV/CVC</Text>
          <TextInput
            value={cvv}
            onChangeText={handleCvvChange}
            placeholder="CVV"
            placeholderTextColor="#777"
            keyboardType="numeric"
            secureTextEntry
            style={styles.textInput}
          />
        </View>
      </View>

      <View style={styles.paymentIconsRow}>
        <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Payment Method :</Text>
        <View style={styles.visaCard}>
          <Text style={styles.visaText}>VISA</Text>
        </View>
        <View style={styles.masterCard}>
          <View style={[styles.mcCircle, { backgroundColor: '#FF5F00' }]} />
          <View
            style={[
              styles.mcCircle,
              { backgroundColor: '#EB001B', marginLeft: -10 },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default CardPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282828',
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(45),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  grayContainer: {
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    padding: moderateScale(16),
  },
  label: {
    color: '#ccc',
    fontSize: moderateScale(13),
    marginBottom: verticalScale(8),
    fontWeight: '500',
  },
  cardInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: scale(12),
  },
  cardIcon: {
    marginRight: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRect: {
    width: scale(28),
    height: verticalScale(18),
    backgroundColor: '#1E40AF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#60A5FA',
  },
  cardCircles: {
    flexDirection: 'row',
    position: 'absolute',
  },
  circle: {
    width: scale(6),
    height: scale(6),
    borderRadius: 6,
    marginHorizontal: scale(2),
  },
  textInputWithIcon: {
    flex: 1,
    color: '#fff',
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(14),
  },
  textInput: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    color: '#fff',
    fontSize: moderateScale(14),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
  },
  row: {
    flexDirection: 'row',
    marginBottom: verticalScale(20),
  },
  paymentIconsRow: {
    flexDirection: 'row',
    gap: scale(10),
    marginTop: verticalScale(0),
    justifyContent:'flex-start',
    alignItems:'center'
  },
  visaCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: scale(6),
    width: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaText: {
    color: '#1A1F71',
    fontWeight: '700',
    fontSize: moderateScale(10),
  },
  masterCard: {
    backgroundColor: '#977c7cff',
    borderRadius: 8,
    padding: scale(6),
    width: scale(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mcCircle: {
    width: scale(12),
    height: scale(12),
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#ADE406',
    borderRadius: 50,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
  saveButtonText: {
    color: '#000',
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
});
