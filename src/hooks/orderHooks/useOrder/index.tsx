import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { RentalRequest } from "../../../types/RentalRequest";

export const useRentalRequests = () => {
  const itemsPerPage = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [paymentStatus, setPaymentStatus] = useState("Pending");

  const {
    data: rentalRequestData,
    isLoading: rentalRequestLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rentalRequests", currentPage, itemsPerPage, paymentStatus],
    queryFn: async () => {
      const userId = localStorage.getItem("id");
      if (!userId) throw new Error("User ID not found in localStorage.");

      const rentalResponse = await axios.get(`/RentalRequest/by-user/${userId}`, {
        params: { pageNumber: currentPage, pageSize: itemsPerPage, paymentStatus },
      });

      const rentalRequests = rentalResponse.data.data || [];
      const totalPages: number = rentalResponse.data.totalPages || 1;

      return { rentalRequests, totalPages };
    },
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const handleStatusChange = (status: string) => {
    setPaymentStatus(status);
  };

  return {
    rentalRequestData,
    rentalRequests: (rentalRequestData?.rentalRequests as RentalRequest[]) || [],
    totalPages: rentalRequestData?.totalPages || 1,
    currentPage,
    handlePageChange,
    handleStatusChange,
    rentalRequestLoading,
    isError,
    error: isError ? (error as Error).message : "",
  };
};
