import React, { useEffect, useState } from "react";
import {
  Trash2,
  PlusCircle,
  Info,
  UploadCloud,
  Briefcase,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOpportunities,
  setOpportunities,
  addOpportunity,
  removeOpportunity,
  setOppLoading,
  setOppError,
  selectOppLoading,
  selectOppError,
} from "../slices/opportunity/oppSlice";
import { createOppService, getOppService } from "../services/oppService";
import toast from "react-hot-toast";

export default function OpportunityManagement() {
  const dispatch = useDispatch();
  const opportunities = useSelector(selectOpportunities);
  const loading = useSelector(selectOppLoading);
  const error = useSelector(selectOppError);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newOpp, setNewOpp] = useState({
    oppName: "",
    oppDate: "",
    location: "",
    image: null,
    description: "",
    membershipRequired: false,
  });

  const handleAddOpportunity = async (e) => {
    e.preventDefault();
    try {
      dispatch(setOppLoading(true));

      const formData = new FormData();
      formData.append("oppName", newOpp.oppName);
      formData.append("oppDate", newOpp.oppDate);
      formData.append("location", newOpp.location);
      formData.append("image", newOpp.image);
      formData.append("description", newOpp.description);
      formData.append("membershipRequired", newOpp.membershipRequired);

      const response = await createOppService(formData);
      dispatch(addOpportunity(response));
      toast.success("Opportunity added successfully!");
      setShowAddForm(false);
      setNewOpp({
        oppName: "",
        oppDate: "",
        location: "",
        image: null,
        description: "",
        membershipRequired: false,
      });
    } catch (err) {
      dispatch(setOppError("Failed to add opportunity."));
      toast.error("Failed to add opportunity.");
    } finally {
      dispatch(setOppLoading(false));
    }
  };

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        dispatch(setOppLoading(true));
        const data = await getOppService();
        dispatch(setOpportunities(data.opportunities)); // if backend sends { opportunities: [...] }
      } catch (err) {
        dispatch(setOppError("Failed to load opportunities."));
      } finally {
        dispatch(setOppLoading(false));
      }
    };

    fetchOpportunities();
  }, [dispatch]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Manage Opportunities
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add Opportunity
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 overflow-hidden">
            <form onSubmit={handleAddOpportunity} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Opportunity Name
                </label>
                <div className="relative">
                  <Briefcase
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={newOpp.oppName}
                    onChange={(e) =>
                      setNewOpp({ ...newOpp, oppName: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="relative">
                  <CalendarDays
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                  <input
                    type="date"
                    value={newOpp.oppDate}
                    onChange={(e) =>
                      setNewOpp({ ...newOpp, oppDate: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={newOpp.location}
                    onChange={(e) =>
                      setNewOpp({ ...newOpp, location: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <div className="relative">
                  <UploadCloud
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewOpp({ ...newOpp, image: e.target.files[0] })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="relative">
                  <Info
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                  <textarea
                    rows={4}
                    value={newOpp.description}
                    onChange={(e) =>
                      setNewOpp({ ...newOpp, description: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="membershipRequired"
                  type="checkbox"
                  checked={newOpp.membershipRequired}
                  onChange={(e) =>
                    setNewOpp({
                      ...newOpp,
                      membershipRequired: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="membershipRequired"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Requires Membership
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                >
                  {loading ? "Loading..." : "Add Opportunity"}
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membership
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opportunities.map((opp) => (
              <tr key={opp._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {opp.oppName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {opp.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(opp.oppDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {opp.membershipRequired ? "Yes" : "No"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
