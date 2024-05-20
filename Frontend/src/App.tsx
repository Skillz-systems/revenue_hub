import React from "react";
import { Route, Routes } from "react-router-dom";
import ProjectLayout from "./Components/ProjectLayout/ProjectLayout";
import LoginPage from "./Pages/LoginPage";
import DemandInvoiceDocument from "./Components/DemandNotice/DemandInvoiceDocument";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProjectLayout />} />
        <Route path="/home" element={<ProjectLayout />} />
        <Route path="/invoice" element={<DemandInvoiceDocument />} />
      </Routes>
    </>
  );
}

export default App;
