import { IDPFormData, StatusType } from "../types/idp";

/**
 * Checks if an IDP has passed its expiration date
 * @param data The IDP form data
 * @returns True if the IDP has passed its expiration date
 */
export const hasIDPExpired = (data: IDPFormData): boolean => {
  if (!data.createdAt) {
    return false;
  }

  const issueDate = new Date(data.createdAt.seconds * 1000);
  const currentDate = new Date();
  const expirationDate = new Date(issueDate);

  if (data.duration === "1 year") {
    expirationDate.setFullYear(issueDate.getFullYear() + 1);
  } else {
    expirationDate.setFullYear(issueDate.getFullYear() + 3);
  }

  return currentDate > expirationDate;
};

/**
 * Gets the actual IDP status considering the stored status value
 * Status is only determined by what is stored in the database, not by expiration date
 * @param data The IDP form data
 * @returns The status as a StatusType
 */
export const getIDPStatus = (data: IDPFormData): StatusType => {
  // If there's a status stored in the database, respect that
  if (data.status) {
    return data.status;
  }

  // Default to approved if no status is set
  return "approved";
};

/**
 * Format the status for display purposes
 * @param data The IDP form data
 * @returns An object with text and className for displaying the status
 */
export const getStatusDisplay = (
  data: IDPFormData
): { text: string; className: string } => {
  const status = getIDPStatus(data);

  // Note: status is determined solely by what's stored in the database,
  // not by expiration date (even if the IDP is expired but status is 'approved')

  switch (status) {
    case "canceled":
      return {
        text: "CANCELED",
        className: "bg-red-100 text-red-700",
      };
    case "expired":
      return {
        text: "EXPIRED",
        className: "bg-orange-100 text-orange-700",
      };
    case "approved":
      return {
        text: "APPROVED",
        className: "bg-green-100 text-green-700",
      };
    default:
      return {
        text: "APPROVED",
        className: "bg-green-100 text-green-700",
      };
  }
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
  if (!data.createdAt) {
    return null;
  }

  const issueDate = new Date(data.createdAt.seconds * 1000);
  const expirationDate = new Date(issueDate);

  if (data.duration === "1 year") {
    expirationDate.setFullYear(issueDate.getFullYear() + 1);
  } else {
    expirationDate.setFullYear(issueDate.getFullYear() + 3);
  }

  return expirationDate;
};

/**
 * Gets the expiration date as a formatted string
 * @param data The IDP form data
 * @returns A formatted date string or 'Unknown' if no issue date
 */
export const getFormattedExpirationDate = (data: IDPFormData): string => {
  const expirationDate = getExpirationDate(data);

  if (!expirationDate) {
    return "Unknown";
  }

  return expirationDate.toLocaleDateString();
};

/**
 * Gets the issue date (created date) as a formatted string
 * @param data The IDP form data
 * @returns A formatted date string or current date as fallback
 */
export const getFormattedIssueDate = (data: IDPFormData): string => {
  if (data.createdAt) {
    return new Date(data.createdAt.seconds * 1000).toLocaleDateString();
  }
  return new Date().toLocaleDateString();
};
