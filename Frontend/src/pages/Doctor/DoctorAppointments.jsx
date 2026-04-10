import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { getDoctorAppointments } from "../../util/Localstorage";
import { getDoctorAppointmentsFromDb } from "../../api/doctorApi";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

function DoctorAppointments() {
  const navigate = useNavigate();
  const currentDoctorId = Number(sessionStorage.getItem("currentDoctorId") || localStorage.getItem("currentDoctorId"));
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const loadAppointments = async () => {
      if (!currentDoctorId) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setFetchError("");
        const dbAppointments = await getDoctorAppointmentsFromDb(currentDoctorId);
        setAppointments(dbAppointments);
      } catch (error) {
        setFetchError(error?.message || "Unable to fetch appointments from database.");
        setAppointments(getDoctorAppointments(currentDoctorId));
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [currentDoctorId]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = appointments.filter((a) => {
    const apptDate = new Date(a.date);
    if (activeTab === "upcoming") return apptDate >= today;
    if (activeTab === "past") return apptDate < today;
    return true;
  });

  const upcomingCount = appointments.filter((a) => new Date(a.date) >= today).length;
  const pastCount = appointments.filter((a) => new Date(a.date) < today).length;

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="mx-auto mt-4 mb-20 max-w-3xl px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#1a79f7] hover:text-[#1a79f7]"
      >
        <HiArrowLeft className="h-5 w-5" />
        Back
      </button>

      <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <h2 className="text-2xl font-bold text-gray-900">Booked Appointments</h2>
        <p className="mt-1 text-sm text-gray-500">Track your patient appointments by date and status.</p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-xs font-medium text-gray-500">Total</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{appointments.length}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">
            <p className="text-xs font-medium text-gray-500">Upcoming</p>
            <p className="mt-1 text-2xl font-bold text-[#1a79f7]">{upcomingCount}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-green-200 bg-green-50 p-4 text-center sm:col-span-1">
            <p className="text-xs font-medium text-gray-500">Past</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{pastCount}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 grid grid-cols-3 gap-1 rounded-2xl border border-gray-100 bg-white p-1 shadow-sm">
        {["upcoming", "past", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl py-3 px-4 font-semibold transition-all capitalize ${activeTab === tab
              ? "bg-[#1a79f7] text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#1a79f7]" />
          Loading appointments...
        </div>
      ) : (
        <>
          {fetchError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-sm text-yellow-700">
              {fetchError} Showing cached appointments.
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <FaCalendarAlt className="text-2xl text-[#1a79f7]" />
              </div>
              <p className="text-lg font-semibold text-gray-800">No appointments in this category.</p>
              <p className="mt-2 text-sm text-gray-500">Switch tabs to check other appointments.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((appt) => (
                <div key={appt.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-50 border-2 border-blue-200 shrink-0 flex items-center justify-center">
                      {appt.patientProfileImage ? (
                        <img src={appt.patientProfileImage} alt={appt.patientName || "patient"} className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="text-blue-400 text-2xl" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-900">{appt.patientName || appt.fullName || appt.name || "Patient"}</p>
                      <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(appt.status)}`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="rounded-lg bg-white p-2 text-[#1a79f7]">
                        <FaCalendarAlt />
                      </div>
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
                      <div className="rounded-lg bg-white p-2 text-[#1a79f7]">
                        <FaClock />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-semibold">{appt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="rounded-lg bg-white p-2 text-[#1a79f7]">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-semibold">{appt.clinicLocation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2">
                      <p className="text-xs text-gray-600">Consultation Fee</p>
                      <p className="text-lg font-bold text-[#1a79f7]">₹{appt.fee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DoctorAppointments;
