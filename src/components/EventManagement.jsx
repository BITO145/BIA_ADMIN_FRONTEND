import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  CalendarPlus,
  Clock,
  FileText,
  Flag,
  Link,
  MapPin,
  Trash2,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { convertTo12Hour } from "../utils/timeformat";
import {
  setEvents,
  addEvent,
  removeEvent,
  setEventLoading,
  setEventError,
  selectEvents,
  selectEventsLoading,
  selectEventsError,
} from "../slices/event/eventSlice";
import { getEventsService, addEventService } from "../services/eventService";
// Import chapters from Redux:
import { setChapters, selectChapters } from "../slices/chapter/chapterSlice";
import {
  deleteEventService,
  getChaptersService,
} from "../services/chapterService";
import toast from "react-hot-toast";
import { Cropper } from "react-cropper";
import ImageCropperModal from "./ImageCropperModal";

export default function EventManagement() {
  const dispatch = useDispatch();
  const eventsList = useSelector(selectEvents);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);
  const chaptersList = useSelector(selectChapters);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [selectedEventMembers, setSelectedEventMembers] = useState([]);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    slots: 0,
    link: "",
    eventStartTime: "",
    eventEndTime: "",
    eventDate: "",
    location: "",
    description: "",
    membershipRequired: false,
    chapter: "",
    image: null,
  });

  const [isCropperModalOpen, setIsCropperModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);

  const fetchEvents = async () => {
    try {
      dispatch(setEventLoading(true));
      const response = await getEventsService();
      dispatch(setEvents(response.events));
    } catch (err) {
      console.error("Error fetching events:", err);
      dispatch(setEventError("Error fetching events"));
    } finally {
      dispatch(setEventLoading(false));
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [dispatch]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (chaptersList.length === 0) {
        try {
          const response = await getChaptersService();
          dispatch(setChapters(response.chapters));
        } catch (err) {
          console.error("Error fetching chapters:", err);
        }
      }
    };
    fetchChapters();
  }, [dispatch, chaptersList.length]);

  const handleFileChangeForCropper = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setIsCropperModalOpen(true);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast.error("Failed to read image file.");
        setImageToCrop(null);
      };
      reader.readAsDataURL(file);
    } else {
      setImageToCrop(null);
    }
    e.target.value = "";
  };

  const handleCroppedImage = (imageBlob) => {
    setNewEvent({ ...newEvent, image: imageBlob });
    setIsCropperModalOpen(false);
    setImageToCrop(null);
    toast.success("Image cropped and ready for upload!");
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      dispatch(setEventLoading(true));

      if (
        !newEvent.eventName ||
        !newEvent.eventDate ||
        !newEvent.eventStartTime ||
        !newEvent.eventEndTime ||
        !newEvent.location ||
        !newEvent.chapter ||
        !newEvent.image
      ) {
        toast.error("Please fill in all required fields and upload an image.");
        return;
      }

      if (newEvent.membershipRequired && newEvent.slots <= 0) {
        toast.error(
          "Slots must be greater than 0 for membership required events."
        );
        return;
      }

      const formData = new FormData();
      formData.append("eventName", newEvent.eventName);
      formData.append("slots", newEvent.slots);
      formData.append("link", newEvent.link);
      formData.append("eventStartTime", newEvent.eventStartTime);
      formData.append("eventEndTime", newEvent.eventEndTime);
      formData.append("eventDate", newEvent.eventDate);
      formData.append("location", newEvent.location);
      formData.append("image", newEvent.image, "event_image.jpeg");
      formData.append("description", newEvent.description);
      formData.append("membershipRequired", newEvent.membershipRequired);
      formData.append("chapter", newEvent.chapter);

      const response = await addEventService(formData);

      if (response.success) {
        dispatch(addEvent(response.event));
        toast.success("Event added successfully.");

        setShowAddForm(false);
        setNewEvent({
          eventName: "",
          slots: 0,
          link: "",
          eventStartTime: "",
          eventEndTime: "",
          eventDate: "",
          location: "",
          description: "",
          membershipRequired: false,
          chapter: "",
          image: null,
        });
      }
    } catch (err) {
      console.error("Error adding event:", err);
      dispatch(setEventError("Error adding event"));
      toast.error("Failed to add event. Please try again.");
    } finally {
      dispatch(setEventLoading(false));
    }
  };

  const handleDeleteEvent = async (id) => {
    dispatch(removeEvent(id));
    try {
      dispatch(setEventLoading(true));
      const response = await deleteEventService(id);
      if (response.success) {
        toast.success("Event deleted successfully.");
        fetchEvents();
      } else {
        toast.error("Failed to delete event. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      dispatch(setEventError("Error deleting event"));
      toast.error("Failed to delete event. Please try again.");
    } finally {
      dispatch(setEventLoading(false));
      setShowDeleteModal(false);
      setDeleteEventId(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {showMembersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg relative">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Event Members
            </h3>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {selectedEventMembers.length > 0 ? (
                selectedEventMembers.map((member, idx) => (
                  <li key={idx} className="border p-2 rounded-md bg-gray-50">
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">
                  No members registered.
                </li>
              )}
            </ul>
            <button
              onClick={() => setShowMembersModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure you want to delete this event?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. All associated data will be lost.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvent(deleteEventId)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Deleting...</span>
                  </span>
                ) : (
                  "Delete Event"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <CalendarPlus className="w-5 h-5 mr-2" />
          Add Event
        </button>
      </div>

      {showAddForm && (
        <div className="fixed h-screen inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                Create New Event
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-white hover:text-indigo-100 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="eventName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Name
                  </label>
                  <div className="relative">
                    <Flag
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      id="eventName"
                      required
                      value={newEvent.eventName}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, eventName: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm pl-10 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="eventDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="date"
                      id="eventDate"
                      required
                      value={newEvent.eventDate}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, eventDate: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm pl-10 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="eventStartTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Time
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="time"
                      id="eventStartTime"
                      required
                      value={newEvent.eventStartTime}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          eventStartTime: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm pl-10 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="eventEndTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Time
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="time"
                      id="eventEndTime"
                      required
                      value={newEvent.eventEndTime}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          eventEndTime: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm pl-10 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      id="location"
                      required
                      value={newEvent.location}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, location: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm pl-10 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="slots"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Slots
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="number"
                      id="slots"
                      required
                      value={newEvent.slots}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, slots: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm pl-10 py-2"
                    />
                    <span className="text-gray-400 text-xs">
                      (If membership is not required then no need to add slots)
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="link"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Link
                  </label>
                  <div className="relative">
                    <Link
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      id="link"
                      value={newEvent.link}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, link: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm pl-10 py-2"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="image-upload"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Event Image
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                      className="hidden"
                      onChange={handleFileChangeForCropper}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("image-upload").click()
                      }
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <UploadCloud className="mr-2" size={20} />
                      {newEvent.image ? "Change Image" : "Choose Image"}
                    </button>
                    {newEvent.image && (
                      <p className="mt-2 text-sm text-gray-500">
                        Image selected:{" "}
                        <span className="font-semibold">
                          {newEvent.image.name || "cropped_image.jpeg"}
                        </span>{" "}
                        (Ready to upload)
                      </p>
                    )}
                    <span className="text-sm text-gray-500 block mt-1">
                      Upload an image for the event (e.g., JPEG, PNG, GIF)
                    </span>
                  </div>
                </div>
                {newEvent.image && (
                  <div className="sm:col-span-2">
                    <img
                      className="mt-2 w-full h-32 object-cover rounded-md"
                      src={URL.createObjectURL(newEvent.image)}
                      alt=""
                    />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <FileText
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <textarea
                      id="description"
                      required
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm pl-10 py-2"
                    />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <input
                    id="membershipRequired"
                    name="membershipRequired"
                    type="checkbox"
                    checked={newEvent.membershipRequired}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        membershipRequired: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="requiresMembership"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    This event requires membership
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="chapter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Chapter
                  </label>
                  <div className="relative">
                    <Flag
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <select
                      id="chapter"
                      required
                      value={newEvent.chapter}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, chapter: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm pl-10 py-2"
                    >
                      <option value="">Select Chapter</option>
                      {chaptersList.map((chapter) => (
                        <option key={chapter._id} value={chapter._id}>
                          {chapter.chapterName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Loading...</span>
                    </span>
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slots
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventsList.map((event) => {
                // Parse date for display.
                let displayDate = "Invalid Date";
                const dateObj = new Date(event.eventDate);
                if (!isNaN(dateObj.getTime())) {
                  displayDate = dateObj.toLocaleDateString();
                }

                const displayStartTime = convertTo12Hour(event.eventStartTime);
                const displayEndTime = convertTo12Hour(event.eventEndTime);

                return (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.eventName}
                    </td>
                    <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                      {event.membershipRequired ? (
                        event.slots
                      ) : (
                        <span className="text-green-500 bg-green-50 p-2 rounded-full text-xs">
                          Open for all
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {displayDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {displayStartTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {displayEndTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.membershipRequired ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end space-x-4">
                      <button
                        onClick={() => {
                          setSelectedEventMembers(event.members || []);
                          setShowMembersModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Members"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteEventId(event._id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Event"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <ImageCropperModal
        isOpen={isCropperModalOpen}
        onClose={() => setIsCropperModalOpen(false)}
        imageSrc={imageToCrop}
        onCropComplete={handleCroppedImage}
        isLoading={loading}
      />
    </div>
  );
}
