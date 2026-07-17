import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { screenTopPadding } from '../theme/layout';
import { getWorkoutProgressApi, logWorkoutApi } from '../api/user';
import { getWorkoutDetail, getWorkouts, getWorkoutsByCategory } from '../api/public';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const unwrapList = (payload: any) => {
  const data = payload?.data?.data || payload?.data?.progress || payload?.data || payload;
  return Array.isArray(data) ? data : [];
};

const WorkoutProgressScreen = () => {
  const navigation = useNavigation<any>();
  const [progress, setProgress] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workoutId, setWorkoutId] = useState('');
  const [notes, setNotes] = useState('');

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await getWorkoutProgressApi();
      setProgress(unwrapList(response));
    } catch (error) {
      showErrorToast('Could not load workout progress');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async (category?: string) => {
    try {
      const response = category
        ? await getWorkoutsByCategory(category)
        : await getWorkouts({ page: 1, perPage: 20 });
      setWorkouts(unwrapList(response));
    } catch (error) {
      setWorkouts([]);
    }
  };

  useEffect(() => {
    fetchProgress();
    fetchWorkouts();
  }, []);

  const handleWorkoutDetail = async (workout: any) => {
    try {
      const response = await getWorkoutDetail(workout.guid || workout.id);
      const detail = response?.data || response;
      setSelectedWorkout(detail);
      setWorkoutId(String(detail.guid || detail.id || ''));
    } catch (error: any) {
      setSelectedWorkout(workout);
      setWorkoutId(String(workout.guid || workout.id || ''));
      showErrorToast(error.response?.data?.message || 'Showing local workout detail');
    }
  };

  const handleLogWorkout = async () => {
    if (!workoutId.trim()) {
      showErrorToast('Workout ID is required');
      return;
    }
    setSaving(true);
    try {
      await logWorkoutApi({
        workout_id: workoutId.trim(),
        duration_minutes: 60,
        calories_burned: 450,
        progress_percent: 100,
        completed_at: new Date().toISOString(),
        notes,
      });
      setWorkoutId('');
      setNotes('');
      showSuccessToast('Workout logged');
      fetchProgress();
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Could not log workout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Progress</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.categoryRow}>
          <TextInput
            value={categoryId}
            onChangeText={setCategoryId}
            placeholder="Workout category ID"
            placeholderTextColor="#777"
            style={[styles.input, styles.categoryInput]}
          />
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => fetchWorkouts(categoryId.trim() || undefined)}
          >
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={workouts}
          keyExtractor={(item, index) => String(item.guid || item.id || index)}
          showsHorizontalScrollIndicator={false}
          style={styles.workoutList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.workoutChip}
              onPress={() => handleWorkoutDetail(item)}
            >
              <Text style={styles.workoutText} numberOfLines={1}>
                {item.title || item.name || item.guid || item.id}
              </Text>
            </TouchableOpacity>
          )}
        />
        {!!selectedWorkout && (
          <View style={styles.selectedWorkout}>
            <Text style={styles.selectedTitle}>
              {selectedWorkout.title || selectedWorkout.name}
            </Text>
            <Text style={styles.selectedMeta} numberOfLines={2}>
              {selectedWorkout.description || selectedWorkout.short_description || 'Selected workout'}
            </Text>
          </View>
        )}
        <TextInput
          value={workoutId}
          onChangeText={setWorkoutId}
          placeholder="Workout ID / GUID"
          placeholderTextColor="#777"
          style={styles.input}
        />
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes"
          placeholderTextColor="#777"
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleLogWorkout}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.saveText}>Log Workout</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ADE406" />
        </View>
      ) : (
        <FlatList
          data={progress}
          keyExtractor={(item, index) => String(item.id || item.guid || index)}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No workout progress found.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>
                {item.workout?.title || item.workout_id || 'Workout'}
              </Text>
              <Text style={styles.meta}>
                Progress: {item.progress_percent || item.progress || 0}%
              </Text>
              <Text style={styles.meta}>
                Duration: {item.duration_minutes || 0} minutes
              </Text>
              {!!item.notes && <Text style={styles.meta}>{item.notes}</Text>}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default WorkoutProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: moderateScale(14),
    paddingTop: screenTopPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  form: {
    backgroundColor: '#1c1c1c',
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  input: {
    backgroundColor: '#282828',
    color: '#fff',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  categoryRow: {
    flexDirection: 'row',
    gap: scale(8),
  },
  categoryInput: {
    flex: 1,
  },
  filterBtn: {
    backgroundColor: '#ADE406',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(14),
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  filterText: {
    color: '#000',
    fontWeight: '800',
  },
  workoutList: {
    marginBottom: verticalScale(8),
  },
  workoutChip: {
    maxWidth: scale(160),
    backgroundColor: '#333',
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(7),
    marginRight: scale(8),
  },
  workoutText: {
    color: '#fff',
    fontWeight: '700',
  },
  selectedWorkout: {
    backgroundColor: '#222',
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    marginBottom: verticalScale(8),
  },
  selectedTitle: {
    color: '#fff',
    fontWeight: '800',
  },
  selectedMeta: {
    color: '#aaa',
    marginTop: verticalScale(4),
  },
  saveBtn: {
    backgroundColor: '#ADE406',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(9),
    alignItems: 'center',
  },
  saveText: {
    color: '#000',
    fontWeight: '800',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: verticalScale(80),
  },
  card: {
    backgroundColor: '#1c1c1c',
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    marginBottom: verticalScale(10),
  },
  title: {
    color: '#fff',
    fontWeight: '800',
    fontSize: moderateScale(15),
  },
  meta: {
    color: '#aaa',
    marginTop: verticalScale(4),
  },
});
