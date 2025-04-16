import React, { useEffect, useState } from "react";
import { Building2, Trash2, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setChapters,
  addChapter,
  removeChapter,
  setChapterLoading,
  setChapterError,
  selectChapters,
  selectChaptersLoading,
  selectChaptersError,
} from "../slices/chapter/chapterSlice";
import {
  getChaptersService,
  addChapterService,
} from "../services/chapterService";

export default function ChapterManagement() {
  const dispatch = useDispatch();
  const chaptersList = useSelector(selectChapters);
  const loading = useSelector(selectChaptersLoading);
  const error = useSelector(selectChaptersError);

  // Local UI state for modal and form
  const [showAddForm, setShowAddForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("members");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [newChapter, setNewChapter] = useState({
    chapterName: "",
    zone: "",
    description: "",
    chapterLeadName: "",
    members: [],
  });
  // Fetch chapters from the backend API on component mount.
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        dispatch(setChapterLoading(true));
        const response = await getChaptersService();
        // Expecting response in the format: { chapters: [...] }
        dispatch(setChapters(response.chapters));
      } catch (err) {
        console.error("Error fetching chapters:", err);
        dispatch(setChapterError("Error fetching chapters"));
      } finally {
        dispatch(setChapterLoading(false));
      }
    };

    fetchChapters();
  }, [dispatch]);

  // Add a new chapter using the API
  const handleAddChapter = async (e) => {
    e.preventDefault();
    try {
      dispatch(setChapterLoading(true));
      // Create a new chapter via API using the correct keys
      const response = await addChapterService(newChapter);
      // Expecting response in format: { chapter: { ... } }
      dispatch(addChapter(response.chapter));
      setShowAddForm(false);
      setNewChapter({
        chapterName: "",
        zone: "",
        description: "",
        chapterLeadName: "",
        members: [],
      });
    } catch (err) {
      console.error("Error adding chapter:", err);
      dispatch(setChapterError("Error adding chapter"));
    } finally {
      dispatch(setChapterLoading(false));
    }
  };

  // Delete chapter will integrate later
  const handleDeleteChapter = (id) => {
    dispatch(removeChapter(id));
  };

  // View members for the selected chapter
  const handleViewMembers = (chapter) => {
    setSelectedChapter(chapter);
    setModalType("members");
    setShowModal(true);
  };

  // View events for the selected chapter
  const handleViewEvents = (chapter) => {
    setSelectedChapter(chapter);
    setModalType("events");
    setShowModal(true);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Chapters</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Building2 className="w-5 h-5 mr-2" />
          Add Chapter
        </button>
      </div>

      {loading && <p className="text-gray-500 mb-4">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showAddForm && (
        <form
          onSubmit={handleAddChapter}
          className="mb-8 bg-gray-50 p-4 rounded-lg"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chapter Name
              </label>
              <input
                type="text"
                required
                value={newChapter.chapterName}
                onChange={(e) =>
                  setNewChapter({ ...newChapter, chapterName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zone
              </label>
              <input
                type="text"
                required
                value={newChapter.zone}
                onChange={(e) =>
                  setNewChapter({ ...newChapter, zone: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lead Name
              </label>
              <input
                type="text"
                required
                value={newChapter.chapterLeadName}
                onChange={(e) =>
                  setNewChapter({
                    ...newChapter,
                    chapterLeadName: e.target.value,
                  })
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
                value={newChapter.description}
                onChange={(e) =>
                  setNewChapter({ ...newChapter, description: e.target.value })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
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
              Add Chapter
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chapter Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chaptersList.map((chapter) => (
              <tr key={chapter.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {chapter.chapterName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {chapter.zone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {chapter.chapterLeadName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewMembers(chapter)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Users className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleViewEvents(chapter)}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    Events
                  </button>
                  <button
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing members or events related to a chapter */}
      {showModal && selectedChapter && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedChapter.chapterName}{" "}
                {modalType === "events" ? "- Events" : "- Members"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            {modalType === "events" ? (
              selectedChapter.events && selectedChapter.events.length > 0 ? (
                <ul className="space-y-2">
                  {selectedChapter.events.map((event) => (
                    <li
                      key={event._id || event.id}
                      className="p-2 border rounded"
                    >
                      <p className="font-medium">{event.eventName}</p>
                      <p className="text-sm text-gray-500">{event.eventDate}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No events available.</p>
              )
            ) : selectedChapter.members &&
              selectedChapter.members.length > 0 ? (
              <ul className="space-y-2">
                {selectedChapter.members.map((memberId) => (
                  <li key={memberId} className="p-2 border rounded">
                    <p className="font-medium">Member ID: {memberId}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No members available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
