import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.75)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenWidth * 0.75,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setIsMounted(false)); 
    }
  }, [fadeAnim, slideAnim, visible]);

  if (!isMounted) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 9999 }]}>
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </Pressable>

      <Animated.View
        style={[
          styles.menu,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
          <Text style={styles.title}>☰   Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={onClose}>
          <Text style={styles.optionText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={onClose}>
          <Text style={styles.optionText}>Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={onClose}>
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.option} onPress={onClose}>
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  menu: {
    position: "absolute",
    left: 0,
    top: 0,
    height: screenHeight,
    width: screenWidth * 0.75,
    backgroundColor: "#111",
    paddingHorizontal: scale(25),
    paddingVertical: verticalScale(30),
    borderTopRightRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: moderateScale(22),
    fontWeight: "700",
    marginBottom: verticalScale(30),
  },
  option: {
    paddingVertical: verticalScale(12),
  },
  optionText: {
    color: "#f5f5f5",
    fontSize: moderateScale(17),
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: verticalScale(20),
  },
});
