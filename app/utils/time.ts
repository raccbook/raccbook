export const getTimeAgo = (unixTime: bigint): string => {
  const now = new Date().getTime() / 1000; // convert to seconds
  const diff = Math.floor(now - Number(unixTime));

  if (diff < 60) {
    return `${diff}s`;
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes}m`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}h`;
  } else {
    const days = Math.floor(diff / 86400);
    return `${days}d`;
  }
};
