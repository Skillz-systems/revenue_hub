import { Route, Routes } from "react-router-dom";
import ProjectLayout from "./Components/ProjectLayout/ProjectLayout";
import LoginPage from "./Components/LoginPage/LoginPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProjectLayout />} />
        <Route path="/home" element={<ProjectLayout />} />
      </Routes>
    </>
  );
}

export default App;
