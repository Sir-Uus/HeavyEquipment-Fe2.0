import { jsPDF } from "jspdf";

const OrderDetail = () => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Order Receipt", 14, 22);

    doc.setFontSize(12);
    doc.text("Business Name", 14, 32);
    doc.text("Address: Some address here", 14, 42);

    doc.text("Receipt No.: #5033", 14, 52);
    doc.text("Order Type: Rental + Spare Parts", 14, 62);
    doc.text("Host: Jane Doe", 14, 72);
    doc.text("Customer: John Doe", 14, 82);

    doc.text("Items:", 14, 92);
    doc.text("1. Excavator Rental (3 days)", 14, 102);
    doc.text("   Quantity: 1", 14, 112);
    doc.text("   Total: Rp 12.000.000", 14, 122);

    doc.text("2. Hydraulic Pump (Spare Part)", 14, 132);
    doc.text("   Quantity: 2", 14, 142);
    doc.text("   Total: Rp 2.000.000", 14, 152);

    doc.text("Grand Total: Rp 14.000.000", 14, 172);

    doc.text("Thank you for your business!", 14, 192);

    doc.save("order-receipt.pdf");
  };

  return (
    <div className="mt-[100px] max-w-md mx-[34%] mb-[30px]">
      <div className="w-96 rounded bg-gray-50 px-6 pt-8 shadow-lg pb-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg"
          alt="company-logo"
          className="mx-auto w-16 py-4"
        />
        <div className="flex flex-col justify-center items-center gap-2">
          <h4 className="font-semibold">Heavy Equipment Rentals Inc.</h4>
          <p className="text-xs">123 Industrial Park, City</p>
        </div>
        <div className="flex flex-col gap-3 border-b py-6 text-xs">
          <p className="flex justify-between">
            <span className="text-gray-400">Receipt No.:</span>
            <span>#5033</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-400">Order Type:</span>
            <span>Rental + Spare Parts</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-400">Host:</span>
            <span>Jane Doe</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-400">Customer:</span>
            <span>John Doe</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 pb-6 pt-2 text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="flex">
                <th className="w-full py-2">Product</th>
                <th className="min-w-[44px] py-2">QTY</th>
                <th className="min-w-[44px] py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="flex">
                <td className="flex-1 py-1">Excavator Rental (3 days)</td>
                <td className="min-w-[44px]">1</td>
                <td className="min-w-[44px]">Rp 12.000.000</td>
              </tr>
              <tr className="flex py-1">
                <td className="flex-1">Hydraulic Pump</td>
                <td className="min-w-[44px]">2</td>
                <td className="min-w-[44px]">Rp 2.000.000</td>
              </tr>
            </tbody>
          </table>
          <div className="border-b border-dashed py-4"></div>
          <p className="text-right font-semibold text-lg">Grand Total: Rp 14.000.000</p>
          <div className="py-4 justify-center items-center flex flex-col gap-2">
            <p>info@heavyrentals.com</p>
            <p>+62 123-456-7890</p>
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
