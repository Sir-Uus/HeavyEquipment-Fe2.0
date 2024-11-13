import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const isActive = (path: string) => location.pathname.includes(path);

  useEffect(() => {
    const displayName = localStorage.getItem("displayName");
    if (displayName) {
      setDisplayName(displayName);
    }
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-40 w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 border-b border-gray-800 shadow-xl">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <a href="/admin" className="flex items-center">
              <img src="/logo-excavator-.png" className="h-8 mr-3" alt="Logo" />
              <span className="text-xl font-semibold text-black">Admin Panel</span>
            </a>
            <div className="mr-10 flex font-bold text-black">
              <span className="material-icons mr-2 text-3xl">account_circle</span>
              <p className="mt-[5px]">{displayName}</p>
            </div>
          </div>
        </div>
      </nav>

      <aside className="fixed top-0 left-0 z-30 w-64 h-screen bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-500 shadow-2xl border-r border-gray-800">
        <div className="h-full mt-[74px] px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium text-black">
            <li>
              <Link
                to="/admin/dashboard"
                className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                  isActive("/admin/dashboard") ? "bg-gray-900 text-yellow-300" : ""
                }`}
              >
                <span className="material-icons w-6 h-6">dashboard</span>
                <span className="ml-3 text-[12px]">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/list-equipment"
                className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                  isActive("/admin/list-equipment") ? "bg-gray-900 text-yellow-300" : ""
                }`}
              >
                <span className="material-icons w-6 h-6">settings</span>
                <span className="ml-3 text-[12px]">Equipment</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/list-feedback"
                className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                  isActive("/admin/list-feedback") ? "bg-gray-900 text-yellow-300" : ""
                }`}
              >
                <span className="material-icons w-6 h-6">feedback</span>
                <span className="ml-3 text-[12px]">Performance Feedback</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/list-maintenance-record"
                className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                  isActive("/admin/list-maintenance-record") ? "bg-gray-900 text-yellow-300" : ""
                }`}
              >
                <span className="material-icons w-6 h-6">engineering</span>
                <span className="ml-3 text-[12px]">Maintenance Record</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/list-rental-history"
                className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                  isActive("/admin/list-rental-history") ? "bg-gray-900 text-yellow-300" : ""
                }`}
              >
                <span className="material-icons w-6 h-6">history</span>
                <span className="ml-3 text-[12px]">Rental History</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/list-sparepart"
                className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                  isActive("/admin/list-sparepart") ? "bg-gray-900 text-yellow-300" : ""
                }`}
              >
                <span className="material-icons w-6 h-6">settings_input_component</span>
                <span className="ml-3 text-[12px]">Spare Part</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/list-rental-request"
                className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                  isActive("/admin/list-rental-request") ? "bg-gray-900 text-yellow-300" : ""
                }`}
              >
                <span className="material-icons w-6 h-6">request_page</span>
                <span className="ml-3 text-[12px]">Rental Request</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/list-payment"
                className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                  isActive("/admin/list-payment") ? "bg-gray-900 text-yellow-300" : ""
                }`}
              >
                <span className="material-icons w-6 h-6">payments</span>
                <span className="ml-3 text-[12px]">Payment</span>
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`flex items-center p-3 rounded-lg transition-all transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-900 hover:shadow-md hover:text-yellow-300 ${
                  isActive("exit") ? "bg-gray-900 text-yellow-300" : ""
                }`}
              >
                <span className="material-icons w-6 h-6">logout</span>
                <span className="ml-3 text-[12px]">Exit</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
