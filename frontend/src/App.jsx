import createCache from "@emotion/cache";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import ExpensesDataGrid from "./expensesReport/ExpensesDataGrid";
//
import "@fontsource/vazir";
import "@fontsource/vazir/700.css";
import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";

function App() {
  const theme = (outerTheme) =>
    createTheme({
      direction: "rtl",
      typography: {
        fontFamily: "Vazir, Roboto, sans-serif",
      },
      palette: {
        mode: "dark",
      },
    });

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ExpensesDataGrid />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
