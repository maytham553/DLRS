import { IDPFormData } from "../types/idp";

/**
 * Checks if an IDP has passed its expiration date
 * @param data The IDP form data
 * @returns True if the IDP has passed its expiration date
 */
export const hasIDPExpired = (data: IDPFormData): boolean => {
  if (!data.expiryDate) {
    return true;
  }

  const currentDate = new Date();
  const expirationDate = new Date(data.expiryDate?.seconds * 1000);

  return currentDate > expirationDate;
};

/**
 * Gets the actual IDP status considering the stored status value
 * Status is only determined by what is stored in the database, not by expiration date
 * @param data The IDP form data
 * @returns The status as a StatusType
 */
export const getIDPStatus = (data: IDPFormData): any => {
  if (data.isCanceled) {
    return "canceled";
  }

  // if expired, return expired
  if (hasIDPExpired(data)) {
    return "expired";
  }

  return "active";
};

/**
 * Format the status for display purposes
 * @param data The IDP form data
 * @returns An object with text and className for displaying the status
 */
export const getStatusDisplay = (
  data: IDPFormData
): { text: string; className: string } => {
  if (data.isCanceled) {
    return { text: "Canceled", className: "text-red-500" };
  }

  if (hasIDPExpired(data)) {
    return { text: "Expired", className: "text-orange-500" };
  }

  return { text: "Active", className: "text-green-500" };
};

/**
 * Gets the HTML/CSS class for the status bar color
 * @param data The IDP form data
 * @returns A CSS class string for the status bar
 */
export const getStatusBarClass = (data: IDPFormData): string => {
  const status = getIDPStatus(data);

  switch (status) {
    case "canceled":
      return "bg-red-500";
    case "approved":
      return "bg-green-500";
    case "expired":
      return "bg-orange-500";
    default:
      return "bg-green-500";
  }
};

/**
 * Gets the expiration date for an IDP
 * @param data The IDP form data
 * @returns A date object representing the expiration date
 */
export const getExpirationDate = (data: IDPFormData): Date | null => {
  return data.expiryDate ? new Date(data.expiryDate.seconds * 1000) : null;
};

/**
 * Gets the expiration date as a formatted string in YYYY-MM-DD format
 * @param data The IDP form data
 * @returns A formatted date string or 'Unknown' if no issue date
 */
export const getFormattedExpirationDate = (data: IDPFormData): string => {
  const expirationDate = getExpirationDate(data);

  if (!expirationDate) {
    return "Unknown";
  }

  return expirationDate.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
};

/**
 * Gets the issue date (created date) as a formatted string in YYYY-MM-DD format
 * @param data The IDP form data
 * @returns A formatted date string or current date as fallback
 */
export const getFormattedIssueDate = (data: IDPFormData): string => {
  if (data.createdAt) {
    return new Date(data.createdAt.seconds * 1000).toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  }
  return new Date().toISOString().split("T")[0]; // Returns YYYY-MM-DD format
};

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
