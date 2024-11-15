import { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { getAverageRating } from "../../utils";
import { useEquipmentImages, useEquipmentOptions } from "../../hooks/equipmentHooks/useEquipmentQueries";
import { ThreeDot } from "react-loading-indicators";
import Tooltip from "@mui/material/Tooltip";
import { AccordionDetails, AccordionSummary, Skeleton } from "@mui/material";
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

const HeavyEquipment = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [equipmentImagesCache, setEquipmentImagesCache] = useState<{ [key: number]: string }>({});
  const [selectedLocation, setSelectedLocation] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedBrand, setSelectedBrand] = useState<string>();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);
  const filters = useMemo(
    () => ({
      type: selectedEquipment.length > 0 ? selectedEquipment.join(",") : undefined,
      status: selectedStatus,
      location: selectedLocation,
      brand: selectedBrand,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
    }),
    [selectedEquipment, selectedStatus, selectedLocation, selectedBrand, debouncedMinPrice, debouncedMaxPrice]
  );

  const {
    data: equipmentPages,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEquipmentOptions(filters);

  const allEquipment = equipmentPages?.pages.flatMap((page) => page.data) || [];
  const newEquipmentIds = useMemo(() => {
    return allEquipment.map((equipment) => equipment.id).filter((id) => !equipmentImagesCache[id]);
  }, [allEquipment, equipmentImagesCache]);
  const { data: equipmentImages } = useEquipmentImages(newEquipmentIds, 300);

  useEffect(() => {
    if (equipmentImages) {
      setEquipmentImagesCache((prevCache) => ({ ...prevCache, ...equipmentImages }));
    }
  }, [equipmentImages]);

  const [visibleEquipment, setVisibleEquipment] = useState<any[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleMobileFilter = () => setIsMobileFilterOpen((prev) => !prev);

  const handleScroll = () => {
    if (window.scrollY > 800) {
      setShowBackToTop(true);
    } else if (window.scrollY === 0) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setShowBackToTop(false);
        setIsAnimatingOut(false);
      }, 300);
    }

    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 400 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    setVisibleEquipment(allEquipment);
  }, [equipmentPages]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 2000);
    return () => clearTimeout(handler);
  }, [minPrice, maxPrice]);

  const handleCheckboxChange = (equipmentType: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipmentType) ? prev.filter((type) => type !== equipmentType) : [...prev, equipmentType]
    );
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location === selectedLocation ? "" : location);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status === selectedStatus ? "" : status);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand === selectedBrand ? "" : brand);
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

  if (isError) return <p>Failed to fetch equipment data</p>;

  const filteredEquipmentData = allEquipment;

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
          {" "}
          <div className=" flex-col rounded-lg w-80 min-h-[310px] lg:block hidden">
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                <span className="text-md font-semibold text-slate-900">Type</span>
              </AccordionSummary>
              <AccordionDetails>
                <div className="pl-2 overflow-y-auto space-y-2">
                  {["Excavator", "Grader", "Loader", "Dozer", "Truck", "Compactor", "Crane"].map(
                    (equipmentType) => (
                      <div key={equipmentType} className="flex items-center">
                        <input
                          id={`checkbox-${equipmentType}`}
                          type="checkbox"
                          checked={selectedEquipment.includes(equipmentType)}
                          onChange={() => handleCheckboxChange(equipmentType)}
                          className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                        />
                        <label
                          htmlFor={`checkbox-${equipmentType}`}
                          className="cursor-pointer text-sm text-gray-700"
                        >
                          {equipmentType}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                <span className="text-md font-semibold text-slate-900">Location</span>
              </AccordionSummary>
              <AccordionDetails>
                <div className="pl-2 overflow-y-auto space-y-2">
                  {["Jakarta", "Bandung", "Kalimantan", "Malang", "Surabaya", "Ngawi"].map((location) => (
                    <div key={location} className="flex items-center">
                      <input
                        id={`checkbox-${location}`}
                        type="checkbox"
                        value={location}
                        checked={selectedLocation === location}
                        onChange={() => handleLocationChange(location)}
                        className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                      />
                      <label
                        htmlFor={`checkbox-${location}`}
                        className="cursor-pointer text-sm text-gray-700"
                      >
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                <span className="text-md font-semibold text-slate-900">Brand</span>
              </AccordionSummary>
              <AccordionDetails>
                <div className="pl-2 overflow-y-auto space-y-2">
                  {["Komatsu", "Scania", "Tadano", "Bomag", "UD Truck"].map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        id={`checkbox-${brand}`}
                        type="checkbox"
                        value={brand}
                        checked={selectedBrand === brand}
                        onChange={() => handleBrandChange(brand)}
                        className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                      />
                      <label htmlFor={`checkbox-${brand}`} className="cursor-pointer text-sm text-gray-700">
                        {brand}
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
                  {["Available", "Unavailable"].map((status) => (
                    <div key={status} className="flex items-center">
                      <input
                        id={`checkbox-${status}`}
                        type="checkbox"
                        value={status}
                        checked={selectedStatus === status}
                        onChange={() => handleStatusChange(status)}
                        className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                      />
                      <label htmlFor={`checkbox-${status}`} className="cursor-pointer text-sm text-gray-700">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                <span className="text-md font-semibold text-slate-900">Rental Price</span>
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
            style={{ height: filteredEquipmentData.length < 4 ? "310px" : "auto" }}
          >
            {filteredEquipmentData.map((equipment, index) => (
              <div
                key={equipment.id}
                className={`flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg transition-transform transform hover:scale-105 ${
                  index < visibleEquipment.length ? "fade-in-visible" : ""
                }`}
              >
                <div className="p-4">
                  <h5 className="mb-4 text-slate-800 text-sm md:text-xl font-semibold border-b pb-4">
                    {equipment.name}
                  </h5>
                  <div className="flex gap-5">
                    {equipmentImagesCache?.[equipment.id] ? (
                      <img
                        src={equipmentImagesCache?.[equipment.id]}
                        alt={equipment?.images?.fileName}
                        className="w-28 h-28 mr-6 object-fill"
                        loading="lazy"
                      />
                    ) : (
                      <Skeleton variant="rectangular" width={112} height={112} className="mr-6" />
                    )}
                    <div className="text-[12px] leading-[20px] md:text-sm font-semibold text-gray-700 ">
                      <p>Brand: {equipment.brand}</p>
                      <p>Model: {equipment.model}</p>
                      <p>
                        Status:{" "}
                        <span
                          className={`px-2 font-semibold rounded-full ${
                            equipment.status === "Available"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {equipment.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end items-center mt-4">
                    <Link to={`/equipment/details/${equipment.id}`}>
                      <Tooltip title={equipment.status === "Available" ? "Details" : "Unavailable"} arrow>
                        <span>
                          <button
                            className={`py-2 px-4 rounded-md font-semibold text-sm ${
                              equipment.status === "Unavailable"
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-yellow-400 text-gray-900 transition duration-300 ease-in hover:bg-yellow-300"
                            }`}
                            disabled={equipment.status === "Unavailable"}
                          >
                            Details
                          </button>
                        </span>
                      </Tooltip>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 p-3 text-slate-600">
                  <span>{getAverageRating(equipment.performanceFeedbacks || [])} ⭐</span>
                  <span>
                    {equipment?.performanceFeedbacks?.length}{" "}
                    <span className="text-[12px] md:text-[16px]">Reviews</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isFetchingNextPage && <span>Loading...</span>}

        {showBackToTop && (
          <div>
            <Tooltip title="Back to Top" arrow>
              <button
                onClick={scrollToTop}
                className={`fixed bottom-6 left-6 p-3 bg-yellow-400 text-gray-900 rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                  isAnimatingOut ? "animate-slide-out" : "animate-slide-in"
                }`}
              >
                <span className="material-icons mt-1 mx-[5px]">arrow_upward</span>
              </button>
            </Tooltip>
          </div>
        )}

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
                  {["Excavator", "Grader", "Loader"].map((equipmentType) => (
                    <div key={equipmentType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedEquipment.includes(equipmentType)}
                        onChange={() =>
                          setSelectedEquipment((prev) =>
                            prev.includes(equipmentType)
                              ? prev.filter((type) => type !== equipmentType)
                              : [...prev, equipmentType]
                          )
                        }
                        className="mr-2 cursor-pointer"
                      />
                      <label className="text-sm text-gray-700">{equipmentType}</label>
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                  <span className="text-md font-semibold text-slate-900">Location</span>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="pl-2 overflow-y-auto space-y-2">
                    {["Jakarta", "Bandung", "Kalimantan", "Malang", "Surabaya", "Ngawi"].map((location) => (
                      <div key={location} className="flex items-center">
                        <input
                          id={`checkbox-${location}`}
                          type="checkbox"
                          value={location}
                          checked={selectedLocation === location}
                          onChange={() => handleLocationChange(location)}
                          className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                        />
                        <label
                          htmlFor={`checkbox-${location}`}
                          className="cursor-pointer text-sm text-gray-700"
                        >
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                  <span className="text-md font-semibold text-slate-900">Brand</span>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="pl-2 overflow-y-auto space-y-2">
                    {["Komatsu", "Scania", "Tadano", "Bomag", "UD Truck"].map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input
                          id={`checkbox-${brand}`}
                          type="checkbox"
                          value={brand}
                          checked={selectedBrand === brand}
                          onChange={() => handleBrandChange(brand)}
                          className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                        />
                        <label htmlFor={`checkbox-${brand}`} className="cursor-pointer text-sm text-gray-700">
                          {brand}
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
                    {["Available", "Unavailable"].map((status) => (
                      <div key={status} className="flex items-center">
                        <input
                          id={`checkbox-${status}`}
                          type="checkbox"
                          value={status}
                          checked={selectedStatus === status}
                          onChange={() => handleStatusChange(status)}
                          className="mr-2 cursor-pointer text-yellow-500 border-gray-300 focus:ring-yellow-500"
                        />
                        <label
                          htmlFor={`checkbox-${status}`}
                          className="cursor-pointer text-sm text-gray-700"
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<span className="material-icons">keyboard_arrow_down</span>}>
                  <span className="text-md font-semibold text-slate-900">Rental Price</span>
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

export default HeavyEquipment;
