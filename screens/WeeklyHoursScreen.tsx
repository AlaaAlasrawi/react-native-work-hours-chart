import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import HoursSummaryCard from "../components/HoursSummaryCard";
import WeeklyInteractiveHoursChart, {
  formatMinutesToDuration,
} from "../components/WeeklyInteractiveHoursChart";
import { weeklyHours } from "../data/weeklyHours";

export default function WeeklyHoursScreen() {
  const total = weeklyHours.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Weekly Work Hours</Text>
      <Text style={styles.subheader}>
        Interactive iOS-inspired chart with tap and drag selection.
      </Text>

      <HoursSummaryCard total={total} />
      <WeeklyInteractiveHoursChart data={weeklyHours} />

      <View style={styles.listBox}>
        <Text style={styles.listTitle}>Daily totals</Text>

        {weeklyHours.map((item) => (
          <View key={`${item.dayFull}-${item.dateLabel}`} style={styles.row}>
            <View>
              <Text style={styles.day}>{item.dayFull}</Text>
              <Text style={styles.date}>{item.dateLabel}</Text>
            </View>
            <Text style={styles.value}>{formatMinutesToDuration(item.minutes)}</Text>
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
    backgroundColor: "#F3F5FA",
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
    color: "#161C27",
  },
  subheader: {
    fontSize: 14,
    color: "#677084",
    marginBottom: 18,
  },
  listBox: {
    marginTop: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E6E9F0",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#202738",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F6",
  },
  day: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1B2333",
  },
  date: {
    marginTop: 2,
    fontSize: 11,
    color: "#8B93A6",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D2534",
  },
});
