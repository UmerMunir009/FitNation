import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { CheckCircle, AlertTriangle } from 'lucide-react-native';

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View style={[styles.toastContainer, styles.successContainer]}>
      <CheckCircle color="black" size={scale(22)} />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  ),

  error: ({ text1, text2 }: any) => (
    <View style={[styles.toastContainer, styles.errorContainer]}>
      <AlertTriangle color="black" size={scale(22)} />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(8),
    paddingHorizontal:scale(16),
    borderRadius: scale(10),
    marginHorizontal: scale(10),
    marginTop: scale(5),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  successContainer: {
    backgroundColor: '#75b200', 
  },
  errorContainer: {
    backgroundColor: '#c62828', 
  },
  textWrapper: {
    marginLeft: scale(10),
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: scale(14),
  },
  message: {
    color: 'black',
    fontSize: scale(12),
  },
});
