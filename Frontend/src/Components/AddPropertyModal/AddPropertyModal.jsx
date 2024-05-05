import React from "react";
import AddProperty from "./AddProperty";

export default function AddPropertyModal({
  hideAddPropertyModal,
  propertyModalTransition,
}) {
  return (
    <div className="w-full overflow-hidden h-screen p-4 absolute top-0 left-0 z-10 bg-black bg-opacity-40 flex justify-end items-start">
      <AddProperty
        hideAddPropertyModal={hideAddPropertyModal}
        propertyModalTransition={propertyModalTransition}
      />
    </div>
  );
}
