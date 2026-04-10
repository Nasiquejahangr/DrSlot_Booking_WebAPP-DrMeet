import React, { useEffect, useState } from 'react'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserMd, FaArrowRight } from 'react-icons/fa'
import { getUserAppointments } from '../../util/Localstorage'
import { getPatientAppointmentsFromDb } from '../../api/userApi'
import { useNavigate } from 'react-router-dom'

function Appointment() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const navigate = useNavigate()

  const currentUserId = Number(sessionStorage.getItem("currentUserId") || localStorage.getItem("currentUserId"));

  useEffect(() => {
    const loadAppointments = async () => {
      if (!currentUserId) {
        setAppointments([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setFetchError('')
        const dbAppointments = await getPatientAppointmentsFromDb(currentUserId)
        setAppointments(dbAppointments)
      } catch (error) {
        setFetchError(error?.message || 'Unable to fetch appointments from database.')
        setAppointments(getUserAppointments(currentUserId))
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [currentUserId])

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const filterAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'upcoming') {
      return appointments.filter(apt =>
        new Date(apt.date) >= today && apt.status !== 'cancelled' && apt.status !== 'completed'
      );
    } else if (activeTab === 'past') {
      return appointments.filter(apt =>
        new Date(apt.date) < today || apt.status === 'completed' || apt.status === 'cancelled'
      );
    }
    return appointments;
  }

  const filteredAppointments = filterAppointments()
  const upcomingCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length
  const completedCount = appointments.filter(a => a.status === 'completed').length

  return (
    <div className="min-h-screen bg-white px-4 pb-24 pt-4 sm:px-5">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Appointments</h2>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">Manage and view your appointment history</p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard title="Total" value={appointments.length} tone="gray" icon={<FaCalendarAlt />} />
            <StatCard title="Upcoming" value={upcomingCount} tone="blue" icon={<FaClock />} />
            <div className="col-span-2 sm:col-span-1">
              <StatCard title="Completed" value={completedCount} tone="green" icon={<FaCalendarAlt />} />
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-1 shadow-sm">
          <div className="grid grid-cols-3 gap-1">
            {['upcoming', 'past', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold capitalize transition-all ${activeTab === tab
                  ? 'bg-[#1a79f7] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-100 bg-white px-4 py-12 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#1a79f7]" />
            <p className="font-medium text-gray-600">Loading appointments...</p>
          </div>
        ) : (
          <>
            {fetchError && (
              <div className="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
                {fetchError} Showing cached appointments.
              </div>
            )}

            {filteredAppointments.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white px-4 py-12 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <FaCalendarAlt className="text-2xl text-[#1a79f7]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">No appointments found</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 sm:text-base">
                  {activeTab === 'upcoming'
                    ? 'You have no upcoming appointments. Book an appointment to see it here.'
                    : 'No appointments in this category.'}
                </p>
                <button
                  onClick={() => navigate('/search')}
                  className="mx-auto mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1a79f7] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#1563d1]"
                >
                  Book Appointment
                  <FaArrowRight />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50">
                        {appointment.profileImage ? (
                          <img
                            src={appointment.profileImage}
                            alt={appointment.fullName || 'Doctor'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#1a79f7]">
                            <FaUserMd className="text-2xl" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                              {appointment.doctorName || appointment.fullName || appointment.name || 'Doctor'}
                            </h3>
                            <p className="text-sm font-medium text-gray-700 sm:text-base">{appointment.specialization || appointment.specialty || ''}</p>
                            <p className="text-xs text-gray-500 sm:text-sm">{appointment.qualification}</p>
                          </div>
                          <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-2 rounded-2xl bg-gray-50 p-3 sm:grid-cols-3 sm:gap-3 sm:p-4">
                          <InfoPill icon={<FaCalendarAlt />} label="Date" value={new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
                          <InfoPill icon={<FaClock />} label="Time" value={appointment.time || 'N/A'} />
                          <InfoPill icon={<FaMapMarkerAlt />} label="Location" value={appointment.clinicLocation || 'N/A'} />
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <div className="inline-flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-2">
                            <p className="text-xs text-gray-600">Consultation Fee</p>
                            <p className="text-lg font-bold text-[#1a79f7]">₹{appointment.fee || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, tone = 'gray' }) {
  const tones = {
    gray: 'border-gray-200 bg-white text-gray-700',
    blue: 'border-blue-200 bg-blue-50 text-[#1a79f7]',
    green: 'border-green-200 bg-green-50 text-green-600',
  }

  const toneClass = tones[tone] || tones.gray

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium">{title}</p>
          <p className="mt-1 text-xl font-bold">{value}</p>
        </div>
        <div className="rounded-xl bg-white/70 p-2">
          {icon}
        </div>
      </div>
    </div>
  )
}

function InfoPill({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <div className="rounded-lg bg-white p-2 text-[#1a79f7]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-500">{label}</p>
        <p className="truncate font-semibold">{value}</p>
      </div>
    </div>
  )
}

export default Appointment
