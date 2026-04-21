import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatMinutes } from '../utils/time';

type Props = {
  total: number;
};

export default function HoursSummaryCard({ total }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>This week</Text>
      <Text style={styles.value}>{formatMinutes(total)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
});