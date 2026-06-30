export const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return num.toLocaleString();
};

export const formatDecimal = (num, places = 1) => {
  if (num === undefined || num === null) return "0";
  return Number(num).toFixed(places);
};

export const formatCalories = (cal) => {
  if (!cal) return "0 cal";
  return `${Math.round(cal).toLocaleString()} cal`;
};

export const formatWeight = (weight, unit = "kg") => {
  if (!weight) return `0 ${unit}`;
  return `${Number(weight).toFixed(1)} ${unit}`;
};

export const formatDuration = (minutes) => {
  if (!minutes) return "0 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateShort = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateShort(date);
};

export const formatPercentage = (value, total) => {
  if (!total || !value) return "0%";
  return `${Math.round((value / total) * 100)}%`;
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Good Night";
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

export const getDayName = (date) => {
  return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
};

export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str, length = 100) => {
  if (!str) return "";
  return str.length > length ? `${str.slice(0, length)}...` : str;
};

export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
