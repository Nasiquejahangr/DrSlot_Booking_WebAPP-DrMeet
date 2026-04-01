import { useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { getDoctorAppointments } from "../../util/Localstorage";

function DoctorAppointments() {
  const currentDoctorId = Number(sessionStorage.getItem("currentDoctorId") || localStorage.getItem("currentDoctorId"));
  const appointments = getDoctorAppointments(currentDoctorId);

  const [activeTab, setActiveTab] = useState("upcoming");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = appointments.filter((a) => {
    const apptDate = new Date(a.date);
    if (activeTab === "upcoming") return apptDate >= today;
    if (activeTab === "past") return apptDate < today;
    return true;
  });

  return (
    <div className="p-4 max-w-2xl mx-auto mt-4 mb-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Booked Appointments</h2>

      {/* Stats */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex-1 text-center">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
        </div>
        <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm flex-1 text-center">
          <p className="text-gray-500 text-sm">Upcoming</p>
          <p className="text-2xl font-bold text-[#1a79f7]">
            {appointments.filter((a) => new Date(a.date) >= today).length}
          </p>
        </div>
        <div className="bg-white border border-green-200 rounded-2xl p-4 shadow-sm flex-1 text-center">
          <p className="text-gray-500 text-sm">Past</p>
          <p className="text-2xl font-bold text-green-600">
            {appointments.filter((a) => new Date(a.date) < today).length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm mb-6 p-1 flex gap-1">
        {["upcoming", "past", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-all capitalize ${activeTab === tab
              ? "bg-[#1a79f7] text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No appointments in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => (
            <div key={appt.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-50 border-2 border-blue-200 shrink-0 flex items-center justify-center">
                  {appt.profileImage ? (
                    <img src={appt.profileImage} alt="patient" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-blue-400 text-2xl" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{appt.doctorName || "Patient"}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                    {appt.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaCalendarAlt className="text-[#1a79f7]" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold">
                      {new Date(appt.date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaClock className="text-[#1a79f7]" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-semibold">{appt.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaMapMarkerAlt className="text-[#1a79f7]" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold">{appt.clinicLocation}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Consultation Fee</p>
                <p className="text-lg font-bold text-[#1a79f7]">₹{appt.fee}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;
