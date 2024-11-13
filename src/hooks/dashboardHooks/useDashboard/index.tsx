import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

const fetchDashboardData = async () => {
  const [equipmentsResponse, ordersResponse, usersResponse] = await Promise.all([
    axios.get("/Equipment/all"),
    axios.get("/RentalRequest/all"),
    axios.get("/Account/all"),
  ]);

  return {
    equipments: equipmentsResponse.data,
    orders: ordersResponse.data,
    users: usersResponse.data,
  };
};

export const useDashboardData = () => {
  const dashboardQuery = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
  });

  const equipmentsCount = dashboardQuery.data ? dashboardQuery.data.equipments.length : 0;
  const ordersCount = dashboardQuery.data ? dashboardQuery.data.orders.length : 0;
  const activeUsersCount = dashboardQuery.data ? dashboardQuery.data.users.length : 0;

  return {
    equipmentsCount,
    ordersCount,
    activeUsersCount,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
  };
};

const fetchRecentTransaction = async () => {
  const itemsPerPage = 7;
  const currentPage = 1;
  const response = await axios.get("/Transaction/", {
    params: { pageNumber: currentPage, pageSize: itemsPerPage },
  });
  return response?.data.data || [];
};

export const useDashboardActivity = () => {
  return useQuery({
    queryKey: ["Transaction"],
    queryFn: fetchRecentTransaction,
    refetchOnWindowFocus: false,
  });
};
