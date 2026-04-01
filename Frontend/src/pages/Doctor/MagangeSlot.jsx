import { useState, useEffect } from "react";
import { getDoctorSlots, saveDoctorSlots, DEFAULT_SLOTS } from "../../util/Localstorage";

function ManageSlots() {
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [newTime, setNewTime] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTime, setEditTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentDoctorId = Number(sessionStorage.getItem("currentDoctorId") || localStorage.getItem("currentDoctorId"));

  const loadSlots = (date) => {
    if (!date) {
      setSlots([]);
      return;
    }
    const loaded = getDoctorSlots(currentDoctorId, date);
    setSlots(loaded);
  };

  useEffect(() => {
    loadSlots(selectedDate);
    // Reset editing state when date changes
    setEditingIndex(null);
    setEditTime("");
    setError("");
    setSuccess("");
  }, [selectedDate]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ── Add slot ──────────────────────────────────────────────────────────────
  const handleAdd = () => {
    clearMessages();

    if (!selectedDate || !newTime) {
      setError("Please select a date and enter a time.");
      return;
    }

    // Convert HH:MM (24h) from <input type="time"> to "HH:MM AM/PM" display format
    const formattedTime = formatTime(newTime);

    // Get current stored slots (may be DEFAULT_SLOTS if none stored yet)
    const currentSlots = getDoctorSlots(currentDoctorId, selectedDate);

    // Check for duplicate
    if (currentSlots.some((s) => s.time === formattedTime)) {
      setError("A slot with this time already exists for the selected date.");
      return;
    }

    // If currentSlots are the defaults (not yet stored), initialize with them first
    const baseSlots = currentSlots === DEFAULT_SLOTS ? [...DEFAULT_SLOTS] : [...currentSlots];
    const updated = [...baseSlots, { time: formattedTime, isBooked: false }];

    saveDoctorSlots(currentDoctorId, selectedDate, updated);
    setNewTime("");
    setSuccess("Slot added successfully.");
    loadSlots(selectedDate);
  };

  // ── Edit slot ─────────────────────────────────────────────────────────────
  const handleEditSave = (index) => {
    clearMessages();

    const slot = slots[index];

    if (slot.isBooked) {
      setError("Cannot edit a booked slot.");
      return;
    }

    if (!editTime) {
      setError("Please enter a new time.");
      return;
    }

    const formattedTime = formatTime(editTime);

    // Duplicate check — exclude the slot being edited
    const isDuplicate = slots.some((s, i) => i !== index && s.time === formattedTime);
    if (isDuplicate) {
      setError("A slot with this time already exists for the selected date.");
      return;
    }

    const updated = slots.map((s, i) =>
      i === index ? { ...s, time: formattedTime } : s
    );

    saveDoctorSlots(currentDoctorId, selectedDate, updated);
    setEditingIndex(null);
    setEditTime("");
    setSuccess("Slot updated successfully.");
    loadSlots(selectedDate);
  };

  // ── Delete slot ───────────────────────────────────────────────────────────
  const handleDelete = (index) => {
    clearMessages();

    const slot = slots[index];

    if (slot.isBooked) {
      setError("Cannot delete a booked slot.");
      return;
    }

    const updated = slots.filter((_, i) => i !== index);
    saveDoctorSlots(currentDoctorId, selectedDate, updated);
    setSuccess("Slot deleted successfully.");
    loadSlots(selectedDate);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  /**
   * Convert "HH:MM" (24-hour from <input type="time">) to "HH:MM AM/PM" format.
   */
  function formatTime(value) {
    const [hourStr, minute] = value.split(":");
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${String(hour).padStart(2, "0")}:${minute} ${period}`;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Slots</h2>

      {/* Date picker */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <label className="block text-sm font-medium mb-1">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Error / Success messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-300">
          {success}
        </div>
      )}

      {/* Slot list */}
      {selectedDate && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Slots for {selectedDate}</h3>

          {slots.length === 0 ? (
            <p className="text-gray-500 text-sm">No slots available for this date.</p>
          ) : (
            <ul className="space-y-2">
              {slots.map((slot, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border rounded p-2"
                >
                  {editingIndex === index ? (
                    /* Inline edit form */
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="border p-1 rounded flex-1"
                      />
                      <button
                        onClick={() => handleEditSave(index)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingIndex(null);
                          setEditTime("");
                          clearMessages();
                        }}
                        className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    /* Normal slot row */
                    <>
                      <span className="font-medium">{slot.time}</span>
                      <div className="flex items-center gap-2">
                        {slot.isBooked ? (
                          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                            Booked
                          </span>
                        ) : (
                          <>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                              Available
                            </span>
                            <button
                              onClick={() => {
                                clearMessages();
                                setEditingIndex(index);
                                setEditTime("");
                              }}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(index)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Add slot form */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Add New Slot</h3>
        <div className="flex gap-2">
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Slot
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageSlots;
