import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Feature_Card from "./Feature_Card";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react-native";

const featuresData = [
  {
    id: "1",
    image: require("../../assets/images/feature_1.jpg"),
    title: "Personalized Training Plans",
    description: "Tailored workouts based on your goals, fitness level, and lifestyle.",
  },
  {
    id: "2",
    image: require("../../assets/images/feature_2.jpg"),
    title: "Customized Meal Plans",
    description: "Nutritious meals built around your goals and dietary needs.",
  },
  {
    id: "3",
    image: require("../../assets/images/feature_3.jpg"),
    title: "Track Your Progress",
    description: "Visualize your fitness journey and celebrate milestones.",
  },
  {
    id: "4",
    image: require("../../assets/images/feature_1.jpg"),
    title: "Personalized Training Plans",
    description: "Tailored workouts based on your goals, fitness level, and lifestyle.",
  },
  {
    id: "5",
    image: require("../../assets/images/feature_2.jpg"),
    title: "Customized Meal Plans",
    description: "Nutritious meals built around your goals and dietary needs.",
  },
  {
    id: "6",
    image: require("../../assets/images/feature_3.jpg"),
    title: "Track Your Progress",
    description: "Visualize your fitness journey and celebrate milestones.",
  },
];

const CARD_WIDTH = scale(180) + scale(10); 

const Features = () => {
  const flatListRef = useRef<FlatList>(null);
  const [scrollX, setScrollX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;

    setScrollX(offsetX);
    setMaxScroll(contentWidth - layoutWidth);
  };

  const scrollRight = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: Math.min(scrollX + CARD_WIDTH, maxScroll),
        animated: true,
      });
    }
  };

  const scrollLeft = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: Math.max(scrollX - CARD_WIDTH, 0),
        animated: true,
      });
    }
  };

  const isAtStart = scrollX <= 0;
  const isAtEnd = scrollX >= maxScroll - 10;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Features</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={scrollLeft}
            disabled={isAtStart}
          >
            <ArrowLeftCircle size={24} color={isAtStart ? "#777777" : "#FFFFFF"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={scrollRight}
            disabled={isAtEnd}
          >
            <ArrowRightCircle size={24} color={isAtEnd ? "#777777" : "#FFFFFF"} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={featuresData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Feature_Card
            image={item.image}
            title={item.title}
            description={item.description}
          />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default Features;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#282828",
    paddingVertical: verticalScale(10),
    paddingLeft: moderateScale(10),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
    marginBottom: verticalScale(8),
  },
  header: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  iconRow: {
    flexDirection: "row",
    gap: scale(8),
  },
  iconBtn: {
    backgroundColor: "#2B2B2B",
    borderRadius: 100,
    padding: moderateScale(6),
  },
});
