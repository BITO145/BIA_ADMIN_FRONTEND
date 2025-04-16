export function convertTo12Hour(timeString) {
  // If timeString is empty or invalid, return an empty string.
  if (!timeString) return "";

  // Example input: "09:00:00" or "09:00".
  const [hourStr, minuteStr] = timeString.split(":");
  if (!hourStr || !minuteStr) return timeString; // Fallback to raw input if parsing fails.

  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert "0" to "12", "13" to "1", etc.

  // Return a string in the format "9:00 AM".
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}
