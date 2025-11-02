import createCache from "@emotion/cache";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import "./App.css";
import ExpensesDataGrid from "./DataGrid";
//
import { createTheme } from "@mui/material/styles";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";

function App() {
  const theme = (outerTheme) =>
    createTheme({
      direction: "rtl",
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
        <ExpensesDataGrid />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
