// utils/formatHelpers.js
import processImage from "./imageProcessor.js";

/**
 * Format a date string to 'YYYY-MM-DD'.
 * @param {string} dateString 
 * @returns {string|null}
 */
function formatDateForBackend(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Process and normalize employee data.
 * @param {Object} employee 
 * @returns {Promise<Object>}
 */
export async function processEmployeeData(employee) {
  const processed = { ...employee };
  
  // Convert empty strings to null
  Object.keys(processed).forEach((k) => {
    if (processed[k] === "") processed[k] = null;
  });

  const dateFields = [
    "dateOfBirth", "joiningDate", "offerLetterDate", "appointmentLetterDate",
    "promotionDate", "startDate", "endDate", "payDate", "workStartDate", "workEndDate"
  ];
  dateFields.forEach((field) => {
    processed[field] = formatDateForBackend(processed[field]);
  });

  const booleanFields = [
    "offerLetterSent", "appointmentLetterSent", "eligibleForPromotion", "hra",
    "conveyanceAllowance", "medicalAllowance", "epfEmployee", "epfEmployer",
    "otherExpenses", "professionalTax", "gratuityProvision", "eligibleForIncentive"
  ];
  booleanFields.forEach((field) => {
    processed[field] = (processed[field] === "yes" || processed[field] === true) ? 1 : 0;
  });

  processed.picture = await processImage(processed.picture);
  processed.aadharCardImage = await processImage(processed.aadharCardImage);
  processed.panCardImage = await processImage(processed.panCardImage);

  return processed;
}
