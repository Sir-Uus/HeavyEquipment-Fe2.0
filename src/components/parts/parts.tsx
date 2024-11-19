import { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { formatNumber, getAverageRatingSparepart } from "../../utils";
import { SparePart } from "../../types/SparePart";
import { useSparePartImages, useSparePartOptions } from "../../hooks/sparepartHooks/useSparePartQueries";
import { ThreeDot } from "react-loading-indicators";
import { AccordionDetails, AccordionSummary, Skeleton, Tooltip } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import { NumericFormat } from "react-number-format";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const Parts = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>();
  const [selectedAvailabilityStatus, setSelectedAvailabilityStatus] = useState<string>();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);
  const [sparepartImagesCache, setSparepartImagesCache] = useState<{ [key: number]: string }>({});
  const filters = {
    equipmentName: selectedEquipment.length > 0 ? selectedEquipment.join(",") : undefined,
    manufacturer: selectedManufacturer,
    availabilityStatus: selectedAvailabilityStatus,
    minPrice: debouncedMinPrice,
    maxPrice: debouncedMaxPrice,
  };

  const {
    data: sparepartPages,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
  } = useSparePartOptions(filters);

  const spareParts = sparepartPages?.pages.flatMap((page) => page.data) || [];
  const newSparepartIds = useMemo(() => {
    return spareParts.map((sparePart) => sparePart.id).filter((id) => !sparepartImagesCache[id]);
  }, [spareParts, sparepartImagesCache]);

  const { data: sparePartImages } = useSparePartImages(newSparepartIds, 300);

  useEffect(() => {
    if (sparePartImages) {
      setSparepartImagesCache((prevCache) => ({ ...prevCache, ...sparePartImages }));
    }
  }, [sparePartImages]);
  const [visibleSparePart, setVisibleSparePart] = useState<any[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setShowBackToTop(true);
      } else if (window.scrollY == 0) {
        setIsAnimatingOut(true);
        setTimeout(() => {
          setShowBackToTop(false);
          setIsAnimatingOut(false);
        }, 300);
      }

      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        hasNextPage &&
        !isFetchingNextPage
      )
        return;
      fetchNextPage();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleCheckboxChange = (equipmentName: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipmentName) ? prev.filter((name) => name !== equipmentName) : [...prev, equipmentName]
    );
  };

  const handleManufacturerChange = (manufacturer: string) => {
    setSelectedManufacturer(manufacturer === selectedManufacturer ? "" : manufacturer);
  };

  const handleAvailabilityStatusChange = (availabilityStatus: string) => {
    setSelectedAvailabilityStatus(
      availabilityStatus === selectedAvailabilityStatus ? "" : availabilityStatus
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [minPrice, maxPrice]);

  const resetPrice = () => {
    setMinPrice("");
    setMaxPrice("");
    setDebouncedMaxPrice("");
    setDebouncedMinPrice("");
  };

  useEffect(() => {
    const sparePart = sparepartPages?.pages.flatMap((page) => page.data) || [];
    setVisibleSparePart(sparePart);
  }, [sparepartPages]);

  const scrollToTop = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDot variant="bob" color="#facc15" size="medium" />
      </div>
    );
  if (isError) return <p>No Data</p>;

  const validSpareParts = spareParts.filter((part): part is SparePart => part != null);

  const filteredSpareParts = validSpareParts;

  return (
    <>
      <div className="lg:mt-[100px]">
        <button
          onClick={toggleMobileFilter}
          className="p-3 bg-yellow-400 text-gray-900 rounded-full shadow-md lg:hidden pt-[70px]"
        >
          <span className="material-icons">filter_list</span>
        </button>
        <div className="flex space-x-8 mt-6 mb-6 lg:px-8 pr-8">
          <div className="flex-col  rounded-lg w-80 min-h-[310px] lg:block hidden">
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                <span className="text-md font-semibold text-slate-900">Type</span>
              </AccordionSummary>
              <AccordionDetails>
                <div className="pl-2 overflow-y-auto space-y-2">
                  {["Excavator", "Grader", "Loader", "Dozer", "Truck", "Compactor", "Crane"].map(
                    (equipmentName) => (
                      <div key={equipmentName} className="flex items-center">
                        <input
                          id={`checkbox-${equipmentName}`}
                          type="checkbox"
                          checked={selectedEquipment.includes(equipmentName)}
                          onChange={() => handleCheckboxChange(equipmentName)}
                          className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                        />
                        <label
                          htmlFor={`checkbox-${equipmentName}`}
                          className="cursor-pointer text-sm text-gray-700"
                        >
                          {equipmentName}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                <span className="text-md font-semibold text-slate-900">Manucfaturer</span>
              </AccordionSummary>
              <AccordionDetails>
                <div className="pl-2 overflow-y-auto space-y-2">
                  {["Komatsu", "Scania", "Tadano", "Bomag", "UD Truck"].map((manufacturer) => (
                    <div key={manufacturer} className="flex items-center">
                      <input
                        id={`checkbox-${manufacturer}`}
                        type="checkbox"
                        checked={selectedManufacturer === manufacturer}
                        onChange={() => handleManufacturerChange(manufacturer)}
                        className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                      />
                      <label
                        htmlFor={`checkbox-${manufacturer}`}
                        className="cursor-pointer text-sm text-gray-700"
                      >
                        {manufacturer}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                <span className="text-md font-semibold text-slate-900">Status</span>
              </AccordionSummary>
              <AccordionDetails>
                <div className="pl-2 overflow-y-auto space-y-2">
                  {["In Stock", "Out of Stock"].map((availabilityStatus) => (
                    <div key={availabilityStatus} className="flex items-center">
                      <input
                        id={`checkbox-${availabilityStatus}`}
                        type="checkbox"
                        checked={selectedAvailabilityStatus === availabilityStatus}
                        onChange={() => handleAvailabilityStatusChange(availabilityStatus)}
                        className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                      />
                      <label
                        htmlFor={`checkbox-${availabilityStatus}`}
                        className="cursor-pointer text-sm text-gray-700"
                      >
                        {availabilityStatus}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                <span className="text-md font-semibold text-slate-900">Price</span>
              </AccordionSummary>
              <AccordionDetails>
                <div className="pl-2 overflow-y-auto space-y-2">
                  <NumericFormat
                    id="minPrice"
                    value={minPrice}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    onValueChange={(e) => setMinPrice(e.value)}
                    placeholder="Rp Min Price"
                    className="p-2 mr-2  border border-gray-800 text-gray-900 focus:ring-gray-900"
                  />
                  <NumericFormat
                    id={`maxPrice`}
                    value={maxPrice}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    onValueChange={(e) => setMaxPrice(e.value)}
                    placeholder="Rp Max Price"
                    className="p-2 mr-2  border border-gray-800 text-gray-900 focus:ring-gray-900"
                  />
                  <button
                    onClick={resetPrice}
                    className="px-4 py-2 bg-red-500 w-[213px] text-white text-[12px] rounded-md hover:bg-red-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full "
            style={{ height: filteredSpareParts.length < 4 ? "310px" : "auto" }}
          >
            {filteredSpareParts.map((part, index) => (
              <div
                key={part.id}
                className={`flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg transition-transform transform hover:scale-105 ${
                  index < visibleSparePart.length ? "fade-in-visible" : ""
                }`}
              >
                <div className="p-4">
                  <h5 className="mb-4 text-slate-800 text-sm md:text-xl font-semibold border-b pb-4">
                    {part.partName}
                  </h5>
                  <div className="flex">
                    {sparepartImagesCache?.[part.id] ? (
                      <img
                        src={sparepartImagesCache?.[part.id]}
                        alt={part.partName}
                        className="w-28 h-28 mr-6"
                      />
                    ) : (
                      <Skeleton variant="rectangular" width={112} height={112} className="mr-6" />
                    )}
                    <div className="text-[12px] leading-[20px] md:text-sm font-semibold text-gray-700 ">
                      <p>Part Number: {part.partNumber}</p>
                      <p>Manufacturer: {part.manufacturer}</p>
                      <p>
                        Status:{" "}
                        <span
                          className={`px-2 font-semibold rounded-full ${
                            part.availabilityStatus === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {part.availabilityStatus}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="font-semibold text-lg">{formatNumber(part.price)}</p>
                    <Link to={`/parts/details/${part.id}`}>
                      <Tooltip
                        title={part.availabilityStatus === "Out of Stock" ? "Out of Stock" : "View Details"}
                        arrow
                      >
                        <span>
                          <button
                            className={`py-2 px-4 rounded-md ${
                              part.availabilityStatus === "Out of Stock"
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-yellow-400 text-gray-900 transition duration-300 ease-in hover:bg-yellow-300"
                            }`}
                            disabled={part.stock == 0}
                          >
                            Details
                          </button>
                        </span>
                      </Tooltip>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 p-3 text-slate-600">
                  <p>{getAverageRatingSparepart(part.sparePartFeedbacks || [])} ⭐</p>
                  <p>{part.sparePartFeedbacks.length} Reviews</p>
                </div>
              </div>
            ))}
            {isFetchingNextPage && <p>Loading more...</p>}
          </div>
          {showBackToTop && (
            <Tooltip title="Back to Top" arrow>
              <button
                onClick={scrollToTop}
                className={`fixed bottom-6 left-1 p-3 bg-yellow-400 text-gray-900 rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                  isAnimatingOut ? "animate-slide-out" : "animate-slide-in"
                }`}
              >
                <span className="material-icons mt-1 mx-[5px]">arrow_upward</span>
              </button>
            </Tooltip>
          )}
        </div>
        {isMobileFilterOpen && (
          <div
            className={`fixed inset-x-0 bottom-0 bg-white rounded-t-lg shadow-lg p-6 transition-transform transform ${
              isMobileFilterOpen ? "animate-slide-up" : "animate-slide-out"
            } lg:hidden max-h-[80vh] overflow-hidden`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <button onClick={toggleMobileFilter} className="text-gray-600">
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="mt-4 overflow-y-auto max-h-[65vh] space-y-4">
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                  <span className="text-md font-semibold text-slate-900">Type</span>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="pl-2 overflow-y-auto space-y-2">
                    {["Excavator", "Grader", "Loader", "Dozer", "Truck", "Compactor", "Crane"].map(
                      (equipmentName) => (
                        <div key={equipmentName} className="flex items-center">
                          <input
                            id={`checkbox-${equipmentName}`}
                            type="checkbox"
                            checked={selectedEquipment.includes(equipmentName)}
                            onChange={() => handleCheckboxChange(equipmentName)}
                            className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                          />
                          <label
                            htmlFor={`checkbox-${equipmentName}`}
                            className="cursor-pointer text-sm text-gray-700"
                          >
                            {equipmentName}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                  <span className="text-md font-semibold text-slate-900">Manucfaturer</span>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="pl-2 overflow-y-auto space-y-2">
                    {["Komatsu", "Scania", "Tadano", "Bomag", "UD Truck"].map((manufacturer) => (
                      <div key={manufacturer} className="flex items-center">
                        <input
                          id={`checkbox-${manufacturer}`}
                          type="checkbox"
                          checked={selectedManufacturer === manufacturer}
                          onChange={() => handleManufacturerChange(manufacturer)}
                          className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                        />
                        <label
                          htmlFor={`checkbox-${manufacturer}`}
                          className="cursor-pointer text-sm text-gray-700"
                        >
                          {manufacturer}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                  <span className="text-md font-semibold text-slate-900">Status</span>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="pl-2 overflow-y-auto space-y-2">
                    {["In Stock", "Out of Stock"].map((availabilityStatus) => (
                      <div key={availabilityStatus} className="flex items-center">
                        <input
                          id={`checkbox-${availabilityStatus}`}
                          type="checkbox"
                          checked={selectedAvailabilityStatus === availabilityStatus}
                          onChange={() => handleAvailabilityStatusChange(availabilityStatus)}
                          className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                        />
                        <label
                          htmlFor={`checkbox-${availabilityStatus}`}
                          className="cursor-pointer text-sm text-gray-700"
                        >
                          {availabilityStatus}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                  <span className="text-md font-semibold text-slate-900">Price</span>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="pl-2 overflow-y-auto space-y-2">
                    <NumericFormat
                      id="minPrice"
                      value={minPrice}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="Rp "
                      onValueChange={(e) => setMinPrice(e.value)}
                      placeholder="Rp Min Price"
                      className="p-2 mr-2  border border-gray-800 text-gray-900 focus:ring-gray-900"
                    />
                    <NumericFormat
                      id={`maxPrice`}
                      value={maxPrice}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="Rp "
                      onValueChange={(e) => setMaxPrice(e.value)}
                      placeholder="Rp Max Price"
                      className="p-2 mr-2  border border-gray-800 text-gray-900 focus:ring-gray-900"
                    />
                    <button
                      onClick={resetPrice}
                      className="px-4 py-2 bg-red-500 w-[213px] text-white text-[12px] rounded-md hover:bg-red-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Parts;
