import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts";
import { useCallback, useEffect, useState } from "react";
import { fetchJSON } from "../api";

export default function Summary({ rows }) {
  const [summary, setSummary] = useState(null);

  const getSummary = useCallback(async () => {
    if (rows) {
      const data = await fetchJSON("summary");
      setSummary(data);
    }
  }, [rows]);

  useEffect(() => {
    getSummary();
  }, [getSummary]);

  const total =
    summary && Object.values(summary).length > 0
      ? Object.values(summary).reduce((acc, val) => acc + Number(val), 0)
      : 0;

  const chartData =
    summary && total > 0
      ? Object.entries(summary).map(([cat, sum], index) => ({
          id: index,
          value: sum,
          label: `${cat} (${((sum / total) * 100).toFixed(1)}%)`,
        }))
      : [];

  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        margin: "47px auto",
        height: "75dvh",
        sx: {
          boxShadow: 2,
          border: 2,
          borderRadius: 2,
          borderColor: "#e0e0e0",
          m: 2,
        },
      }}
    >
      <Typography variant="body1" component="div" textAlign="center">
        خلاصه هزینه‌ها
      </Typography>

      <PieChart
        series={[
          {
            data: chartData,
            arcLabel: (item) => `${((item.value / total) * 100).toFixed(1)}%`,
            arcLabelMinAngle: 10,
          },
        ]}
        width={200}
        height={200}
      />

      {summary && (
        <Stack spacing={1} sx={{ textAlign: "end", mt: 2, px: 1 }}>
          {Object.entries(summary).map(([category, amount]) => {
            const percent = ((amount / total) * 100).toFixed(1);
            return (
              <Stack key={category} display="flex" flexDirection="row" justifyContent="flex-end">
                <Typography
                  variant="body2"
                  sx={{
                    color: "#888",
                    marginRight: "1rem",
                    display: "inline",
                  }}
                >
                  {percent}%
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    marginRight: "0.5rem",
                    display: "inline",
                    width: "50%",
                  }}
                >
                  {category}: <strong>{amount.toLocaleString()} ریال</strong> —{" "}
                </Typography>
              </Stack>
            );
          })}

          <Typography
            variant="h6"
            sx={{ mt: 1, borderTop: "1px solid #ccc", pt: 1 }}
          >
            جمع کل: <strong>{total.toLocaleString()} ریال</strong>
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
