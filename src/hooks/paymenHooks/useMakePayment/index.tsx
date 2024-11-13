import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { generateInvoice } from "../../../utils";
import { Payment } from "../../../types/Payment";
import { useState } from "react";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

const useFetchPayment = async (rentalRequestId: string): Promise<Payment> => {
  return axios.get(`/Payment/by-rental-request/${rentalRequestId}`).then((response) => response.data);
};

export const useMakePayment = (rentalRequestId: string) => {
  return useQuery<Payment>({
    queryKey: ["makePayment", rentalRequestId],
    queryFn: async () => useFetchPayment(rentalRequestId),
  });
};

export const usePayment = (paymentData: any, cartItems: CartItem[], _onClose: () => void) => {
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const createTransaction = async (transactionData: any) => {
    const response = await axios.post("/Transaction", transactionData);
    return response.data;
  };

  const createTransactionDetail = async (transactionId: any, details: any) => {
    await Promise.all(
      details.map(async (detail: any) => {
        await axios.post("/TransactionDetail", { ...detail, transactionId });
      })
    );
  };

  const createPayment = async (paymentData: any) => {
    const response = await axios.post("/Payment", paymentData);
    return response.data;
  };

  const handleCompletePayment = useMutation({
    mutationFn: async () => {
      const userId = localStorage.getItem("id");
      const invoice = generateInvoice();
      const totalAmount = paymentData?.amount || 0;
      const transaction = await createTransaction({
        userId,
        invoice,
        transactionDate: new Date().toISOString(),
        totalAmount,
        status: "Pending",
      });

      setTransactionId(transaction.id);

      const transactionDetails = cartItems.map((item) => ({
        sparePartId: item.id,
        quantity: item.quantity,
        price: item.price * item.quantity,
      }));

      await createTransactionDetail(transaction.id, transactionDetails);

      const paymentInfo = {
        transactionId: transaction.id,
        amount: totalAmount,
        paymentStatus: "Paid",
        paymentMethod: paymentData?.paymentMethod || "Cash",
        paymentDate: paymentData?.paymentDate || new Date().toISOString(),
      };
      await createPayment(paymentInfo);

      localStorage.removeItem("cartItems");
    },
  });

  return { handleCompletePayment, transactionId };
};
