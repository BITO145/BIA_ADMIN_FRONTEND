import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getChaptersService = async () => {
  const response = await axios.get(`${backendUrl}/sa/get-chapter`, {
    withCredentials: true,
  });
  // Assuming the API returns { chapters: [...] }
  return response.data;
};

export const addChapterService = async (chapterData) => {
  // API endpoint to add a new chapter
  const response = await axios.post(`${backendUrl}/sa/chapter`, chapterData, {
    withCredentials: true,
  });
  return response.data;
};

// new helper to call your PUT /sa/updaterole endpoint
export const updateChapterMemberService = async ({
  chapterId,
  memberId,
  role,
}) => {
  const { data } = await axios.post(
    `${backendUrl}/sa/updaterole`,
    { chapterId, memberId, newRole: role },
    { withCredentials: true, headers: { "Content-Type": "application/json" } }
  );
  return data;
};

export const deleteChapterService = async (chapterId) => {
  const { data } = await axios.post(
    `${backendUrl}/sa/delChap/${chapterId}`,
    {},
    { withCredentials: true }
  );
  return data;
};

export const deleteEventService = async (eventId) => {
  const { data } = await axios.post(
    `${backendUrl}/sa/delEvent/${eventId}`,
    {},
    { withCredentials: true }
  );
  return data;
};