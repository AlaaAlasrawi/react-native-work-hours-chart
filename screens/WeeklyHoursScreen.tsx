import React from 'react';
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
    gap: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subheader: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 8,
  },
  listBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  day: {
    fontSize: 16,
    color: '#111827',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});