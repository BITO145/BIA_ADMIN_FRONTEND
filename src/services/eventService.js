import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getEventsService = async () => {
  try {
    const response = await axios.get(`${backendUrl}/sa/get-event`, {
      withCredentials: true,
    });
    console.log("[EventsService] GET events response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[EventsService] Error fetching events:", error);
    throw error;
  }
};

export const addEventService = async (eventData) => {
  try {
    const response = await axios.post(`${backendUrl}/sa/event`, eventData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    console.log("[EventsService] POST add event response:", response.data);
    return response.data; // Expected format: { event: { ... } } can be changed later lets keep it like this for now
  } catch (error) {
    console.error("[EventsService] Error adding event:", error);
    throw error;
  }
};
