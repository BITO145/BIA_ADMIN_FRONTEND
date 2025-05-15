import React, { useEffect, useState } from "react";
import {
  Calendar,
  CalendarPlus,
  Clock,
  FileText,
  Flag,
  MapPin,
  Trash2,
  UploadCloud,
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
import { getChaptersService } from "../services/chapterService";
import toast from "react-hot-toast";

export default function EventManagement() {
  const dispatch = useDispatch();
  const eventsList = useSelector(selectEvents);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);
  // Fetch chapters from Redux
  const chaptersList = useSelector(selectChapters);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    eventStartTime: "",
    eventEndTime: "",
    eventDate: "",
    location: "",
    description: "",
    membershipRequired: false, // default value via dropdown
    chapter: "", // chapter id string
  });

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        dispatch(setEventLoading(true));
        const response = await getEventsService();
        // Expected response: { events: [...] }
        dispatch(setEvents(response.events));
        console.log("Fetched events from backend:", response.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        dispatch(setEventError("Error fetching events"));
      } finally {
        dispatch(setEventLoading(false));
      }
    };

    fetchEvents();
  }, [dispatch]);

  // Also, fetch chapters if not already available
  useEffect(() => {
    const fetchChapters = async () => {
      if (chaptersList.length === 0) {
        try {
          const response = await getChaptersService();
          // Expected response: { chapters: [...] }
          dispatch(setChapters(response.chapters));
          console.log("Fetched chapters from backend:", response.chapters);
        } catch (err) {
          console.error("Error fetching chapters:", err);
        }
      }
    };
    fetchChapters();
  }, [dispatch, chaptersList.length]);

  // Handler to add an event using the create event API
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
        toast.error("Please fill in all required fields.");
        return;
      }

      // Prepare FormData payload
      const formData = new FormData();
      formData.append("eventName", newEvent.eventName);
      formData.append("eventStartTime", newEvent.eventStartTime);
      formData.append("eventEndTime", newEvent.eventEndTime);
      formData.append("eventDate", newEvent.eventDate);
      formData.append("location", newEvent.location);
      formData.append("image", newEvent.image);
      formData.append("description", newEvent.description);
      formData.append(
        "membershipRequired",
        newEvent.membershipRequired.toString()
      );
      formData.append("chapter", newEvent.chapter);

      const response = await addEventService(formData);

      if (response.success) {
        dispatch(addEvent(response.event));
        toast.success("Event added successfully.");

        setShowAddForm(false);
        setNewEvent({
          eventName: "",
          eventStartTime: "",
          eventEndTime: "",
          eventDate: "",
          location: "",
          description: "",
          membershipRequired: false,
          chapter: "",
          image: "",
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

  // Handler to delete an event
  const handleDeleteEvent = (id) => {
    dispatch(removeEvent(id));
    console.log(`Event with id ${id} deleted`);
    toast.success("Event deleted successfully.");
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
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
                <div className="sm:col-span-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Image
                  </label>
                  <div className="relative">
                    <UploadCloud
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          setNewEvent({ ...newEvent, image: file });
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          image: e.target.files[0],
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white sm:text-sm pl-10 py-2"
                    />
                    <span className="text-sm text-gray-500">
                      Upload an image for the event
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Name
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
                    {event.requiresMembership ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-900"
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
    </div>
  );
}
