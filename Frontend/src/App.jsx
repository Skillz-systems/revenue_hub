import { Route, Routes } from "react-router-dom";
import ProjectLayout from "./Components/ProjectLayout/ProjectLayout";
import PropertyCard from "./Components/PropertyCard/PropertyCard";

function App() {
  return (
    <>
      <Routes>
        {/* Pass custom placeholder values as props */}
        <Route
          path="/"
          element={
            <div className="grid grid-cols-4 gap-4">
              <PropertyCard
                houseType=" House Type"
                paymentStatus=" Payment Status"
                pin=" Pin"
                address=" Address"
                Zone=" Zone"
                location=" Location"
                Value=" Value"
              />
              <PropertyCard
                houseType=" House Type"
                paymentStatus="ungenerated"
                pin=" Pin"
                address=" Address"
                Zone=" Zone"
                location=" Location"
                Value=" Value"
              />
              <PropertyCard
                houseType=" House Type"
                paymentStatus=" Payment Status"
                pin=" Pin"
                address=" Address"
                Zone=" Zone"
                location=" Location"
                Value=" Value"
              /> <PropertyCard
                houseType=" House Type"
                paymentStatus=" Payment Status"
                pin=" Pin"
                address=" Address"
                Zone=" Zone"
                location=" Location"
                Value=" Value"
              />
            </div>

          }
        />
        <Route path="/home" element={<ProjectLayout />} />
      </Routes>
    </>
  );
}

export default App;

