import React, { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import Sidebar from "./Sidebar";
import { compactScreenTopPadding } from "../theme/layout";

const NavBar = () => {
  const navigation = useNavigation<any>();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  return (
    <View style={{ zIndex: 20 }}>
      <View style={styles.navBar}>
        {/* <TouchableOpacity onPress={toggleSidebar}>
          <Image
            source={require("../assets/images/sidebar_icon.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </TouchableOpacity> */}

        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={require("../assets/images/search_icon.png")}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("cart")}
            style={styles.iconButton}
          >
            <Image
              source={require("../assets/images/cart_icon.png")}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Sidebar visible={sidebarVisible} onClose={toggleSidebar} />
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    paddingTop: compactScreenTopPadding,
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
});
