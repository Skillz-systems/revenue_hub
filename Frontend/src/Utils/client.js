export function formatNumberWithCommas(number) {
    // Convert the number to a string
    const numStr = String(number);

    // Split the string into integer and decimal parts (if any)
    const [integerPart, decimalPart] = numStr.split(".");

    // Add commas to the integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine the integer and decimal parts (if any)
    const formattedNumber = decimalPart
        ? `${formattedInteger}.${decimalPart}`
        : formattedInteger;

    return formattedNumber;
}

export function filterRecordsByKeyAndValue(recordsArray, key, value) {
    return recordsArray.filter((record) => record[key] === value);
}

export function ScrollToTop(id) {
    const topContainer = document.getElementById(id);
    if (topContainer) {
      topContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }