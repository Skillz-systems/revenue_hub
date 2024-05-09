import { Route, Routes } from "react-router-dom";
import ProjectLayout from "./Components/ProjectLayout/ProjectLayout";
import {
  Overview,
  Properties,
  Statistics,
  DemandNotice,
  Transactions,
  Staff,
  Settings,
} from "./Components/Index";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProjectLayout page={Overview} />} />
        <Route
          path="/properties"
          element={<ProjectLayout page={Properties} />}
        />
        <Route
          path="/statistics"
          element={<ProjectLayout page={Statistics} />}
        />
        <Route
          path="/demand-notice"
          element={<ProjectLayout page={DemandNotice} />}
        />
        <Route
          path="/transactions"
          element={<ProjectLayout page={Transactions} />}
        />
        <Route path="/staff" element={<ProjectLayout page={Staff} />} />
        <Route path="/settings" element={<ProjectLayout page={Settings} />} />
      </Routes>
    </>
  );
}

export default App;
