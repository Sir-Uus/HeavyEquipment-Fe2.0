import { useLocation, Link, useParams } from "react-router-dom";

const Wizard = () => {
  const { id } = useParams<{
    id: string;
    rentalRequestId?: string;
    paymentId?: string;
  }>();
  const location = useLocation();
  const currentPath = location.pathname;

  const paths = [
    { path: "/equipment", label: "Equipment" },
    { path: `/equipment/details/${id}`, label: "Equipment Details" },
    { path: `/equipment/details/${id}/rental-request`, label: "Rental Request" },
  ].filter(Boolean);

  const matchesPath = (pattern: string, path: string | null) => {
    if (!path) return false;
    const regexPattern = new RegExp("^" + pattern.replace(/:\w+/g, "[^/]+") + "$");
    return regexPattern.test(path);
  };

  const currentIndex = paths.findIndex(({ path }) => matchesPath(path, currentPath));

  const renderChecklistIcon = (path: string | null) => {
    if (!path) return null;
    const index = paths.findIndex(({ path: p }) => matchesPath(p, path));
    return index < currentIndex ? (
      <span className="material-icons text-green-500 mr-1 text-[12px] md:text-[18px]">check_circle</span>
    ) : null;
  };

  const isDisabled = (path: string | null) => {
    if (!path) return true;
    const index = paths.findIndex(({ path: p }) => matchesPath(p, path));
    return index > currentIndex;
  };

  return (
    <nav className="bg-white border border-gray-200 rounded-md shadow-sm">
      <ol className="flex items-center p-4">
        {paths.map(({ path, label }) => (
          <li
            key={path}
            className={`flex-1 text-center ${
              matchesPath(path, currentPath) ? "font-bold text-blue-600" : "text-gray-500"
            }`}
          >
            <div className="flex items-center justify-center">
              {renderChecklistIcon(path)}
              <Link
                to={isDisabled(path) ? "#" : path}
                className={`font-semibold text-[8px] md:text-[16px] ${
                  matchesPath(path, currentPath) ? "text-blue-600" : "text-gray-500"
                } ${isDisabled(path) ? "cursor-not-allowed" : ""}`}
                aria-disabled={isDisabled(path)}
                tabIndex={isDisabled(path) ? -1 : undefined}
              >
                {label}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Wizard;
