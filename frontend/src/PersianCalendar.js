import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";
import { prefixer } from "stylis";

// Create rtl cache
const cacheRtl = createCache({
  key: "adapter-date-fns-jalali-demo",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function PersianCalendar() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();

  const theme = React.useMemo(
    () => createTheme(existingTheme, { direction: "rtl" }),
    [existingTheme]
  );

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
            <DateTimePicker
              label="AdapterDateFnsJalali"
              defaultValue={new Date(2022, 1, 1, 12)}
              // Setting `dir="rtl"` on the paper is needed if the `<div dir="rtl />` does not contain the portaled element.
              // If you set `dir="rtl"` on the `<body />`, you can skip it.
              slotProps={{
                desktopPaper: {
                  dir: "rtl",
                },
                mobilePaper: {
                  dir: "rtl",
                },
              }}
            />
          </LocalizationProvider>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
