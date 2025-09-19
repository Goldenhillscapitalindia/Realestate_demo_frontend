
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './CalendarStyles.css';
import 'react-calendar/dist/Calendar.css';
interface CalendarEvent {
  date: string;  // 'YYYY-MM-DD'
  label: string;
}

interface CalendarChartProps {
  data: CalendarEvent[];
  title: string;
}

const CalendarChart: React.FC<CalendarChartProps> = ({ data, title }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getEventsForDate = (date: Date) => {
    const formatted = date.toISOString().split('T')[0];
    return data.filter((event) => event.date === formatted);
  };

  return (
    // <div className="p-4  rounded-xl shadow">
     <>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <Calendar
        onClickDay={(value) => setSelectedDate(value)}
        tileContent={({ date, view }) => {
          if (view !== 'month') return null;

          const events = getEventsForDate(date);
          return events.length > 0 ? (
            <ul className="calendar-events">
              {events.map((event, idx) => (
                <li key={idx} className="calendar-event-dot group">
                  <span className="tooltip group-hover:scale-100">{event.label}</span>
                </li>
              ))}
            </ul>
          ) : null;
        }}
      />

      {selectedDate && (
        <div className="mt-4">
          <h4 className="font-medium">Events on {selectedDate.toDateString()}:</h4>
          <ul className="list-disc list-inside">
            {getEventsForDate(selectedDate).map((event, idx) => (
              <li key={idx}>{event.label}</li>
            ))}
          </ul>
        </div>
      )}
     </>
    // </div>
  );
};

export default CalendarChart;
