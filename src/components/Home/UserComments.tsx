import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import {ArrowLeft,ArrowRight} from "lucide-react-native";

const testimonials = [
  {
    id: "1",
    name: "Hellen Jummy",
    role: "Financial Counselor",
    image: require("../../assets/images/user.jpg"),
    feedback:
      "Lacus vestibulum ultricies mi risus, duis non, volutpat nullam non. Magna congue nisi maecenas elit aliquet eu sed consectetur.",
  },
  {
    id: "2",
    name: "Mark Thompson",
    role: "Fitness Coach",
    image: require("../../assets/images/user.jpg"),
    feedback:
      "Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
  },
  {
    id: "3",
    name: "Sofia Khan",
    role: "Nutrition Specialist",
    image: require("../../assets/images/user.jpg"),
    feedback:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida dictum fusce.",
  },
  {
    id: "4",
    name: "David Green",
    role: "Gym Manager",
    image: require("../../assets/images/user.jpg"),
    feedback:
      "Pharetra pharetra massa massa ultricies mi quis hendrerit dolor magna eget est lorem ipsum dolor sit amet consectetur.",
  },
  {
    id: "5",
    name: "Lara Smith",
    role: "Health Consultant",
    image: require("../../assets/images/user.jpg"),
    feedback:
      "Eu volutpat odio facilisis mauris sit amet massa vitae. Et netus et malesuada fames ac turpis egestas integer eget.",
  },
];

const UserComments = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < testimonials.length - 1) setIndex(index + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const item = testimonials[index];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>What everyone says</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={handlePrev} disabled={index === 0}>
            <View
              style={[
                styles.iconButton,
                { opacity: index === 0 ? 0.5 : 1 },
              ]}
            >
              <ArrowLeft color="#fff" size={18} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            disabled={index === testimonials.length - 1}
          >
            <View
              style={[
                styles.iconButton,
                { opacity: index === testimonials.length - 1 ? 0.5 : 1 },
              ]}
            >
              <ArrowRight color="#fff" size={18} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text numberOfLines={8} style={styles.feedback}>{item.feedback}</Text>

        <View style={styles.profileRow}>
          <Image source={item.image} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserComments;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    paddingHorizontal: moderateScale(18),
    paddingVertical: verticalScale(15),
    marginBottom:verticalScale(90)
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  header: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  iconRow: {
    flexDirection: "row",
    gap: moderateScale(8),
  },
  iconButton: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: moderateScale(20),
    padding: moderateScale(5),
  },
  card: {
    backgroundColor: "#1C1C1C",
    borderRadius: moderateScale(15),
    padding: moderateScale(28),
  },
  feedback: {
    color: "#CCCCCC",
    fontSize: moderateScale(12),
    lineHeight: verticalScale(18),
    marginBottom: verticalScale(14),
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(16),
  },
  avatar: {
    width: scale(65),
    height: scale(65),
    borderRadius: scale(100),
  },
  name: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  role: {
    color: "#C0FF00",
    fontSize: moderateScale(13),
    fontWeight: "600",
  },
});
