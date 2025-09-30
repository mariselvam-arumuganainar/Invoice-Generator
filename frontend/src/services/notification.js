// frontend/src/services/notification.js
import { toast } from 'react-toastify';

/**
 * Displays a success notification.
 * @param {string} message The message to display.
 */
export const notifySuccess = (message) => {
  toast.success(message);
};

/**
 * Displays an error notification.
 * @param {string} message The message to display.
 */
export const notifyError = (message) => {
  toast.error(message);
};

/**
 * Displays an informational notification.
 * @param {string} message The message to display.
 */
export const notifyInfo = (message) => {
  toast.info(message);
};
