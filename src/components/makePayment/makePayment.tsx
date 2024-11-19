import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios, { BASE_URL } from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useRentalRequestIdsOptions } from "../../hooks/paymenHooks/useRentalRequestOption";
import { useEquipment } from "../../hooks/paymenHooks/useEquipment";
import { useMakePayment } from "../../hooks/paymenHooks/useMakePayment";
import { formatNumber } from "../../utils";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const schema = z.object({
  rentalRequestId: z.string().nonempty("Invoice is required"),
  amount: z.number().min(1, "Amount is required"),
  paymentMethod: z.string().nonempty("Payment method is required"),
  paymentStatus: z.string().nonempty("Payment Status is required"),
});

type FormData = z.infer<typeof schema>;

const MakePayment = () => {
  const { id, rentalRequestId } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const navigate = useNavigate();
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  const { data: rentalRequest, isLoading: rentalLoading } = useRentalRequestIdsOptions(rentalRequestId!);
  const { data: equipment } = useEquipment(id!);
  const { data: payment, isLoading: paymentLoading } = useMakePayment(rentalRequestId!);

  useEffect(() => {
    if (rentalRequest && payment) {
      setValue("rentalRequestId", rentalRequest.invoice);
      setValue("paymentMethod", payment.paymentMethod || "Cash");
      setValue("paymentStatus", payment.paymentStatus);
      setValue("amount", payment.amount);
      setPaymentId(payment.id);
    }
  }, [rentalRequest, payment, setValue]);

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(`/Payment/by-rental-request/${rentalRequestId}`);
      if (response.data.paymentStatus === "Paid") {
        setIsPaymentCompleted(true);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  useEffect(() => {
    if (!showConfirmModal) {
      checkPaymentStatus();
    }
  }, [showConfirmModal]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = { ...data, rentalRequestId, paymentStatus: "Paid" };
      if (paymentId) await axios.put(`/Payment/${paymentId}`, payload);

      const transactionPayload = {
        invoice: rentalRequest?.invoice,
        userId: localStorage.getItem("id"),
        transactionDate: new Date().toISOString(),
        totalAmount: data.amount,
        status: "Paid",
      };

      const transactionResponse = await axios.post("/Transaction", transactionPayload);
      const transactionId = transactionResponse.data.id;

      const rentalDuration =
        rentalRequest?.startDate && rentalRequest?.endDate
          ? (new Date(rentalRequest.endDate).getTime() - new Date(rentalRequest.startDate).getTime()) /
            (1000 * 3600 * 24)
          : 0;

      const transactionDetailPayload = {
        transactionId: transactionId,
        equipmentId: equipment?.id,
        rentalDuration,
        quantity: 1,
        price: data.amount,
      };

      await axios.post("/TransactionDetail", transactionDetailPayload);
      navigate(
        `/equipment/details/${equipment?.id}/rental-request/${rentalRequestId}/payment/${paymentId}/confirmation`
      );
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  if (rentalLoading || paymentLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <CircularProgress color="primary" />
      </div>
    );

  return (
    <div className="flex mt-24 justify-center items-center mx-2 md:mx-5">
      <div className="w-full h-full bg-white rounded-lg shadow-md p-6 space-y-6">
        <span className="text-gray-800 font-semibold text-sm md:text-2xl flex justify-center">
          SECURE PAYMENT INFO
        </span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <span className="text-gray-700 text-[12px] md:text-[16px]">Payment Method</span>
            <RadioGroup row {...register("paymentMethod")} defaultValue="Cash">
              <FormControlLabel
                value="QRIS"
                control={<Radio />}
                label={<img src="/qris.svg" alt="QRIS" width="50" />}
              />
              <FormControlLabel
                value="OVO"
                control={<Radio />}
                label={<img src="/ovo.svg" alt="OVO" width="50" />}
                disabled
              />
              <FormControlLabel
                value="GoPay"
                control={<Radio />}
                label={<img src="/gopay.svg" alt="GoPay" width="50" />}
                disabled
              />
              <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
            </RadioGroup>
          </div>
          <div className="space-y-4">
            <TextField
              label="Invoice"
              variant="outlined"
              {...register("rentalRequestId")}
              value={rentalRequest?.invoice || ""}
              InputProps={{
                readOnly: true,
                style: { fontSize: "14px" },
              }}
              fullWidth
              error={!!errors.rentalRequestId}
              helperText={errors.rentalRequestId?.message}
            />
            <TextField
              label="Amount"
              variant="outlined"
              {...register("amount")}
              value={payment ? formatNumber(payment.amount) : ""}
              InputProps={{
                readOnly: true,
                style: { fontSize: "14px" },
              }}
              fullWidth
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />

            <TextField
              label="Payment Status"
              variant="outlined"
              {...register("paymentStatus")}
              value={isPaymentCompleted ? "Paid" : payment?.paymentStatus || ""}
              InputProps={{
                readOnly: true,
                style: { fontSize: "14px" },
              }}
              fullWidth
            />
          </div>
          <div className="flex justify-between mt-10 gap-2">
            <Button
              variant="contained"
              onClick={() => setShowConfirmModal(true)}
              style={{ backgroundColor: "#facc15", color: "#000" }}
            >
              <span className="material-icons mr-3 text-[14px] md:text-[24px]">qr_code</span>
              <span className="text-[10px] md:text-[16px]">Generate QR Code</span>
            </Button>
            <Button
              type="submit"
              color={isPaymentCompleted ? "info" : "success"}
              disabled={!isPaymentCompleted}
              className="py-2"
            >
              <span className="material-icons mr-3 text-[14px] md:text-[24px]">check_circle</span>
              <span className="text-[10px] md:text-[16px]">Complete Payment</span>
            </Button>
          </div>
        </form>

        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 space-y-4">
              <Typography variant="h6" className="font-bold text-gray-700">
                Scan QR Code to Complete Payment
              </Typography>
              <QRCodeSVG
                value={BASE_URL + `/Payment/complete-payment/${rentalRequestId}`}
                size={200}
                level="H"
                className="animate-pulse mx-auto"
              />
              <Button variant="outlined" color="secondary" onClick={() => setShowConfirmModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakePayment;
