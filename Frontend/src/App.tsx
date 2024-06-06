import React from "react";
import { Route, Routes } from "react-router-dom";
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
    <ErrorProvider>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/confirm-account/:id/:token/"
            element={<ConfirmAccount />}
          />
          <Route
            path="/create-password/:id/:token/"
            element={<AccountPassword />}
          />
          <Route path="/invoice/:pid" element={<Payment />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProjectLayout />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ErrorBoundary>
    </ErrorProvider>
  );
}

export default App;
