import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native"
import { scale, verticalScale, moderateScale } from "react-native-size-matters"
import NavBar from "../components/Navbar"

type PlanType = "diet" | "workout"
type GoalType = "weight gain" | "weight loss" | "balanced"
type TabType = "oneTime" | "membership"

const allPlans = {
  oneTime: [
    {
      id: "1",
      image: require("../assets/images/meal_1.jpg"),
      title: "Weight Gain Plan",
      description:
        "Fuel your workouts and speed up recovery with high-quality whey protein isolate.",
      price: "2000",
      planType: "diet",
      goal: "weight gain",
    },
    {
      id: "2",
      image: require("../assets/images/meal_2.jpg"),
      title: "Weight Gain Plan",
      description:
        "Fuel your workouts and speed up recovery with high-quality whey protein isolate.",
      price: "2000",
      planType: "workout",
      goal: "weight gain",
    },
    {
      id: "3",
      image: require("../assets/images/meal_3.jpg"),
      title: "PROTINE JAR",
      description:
        "Fuel your workouts and speed up recovery with high-quality whey protein isolate.",
      price: "2000",
      planType: "diet",
      goal: "weight loss",
    },
    {
      id: "4",
      image: require("../assets/images/meal_4.jpg"),
      description:
        "Fuel your workouts and speed up recovery with high-quality whey protein isolate.",
      price: "2000",
      planType: "workout",
      goal: "balanced",
    },
     {
      id: "5",
      image: require("../assets/images/meal_5.jpg"),
      title: "Weight Gain Plan",
      description:
        "Fuel your workouts and speed up recovery with high-quality whey protein isolate.",
      price: "2000",
      planType: "diet",
      goal: "weight gain",
    },

     {
      id: "6",
      image: require("../assets/images/feature_1.jpg"),
      title: "Weight Gain Plan",
      description:
        "Fuel your workouts and speed up recovery with high-quality whey protein isolate.",
      price: "2000",
      planType: "diet",
      goal: "weight gain",
    },
     {
      id: "7",
      image: require("../assets/images/feature_2.jpg"),
      title: "Weight Gain Plan",
      description:
        "Fuel your workouts and speed up recovery with high-quality whey protein isolate.",
      price: "2000",
      planType: "diet",
      goal: "weight gain",
    },
     {
      id: "8",
      image: require("../assets/images/feature_3.jpg"),
      title: "Weight Gain Plan",
      description:
        "Fuel your workouts and speed up recovery with high-quality whey protein isolate.",
      price: "2000",
      planType: "diet",
      goal: "weight gain",
    },
  ],
  membership: [
    {
      id: "1",
      image: require("../assets/images/meal_1.jpg"),
      title: "Monthly Gainer",
      description: "Membership plan for bulking with premium access.",
      price: "5000",
      planType: "diet",
      goal: "weight gain",
    },
    {
      id: "2",
      image: require("../assets/images/meal_1.jpg"),
      title: "Lean Program",
      description: "Sculpt and tone your body with expert guidance.",
      price: "4500",
      planType: "workout",
      goal: "weight loss",
    },
    {
      id: "3",
      image: require("../assets/images/meal_1.jpg"),
      title: "Fit Balance Pack",
      description: "Steady energy, healthy body with balanced nutrition.",
      price: "4000",
      planType: "diet",
      goal: "balanced",
    },
  ],
}

const FitnessProgramsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>("oneTime")
  const [selectedType, setSelectedType] = useState<PlanType>("diet")
  const [selectedGoal, setSelectedGoal] = useState<GoalType>("weight gain")

  const filteredPlans = allPlans[selectedTab].filter(
    (p) => p.planType === selectedType && p.goal === selectedGoal
  )

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: verticalScale(80) }}
    >
     <NavBar/>

      <View style={styles.content}>
        <Text style={styles.categoriesTitle}>Categories</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab("oneTime")}
            style={[
              styles.tabButton,
              selectedTab === "oneTime" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "oneTime" && styles.tabTextActive,
              ]}
            >
              One-Time Plans
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab("membership")}
            style={[
              styles.tabButton,
              selectedTab === "membership" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "membership" && styles.tabTextActive,
              ]}
            >
              Membership Plans
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => setSelectedType("diet")}
            style={[
              styles.filterButton,
              selectedType === "diet" && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === "diet" && styles.filterTextActive,
              ]}
            >
              Diet Plans
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedType("workout")}
            style={[
              styles.filterButton,
              selectedType === "workout" && styles.filterButtonActive,
            ]}
          >
            <Text  style={[
                styles.filterText,
                selectedType === "workout" && styles.filterTextActive,
              ]}>Workout Plans</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.goalRow}>
          {["weight gain", "weight loss", "balanced"].map((goal) => (
            <TouchableOpacity
              key={goal}
              style={styles.goalOption}
              onPress={() => setSelectedGoal(goal as GoalType)}
            >
              <View
                style={[
                  styles.radioOuter,
                  selectedGoal === goal && styles.radioOuterActive,
                ]}
              >
                {selectedGoal === goal && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.goalText}>
                {goal.replace("weight ", "")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          {selectedTab === "oneTime" ? "One - Time Plans" : "Membership Plans"} (
          {filteredPlans.length}/{allPlans[selectedTab].length})
        </Text>

        <View style={styles.grid}>
          {filteredPlans.map((plan) => (
            <View key={plan.id} style={styles.card}>
              <Image source={plan.image} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{plan.title}</Text>
                <Text numberOfLines={3} style={styles.cardDesc}>{plan.description}</Text>

                <View style={styles.cardBottom}>
                  <Text style={styles.priceText}>Rs. {plan.price}</Text>
                   <Image
                            source={require("../assets/images/green_cart.png")}
                            style={styles.cartIcon}
                            resizeMode="contain"
                          />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default FitnessProgramsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop:verticalScale(10)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  iconText: {
    fontSize: moderateScale(20),
    color: "#fff",
  },
   cartIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
  },
  logoText: {
    fontSize: moderateScale(18),
    color: "#ADFF2F",
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: scale(16),
  },
  content: {
    padding: scale(20),
    paddingTop:scale(0)
  },
  categoriesTitle: {
    fontSize: moderateScale(22),
    color: "#fff",
    marginBottom: verticalScale(12),
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    marginBottom: verticalScale(16),
  },
  tabButton: {
    marginRight: scale(30),
    paddingBottom: verticalScale(8),
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#ADFF2F",
  },
  tabText: {
    fontSize: moderateScale(13),
    color: "#666",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#ADFF2F",
  },
  filterRow: {
    flexDirection: "row",
    gap: scale(12),
    marginBottom: verticalScale(16),
  },
  filterButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(20),
  },
  filterButtonActive: {
    backgroundColor: "#ADFF2F",
  },
  filterButtonOutline: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: "#444",
  },
  filterButtonOutlineActive: {
    borderColor: "#ADFF2F",
  },
  filterText: {
    color: "#fff",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#000",
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  goalOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: "#999",
    marginRight: scale(6),
  },
  radioOuterActive: {
    borderColor: "#ADFF2F",
  },
  radioInner: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: "#ADFF2F",
    alignSelf: "center",
    marginTop: scale(3),
  },
  goalText: {
    color: "#fff",
    fontSize: moderateScale(12),
    textTransform: "capitalize",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontWeight: "600",
    marginBottom: verticalScale(10),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(14),
    width: "47%",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: verticalScale(110),
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
  },
  cardContent: {
    padding: scale(10),
  },
  cardTitle: {
    color: "#fff",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#999",
    fontSize: moderateScale(10),
  },
  cardDesc: {
    color: "#999",
    fontSize: moderateScale(10),
    lineHeight: verticalScale(12),
    marginTop: verticalScale(4),
    marginBottom: verticalScale(8),
  },
  cardPrice: {
    color: "#ADFF2F",
    fontSize: moderateScale(11),
    fontWeight: "600",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    color: "#ADFF2F",
    fontSize: moderateScale(14),
    fontWeight:'700'
  },
  addButton: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: "#ADFF2F",
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    color: "#000",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
})
