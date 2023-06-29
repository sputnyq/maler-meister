import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import LoginProvider from "./components/LoginProvider";
import MainNavigation from "./components/MainNavigation";
import { Fallback } from "./components/shared/Fallback";
import { RootBox } from "./components/shared/RootBox";
import TopBar from "./components/TopBar";
import Login from "./routes/Login";
import theme from "./theme";

const Offers = lazy(() => import("./routes/Offers"));
const Invoices = lazy(() => import("./routes/Invoices"));
const TimeCapture = lazy(() => import("./routes/TimeCapture"));
const OfferEdit = lazy(() => import("./routes/OfferEdit"));
const Times = lazy(() => import("./routes/Times"));
const Options = lazy(() => import("./routes/Options"));
const Constructions = lazy(() => import("./routes/Constructions"));
const Upload = lazy(() => import("./routes/Upload"));

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
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <LoginProvider>
                    <Outlet />
                  </LoginProvider>
                }
              >
                <Route index element={<MainNavigation />} />
                <Route
                  path="invoices"
                  element={
                    <LazyLoad>
                      <Invoices />
                    </LazyLoad>
                  }
                />
                <Route
                  path="upload"
                  element={
                    <LazyLoad>
                      <Upload />
                    </LazyLoad>
                  }
                />
                <Route
                  path="constructions"
                  element={
                    <LazyLoad>
                      <Constructions />
                    </LazyLoad>
                  }
                />
                <Route
                  path="options"
                  element={
                    <LazyLoad>
                      <Options />
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
                <Route
                  path="time"
                  element={
                    <LazyLoad>
                      <Times />
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
