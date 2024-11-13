import React, { useEffect, useState } from "react";
import Modal from "./modal";
import { usePayment } from "../../hooks/paymenHooks/useMakePayment";
import { formatNumber } from "../../utils";
import { Button, Tooltip, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

interface PaymentData {
  transactionId: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentDate: string;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
}

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentData | null;
  cartItems: CartItem[];
  onSelectPaymentMethod: (method: string) => void;
}

const ModalPayment: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentData,
  cartItems,
  onSelectPaymentMethod,
}) => {
  const { handleCompletePayment, transactionId } = usePayment(paymentData, cartItems, onClose);
  const [selectedMethod, setSelectedMethod] = useState(paymentData?.paymentMethod || "");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (transactionId) {
      setShowConfirmModal(true);
    }
  }, [transactionId]);

  const handleSelectPaymentMethod = (method: string) => {
    setSelectedMethod(method);
    onSelectPaymentMethod(method);
  };

  if (!isOpen || !paymentData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[300px] md:w-[700px] space-y-4">
        <div className="text-xl font-semibold">
          <p>Payment</p>
        </div>
        <div className="text-md">
          <p>Payment Method </p>
        </div>
        <div>
          <Tooltip title="Comming Soon" arrow>
            <label
              className={`flex justify-between border border-gray-900 p-2 rounded-md cursor-pointer ${
                selectedMethod === "Qris-partner" ? "bg-gray-200" : ""
              }`}
              htmlFor="paymentMethodCash"
            >
              <img src="/qris-partner-full.svg" alt="qris" className="w-56 h-10" />
              <input
                type="radio"
                name="paymentMethod"
                id="paymentMethodCash"
                value="Qris-partner"
                checked={selectedMethod === "Qris-partner"}
                onChange={() => handleSelectPaymentMethod("Qris-partner")}
                className="cursor-pointer"
                disabled
              />
            </label>
          </Tooltip>
        </div>

        <div>
          <label
            className={`flex justify-between border border-gray-900 p-2 rounded-md cursor-pointer ${
              selectedMethod === "Bank" ? "bg-gray-200" : ""
            }`}
            onClick={() => handleSelectPaymentMethod("Bank")}
            htmlFor="paymentMethodDebit"
          >
            <img src="/qris.svg" alt="bank" className="w-16 h-10" />
            <input
              type="radio"
              name="paymentMethod"
              id="paymentMethodDebit"
              value="Bank"
              checked={selectedMethod === "Bank"}
              onChange={() => handleSelectPaymentMethod("Bank")}
              className="cursor-pointer"
            />
          </label>
        </div>
        <div className="text-md">
          <p>Payment Summary </p>
        </div>
        <div className="border border-gray-900 rounded-md p-3 space-y-2">
          <div className="flex justify-between">
            <div className="text-sm">Total Shopping</div>
            <div>{formatNumber(paymentData.subtotal)}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm">Delivery Charge</div>
            <div>{formatNumber(paymentData.deliveryCharge)}</div>
          </div>
        </div>
        <div className="md:flex md:justify-between">
          <div className="font-semibold mt-4">
            <p>Total Bill </p>
            <p>{formatNumber(paymentData.amount)}</p>
          </div>
          <button
            onClick={() => handleCompletePayment.mutate()}
            className="w-full md:w-[250px] flex gap-2 bg-green-500 p-3 text-white font-semibold rounded-lg hover:bg-green-400 transition mt-5"
          >
            <span className="material-icons mr-3 ">beenhere</span>{" "}
            <span className="ml-8 md:ml-0 text-[14px] md:text-lg">Complete Payment</span>
          </button>
        </div>
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 space-y-4">
            <Typography variant="h6" className="font-bold text-gray-700">
              Scan QR Code to Complete Payment
            </Typography>
            <QRCodeSVG
              value={import.meta.env.BASE_API_URL + `/Payment/complete-payment-sparepart/${transactionId}`}
              size={200}
              level="H"
              className="animate-pulse mx-auto"
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setShowConfirmModal(false), onClose(), navigate("/transaction-history");
              }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalPayment;
