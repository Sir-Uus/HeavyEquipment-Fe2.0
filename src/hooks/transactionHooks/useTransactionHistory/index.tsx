import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { useSearchParams } from "react-router-dom";

interface Transaction {
  id: string;
  invoice: string;
  userId: string;
  totalAmount: number;
  transactionDate: string;
  status: string;
}

export const useTransactionHistory = () => {
  const itemsPerPage = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const {
    data: TransactionData,
    isLoading: TransactionLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["transaction-history", currentPage, itemsPerPage],
    queryFn: async () => {
      const userId = localStorage.getItem("id");
      if (!userId) throw new Error("User ID not found in localStorage.");

      const response = await axios.get("/Transaction/by-user/" + userId, {
        params: { pageNumber: currentPage, pageSize: itemsPerPage },
      });

      return response?.data;
    },
  });

  const Transaction: Transaction[] = TransactionData?.data || [];
  const totalPages: number = TransactionData?.totalPages || 1;

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["userMap", Transaction],
    queryFn: async () => {
      const userIds = Transaction.map((t) => t.userId);
      if (userIds.length === 0) return new Map();

      const userRequests = userIds.map((id) => axios.get(`/Account/${id}`));
      const userResponses = await Promise.all(userRequests);
      const userMap = new Map(userResponses.map((response) => [response.data.id, response.data.displayName]));
      return userMap;
    },
    enabled: Transaction.length > 0,
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  return {
    Transaction,
    userMap: userData || new Map(),
    totalPages,
    currentPage,
    handlePageChange,
    TransactionLoading,
    userLoading,
    isError,
    error: isError ? (error as Error).message : "",
  };
};
