import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image, Easing } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";


const logos = [
  require("../../assets/images/trusted_logo_1.png"),
  require("../../assets/images/trusted_logo_2.png"),
  require("../../assets/images/trusted_logo_3.png"),

];

const scrollingLogos = [...logos, ...logos,...logos];

const TrustedCompanies = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const totalWidth = scale(160) * logos.length; 

  useEffect(() => {
    const loopScroll = () => {
      scrollX.setValue(0);
      Animated.timing(scrollX, {
        toValue: -totalWidth,
        duration: 20000, 
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => loopScroll());
    };
    loopScroll();
  }, [totalWidth]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.highlight}>Trusted By </Text>
        Leading Companies
      </Text>

      <View style={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.logoRow,
            {
              transform: [{ translateX: scrollX }],
            },
          ]}
        >
          {scrollingLogos.map((logo, index) => (
            <View key={index} style={styles.logoWrapper}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

export default TrustedCompanies;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    paddingVertical: verticalScale(12),
    alignItems: "center",
  },
  title: {
    fontSize: moderateScale(18),
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: verticalScale(10),
  },
  highlight: {
    color: "#ADFF2F", 
    fontWeight: "700",
  },
  scrollContainer: {
    overflow: "hidden",
    width: "100%",
  },
  logoRow: {
    flexDirection: "row",
  },
  logoWrapper: {
    marginHorizontal: scale(15),
  },
  logo: {
    width: scale(60),
    height: verticalScale(20),
  },
});
