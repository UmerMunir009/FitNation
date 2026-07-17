import React from "react"
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native"
import {
  scale,
  verticalScale,
  moderateScale,
} from "react-native-size-matters"
import NavBar from "../Navbar"

const Header = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/header_bg.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={styles.headerContainer}>
       <NavBar/>

        <View style={styles.contentSection}>
          <Image
            source={require("../../assets/images/header-text.png")}
            style={styles.halfWidthImage}
            resizeMode="contain"
          />

          <Text style={styles.paragraph}>
            Pair your training with the right nutrition. Our plans and supplements keep you energized, focused, and ready to achieve more.
          </Text>

          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Shop Now</Text>
            <Image
              source={require("../../assets/images/right-arrow.png")}
              style={styles.ctaIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    paddingBottom: verticalScale(14),
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 0,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
  },
  logoImage: {
    width: scale(120),
    height: verticalScale(35),
  },
  rightIcons: {
    flexDirection: "row",
  },
  iconButton: {
    padding: scale(8),
  },
  iconImage: {
    width: moderateScale(22),
    height: moderateScale(24),
    tintColor: "#FFFFFF",
  },

  contentSection: {
    alignItems: "flex-start",
    paddingHorizontal: scale(20),
  },
  halfWidthImage: {
    width: "50%",
    height: verticalScale(35),
    marginBottom: verticalScale(0),
  },
  paragraph: {
    color: "#777373ff",
    width:'70%',
    fontSize: moderateScale(11),
    lineHeight: verticalScale(12),
    marginBottom: verticalScale(12),
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ADE406",
    borderRadius: moderateScale(25),
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(12),
  },
  ctaButtonText: {
    color: "#000",
    fontSize: moderateScale(18),
    fontWeight: "900",
    marginRight: scale(8), 
  },
  ctaIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    tintColor: "#000", 
  },
})
