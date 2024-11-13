import { Link } from "react-router-dom";

const sidebarOrder = () => {
  const isActive = (path: string) => location.pathname.includes(path);
  const username = localStorage.getItem("displayName");

  return (
    <nav>
      <div className="flex gap-4 mt-13 p-5">
        <span className="material-icons text-[50px]">account_circle</span>
        <span className="text-sm font-semibold mt-[14px]">{username}</span>
      </div>
      <div>
        <aside className="lg:w-64">
          <div className="px-3 pb-4 overflow-y-auto">
            <ul className="space-y-2 font-medium text-black">
              <li>
                <Link
                  to="/order"
                  className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                    isActive("/order") ? "bg-gray-900 text-yellow-300" : ""
                  }`}
                >
                  <span className="material-icons w-6 h-6">request_quote</span>
                  <span className="ml-3 text-[12px]">My Rental</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/buying-sparepart"
                  className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                    isActive("/buying-sparepart") ? "bg-gray-900 text-yellow-300" : ""
                  }`}
                >
                  <span className="material-icons w-6 h-6">shopping_bag</span>
                  <span className="ml-3 text-[12px]">My Buying</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </nav>
  );
};

export default sidebarOrder;
