// components/common/ErrorMessage.tsx
export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow text-center">
    <p>{message}</p>
  </div>
);
