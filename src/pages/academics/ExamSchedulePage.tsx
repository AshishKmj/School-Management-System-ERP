import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Calendar, Plus, Printer, Clock, MapPin, Download } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

interface ScheduleItem {
  id: string;
  examName: string;
  className: string;
  subjectName: string;
  date: string;
  timeSlot: string;
  roomNo: string;
}

const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: 'sc_1', examName: 'Term 1 Mid-Term Assessment 2027', className: 'Class 5', subjectName: 'English Core', date: '2027-10-15', timeSlot: '09:00 AM - 12:00 PM', roomNo: 'Hall A (Room 201)' },
  { id: 'sc_2', examName: 'Term 1 Mid-Term Assessment 2027', className: 'Class 5', subjectName: 'Hindi Course A', date: '2027-10-17', timeSlot: '09:00 AM - 12:00 PM', roomNo: 'Hall A (Room 201)' },
  { id: 'sc_3', examName: 'Term 1 Mid-Term Assessment 2027', className: 'Class 5', subjectName: 'Mathematics', date: '2027-10-19', timeSlot: '09:00 AM - 12:00 PM', roomNo: 'Hall A (Room 201)' },
  { id: 'sc_4', examName: 'Term 1 Mid-Term Assessment 2027', className: 'Class 5', subjectName: 'General Science', date: '2027-10-22', timeSlot: '09:00 AM - 12:00 PM', roomNo: 'Science Lab 1' },
  { id: 'sc_5', examName: 'Term 1 Mid-Term Assessment 2027', className: 'Class 5', subjectName: 'Social Studies', date: '2027-10-24', timeSlot: '09:00 AM - 12:00 PM', roomNo: 'Hall A (Room 201)' },
];

export const ExamSchedulePage: React.FC = () => {
  const { showToast, school } = useAppStore();
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New form state
  const [subjectName, setSubjectName] = useState('Computer Applications');
  const [date, setDate] = useState('2027-10-26');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 12:00 PM');
  const [roomNo, setRoomNo] = useState('Computer Lab 2');

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ScheduleItem = {
      id: `sc_${Date.now()}`,
      examName: 'Term 1 Mid-Term Assessment 2027',
      className: selectedClass,
      subjectName,
      date,
      timeSlot,
      roomNo,
    };
    setSchedules([...schedules, newItem]);
    setIsAddOpen(false);
    showToast({
      title: 'Schedule Item Added',
      message: `${subjectName} timetable slotted for ${date}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Examination Board
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Exam Date Sheet & Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hall time slots, seating allotments, and printable student exam date sheets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Date Sheet</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-950/5 flex items-center gap-3">
        <label className="text-xs font-bold text-slate-600">Select Class Date Sheet:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
        >
          <option>Class 5</option>
          <option>Class 6</option>
          <option>Class 7</option>
          <option>Class 8</option>
          <option>Class 9</option>
          <option>Class 10</option>
        </select>
      </div>

      {/* Timetable view */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden">
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm tracking-wide">
              {school.name} • Official Examination Schedule
            </h3>
            <span className="text-[11px] text-teal-200">
              CBSE Affiliation: {school.affiliationNumber} • {selectedClass} Date Sheet
            </span>
          </div>
          <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold">
            Term 1 Mid-Term Assessment 2027
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {schedules.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">
                    Slot {idx + 1}
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {item.date.slice(-2)}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.subjectName}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.timeSlot}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {item.roomNo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Exam Schedule Slot"
        subtitle="Schedule date, timing, and hall allocation"
      >
        <form onSubmit={handleAddSchedule} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Time Slot
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Hall / Room
            </label>
            <input
              type="text"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              Schedule Exam
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
