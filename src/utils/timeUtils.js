export const getTimeAgo = (uploadDate) => {
  const now = new Date();
  const past = new Date(uploadDate);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

export const unitTimeToIST = (unitTime) => {
  const date = new Date(unitTime * 1000);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const hours = date.getHours();

  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();

  // Seconds part from the timestamp
  const seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  const formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

  return {
    date: date.toLocaleDateString("en-US", options),
    time: formattedTime,
  };
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
