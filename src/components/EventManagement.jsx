import React, { useEffect, useState } from "react";
import { CalendarPlus, Trash2 } from "lucide-react";
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
      const response = await addEventService(newEvent);
      // Expected response: { event: { ... } }
      dispatch(addEvent(response.event));
      console.log("Event added:", response.event);
      alert("Event added successfully.");
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
      });
    } catch (err) {
      console.error("Error adding event:", err);
      dispatch(setEventError("Error adding event"));
      alert("Error adding event. Please try again.");
    } finally {
      dispatch(setEventLoading(false));
    }
  };

  // Handler to delete an event
  const handleDeleteEvent = (id) => {
    dispatch(removeEvent(id));
    console.log(`Event with id ${id} deleted`);
    alert("Event deleted successfully.");
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
        <form
          onSubmit={handleAddEvent}
          className="mb-8 bg-gray-50 p-4 rounded-lg"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Name
              </label>
              <input
                type="text"
                required
                value={newEvent.eventName}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, eventName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                required
                value={newEvent.eventDate}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, eventDate: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                required
                value={newEvent.eventStartTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, eventStartTime: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                required
                value={newEvent.eventEndTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, eventEndTime: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                required
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center mt-4">
              <input
                id="membershipRequired"
                name="membershipRequired"
                type="checkbox"
                checked={newEvent.membershipRequired} // ✅ correct key
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    membershipRequired: e.target.checked, // ✅ correct key
                  })
                }
              />

              <label
                htmlFor="requiresMembership"
                className="ml-2 block text-sm text-gray-700"
              >
                This event requires membership
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chapter
              </label>
              <select
                required
                value={newEvent.chapter}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, chapter: e.target.value })
                }
                className="mt-1 block w-full ..."
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
              Add Event
            </button>
          </div>
        </form>
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
