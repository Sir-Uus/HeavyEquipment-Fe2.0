import { useEffect, useState } from "react";
import Modal from "../modal/modal";
import { formatNumber, getAverageRatingSparepart } from "../../utils";
import { useSparePartImage, useSparePartOptionsIds } from "../../hooks/sparepartHooks/useSparePartOption";
import * as signalR from "@microsoft/signalr";
import SparePartFeedbackModal from "../sparepartFeedbackModal/sparepartFeedbackModal";

const PartsDetails = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(0);
  const [isItemInCart, setIsItemInCart] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);

  const { data: spareParts, isLoading, isError } = useSparePartOptionsIds();
  const { data: sparePartImage } = useSparePartImage(spareParts?.id);

  useEffect(() => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === spareParts?.id);
    if (existingItemIndex !== -1) {
      setIsItemInCart(true);
      setQuantity(currentCart[existingItemIndex].quantity);
    }
  }, [spareParts]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/stockHub")
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");

        connection.on("ReceiveStockUpdate", (sparePartId: number, newStock: number) => {
          if (spareParts?.id === sparePartId) {
            setStock(newStock);
          }
        });
      })
      .catch((error) => console.error("SignalR Error: ", error));
  }, [spareParts]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;
  if (!spareParts) return <p>No Spare Parts data available</p>;

  const addToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === spareParts.id);

    if (existingItemIndex !== -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      const item = { ...spareParts, quantity };
      currentCart.push(item);
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("storage"));
    setMessage(`${spareParts.partName} has been added to your cart!`);
    setModalOpen(true);
    setIsItemInCart(true);

    setTimeout(() => {
      setModalOpen(false);
      setMessage("");
    }, 2000);
  };

  const updateQuantity = (value: number) => {
    if (value <= 0) {
      removeFromCart();
      return;
    }

    setQuantity(value);
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === spareParts.id);

    if (existingItemIndex !== -1) {
      currentCart[existingItemIndex].quantity = value;
      localStorage.setItem("cartItems", JSON.stringify(currentCart));
    }
  };

  const removeFromCart = () => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const updatedCart = currentCart.filter((item: any) => item.id !== spareParts.id);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    setQuantity(1);
    setIsItemInCart(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setMessage("");
  };

  return (
    <div className="p-4 pt-[60px] md:p-8 lg:pt-[70px]">
      <div className="mt-3 md:mt-6 md:grid md:grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <a
            href="#"
            className="block p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
          >
            <h5 className="text-sm md:text-lg font-bold tracking-tight text-gray-900">
              Secured Payment Guarantee!
            </h5>
            <p className="text-[12px] md:text-sm font-normal text-gray-700">
              Your payment will be secure. Sit back and relax.
            </p>
          </a>

          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-700">
            <a href="#">
              <h5 className="mb-2 text-sm md:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Not what you expect?
              </h5>
            </a>
            <p className="text-[12px] md:text-sm font-normal text-gray-600 dark:text-gray-300">
              Explore more spare parts or check other options.
            </p>
            <a
              href="/equipment"
              className="inline-flex items-center mt-3 p-1 px-2 md:px-3 md:py-2 text-[12px] md:text-sm font-medium text-center rounded-3xl bg-yellow-400 text-gray-900 transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950"
            >
              Browse More
              <svg
                className="w-3.5 h-3.5 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 w-full h-auto p-4 md:p-6 bg-white border border-gray-200 rounded-lg shadow mt-4 md:mt-0">
          <div className="flex flex-col items-center md:flex-row">
            <img src={sparePartImage} alt="" className="w-full h-48 md:w-60 md:h-60 mb-4 md:mr-8" />
            <div className="text-sm font-semibold text-gray-700 w-full md:w-[41%]">
              <h5 className="text-slate-800 text-lg font-semibold pb-4 text-center md:text-left ">
                {spareParts.partName}
              </h5>
              <div className="flex flex-col md:text-[16px] md:mt-8">
                <p className="text-[13px] md:text-[14px]">
                  <span className="material-icons mr-2 text-[13px] md:text-[14px]">build</span>Part Name:{" "}
                  {spareParts.partName}
                </p>
                <p className="text-[13px] md:text-[14px]">
                  <span className="material-icons mr-2 text-[13px] md:text-[14px]">local_offer</span>Part
                  Number: {spareParts.partNumber}
                </p>
                <p className="text-[13px] md:text-[14px]">
                  <span className="material-icons mr-2 text-[13px] md:text-[14px]">inventory_2</span>Stock:{" "}
                  {stock || spareParts.stock}
                </p>
                <p className="text-[13px] md:text-[14px]">
                  <span className="material-icons mr-2 text-[13px] md:text-[14px]">widgets</span>Manufacturer:{" "}
                  {spareParts.manufacturer}
                </p>
                <p className="text-[13px] md:text-[14px]">
                  <span className="material-icons mr-2 text-[13px] md:text-[14px]">calendar_today</span>
                  Status: {spareParts.availabilityStatus}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end justify-end mt-4 md:mt-[70px]">
              <p className="text-[12px] md:text-sm font-semibold text-slate-400">Price</p>
              <p className="text-xl font-bold text-slate-800">{formatNumber(spareParts.price)}</p>
              {isItemInCart ? (
                <div className="flex justify-end mb-4 mt-4">
                  <button
                    onClick={() => updateQuantity(quantity - 1)}
                    className="px-4 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => updateQuantity(Number(e.target.value))}
                    className="w-12 py-[7px] text-center border border-gray-200"
                  />
                  <button
                    onClick={() => updateQuantity(quantity + 1)}
                    className={`px-4 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300 ${
                      quantity >= spareParts.stock ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={quantity >= spareParts.stock}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={addToCart}
                  className="flex justify-center text-xs md:text-[16px] mt-4 font-semibold w-40 py-3 rounded-md bg-yellow-400 text-gray-900 transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow">
              <h5 className="text-sm md:text-lg font-bold mb-2">Rating</h5>
              <p className="text-xs md:text-sm text-gray-600">See the average rating given by users.</p>
              <p className="md:absolute bottom-6 text-yellow-500 font-bold text:[12px] md:text-2xl mt-2 md:mt-0">
                {getAverageRatingSparepart(spareParts.sparePartFeedbacks)} / 5
              </p>
            </div>
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow">
              <h5 className="text-sm md:text-lg font-bold mb-2">Feedback</h5>
              <p className="text-xs md:text-sm text-gray-600">Read user feedback about their experience.</p>
              <button
                onClick={() => setFeedbackOpen(true)}
                className="inline-flex items-center md:mt-9 text-xs mt-4 px-4 py-2 md:text-sm text-gray-900 bg-yellow-400 rounded-3xl transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950"
              >
                View Feedback
                <span className="material-icons ms-2">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="py-4 mt-4">
            <h5 className="font-semibold text-sm md:text-base">Your purchase includes:</h5>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Certification of
                Authenticity
              </p>
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Secured Payment
                Guarantee
              </p>
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Door-to-Door Delivery
              </p>
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> 24/7 Customer Support
              </p>
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Free Returns
              </p>
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Warranty
              </p>
            </div>
          </div>
        </div>
      </div>

      {isFeedbackOpen && (
        <SparePartFeedbackModal
          isOpen={isFeedbackOpen}
          sparepartId={spareParts.id || ""}
          onClose={() => setFeedbackOpen(false)}
        />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex justify-center gap-1 text-[12px] md:text-lg font-semibold">
          <span className="material-icons mt-[2px] text-[12px] md:text-lg">info</span>Info
        </div>
        <div className="font-semibold mt-3 text-[12px] md:text-lg">{message}</div>
      </Modal>
    </div>
  );
};

export default PartsDetails;
