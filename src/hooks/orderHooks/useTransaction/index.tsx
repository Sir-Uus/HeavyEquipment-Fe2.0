import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { TransactionDetail } from "../../../types/TransactionDetail";

export const useTransactionDetail = () => {
  const itemsPerPage = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [Status, setStatus] = useState("Paid");

  const {
    data: transactionDetailData,
    isLoading: transactionDetailLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["transactionDetail", currentPage, itemsPerPage, Status],
    queryFn: async () => {
      const userId = localStorage.getItem("id");
      if (!userId) throw new Error("User ID not found in localStorage.");

      const transactionResponse = await axios.get(`/TransactionDetail/by-user/${userId}`, {
        params: { pageNumber: currentPage, pageSize: itemsPerPage, Status },
      });

      const transactionDetail = transactionResponse.data.data || [];
      const totalPages: number = transactionResponse.data.totalPages || 1;

      return { transactionDetail, totalPages };
    },
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const handleStatusChange = (status: string) => {
    setStatus(status);
  };

  return {
    transactionDetailData,
    transactionDetail: (transactionDetailData?.transactionDetail as TransactionDetail[]) || [],
    totalPages: transactionDetailData?.totalPages || 1,
    currentPage,
    handlePageChange,
    handleStatusChange,
    transactionDetailLoading,
    isError,
    error: isError ? (error as Error).message : "",
  };
};
