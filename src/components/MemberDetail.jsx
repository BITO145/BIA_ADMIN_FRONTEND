import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MemberDetails = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_MEMBERSHIP_API_URL}/api/admin/members/${id}`)
      .then((res) => setMember(res.data.member))
      .catch((err) => console.error("Error fetching member details:", err));
  }, [id]);

  if (!member) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Member Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow rounded-lg p-6">
        <div>
          <label className="text-gray-600 font-semibold">Name</label>
          <p className="text-lg">{member.name}</p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Email</label>
          <p>{member.email}</p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Phone</label>
          <p>{member.phone || "-"}</p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">
            Membership Level
          </label>
          <p className="capitalize">{member.membershipLevel}</p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Joined On</label>
          <p>
            {member.dateOfJoining
              ? new Date(member.dateOfJoining).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Expiry Date</label>
          <p>
            {member.membershipExpiryDate
              ? new Date(member.membershipExpiryDate).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Business Sector</label>
          <p>{member.businessSector || "-"}</p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Country</label>
          <p>{member.country || "-"}</p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Nationality</label>
          <p>{member.nationality || "-"}</p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Connection</label>
          <p>{member.connection || "-"}</p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Payment Status</label>
          <p className="capitalize">{member.paymentStatus}</p>
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Events Attended</label>
          <p>{member.noOfEventsAttended}</p>
        </div>

        <div className="md:col-span-2">
          <label className="text-gray-600 font-semibold">About</label>
          <p>{member.about || "-"}</p>
        </div>

        {member.image && (
          <div className="md:col-span-2">
            <label className="text-gray-600 font-semibold">
              Profile Picture
            </label>
            <img
              src={member.image}
              alt="Profile"
              className="mt-2 w-32 h-32 object-cover rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetails;
