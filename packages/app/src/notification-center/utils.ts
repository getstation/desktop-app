export const minutesBeforeHeightAm = () => {
  const heightAm = new Date();
  const now = new Date();
  heightAm.setDate(heightAm.getDate() + 1);
  heightAm.setHours(8, 0, 0, 0);
  const diff = now.getTime() - heightAm.getTime();
  return Math.abs(Math.round(diff / 60000));
};
