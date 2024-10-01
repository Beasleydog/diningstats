import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DayOfTheWeek({
  dataForTodaysDayOfWeek,
  COLORS,
  selectedHalls,
  selectedDay,
}) {
  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    dataForTodaysDayOfWeek.length > 0 && (
      <div>
        <h2>
          Dining Hall Occupancy for{" "}
          {new Date(0, 0, selectedDay).toLocaleString("en-us", {
            weekday: "long",
          })}
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dataForTodaysDayOfWeek}>
            <XAxis
              dataKey="Timestamp"
              type="category"
              tickFormatter={formatTime}
            />
            <YAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip labelFormatter={(label) => formatTime(new Date(label))} />
            <Legend />
            {Object.keys(selectedHalls)
              .filter((key) => selectedHalls[key])
              .map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  dot={false}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  );
}
