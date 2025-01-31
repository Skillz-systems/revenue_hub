import React from "react";

const AlertDialog = ({ isOpen, message, onConfirm, onCancel, confirmMessage, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative w-96 bg-white rounded-xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-black-900 mb-4">Attention</h2>
        <p className="text-gray-700 text-sm mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12c0-3.036 2.057-5.824 5.824-5.824 3.069 0 5.824 2.786 5.824 5.824 0 3.038-2.755 5.824-5.824 5.824z"
                  />
                </svg>

              </div>
            ) : (
              confirmMessage
            )}
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;