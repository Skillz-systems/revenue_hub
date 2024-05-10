import { Route, Routes } from "react-router-dom";
import ProjectLayout from "./Components/ProjectLayout/ProjectLayout";
import { Overview } from "./Components/Index";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProjectLayout />} />
      </Routes>
    </>
  );
}

export default App;
