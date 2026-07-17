import { Platform, StatusBar } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

const androidStatusBarHeight =
  Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export const screenTopPadding = androidStatusBarHeight + verticalScale(12);
export const compactScreenTopPadding = androidStatusBarHeight + verticalScale(8);
export const authTopPadding = androidStatusBarHeight + verticalScale(28);
export const floatingBackTop = androidStatusBarHeight + verticalScale(10);
export const bottomNavOffset = verticalScale(20);
