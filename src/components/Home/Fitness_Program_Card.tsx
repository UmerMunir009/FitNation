import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import RemoteImage from '../RemoteImage';

type FitnessProgramCardProps = {
  program: any; 
};

const FitnessProgramCard: React.FC<FitnessProgramCardProps> = ({ program }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => navigation.navigate('fitnessProgramDetails', { program })}
    >
      <View style={styles.card}>
        <RemoteImage sourceUri={program.image_url} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.title}>{program.title}</Text>

          <View style={styles.bottomRow}>
            <View style={styles.planRow}>
              <Text style={styles.tag}>{program.plan_type_label}</Text>
              <Text style={styles.tag2}>{program.fitness_goal_label}</Text>
            </View>

            <Image
              source={require('../../assets/images/green_cart.png')}
              style={styles.cartIcon}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: verticalScale(200),
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: scale(12),
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: scale(12),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planRow: { flexDirection: 'row' },
  tag: {
    backgroundColor: '#b2fd62',
    color: '#000',
    fontSize: scale(10),
    fontWeight: '700',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(20),
    marginRight: scale(6),
    textTransform: 'uppercase',
  },
  tag2: {
    backgroundColor: 'white',
    color: '#000',
    fontSize: scale(10),
    fontWeight: '700',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(20),
    marginRight: scale(6),
    textTransform: 'uppercase',
  },
  cartIcon: { width: scale(24), height: scale(24) },
});

export default FitnessProgramCard;
