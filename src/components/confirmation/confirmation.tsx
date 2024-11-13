import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../api/axios";

const formatNumber = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const Confirmation = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const [payment, setPayment] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const paymentResponse = await axios.get(`/Payment/${paymentId}`);
        setPayment(paymentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch payment details. Please try again later.");
      }
    };

    fetchOptions();
  }, [paymentId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  if (error) {
    return (
      <div className="flex mt-7 items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
          <h1 className="text-3xl font-semibold text-red-600 mb-4 text-center">Error</h1>
          <p className="text-gray-700 mb-6 text-center">{error}</p>
          <div className="mt-6 text-center">
            <Link to="/equipment">
              <button className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out">
                <div className="flex gap-3 items-center">
                  Browse Something Else <span className="material-icons">arrow_right_alt</span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mt-7 items-center justify-center min-h-screen bg-gray-100 ">
      <div className=" bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-green-600 mb-4 text-center">Payment Successful!</h1>
        <p className="text-gray-700 mb-6 text-center">
          Thank you for your payment. Your transaction was completed successfully.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Transaction ID</span>
              <span className="font-semibold">{payment?.id || "N/A"}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Amount</span>
              <span className="font-semibold">{formatNumber(payment?.amount || "N/A")}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Payment Method</span>
              <span className="font-semibold">{payment?.paymentMethod || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date</span>
              <span className="font-semibold">{currentDate}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link to="/equipment">
            <button className="px-5 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition duration-200 ease-in-out">
              <div className="flex gap-3 items-center">
                Browse Something Else <span className="material-icons">arrow_right_alt</span>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
