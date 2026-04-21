import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import type { DayHours } from './WeeklyInteractiveHoursChart';

type Props = {
  data: DayHours[];
};

export default function WeeklyBarChart({ data }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Weekly Work Hours</Text>
      <View style={styles.chartBox}>
        <CartesianChart
          data={data}
          xKey="dayShort"
          yKeys={["hours"]}
          domainPadding={{ left: 22, right: 22, top: 16 }}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.hours}
              chartBounds={chartBounds}
              roundedCorners={{ topLeft: 6, topRight: 6 }}
            />
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  chartBox: {
    height: 260,
  },
});