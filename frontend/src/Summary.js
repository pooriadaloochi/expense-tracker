import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts";
import { useCallback, useEffect, useState } from "react";
import { fetchJSON } from "./api";
import json from "./texts.json";

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

  return (
    <Stack spacing={2} sx={{ width: "100%", margin: "40px auto" }}>
      <Typography variant="h3" component="div">
        {json.summary_title}
      </Typography>
      <Typography variant="body1" component="div">
        {json.summary_description}
      </Typography>
      <PieChart
        series={[
          {
            data: summary
              ? Object.entries(summary).map(([cat, sum], index) => ({
                  id: index,
                  value: sum,
                  label: cat,
                }))
              : [],
          },
        ]}
        width={200}
        height={200}
      />
    </Stack>
  );
}
