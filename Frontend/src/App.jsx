import { Route, Routes } from "react-router-dom";
import ProjectLayout from "./Components/ProjectLayout/ProjectLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProjectLayout />} />
        <Route path="/home" element={<ProjectLayout />} />
      </Routes>
    </>
  );
}

export default App;
