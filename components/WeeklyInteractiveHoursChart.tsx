import React, { useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type DayHours = {
  dayShort: string;
  dayFull: string;
  dateLabel: string;
  hours: number;
  minutes: number;
};

type WeeklyInteractiveHoursChartProps = {
  data: DayHours[];
  maxHours?: number;
  title?: string;
};

const CHART_HEIGHT = 220;
const TOOLTIP_WIDTH = 150;
const GRID_LINES = 4;
const BAR_GAP = 10;
const RIGHT_AXIS_WIDTH = 28;

export const formatMinutesToDuration = (minutes: number): string => {
  if (minutes <= 0) return "0m";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
};

export const computeAverageHours = (days: DayHours[]): number => {
  if (!days.length) return 0;
  const totalHours = days.reduce((sum, item) => sum + item.hours, 0);
  return totalHours / days.length;
};

export default function WeeklyInteractiveHoursChart({
  data,
  maxHours = 10,
  title = "Daily Usage",
}: WeeklyInteractiveHoursChartProps) {
  const [chartWidth, setChartWidth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [plotAreaWidth, setPlotAreaWidth] = useState(0);
  const tooltipX = useSharedValue(0);
  const barCentersRef = useRef<number[]>([]);

  const safeData = data.length ? data : [];
  const averageHours = useMemo(() => computeAverageHours(safeData), [safeData]);
  const chartLeft = 0;
  const plotWidth = Math.max(0, chartWidth - RIGHT_AXIS_WIDTH);
  const chartRight = chartLeft + plotWidth;
  const slotWidth = safeData.length > 0 ? plotWidth / safeData.length : 0;
  const barWidth = useMemo(() => {
    if (!safeData.length || slotWidth <= 0) return 0;
    return Math.max(8, slotWidth - BAR_GAP);
  }, [safeData.length, slotWidth]);

  const tooltipStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tooltipX.value }],
  }));

  const getCenterXForIndex = (index: number) => {
    const measuredCenter = barCentersRef.current[index];
    if (typeof measuredCenter === "number") return measuredCenter;
    if (!safeData.length || slotWidth <= 0) return 0;
    return chartLeft + index * slotWidth + slotWidth / 2;
  };

  const getTooltipXForIndex = (index: number) => {
    const center = getCenterXForIndex(index);
    return Math.max(
      chartLeft,
      Math.min(center - TOOLTIP_WIDTH / 2, chartRight - TOOLTIP_WIDTH)
    );
  };

  const updateSelection = (index: number) => {
    if (!safeData.length) return;
    const clampedIndex = Math.max(0, Math.min(index, safeData.length - 1));
    setSelectedIndex((prev) => (prev === clampedIndex ? prev : clampedIndex));
    tooltipX.value = withTiming(getTooltipXForIndex(clampedIndex), {
      duration: 120,
    });
  };

  const indexFromTouchX = (touchX: number) => {
    if (!safeData.length) return 0;
    const centers = barCentersRef.current;
    if (centers.length === safeData.length) {
      const firstCenter = centers[0];
      const lastCenter = centers[centers.length - 1];
      const clampedX = Math.max(firstCenter, Math.min(touchX, lastCenter));
      let nearestIndex = 0;
      let nearestDistance = Math.abs(centers[0] - clampedX);

      for (let i = 1; i < centers.length; i += 1) {
        const distance = Math.abs(centers[i] - clampedX);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }
      return nearestIndex;
    }

    if (slotWidth <= 0) return 0;
    const localX = Math.max(chartLeft, Math.min(touchX, chartRight)) - chartLeft;
    const fallbackIndex = Math.floor(localX / slotWidth);
    return Math.max(0, Math.min(fallbackIndex, safeData.length - 1));
  };

  const onChartLayout = (event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width);
  };

  const onPlotAreaLayout = (event: LayoutChangeEvent) => {
    setPlotAreaWidth(event.nativeEvent.layout.width);
  };

  const onBarSlotLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    barCentersRef.current[index] = x + width / 2;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      updateSelection(indexFromTouchX(evt.nativeEvent.locationX));
    },
    onPanResponderMove: (evt) => {
      updateSelection(indexFromTouchX(evt.nativeEvent.locationX));
    },
  });

  React.useEffect(() => {
    if (!safeData.length) return;
    tooltipX.value = getTooltipXForIndex(selectedIndex);
  }, [chartWidth, plotWidth, plotAreaWidth, safeData.length, selectedIndex]);

  const selected = safeData[selectedIndex];
  const averageY =
    CHART_HEIGHT - (Math.min(averageHours, maxHours) / maxHours) * CHART_HEIGHT;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.chartWrap} onLayout={onChartLayout}>
        <View style={styles.rightAxis}>
          <Text style={styles.axisTop}>{maxHours}h</Text>
          <Text style={styles.axisBottom}>0</Text>
        </View>

        {chartWidth > 0 && selected && (
          <Animated.View style={[styles.tooltip, tooltipStyle]}>
            <Text style={styles.tooltipDay}>{selected.dayFull}</Text>
            <Text style={styles.tooltipDate}>{selected.dateLabel}</Text>
            <Text style={styles.tooltipValue}>
              {formatMinutesToDuration(selected.minutes)}
            </Text>
          </Animated.View>
        )}

        <View
          style={styles.plotArea}
          onLayout={onPlotAreaLayout}
          {...panResponder.panHandlers}
        >
          {Array.from({ length: GRID_LINES + 1 }).map((_, idx) => {
            const y = (CHART_HEIGHT / GRID_LINES) * idx;
            return <View key={idx} style={[styles.gridLine, { top: y }]} />;
          })}

          <View
            style={[
              styles.averageLine,
              { top: averageY },
            ]}
          />
          <Text style={[styles.averageLabel, { top: averageY - 16 }]}>avg</Text>

          <View style={styles.barsRow}>
            {safeData.map((item, index) => {
              const normalized = Math.max(0, Math.min(item.hours, maxHours));
              const barHeight = (normalized / maxHours) * CHART_HEIGHT;
              const isSelected = index === selectedIndex;
              return (
                <View
                  key={`${item.dayFull}-${item.dateLabel}`}
                  style={[styles.barSlot, { width: slotWidth }]}
                  onLayout={(event) => onBarSlotLayout(index, event)}
                >
                  <Animated.View
                    layout={LinearTransition.duration(120)}
                    style={[
                      styles.bar,
                      {
                        width: barWidth,
                        height: Math.max(4, barHeight),
                        opacity: isSelected ? 1 : selected ? 0.45 : 1,
                        transform: [{ scaleY: isSelected ? 1.04 : 1 }],
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.dayLabel,
                      isSelected ? styles.dayLabelSelected : undefined,
                    ]}
                  >
                    {item.dayShort}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    backgroundColor: "#F7F8FB",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: "#E8EBF1",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2430",
    marginBottom: 8,
  },
  chartWrap: {
    position: "relative",
    paddingTop: 54,
  },
  plotArea: {
    height: CHART_HEIGHT + 28,
    justifyContent: "flex-end",
  },
  rightAxis: {
    position: "absolute",
    right: 2,
    top: 58,
    bottom: 24,
    justifyContent: "space-between",
    alignItems: "flex-end",
    zIndex: 4,
  },
  axisTop: {
    fontSize: 11,
    color: "#9298A6",
    fontWeight: "500",
  },
  axisBottom: {
    fontSize: 11,
    color: "#9298A6",
    fontWeight: "500",
  },
  tooltip: {
    position: "absolute",
    top: 4,
    width: TOOLTIP_WIDTH,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#111318",
    zIndex: 5,
  },
  tooltipDay: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  tooltipDate: {
    color: "#CBD0DA",
    fontSize: 10,
    marginTop: 2,
  },
  tooltipValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 3,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: "#E7EAF0",
  },
  averageLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    borderColor: "#8FA0BE",
    borderStyle: "dashed",
    zIndex: 3,
  },
  averageLabel: {
    position: "absolute",
    right: 32,
    color: "#6F7F9F",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "lowercase",
    backgroundColor: "#F7F8FB",
    paddingHorizontal: 4,
  },
  barsRow: {
    height: CHART_HEIGHT + 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    width: "100%",
    paddingRight: RIGHT_AXIS_WIDTH,
  },
  barSlot: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: "auto",
    flex: 0,
    height: CHART_HEIGHT + 24,
  },
  bar: {
    backgroundColor: "#4086FF",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: "#8A90A0",
    fontWeight: "500",
  },
  dayLabelSelected: {
    color: "#1F2430",
    fontWeight: "700",
  },
});
