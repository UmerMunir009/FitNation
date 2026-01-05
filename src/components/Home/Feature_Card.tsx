import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

type FeatureCardProps = {
  image: any;
  title: string;
  description: string;
};

const Feature_Card: React.FC<FeatureCardProps> = ({ image, title, description }) => {
  return (
    <View style={styles.cardContainer}>
      <ImageBackground
        source={image}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <View style={styles.overlay} />

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Feature_Card;

const styles = StyleSheet.create({
  cardContainer: {
    width: scale(160),
    height: verticalScale(180),
    borderRadius: moderateScale(14),
    overflow: "hidden",
    marginRight: scale(6),
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: moderateScale(14),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  textContainer: {
    padding: moderateScale(10),
  },
  title: {
    fontSize: moderateScale(13),
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: verticalScale(4),
  },
  description: {
    fontSize: moderateScale(12),
    color: "#CCCCCC",
  },
});
