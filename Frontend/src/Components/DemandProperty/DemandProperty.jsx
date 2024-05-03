export default function DemandProperty({
  iconOne,
  iconTwo,
  buttonTextOne,
  buttonTextTwo,
  openNewDemandInvoiceModal,
  openAddPropertyModal,
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        className="flex items-center justify-between button-gradient-one space-x-1 px-2 py-2.5 border border-custom-color-two rounded shadow-custom-100"
        style={{ width: "48.5%" }}
        title={buttonTextOne}
        onClick={openNewDemandInvoiceModal}
      >
        <span className="text-sm text-white">{iconOne}</span>
        <span
          className="font-medium text-left text-white ellipsis font-lexend"
          style={{ fontSize: "0.6875rem" }}
        >
          {buttonTextOne}
        </span>
      </button>
      <button
        type="button"
        className="flex items-center justify-between button-gradient-two space-x-1  px-2 py-2.5 border border-custom-color-two rounded shadow-custom-100"
        style={{ width: "48.5%" }}
        title={buttonTextTwo}
        onClick={openAddPropertyModal}
      >
        <span className="text-sm text-primary-color">{iconTwo}</span>
        <span
          className="font-medium text-left text-primary-color ellipsis font-lexend"
          style={{ fontSize: "0.6875rem" }}
        >
          {buttonTextTwo}
        </span>
      </button>
    </div>
  );
}
