import React, { useEffect, useState } from "react";
import { Building2, Trash2, Users, X, PlusCircle, Info, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setChapters,
  addChapter,
  removeChapter,
  setChapterLoading,
  setChapterError,
  updateChapterMember,
  selectChapters,
  selectChaptersLoading,
  selectChaptersError,
} from "../slices/chapter/chapterSlice";
import {
  getChaptersService,
  addChapterService,
  updateChapterMemberService,
} from "../services/chapterService";

export default function ChapterManagement() {
  const dispatch = useDispatch();
  const chaptersList = useSelector(selectChapters);
  const loading = useSelector(selectChaptersLoading);
  const error = useSelector(selectChaptersError);

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

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        dispatch(setChapterLoading(true));
        const response = await getChaptersService();
        dispatch(setChapters(response.chapters));
      } catch (err) {
        dispatch(setChapterError("Error fetching chapters"));
      } finally {
        dispatch(setChapterLoading(false));
      }
    };
    fetchChapters();
  }, [dispatch]);

  const handleAddChapter = async (e) => {
    e.preventDefault();
    try {
      dispatch(setChapterLoading(true));
      const response = await addChapterService(newChapter);
      dispatch(addChapter(response.chapter));
      setShowAddForm(false);
      setNewChapter({
        chapterName: "",
        zone: "",
        description: "",
        chapterLeadName: "",
        members: [],
      });
    } catch {
      dispatch(setChapterError("Error adding chapter"));
    } finally {
      dispatch(setChapterLoading(false));
    }
  };

  const handleDeleteChapter = (id) => {
    dispatch(removeChapter(id));
  };

  const handleViewMembers = (chapter) => {
    setSelectedChapter(chapter);
    setModalType("members");
    setShowModal(true);
  };

  const handleViewEvents = (chapter) => {
    setSelectedChapter(chapter);
    setModalType("events");
    setShowModal(true);
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      dispatch(setChapterLoading(true));
      await updateChapterMemberService({
        chapterId: selectedChapter._id,
        memberId,
        role: newRole,
      });
      dispatch(
        updateChapterMember({
          chapterId: selectedChapter.id,
          memberId,
          role: newRole,
        })
      );
      setSelectedChapter((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          m.memberId === memberId ? { ...m, role: newRole } : m
        ),
      }));
    } catch {
      dispatch(setChapterError("Error updating member role"));
    } finally {
      dispatch(setChapterLoading(false));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Chapters</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add Chapter
        </button>
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                Create New Chapter
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-white hover:text-indigo-100 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddChapter} className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="chapterName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Chapter Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {/* You can add a generic icon if desired, like a tag */}
                    <input
                      type="text"
                      id="chapterName"
                      required
                      value={newChapter.chapterName}
                      onChange={(e) =>
                        setNewChapter({
                          ...newChapter,
                          chapterName: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3 py-2"
                      placeholder="Enter chapter name"
                    />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="zone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Zone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {/* You can add a location icon if desired */}
                    <input
                      type="text"
                      id="zone"
                      required
                      value={newChapter.zone}
                      onChange={(e) =>
                        setNewChapter({ ...newChapter, zone: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3 py-2"
                      placeholder="Enter zone name"
                    />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="chapterLeadName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Chapter Lead <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      id="chapterLeadName"
                      required
                      value={newChapter.chapterLeadName}
                      onChange={(e) =>
                        setNewChapter({
                          ...newChapter,
                          chapterLeadName: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
                      placeholder="Enter lead's full name"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Info
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={20}
                    />
                    <textarea
                      id="description"
                      required
                      value={newChapter.description}
                      onChange={(e) =>
                        setNewChapter({
                          ...newChapter,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
                      placeholder="Describe this chapter's purpose and mission"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                >
                  Create Chapter
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

      {showModal && selectedChapter && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedChapter.chapterName} -{" "}
                {modalType === "events" ? "Events" : "Members"}
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
              <ul className="space-y-4">
                {selectedChapter.members.map((member) => (
                  <li
                    key={member.memberId}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member.memberId, e.target.value)
                        }
                        className="mt-1 block w-36 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="member">Member</option>
                        <option value="committee">Committee Member</option>
                      </select>
                    </div>
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
