import React, { ReactNode } from "react";

interface DemandPropertyModalProps {
  modalStyle: string;
  children: ReactNode;
}

const DemandPropertyModal: React.FC<DemandPropertyModalProps> = ({
  modalStyle,
  children,
}) => {
  return <div className={modalStyle}>{children}</div>;
};

export default DemandPropertyModal;
