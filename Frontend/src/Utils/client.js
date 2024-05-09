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