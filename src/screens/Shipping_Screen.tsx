import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronDown } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CardPayment from '../components/CardPayment';
import { checkoutApi, verifyPaymentApi } from '../api/orders';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { screenTopPadding } from '../theme/layout';

type RouteParams = {
  total?: number;
};

const sampleProduct = {
  name: 'Total War Pre Workout',
  qty: '1/30',
  price: 'Rs. 6,099.00',
  image: require('../assets/images/meal_1.jpg'),
};

const ShippingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  const totalFromCart = params?.total ?? 7279.3;

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [subscribe, setSubscribe] = useState(false);

  const [country] = useState('Pakistan');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [useSameBilling, setUseSameBilling] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = Number(totalFromCart) || 0;
  const shippingCharge = 0;
  const estimatesTaxes =
    Math.round((subtotal + shippingCharge) * 0.15 * 100) / 100;
  const total =
    Math.round((subtotal + shippingCharge + estimatesTaxes) * 100) / 100;

  const handleCompleteOrder = async () => {
    if (!firstName || !lastName || !address || !city || !phone || !emailOrPhone) {
      showErrorToast('Please complete delivery and contact details');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        billing_first_name: useSameBilling ? firstName : firstName,
        billing_last_name: useSameBilling ? lastName : lastName,
        billing_address: useSameBilling ? address : address,
        billing_city: useSameBilling ? city : city,
        billing_state: '',
        billing_country: country,
        billing_zipcode: postalCode,
        shipping_first_name: firstName,
        shipping_last_name: lastName,
        shipping_address: address,
        shipping_city: city,
        shipping_state: '',
        shipping_country: country,
        shipping_zipcode: postalCode,
        customer_name: `${firstName} ${lastName}`.trim(),
        customer_email: emailOrPhone.includes('@') ? emailOrPhone : '',
        customer_phone: phone || emailOrPhone,
        payment_method: paymentMethod === 'card' ? 'stripe' : 'cod',
        shipping_method: 'standard',
        agree_terms: true,
      };
      const response = await checkoutApi(payload);
      const orderNumber =
        response?.data?.order_number ||
        response?.data?.order?.order_number ||
        response?.order_number;

      if (paymentMethod === 'card' && orderNumber) {
        await verifyPaymentApi(orderNumber, `mobile-${Date.now()}`);
      }

      showSuccessToast('Order placed successfully');
      navigation.navigate('myOrders' as never);
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact */}
        <Text style={styles.sectionTitle}>Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Email or Phone number"
          placeholderTextColor="#6f6f6f"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
        />

        <View style={styles.rowBetween}>
          <View style={styles.checkboxRow}>
            <Switch
              value={subscribe}
              onValueChange={setSubscribe}
              thumbColor={subscribe ? '#ADE406' : undefined}
              trackColor={{ true: '#2b2b2b', false: '#1b1b1b' }}
            />
            <Text style={styles.smallText}>Email me with news and offers</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: verticalScale(18) }]}>
          Delivery
        </Text>

        <TouchableOpacity style={styles.pseudoSelect}>
          <Text style={styles.pseudoSelectText}>{country}</Text>
          <ChevronDown color="#9b9b9b" size={16} />
        </TouchableOpacity>

        <View style={styles.row}>
          <TextInput
            style={[styles.inputHalf, { marginRight: scale(8) }]}
            placeholder="First Name"
            placeholderTextColor="#6f6f6f"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.inputHalf, { marginLeft: scale(8) }]}
            placeholder="Last Name"
            placeholderTextColor="#6f6f6f"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Company (optional)"
          placeholderTextColor="#6f6f6f"
          value={company}
          onChangeText={setCompany}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#6f6f6f"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Apartment, suite, etc (optional)"
          placeholderTextColor="#6f6f6f"
          value={apt}
          onChangeText={setApt}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.inputHalf, { marginRight: scale(8) }]}
            placeholder="City"
            placeholderTextColor="#6f6f6f"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={[styles.inputHalf, { marginLeft: scale(8) }]}
            placeholder="Postal Code (optional)"
            placeholderTextColor="#6f6f6f"
            value={postalCode}
            onChangeText={setPostalCode}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#6f6f6f"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <View style={styles.rowBetween}>
          <View style={styles.checkboxRow}>
            <Switch
              value={saveInfo}
              onValueChange={setSaveInfo}
              thumbColor={saveInfo ? '#ADE406' : undefined}
              trackColor={{ true: '#2b2b2b', false: '#1b1b1b' }}
            />
            <Text style={styles.smallText}>
              Save this information for the next time
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: verticalScale(18) }]}>
          Shipping Method
        </Text>

        <View style={styles.shippingMethodBox}>
          <Text style={styles.shippingTitle}>Standard</Text>
          <Text style={styles.shippingSub}>Free</Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: verticalScale(18) }]}>
          Payment
        </Text>

        <TouchableOpacity
          style={[
            styles.paymentCard,
            paymentMethod === 'cod' && styles.paymentCardActive,
          ]}
          onPress={() => setPaymentMethod('cod')}
        >
          <Text style={styles.paymentHead}>Cash on Delivery (COD)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentCard,
            paymentMethod === 'card' && styles.paymentCardActive,
          ]}
          onPress={() => setPaymentMethod('card')}
        >
          <Text style={styles.paymentHead}>Credit / Debit Card</Text>
        </TouchableOpacity>

        {paymentMethod === 'card' && <CardPayment />}

        <Text style={[styles.sectionTitle, { marginTop: verticalScale(18) }]}>
          Billing Address
        </Text>
        <View style={styles.billingRow}>
          <View style={styles.checkboxRow}>
            <Switch
              value={useSameBilling}
              onValueChange={setUseSameBilling}
              thumbColor={useSameBilling ? '#ADE406' : undefined}
              trackColor={{ true: '#2b2b2b', false: '#1b1b1b' }}
            />
            <Text style={styles.smallText}>Same as shipping address</Text>
          </View>
        </View>

        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.productRow}>
            <Image source={sampleProduct.image} style={styles.productImage} />
            <View style={{ flex: 1, marginLeft: scale(10) }}>
              <Text style={styles.productName}>{sampleProduct.name}</Text>
              <Text style={styles.productQty}>{sampleProduct.qty} / 30g</Text>
            </View>
            <Text style={styles.productPrice}>{totalFromCart}</Text>
          </View>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs. {totalFromCart}</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Estimated Taxes</Text>
            <Text style={styles.summaryValue}>
              Rs. {estimatesTaxes.toFixed(2)}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>PKR Rs. {total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.completeBtn}
            onPress={handleCompleteOrder}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.completeBtnText}>Complete Order</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShippingScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    paddingTop: screenTopPadding,
    paddingBottom: verticalScale(12),
  },
  logoImage: {
    width: scale(100),
    height: verticalScale(35),
  },
  container: {
    paddingHorizontal: scale(14),
    paddingBottom: verticalScale(30),
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  input: {
    backgroundColor: '#282828',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    color: '#fff',
    fontSize: moderateScale(13),
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: verticalScale(8),
  },
  pseudoSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#282828',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: verticalScale(8),
  },
  pseudoSelectText: {
    color: '#fff',
    fontSize: moderateScale(13),
  },
  row: {
    flexDirection: 'row',
    marginBottom: verticalScale(8),
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputHalf: {
    flex: 1,
    backgroundColor: '#282828',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    color: '#fff',
    fontSize: moderateScale(13),
    borderWidth: 1,
    borderColor: '#222',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  smallText: {
    color: '#9b9b9b',
    marginLeft: scale(8),
    fontSize: moderateScale(12),
  },
  shippingMethodBox: {
    backgroundColor: '#282828',
    borderRadius: moderateScale(10),
    padding: scale(12),
    borderWidth: 1,
    borderColor: '#222',
  },
  shippingTitle: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  shippingSub: {
    color: '#9b9b9b',
    marginTop: verticalScale(4),
    fontSize: moderateScale(12),
  },
  paymentCard: {
    backgroundColor: '#282828',
    borderRadius: moderateScale(10),
    padding: scale(12),
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: verticalScale(8),
  },
  paymentCardActive: {
    borderColor: '#ADE406',
    backgroundColor: '#282828',
  },
  paymentHead: {
    color: '#fff',
    fontWeight: '700',
    paddingVertical: verticalScale(8),
  },
  billingRow: {
    marginBottom: verticalScale(8),
  },
  orderSummary: {
    backgroundColor: '#0F0F0F',
    borderRadius: moderateScale(10),
    padding: scale(12),
    marginTop: verticalScale(18),
    borderWidth: 1,
    borderColor: '#222',
  },
  summaryTitle: {
    color: '#A3E635',
    fontWeight: '700',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(8),
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  productImage: {
    width: scale(56),
    height: scale(56),
    borderRadius: moderateScale(8),
    backgroundColor: '#222',
  },
  productName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: moderateScale(13),
  },
  productQty: {
    color: '#9b9b9b',
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
  },
  productPrice: {
    color: '#fff',
    fontWeight: '700',
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(8),
  },
  summaryLabel: {
    color: '#9b9b9b',
  },
  summaryValue: {
    color: '#fff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: '#262626',
    paddingTop: verticalScale(12),
  },
  totalLabel: {
    color: '#fff',
    fontWeight: '800',
  },
  totalValue: {
    color: '#ADE406',
    fontWeight: '800',
  },
  completeBtn: {
    marginTop: verticalScale(12),
    backgroundColor: '#ADE406',
    paddingVertical: verticalScale(9),
    borderRadius: moderateScale(30),
    alignItems: 'center',
  },
  completeBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: moderateScale(16),
  },
});
