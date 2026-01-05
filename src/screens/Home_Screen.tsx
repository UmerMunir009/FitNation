import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import Header from "../components/Home/Header";
import BestSellings from "../components/Home/Best_Selling";
import FitnessPrograms from "../components/Home/Fitness_Programs";
import Meals from "../components/Home/Meals";
import Features from "../components/Home/Features";
import TrustedByCompanies from "../components/Home/Trusted_Companies";
import ChooseUs from "../components/Home/Choose_Us";
import UserComments from "../components/Home/UserComments";

const HomeScreen = () => {
  const sections = [
    { id: "1", component: <Header /> },
    { id: "2", component: <BestSellings /> },
    { id: "3", component: <FitnessPrograms /> },
    { id: "4", component: <Meals /> },
    { id: "5", component: <Features /> },
    { id: "6", component: <TrustedByCompanies /> },
    { id: "7", component: <ChooseUs /> },
    { id: "8", component: <UserComments /> },
  ];

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <View>{item.component}</View>}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    paddingBottom: scale(20),
  },
});
