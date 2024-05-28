import React from "react";
import { Route, Routes } from "react-router-dom";
import ProjectLayout from "./Components/ProjectLayout/ProjectLayout";
import LoginPage from "./Pages/LoginPage";
import ProtectedRoute from "./Context/ProtectedRoute";
import Payment from "./Pages/Payment"

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/invoice/:pid" element={<Payment />} />
        <Route path="/" element={
          <ProtectedRoute>
            <ProjectLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
