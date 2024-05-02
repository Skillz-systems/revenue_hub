export default function DemandPropertyComponent({
  iconOne,
  iconTwo,
  buttonTextOne,
  buttonTextTwo,
  openNewDemandInvoiceModal,
  openAddPropertyModal,
}) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <button
        type="button"
        className="flex items-center justify-between button-gradient-one space-x-1 w-1/2 px-2 py-2.5 border border-custom-color-two rounded shadow-custom-100"
        title={buttonTextOne}
        onClick={openNewDemandInvoiceModal}
      >
        <span className="text-sm text-white">{iconOne}</span>
        <span className="text-xs text-left text-white ellipsis font-lexend font-medium">
          {buttonTextOne}
        </span>
      </button>
      <button
        type="button"
        className="flex items-center justify-between button-gradient-two space-x-1 w-1/2 px-2 py-2.5 border border-custom-color-two rounded shadow-custom-100"
        title={buttonTextTwo}
        onClick={openAddPropertyModal}
      >
        <span className="text-sm text-primary-color">{iconTwo}</span>
        <span className="text-xs text-left text-primary-color ellipsis font-lexend font-medium">
          {buttonTextTwo}
        </span>
      </button>
    </div>
  );
}
