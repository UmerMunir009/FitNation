import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const bulletPoints = [
  {
    id: '1',
    title: 'The Gym That Gets You Results',
    description:
      'Lorem ipsum dolor sit amet consectetur. Habitasse lacus a sit ultrices sem nulla donec pulvinar.',
  },
  {
    id: '2',
    title: 'Your Fitness Journey Starts Here',
    description:
      'Lorem ipsum dolor sit amet consectetur. Habitasse lacus a sit ultrices sem nulla donec pulvinar.',
  },
  {
    id: '3',
    title: 'Train Smarter. Get Stronger.',
    description:
      'Lorem ipsum dolor sit amet consectetur. Habitasse lacus a sit ultrices sem nulla donec pulvinar.',
  },
];

const Choose_Us = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Why Choose Us</Text>

      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/about.png')}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.subtitle}>
        FROM DAY ONE TO YOUR PERSONAL BEST HERES {'\n'}
        WHY OUR GYM DELIVERS RESULTS THAT LAST
      </Text>

      <View style={styles.bulletContainer}>
        {bulletPoints.map(item => (
          <View key={item.id} style={styles.pointContainer}>
            <View style={styles.row}>
              <View style={styles.bullet} />
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Choose_Us;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282828',
    paddingHorizontal: moderateScale(18),
    paddingVertical: verticalScale(25),
    flex: 1,
  },
  pointContainer: {
    marginBottom: verticalScale(15),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },

  bullet: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: '#C0FF00',
    marginRight: moderateScale(10),
  },

  title: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    fontWeight: '900',
    fontStyle: 'italic',
  },

  description: {
    color: '#CCCCCC',
    fontSize: moderateScale(12),
    lineHeight: verticalScale(12),
  },

  heading: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  imageContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: verticalScale(16),
  },
  greenBox: {
    position: 'absolute',
    width: scale(180),
    height: scale(180),
    backgroundColor: '#C0FF00',
    borderRadius: moderateScale(20),
    bottom: -scale(10),
    right: -scale(10),
    zIndex: 0,
  },
  mainImage: {
    width: scale(220),
    height: scale(200),
    borderRadius: moderateScale(20),
    zIndex: 1,
  },
  subtitle: {
    color: '#C0FF00',
    fontSize: moderateScale(14),
    fontStyle: 'italic',
    marginBottom: verticalScale(8),
    fontWeight: '900',
  },
  bulletContainer: {
    marginTop: verticalScale(10),
  },

  textContainer: {
    flex: 1,
  },
});
