export const formatMinutes = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
};

export const totalMinutes = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0);