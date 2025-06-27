import React, { useEffect, useState } from "react";
import { getMembers } from "../services/analyticService";
import { useNavigate } from "react-router-dom";

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getMembers().then((data) => {
      const all = data.members || [];
      setMembers(all);
      setFiltered(all);
    });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filteredMembers = members.filter(
      (m) =>
        m.name?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term) ||
        m.phone?.toLowerCase().includes(term) ||
        m.country?.toLowerCase().includes(term)
    );
    setFiltered(filteredMembers);
  }, [searchTerm, members]);

  return (
    <div className="p-4 max-w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Members Directory</h2>
        <input
          type="text"
          placeholder="Search by name, email, phone, or country"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg shadow overflow-auto max-h-[600px]">
        <table className="min-w-full text-sm text-left table-fixed">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="w-[200px] px-4 py-3 font-semibold">Name</th>
              <th className="w-[250px] px-4 py-3 font-semibold">Email</th>
              <th className="w-[150px] px-4 py-3 font-semibold">Phone</th>
              <th className="w-[180px] px-4 py-3 font-semibold">Membership</th>
              <th className="w-[180px] px-4 py-3 font-semibold">Joined On</th>
              <th className="w-[180px] px-4 py-3 font-semibold">Expires On</th>
              <th className="w-[200px] px-4 py-3 font-semibold">Business</th>
              <th className="w-[180px] px-4 py-3 font-semibold">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((member) => (
              <tr key={member._id} className="hover:bg-gray-50">
                <td
                  className="px-4 py-3 text-blue-600 cursor-pointer hover:underline font-medium truncate"
                  onClick={() => navigate(`/admin/members/${member._id}`)}
                >
                  {member.name}
                </td>
                <td className="px-4 py-3 truncate">{member.email}</td>
                <td className="px-4 py-3">{member.phone || "-"}</td>
                <td className="px-4 py-3 capitalize">
                  {member.membershipLevel}
                </td>
                <td className="px-4 py-3">
                  {member.dateOfJoining
                    ? new Date(member.dateOfJoining).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  {member.membershipExpiryDate
                    ? new Date(member.membershipExpiryDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-3 truncate">
                  {member.businessSector || "-"}
                </td>
                <td className="px-4 py-3">{member.country || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500 mt-2">Scroll to see full table ⟶</p>
    </div>
  );
};

export default MembersList;
