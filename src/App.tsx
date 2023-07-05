import { Box, CssBaseline, ThemeProvider } from '@mui/material';

import { Suspense, lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import AppLoader from './components/AppLoader';
import MainNavigation from './components/MainNavigation';
import TopBar from './components/TopBar';
import { LoadingScreen } from './components/aa-shared/LoadingScreen';
import { RootBox } from './components/aa-shared/RootBox';
import Login from './features/log-in-out/Login';
import LoginProvider from './features/log-in-out/LoginProvider';
import theme from './theme';

const Offers = lazy(() => import('./routes/Offers'));
const Invoices = lazy(() => import('./routes/Invoices'));
const TimeCapture = lazy(() => import('./features/time-capture/TimeCapture'));
const OfferEdit = lazy(() => import('./routes/OfferEdit'));
const Options = lazy(() => import('./routes/Options'));
const Constructions = lazy(() => import('./features/constructions/Constructions'));
const Times = lazy(() => import('./features/times/Times'));
const Upload = lazy(() => import('./routes/Upload'));
const Jobs = lazy(() => import('./routes/Jobs'));

function LazyLoad({ children }: React.PropsWithChildren) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
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
                    <AppLoader>
                      <Outlet />
                    </AppLoader>
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
                >
                  <Route
                    index
                    element={
                      <LazyLoad>
                        <Jobs />
                      </LazyLoad>
                    }
                  />
                </Route>

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
                  />
                </Route>
              </Route>
            </Routes>
          </Box>
        </RootBox>
      </CssBaseline>
    </ThemeProvider>
  );
}
