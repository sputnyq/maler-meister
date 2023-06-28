import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import MainNavigation from "./components/MainNavigation";
import { Fallback } from "./components/shared/Fallback";
import { RootBox } from "./components/shared/RootBox";
import TopBar from "./components/TopBar";
import theme from "./theme";

const Offers = lazy(() => import("./routes/Offers"));
const Invoices = lazy(() => import("./routes/Invoices"));
const TimeCapture = lazy(() => import("./routes/TimeCapture"));
const OfferEdit = lazy(() => import("./routes/OfferEdit"));

function LazyLoad({ children }: React.PropsWithChildren) {
  return <Suspense fallback={<Fallback />}>{children}</Suspense>;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <RootBox>
          <TopBar />
          <Box mt={8}>
            <Routes>
              <Route index element={<MainNavigation />} />
              <Route path="/" element={<Outlet />}>
                <Route
                  path="invoices"
                  element={
                    <LazyLoad>
                      <Invoices />
                    </LazyLoad>
                  }
                />
                <Route
                  path="time-capture"
                  element={
                    <LazyLoad>
                      <TimeCapture />
                    </LazyLoad>
                  }
                />
                <Route path="offers" element={<Outlet />}>
                  <Route
                    index
                    element={
                      <LazyLoad>
                        <Offers />
                      </LazyLoad>
                    }
                  />
                  <Route
                    path="edit/:id"
                    element={
                      <LazyLoad>
                        <OfferEdit />
                      </LazyLoad>
                    }
                  ></Route>
                </Route>
              </Route>
            </Routes>
          </Box>
        </RootBox>
      </CssBaseline>
    </ThemeProvider>
  );
}
