import { Route, Routes, Navigate } from "react-router-dom";
import ProjectLayout from "./Components/ProjectLayout/ProjectLayout";
import LoginPage from "./Pages/LoginPage";
import ProtectedRoute from "./Context/ProtectedRoute";
import Payment from "./Pages/Payment";
import AccountPassword from "./Pages/AccountPassword";
import ConfirmAccount from "./Pages/ConfirmAccount";
import PageNotFound from "./Pages/PageNotFound";
import { ErrorProvider } from "./Context/ErrorContext";
import ErrorBoundary from "./Context/ErrorBoundary";

function App() {
  return (
    <>
      <ErrorProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/confirm-account/:id/:token/"
            element={
              <ErrorBoundary>
                <ConfirmAccount />
              </ErrorBoundary>
            }
          />
          <Route
            path="/create-password/:id/:token/"
            element={
              <ErrorBoundary>
                <AccountPassword />
              </ErrorBoundary>
            }
          />
          <Route
            path="/invoice/:pid"
            element={
              <ErrorBoundary>
                <Payment />
              </ErrorBoundary>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ProjectLayout />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ErrorProvider>
    </>
  );
}

export default App;
