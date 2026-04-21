import "react-native-gesture-handler";
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import WeeklyHoursScreen from "./screens/WeeklyHoursScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WeeklyHoursScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
