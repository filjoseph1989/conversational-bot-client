import React from 'react';

interface StatusMessageProps {
  type: 'success' | 'error';
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message }) => (
  <div
    className={`p-3 mb-4 rounded-md text-sm ${type === 'success'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
      }`} >
    {message}
  </div>
);

export default StatusMessage;