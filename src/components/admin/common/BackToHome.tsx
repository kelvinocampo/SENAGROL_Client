import { Link } from "react-router-dom";

interface BackToHomeProps {
  textColor?: string;
  className?: string;
  title?: string;
  route?: string;

}

export const BackToHome = ({
  textColor = "text-[#1B7D00]",
  className = "font-bold mt-2 ml-4 sm:ml-6",
  title = "Volver al inicio",
  route = "/"
}: BackToHomeProps) => {
  return (
    <div className={`${className}`}>
      <Link
        to={route}
        className={`inline-flex items-center ${textColor} hover:text-green-900 font-medium text-sm sm:text-base`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        {title}
      </Link>
    </div>
  );
};
