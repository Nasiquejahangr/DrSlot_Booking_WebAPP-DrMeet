import React, { useState } from 'react'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa'
import { getUserAppointments } from '../../util/Localstorage'

function Appointment() {
  const [activeTab, setActiveTab] = useState('upcoming')

  const currentUserId = Number(sessionStorage.getItem("currentUserId") || localStorage.getItem("currentUserId"));
  const appointments = getUserAppointments(currentUserId);

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

  return (
    <>
      {/* Main Container */}
      <div className="min-h-screen mb-20 from-blue-50 to-white mt-10 pb-10 px-3">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-3 text-center">
            <h2 className='text-3xl font-bold text-gray-900 mb-1'>My Appointments</h2>
            <p className='text-gray-600'>Manage and view your appointment history</p>
          </div>

          <div className="flex overflow-x-auto text-center gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="flex justify-between items-center gap-5">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-xl">
                  <FaCalendarAlt className="text-gray-600 text-2xl" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="flex justify-between items-center gap-5">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Upcoming</p>
                  <p className="text-2xl font-bold text-[#1a79f7]">
                    {appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FaClock className="text-[#1a79f7] text-2xl" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
              <div className="flex justify-between items-center gap-5">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {appointments.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <FaCalendarAlt className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm mb-6 p-1">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${activeTab === 'upcoming'
                  ? 'bg-[#1a79f7] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${activeTab === 'past'
                  ? 'bg-[#1a79f7] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Past
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${activeTab === 'all'
                  ? 'bg-[#1a79f7] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                All
              </button>
            </div>
          </div>


          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-gray-400 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500 text-lg mb-6">
                {activeTab === 'upcoming'
                  ? 'You have no upcoming appointments. Book an appointment to see it here.'
                  : 'No appointments in this category.'}
              </p>
              <button className="bg-[#1a79f7] hover:bg-[#1563d1] text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-md">
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row items-start gap-5">
                    {/* Doctor Image */}
                    <div className="rounded-2xl w-20 h-20 flex items-center justify-center overflow-hidden bg-blue-50 shrink-0 border-2 border-blue-200">
                      <img
                        src={appointment.profileImage}
                        alt={appointment.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Appointment Details */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{appointment.doctorName || appointment.fullName || appointment.name || 'Doctor'}</h3>
                          <p className="text-base text-gray-700 font-medium">{appointment.specialization || appointment.specialty || ''}</p>
                          <p className="text-sm text-gray-500">{appointment.qualification}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>

                      {/* Date, Time, Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="bg-white p-2 rounded-lg">
                            <FaCalendarAlt className="text-[#1a79f7]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-semibold">{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="bg-white p-2 rounded-lg">
                            <FaClock className="text-[#1a79f7]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-semibold">{appointment.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="bg-white p-2 rounded-lg">
                            <FaMapMarkerAlt className="text-[#1a79f7]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="font-semibold">{appointment.clinicLocation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Fee */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="bg-blue-50 px-4 py-2 rounded-xl">
                          <p className="text-xs text-gray-600 mb-0.5">Consultation Fee</p>
                          <p className="text-xl font-bold text-[#1a79f7]">₹{appointment.fee}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Appointment
