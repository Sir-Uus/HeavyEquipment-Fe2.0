import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Payment } from "../../../types/Payment";

export const usePayment = () => {
  const itemsPerPage = 6;
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const navigate = useNavigate();
  const invoice = searchParams.get("invoice") || "";
  const amount = searchParams.get("amount") || "";
  const paymentMethod = searchParams.get("paymentMethod") || "";
  const paymentStatus = searchParams.get("paymentStatus") || "";

  const { data: paymentData, isLoading: paymentLoading } = useQuery({
    queryKey: ["payment", currentPage, itemsPerPage, invoice, amount, paymentMethod, paymentStatus],
    queryFn: async () => {
      const response = await axios.get("/Payment", {
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          invoice,
          amount,
          paymentMethod,
          paymentStatus,
        },
      });
      return response?.data;
    },
  });

  const payment: Payment[] = paymentData?.data || [];
  const totalPages: number = paymentData?.totalPages || 1;

  const { data: rentalRequestData, isLoading: rentalRequestLoading } = useQuery({
    queryKey: ["rentalRequestMap", payment],
    queryFn: async () => {
      const rentalRequestIds = payment.map((f) => f.rentalRequestId).filter((id) => id !== 0 && id !== null); // Filter out 0 and null IDs
      if (rentalRequestIds.length === 0) return new Map();

      const requests = rentalRequestIds.map((id) => axios.get(`/RentalRequest/${id}`));
      const responses = await Promise.all(requests);
      const rentalRequestArray = responses.map((response) => response.data);
      const rentalRequestMap = new Map(
        rentalRequestArray.map((rentalRequest) => [rentalRequest.id, rentalRequest.invoice])
      );
      return rentalRequestMap;
    },
    enabled: payment.length > 0,
  });

  const { data: TransactionData, isLoading: TransactionLoading } = useQuery({
    queryKey: ["TransactionMap", payment],
    queryFn: async () => {
      const TransactionIds = payment.map((f) => f.transactionId).filter((id) => id !== 0 && id !== null); // Filter out 0 and null IDs
      if (TransactionIds.length === 0) return new Map();

      const requests = TransactionIds.map((id) => axios.get(`/Transaction/${id}`));
      const responses = await Promise.all(requests);
      const TransactionArray = responses.map((response) => response.data);
      const TransactionMap = new Map(
        TransactionArray.map((Transaction) => [Transaction.id, Transaction.invoice])
      );
      return TransactionMap;
    },
    enabled: payment.length > 0,
  });

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/SparePart/${id}`);
      toast.success("Data berhasil dihapus!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["sparePart", currentPage, itemsPerPage] });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Gagal menghapus data!", { position: "bottom-right" });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/update-payment/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), invoice, amount, paymentMethod, paymentStatus });
  };

  return {
    payment,
    rentalRequestData,
    TransactionData,
    totalPages,
    currentPage,
    handlePageChange,
    handleDelete,
    handleEdit,
    paymentLoading,
    rentalRequestLoading,
    TransactionLoading,
  };
};
