import { Link } from "react-router-dom";

interface BackToHomeProps {
  textColor?: string;
}

export const BackToHome = ({ textColor = "text-green-700" }: BackToHomeProps) => {
  return (
    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
      <Link
        to="/"
        className={`inline-flex items-center ${textColor} hover:text-green-900 font-medium text-sm sm:text-base`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5  h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Volver al inicio
      </Link>
    </div>
  );
};
