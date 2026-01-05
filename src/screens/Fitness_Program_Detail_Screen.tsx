import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import {
  ArrowLeft,
  Clock,
  Dumbbell,
  Star,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FitnessProgramDetailScreen = ({ route, navigation }: any) => {
  const { program } = route.params;

  const equipment = program.equipment_required
    ? JSON.parse(program.equipment_required)
    : [];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: program.image_url }} style={styles.mainImage} />
          <View style={styles.headerOverlay} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color="#fff" size={scale(22)} />
          </TouchableOpacity>

          <View style={styles.badgeContainer}>
            {program.badges?.map((badge: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.floatingBadge,
                  {
                    backgroundColor:
                      badge.color === 'danger' ? '#ff4d4d' : '#b2fd62',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.floatingBadgeText,
                    { color: badge.color === 'danger' ? '#fff' : '#000' },
                  ]}
                >
                  {badge.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <Text style={styles.categoryBadge}>
              {program.plan_category_label}
            </Text>
            <View style={styles.ratingRow}>
              <Star color="#b2fd62" size={scale(14)} fill="#b2fd62" />
              <Text style={styles.ratingText}>
                {program.rating || '4.8'} ({program.rating_count} reviews)
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{program.title}</Text>
          <Text style={styles.shortDesc}>{program.short_description}</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Clock color="#b2fd62" size={scale(18)} />
              <Text style={styles.statValue}>{program.duration_formatted}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Dumbbell color="#b2fd62" size={scale(18)} />
              <Text style={styles.statValue}>
                {program.intensity_level_label}
              </Text>
              <Text style={styles.statLabel}>Intensity</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Zap color="#b2fd62" size={scale(18)} />
              <Text style={styles.statValue}>{program.workouts_per_week}</Text>
              <Text style={styles.statLabel}>Days/Week</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.longDescription}>{program.description}</Text>

          {program.gallery_images?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gallery</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.galleryScroll}
              >
                {program.gallery_images.map((img: any) => (
                  <Image
                    key={img.id}
                    source={{ uri: img.image_url }}
                    style={styles.galleryImage}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {equipment.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Equipment Needed</Text>
              <View style={styles.tagContainer}>
                {equipment.map((item: string, index: number) => (
                  <View key={index} style={styles.equipmentTag}>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            <View style={styles.benefitItem}>
              <CheckCircle2 color="#b2fd62" size={scale(18)} />
              <Text style={styles.benefitText}>
                Customized Workout Schedules
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle2 color="#b2fd62" size={scale(18)} />
              <Text style={styles.benefitText}>
                Mobile App Access & Progress Tracking
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle2 color="#b2fd62" size={scale(18)} />
              <Text style={styles.benefitText}>
                Community Support & Discussion
              </Text>
            </View>
          </View>

          <View style={{ height: verticalScale(100) }} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Total Investment</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {program.currency} {program.current_price}
            </Text>
            {program.has_discount && (
              <Text style={styles.oldPrice}>
                {program.currency} {program.original_price}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { flexGrow: 1 },
  imageContainer: { width: '100%', height: verticalScale(350) },
  mainImage: { width: '100%', height: '100%' },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(50),
    left: scale(20),
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: scale(10),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: verticalScale(50),
    left: scale(20),
    flexDirection: 'row',
  },
  floatingBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    borderRadius: scale(8),
    marginRight: scale(8),
  },
  floatingBadgeText: { fontSize: scale(11), fontWeight: 'bold' },
  content: {
    paddingHorizontal: scale(20),
    backgroundColor: '#000',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    marginTop: verticalScale(-35),
    paddingTop: verticalScale(25),
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    color: '#b2fd62',
    fontWeight: 'bold',
    fontSize: scale(11),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 6,
    borderRadius: 8,
  },
  ratingText: {
    color: '#fff',
    marginLeft: scale(5),
    fontWeight: '600',
    fontSize: scale(11),
  },
  title: {
    color: '#fff',
    fontSize: scale(26),
    fontWeight: '800',
    marginBottom: 8,
  },
  shortDesc: {
    color: '#b2fd62',
    fontSize: scale(14),
    fontWeight: '500',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    paddingVertical: verticalScale(15),
    borderRadius: scale(20),
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#222',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#333',
    alignSelf: 'center',
  },
  statValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(13),
    marginTop: 6,
  },
  statLabel: {
    color: '#777',
    fontSize: scale(10),
    marginTop: 2,
    textTransform: 'uppercase',
  },
  section: { marginBottom: 30 },
  sectionTitle: {
    color: '#fff',
    fontSize: scale(18),
    fontWeight: '700',
    marginBottom: 15,
  },
  longDescription: {
    color: '#999',
    fontSize: scale(14),
    lineHeight: scale(22),
    marginBottom: 30,
  },
  galleryScroll: { flexDirection: 'row' },
  galleryImage: {
    width: scale(140),
    height: scale(100),
    borderRadius: 15,
    marginRight: 12,
  },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  equipmentTag: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  equipmentText: { color: '#ddd', fontSize: scale(12) },
  benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  benefitText: { color: '#bbb', marginLeft: 12, fontSize: scale(14) },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F0F0F',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(25),
    borderTopWidth: 1,
    borderTopColor: '#222',
    width: '100%',
  },
  priceLabel: {
    color: '#777',
    fontSize: scale(11),
    textTransform: 'uppercase',
  },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  price: { color: '#fff', fontSize: scale(18), fontWeight: 'bold' },
  oldPrice: {
    color: '#555',
    textDecorationLine: 'line-through',
    marginLeft: 10,
    fontSize: scale(14),
  },
  buyButton: {
    backgroundColor: '#b2fd62',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(14),
    borderRadius: scale(10),
    elevation: 5,
  },
  buyButtonText: { color: '#000', fontWeight: '900', fontSize: scale(12) },
});

export default FitnessProgramDetailScreen;
