export function convertTo12Hour(timeString) {
  if (!timeString) return "";

  const date = new Date(timeString);
  if (isNaN(date.getTime())) return timeString; // Invalid date fallback

  let hours = date.getUTCHours(); // Use getHours() for local time, getUTCHours() for UTC
  const minutes = date.getUTCMinutes(); // Same note as above

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

