import { useState } from "react";
import Navbar from "../navbar/navbar";
import { formatNumber } from "../../utils";
import ModalPayment from "../modal/modalPayment";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/cartHooks/useCart";
import { useSparePartImages } from "../../hooks/cartHooks/useSparePartImageCart";

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

const Cart = () => {
  const { cartItems, removeItem, updateQuantity } = useCart();
  const sparePartImages = useSparePartImages(cartItems);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryCharge = 50000;
  const totalAmount = subtotal + deliveryCharge;

  const handleCheckout = () => {
    const paymentInfo = {
      transactionId: "",
      amount: totalAmount,
      paymentStatus: "Pending",
      paymentMethod: "",
      paymentDate: new Date().toISOString(),
      subtotal,
      deliveryCharge,
      totalAmount,
    };

    setPaymentData(paymentInfo);
    setIsModalOpen(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    if (paymentData) {
      setPaymentData({ ...paymentData, paymentMethod: method });
    }
  };

  return (
    <div>
      <Navbar />
      <section className="py-[96px] mx-4">
        <div className="container mx-auto px-4">
          {cartItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:col-span-8 space-y-6 lg:w-3/5">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row items-center lg:items-start bg-white shadow-md p-4 rounded-lg"
                  >
                    <div className="w-full lg:w-1/3 flex justify-center mb-4 lg:mb-0">
                      <img
                        src={sparePartImages?.[item.id] || "https://via.placeholder.com/150"}
                        alt={item.partName}
                        className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-md"
                      />
                    </div>
                    <div className="w-full lg:w-2/3 flex flex-col lg:flex-row justify-between lg:ml-6">
                      <div className="flex flex-col text-center lg:text-left">
                        <h5 className="text-xl font-semibold text-gray-800">{item.partName}</h5>
                        <p className="text-gray-600 mt-2">Spare Part</p>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-gray-400 flex justify-center mt-2 lg:mt-[58px] lg:ml-40 xl:ml-64"
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                      <div className="flex flex-col items-center lg:items-end mt-4 lg:mt-20">
                        <p className="text-green-500 font-bold mb-2">{formatNumber(item.price)}</p>
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className={`px-4 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300 ${
                              item.quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={item.quantity === 1}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="w-12 py-[7px] text-center border border-gray-200"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="px-4 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg lg:w-2/5 sticky top-24 lg:h-[300px]">
                <h4 className="text-xl font-semibold mb-4">Order Summary</h4>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>{formatNumber(subtotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Delivery Charge</p>
                    <p>{formatNumber(deliveryCharge)}</p>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>{formatNumber(totalAmount)}</p>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-yellow-400 text-center p-3 text-gray-800 font-semibold rounded-lg hover:bg-yellow-300 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-[140px] flex justify-center">
                <p className="text-gray-600 text-sm md:text-xl">Your cart is empty!</p>
              </div>
              <Link to="/parts" className="flex justify-center">
                <button className="flex justify-center gap-2 md:gap-4 px-3 py-2 md:py-3 md:w-56 text-center mt-8 rounded-full bg-yellow-400 text-gray-900 duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950 transition-transform transform hover:scale-105">
                  <span className="text-[10px] md:text-[16px] mt-1 md:mt-0">Browse Spare Parts</span>{" "}
                  <span className="material-icons">arrow_right_alt</span>
                </button>
              </Link>
            </>
          )}
        </div>
      </section>
      <ModalPayment
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentData={paymentData}
        cartItems={cartItems}
        onSelectPaymentMethod={handlePaymentMethodSelect}
      />
    </div>
  );
};

export default Cart;
