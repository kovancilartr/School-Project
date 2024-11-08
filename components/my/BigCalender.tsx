"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = ({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 7, 0, 0)}
      max={new Date(2025, 1, 0, 23, 0, 0)}
      formats={{
        timeGutterFormat: "HH:mm",
        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
          localizer?.format(start, "HH:mm", culture) +
          " - " +
          localizer?.format(end, "HH:mm", culture),
      }}
    />
  );
};

export default BigCalendar;