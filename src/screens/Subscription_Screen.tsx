import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const SubscriptionScreen = () => {
  const navigation = useNavigation<any>();
  const [isMonthly, setIsMonthly] = useState(true);

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 19,
      yearlyPrice: 190,
      description:
        'Perfect for beginners. Get started with personalized nutrition and fitness guidance to track your progress.',
      features: [
        'Access to all exercise videos',
        'Progress tracking',
        'Support live community',
        'Customized workout plans',
        'Access to advanced programs',
        'Body composition analysis',
      ],
      isPopular: false,
    },
    {
      name: 'Professional',
      monthlyPrice: 54,
      yearlyPrice: 540,
      description:
        'Experience a fully tailored fitness experience with our expert plan. You get one-on-one coaching with a dedicated trainer.',
      features: [
        'Access to all exercise videos',
        'Progress tracking',
        'Support live community',
        'Customized workout plans',
        'Weekly trainer check-ins',
        'Exclusive meal prep trainings',
      ],
      isPopular: false,
    },
    {
      name: 'Premium',
      monthlyPrice: 89,
      yearlyPrice: 890,
      description:
        'Start your fitness journey with our beginner plan. Work one-on-one with our expert trainers and get essential nutrition guidance.',
      features: [
        'Access to all exercise videos',
        'Progress tracking',
        'Support live community',
        'Personalized workout plans',
        'Weekly trainer check-ins',
        'Exclusive meal prep trainings',
      ],
      isPopular: true,
    },
  ];

  const currentPrice = (plan: (typeof plans)[0]) =>
    isMonthly ? plan.monthlyPrice : plan.yearlyPrice;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plans & Pricing</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.toggleWrapper}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isMonthly && styles.activeButton,
              styles.leftButton,
            ]}
            onPress={() => setIsMonthly(true)}
          >
            <Text
              style={[
                styles.toggleText,
                isMonthly ? styles.activeText : styles.inactiveText,
              ]}
            >
              MONTHLY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isMonthly && styles.activeButton,
              styles.rightButton,
            ]}
            onPress={() => setIsMonthly(false)}
          >
            <Text
              style={[
                styles.toggleText,
                !isMonthly ? styles.activeText : styles.inactiveText,
              ]}
            >
              YEARLY
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(30) }}
      >
        {plans.map((plan, index) => (
          <View
            key={index}
            style={[styles.planCard, plan.isPopular && styles.popularPlanCard]}
          >
            {plan.isPopular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
              </View>
            )}

            <View style={{ marginBottom: verticalScale(10) }}>
              <Text
                style={[styles.priceText, plan.isPopular && { color: '#000' }]}
              >
                ${currentPrice(plan)}
                <Text
                  style={[
                    styles.perMonthText,
                    plan.isPopular && { color: '#666' },
                  ]}
                >
                  {isMonthly ? ' /month' : ' /year'}
                </Text>
              </Text>
              <Text
                style={[styles.planName, plan.isPopular && { color: '#000' }]}
              >
                {plan.name}
              </Text>
              <Text
                style={[styles.planDesc, plan.isPopular && { color: '#555' }]}
              >
                {plan.description}
              </Text>
            </View>

            <View style={{ marginBottom: verticalScale(10) }}>
              {plan.features.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <Check
                    size={16}
                    color={plan.isPopular ? '#83AD03' : '#c0f000'}
                  />
                  <Text
                    style={[
                      styles.featureText,
                      plan.isPopular && { color: '#333' },
                    ]}
                  >
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.chooseButton}>
              <Text
                style={[
                  styles.chooseButtonText,
                  plan.isPopular && { color: '#fff' },
                ]}
              >
                Choose Plan
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: moderateScale(14),
    paddingTop: verticalScale(45),
    paddingBottom: verticalScale(45),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  toggleWrapper: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  toggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(24),
    backgroundColor: 'grey',
  },
  leftButton: {
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  rightButton: {
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  activeButton: {
    backgroundColor: '#83AD03',
  },
  toggleText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    textAlign: 'center',
  },
  activeText: {
    color: '#000',
  },
  inactiveText: {
    color: 'black',
  },
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: verticalScale(14),
  },
  popularPlanCard: {
    backgroundColor: '#fff',
    borderColor: '#83AD03',
    shadowColor: '#83AD03',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: '#83AD03',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(3),
    borderRadius: 20,
  },
  popularBadgeText: {
    color: '#000',
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  priceText: {
    color: '#83AD03',
    fontSize: moderateScale(28),
    fontWeight: '900',
  },
  perMonthText: {
    color: '#aaa',
    fontSize: moderateScale(12),
    fontWeight: '400',
  },
  planName: {
    color: '#83AD03',
    fontSize: moderateScale(22),
    fontWeight: '700',
    marginBottom: verticalScale(4),
    marginTop: verticalScale(12),
  },
  planDesc: {
    color: '#aaa',
    fontSize: moderateScale(12),
    lineHeight: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginBottom: verticalScale(6),
  },
  featureText: {
    color: '#ccc',
    fontSize: moderateScale(13),
  },
  chooseButton: {
    backgroundColor: '#83AD03',
    paddingVertical: verticalScale(10),
    borderRadius: 50,
    alignItems: 'center',
  },
  chooseButtonText: {
    color: '#000',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});
