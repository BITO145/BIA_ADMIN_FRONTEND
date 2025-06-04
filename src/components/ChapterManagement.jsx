import React, { useEffect, useState } from "react";
import {
  Building2,
  Trash2,
  Users,
  X,
  PlusCircle,
  Info,
  User,
  UploadCloud,
} from "lucide-react";
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
  deleteChapterService,
} from "../services/chapterService";
import toast from "react-hot-toast";
import { Switch } from "@headlessui/react";

export default function ChapterManagement() {
  const dispatch = useDispatch();
  const chaptersList = useSelector(selectChapters);
  const loading = useSelector(selectChaptersLoading);
  const error = useSelector(selectChaptersError);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("members");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currMemberId, setCurrMemberId] = useState(null);
  const [newChapter, setNewChapter] = useState({
    chapterName: "",
    zone: "",
    description: "",
    chapterLeadName: "",
    members: [],
    image: "",
  });

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

  useEffect(() => {
    fetchChapters();
  }, [dispatch]);

  const handleAddChapter = async (e) => {
    e.preventDefault();
    try {
      dispatch(setChapterLoading(true));

      const formData = new FormData();
      formData.append("chapterName", newChapter.chapterName);
      formData.append("zone", newChapter.zone);
      formData.append("description", newChapter.description);
      formData.append("chapterLeadName", newChapter.chapterLeadName);
      formData.append("members", JSON.stringify(newChapter.members));
      formData.append("image", newChapter.image);

      const response = await addChapterService(formData);
      if (response.success) {
        toast.success("Chapter added successfully!");
        setShowAddForm(false);
        dispatch(addChapter(response.chapter));
        setShowAddForm(false);
        setNewChapter({
          chapterName: "",
          zone: "",
          description: "",
          chapterLeadName: "",
          members: [],
          image: "",
        });
      }
    } catch {
      dispatch(setChapterError("Error adding chapter"));
      toast.error("Failed to add chapter. Please try again.");
    } finally {
      dispatch(setChapterLoading(false));
    }
  };

  const handleDeleteChapter = async (id) => {
    dispatch(removeChapter(id));
    try {
      dispatch(setChapterLoading(true));
      const response = await deleteChapterService(id);
      if (response.success) {
        toast.success("Chapter deleted successfully!");
        fetchChapters();
      } else {
        toast.error("Failed to delete chapter. Please try again.");
      }
    } catch {
      dispatch(setChapterError("Error deleting chapter"));
      toast.error("Failed to delete chapter. Please try again.");
    } finally {
      dispatch(setChapterLoading(false));
      setShowDeleteModal(false);
      setSelectedChapter(null);
    }
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

  const extractDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure you want to delete this chapter?
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
                onClick={() => handleDeleteChapter(selectedChapter._id)}
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
                  "Delete Chapter"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Chapters</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add Chapter
        </button>
      </div>

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

                <div className="sm:col-span-2">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload Chapter Image
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
                          setNewChapter({ ...newChapter, image: file });
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onChange={(e) =>
                        setNewChapter({
                          ...newChapter,
                          image: e.target.files[0],
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
                    />
                    <span className="text-sm text-gray-500">
                      Upload an image for the chapter
                    </span>
                  </div>
                </div>
                {newChapter.image && (
                  <div className="sm:col-span-2">
                    <img
                      className="mt-2 w-full h-32 object-cover rounded-md"
                      src={URL.createObjectURL(newChapter.image)}
                      alt="Chapter Image Preview"
                    />
                  </div>
                )}

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
                    "Add Chapter"
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
                      onClick={() => {
                        setShowDeleteModal(true);
                        setSelectedChapter(chapter);
                      }}
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
      )}

  {showModal && selectedChapter && (
  <div className="fixed inset-0 bg-gray-300/10 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"> {/* Enhanced backdrop and z-index */}
    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-2xl w-full transform transition-all duration-300 scale-100 opacity-100"> {/* Professional modal container */}
      <div className="flex justify-between items-center border-b pb-4 mb-4"> {/* Stylish header with border */}
        <h3 className="text-2xl font-extrabold text-gray-900"> {/* Larger, bolder title */}
          {selectedChapter.chapterName} -{" "}
          <span className="text-indigo-600"> {/* Highlighted type */}
            {modalType === "events" ? "Events" : "Members"}
          </span>
        </h3>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1 transition-colors" // Enhanced close button
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {modalType === "events" ? (
        selectedChapter.events && selectedChapter.events.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2"> {/* Added max-height and scroll for events */}
            {selectedChapter.events.map((event) => (
              <div
                key={event._id || event.id}
                className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:border-indigo-300" // Enhanced card styling
              >
                <p className="font-semibold text-lg text-gray-800 mb-1">
                  {event.eventName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-indigo-500">Date:</span> {extractDate(event.eventDate)}
                </p>
                {/* Add more event details here if available, e.g., location, description */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8 text-lg">No events available for this chapter.</p>
        )
      ) : selectedChapter.members && selectedChapter.members.length > 0 ? (
        <ul className="space-y-4 max-h-96 overflow-y-auto pr-2"> {/* Added max-height and scroll for members */}
          {selectedChapter.members.map((member) => (
            <li
              key={member.memberId}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-300" // Enhanced member card
            >
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {member.name}
                </p>
                <p className="text-sm text-gray-600">{member.email}</p>
              </div>
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <Switch.Group>
                  <div className="flex items-center">
                    {loading && currMemberId === member.memberId ? (
                      <div>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
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
                      <Switch
                        checked={member.role === "committee"}
                        onChange={() => {
                          handleRoleChange(
                            member.memberId,
                            member.role === "member" ? "committee" : "member"
                          );
                          setCurrMemberId(member.memberId);
                        }}
                        className={`${
                          member.role === "committee"
                            ? "bg-indigo-600"
                            : "bg-gray-300" // Slightly darker gray for off state
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`} // Added focus ring offset
                      >
                        <span className="sr-only">Toggle committee status</span>
                        <span
                          className={`${
                            member.role === "committee"
                              ? "translate-x-5"
                              : "translate-x-0"
                          } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform`} // Added shadow to toggle thumb
                          aria-hidden="true"
                        />
                      </Switch>
                    )}
                    <span className="ml-2 text-sm text-gray-700 font-medium"> {/* Slightly darker text for role */}
                      {member.role === "committee" ? "Committee" : "Member"}
                    </span>
                  </div>
                </Switch.Group>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center py-8 text-lg">No members available for this chapter.</p>
      )}
    </div>
  </div>
)}

      {/* {showModal && selectedChapter && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-100 rounded-lg p-6 max-w-2xl w-full">
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
                      <p className="text-sm text-gray-500">
                        {extractDate(event.eventDate)}
                      </p>
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
                    <div className="flex items-center space-x-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <Switch.Group>
                        <div className="flex items-center">
                          {loading && currMemberId === member.memberId ? (
                            <div>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
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
                            <Switch
                              checked={member.role === "committee"}
                              onChange={() => {
                                handleRoleChange(
                                  member.memberId,
                                  member.role === "member"
                                    ? "committee"
                                    : "member"
                                );
                                setCurrMemberId(member.memberId);
                              }}
                              className={`${
                                member.role === "committee"
                                  ? "bg-indigo-600"
                                  : "bg-gray-200"
                              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                              <span className="sr-only">
                                Toggle committee status
                              </span>
                              <span
                                className={`${
                                  member.role === "committee"
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
                                aria-hidden="true"
                              />
                            </Switch>
                          )}
                          <span className="ml-2 text-sm text-gray-500">
                            {member.role === "committee"
                              ? "Committee"
                              : "Member"}
                          </span>
                        </div>
                      </Switch.Group>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No members available.</p>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}
