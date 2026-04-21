import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import HoursSummaryCard from "../components/HoursSummaryCard";
import WeeklyBarChart from "../components/WeeklyBarChart";
import { weeklyHours } from "../data/weeklyHours";
import { formatMinutes } from "../utils/time";

export default function WeeklyHoursScreen() {
  const total = weeklyHours.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>RN Charts Showcase</Text>
      <Text style={styles.subheader}>
        Reusable mobile chart example for daily and weekly work hours.
      </Text>

      <HoursSummaryCard total={total} />
      <WeeklyBarChart data={weeklyHours} />

      <View style={styles.listBox}>
        <Text style={styles.listTitle}>Daily totals</Text>

        {weeklyHours.map((item) => (
          <View key={item.day} style={styles.row}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.value}>{formatMinutes(item.minutes)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  listBox: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  day: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
});
