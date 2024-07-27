import React, { useEffect, useRef, useState } from "react";
import apiService from "./apiServices";
import "./MainPage.css";
import bannerImage from "./asset/bannerImage.jpeg";
import { RiCloseCircleLine } from "react-icons/ri";

const MainPage = () => {
  const suggestionListRef = useRef(null);
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 640);
  const [productList, setProductList] = useState([]);
  const [paginationProductData, setPaginationData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [tagList, setTageList] = useState([]);
  const [selectedDate, SetSelectedDate] = useState("");
  const [filterdate, setFilterDate] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionClose, setSuggestClose] = useState(false);
  const [displayProduct, setDisplayProduct] = useState([]);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // all products
  useEffect(() => {
    apiService.allProduct().then((data) => {
      setProductList(data?.data);
    });
  }, []);
  // for Pagination geting data function
  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      const response = await apiService.paginationAllProduct(page);
      setPaginationData(response.data);
      console.log(response, "response");
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopView(window.innerWidth > 767);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const allTags = productList.reduce((acc, e) => {
      return [...acc, ...e.tag];
    }, []);
    setTageList(allTags);
  }, [productList]);

  const tagListData = [...new Set(tagList)];

  // date formate
  function formatDateRange(startDate, duration) {
    const start = new Date(startDate * 1000);
    const end = new Date(startDate * 1000 + duration * 24 * 60 * 60 * 1000);

    const startMonth = start.toLocaleString("default", { month: "long" });
    const startDay = start.getDate();
    const endMonth = end.toLocaleString("default", { month: "long" });
    const endDay = end.getDate();
    const year = start.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
  }
  // Date change filtre
  const handleDateChange = (e) => {
    console.log(e, "testr");
    const [startYear, endYear] = e.split("-").map(Number);
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear - 1, 11, 31);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const fromDate = formatDate(startDate);
    const toDate = formatDate(endDate);

    const selectedDateRange = { fromDate, toDate };
    // apiService.dateFilteration(selectedDateRange);
    console.log(selectedDateRange, "from_date, to_date");
  };

  // Filter Type
  const handleSelectedType = (e) => {
    console.log(e.target.value, "hschjskjdcyde");
    const selectedType = e.target.value;
    if (selectedType == "") {
      fetchData(page);
    } else {
      apiService.tageTypeFilteration(selectedType).then((data) => {
        console.log(data, "dataaaa");
        setPaginationData(data.data);
      });
    }
  };

  // search filter
  const handleInputChange = (event) => {
    const value = event.target.value;

    setSearchValue(value);
    setSuggestClose(true);
    const filteredSuggestions = productList.filter((item) => {
      const titleList = item.title ? item.title.toString().toUpperCase() : "";
      const searchValueUpper = value.toString().toUpperCase();

      return titleList.includes(searchValueUpper);
    });
    setSuggestions(filteredSuggestions);
    if (value == "") {
      setSuggestClose(false);
    }
    console.log(filteredSuggestions, "filteredSuggestions");
  };
  const handleSuggestionClick = (suggestion) => {
    setDisplayProduct([suggestion]);
    setSuggestions([]);
    setSuggestClose(false);
    console.log(suggestion, "suggestion");
    setSearchValue(suggestion.title);
    if (suggestion) {
      apiService.tageTypeFilteration(suggestion.title).then((data) => {
        console.log(data, "data");
        setPaginationData(data.data);
      });
    }
  };
  const handleClearSearch = () => {
    setSearchValue("");
    fetchData(page);
  };

  return (
    <div className="w-[100vw] h-[100vh] m-0 overflow-x-hidden main ">
      <div className="bg-[#1b3252] p-5 text-center sm:text-left title">
        <h1 className="text-2xl font-bold text-white">Wellness Retreats</h1>
      </div>

      {isDesktopView && (
        <div className=" p-5 shadow-md h-[500px] bg-[#e0d9cf] rounded-md banner m-4">
          <div>
            <img
              src={bannerImage}
              alt="Banner"
              className="h-[350px] w-[100%] rounded-md opacity-75"
            />
          </div>
          <h2 className="text-lg font-bold  py-1">Discover Your Inner Peace</h2>
          <p className="text-base font-normal  py-1">
            Join us for a series of wellness retreats designed to help you find
            tranquility and rejuvenation.
          </p>
        </div>
      )}
      <div className="productList  m-4">
        <div className="filterProduct md:flex  w-[100%]">
          <div className="md:flex md:w-[25%] ">
            <div className="md:flex-1 my-3 md:ml-2">
              {/* date filter */}
              <select
                id="countries"
                className=" border-[1px] bg-[#efefef] rounded w-[100%]  md:text-white md:bg-[#1b3252] md:hover:bg-blue-800  md:font-medium md:rounded-lg md:text-sm  px-3 py-3 text-left md:dark:bg-blue-600 md:dark:hover:bg-[#1b3252]"
                onChange={(e) => handleDateChange(e.target.value)}
              >
                <option selected>Filter by Date</option>
                <option className="bg-white text-black" value="2023-2024">
                  2023-2024
                </option>
                <option className="bg-white text-black" value=" 2024-2025">
                  2024-2025
                </option>
              </select>
            </div>
            <div className="md:flex-1 my-3 md:ml-2">
              <select
                id="countries"
                className=" border-[1px] bg-[#efefef] rounded w-[100%]  md:text-white md:bg-[#1b3252] md:hover:bg-blue-800  md:font-medium md:rounded-lg md:text-sm  px-3 py-3 text-left md:dark:bg-blue-600 md:dark:hover:bg-[#1b3252]"
                onChange={(e) => handleSelectedType(e)}
              >
                <option selected value="">
                  Filter by Type
                </option>
                {tagListData.map((tags, index) => (
                  <option
                    value={tags}
                    className="bg-white text-black"
                    key={index}
                  >
                    {tags}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:w-[75%]">
            <div className="md:flex-1 my-3 md:justify-end md:flex searchTitle relative">
              <div className="flex items-center w-full md:w-[30%] relative">
                <input
                  className="block border-[1px] bg-[#efefef] rounded-l md:text-white md:bg-[#1b3252] md:hover:bg-blue-800 md:font-medium md:text-sm px-5 py-3 md:dark:bg-blue-600 md:dark:hover:bg-[#1b3252] placeholder-white hover:outline-slate-300 outline-slate-300 w-full"
                  type="text"
                  placeholder="Search retreats by title"
                  value={searchValue}
                  onChange={(event) => {
                    handleInputChange(event);
                    setSearchValue(event.target.value);
                  }}
                />
                {searchValue && (
                  <p
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 md:text-white text-black cursor-pointer"
                    onClick={handleClearSearch}
                  >
                    <RiCloseCircleLine />
                  </p>
                )}
              </div>

              {suggestionClose && (
                <ul
                  className="suggestion-list md:w-[30%] md:mt-[40px]"
                  ref={suggestionListRef}
                >
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="productCard w-[100%]">
          <div className="grid-rows-1">
            <div>
              <div>
                {isLoading ? (
                  <div className="m-5 flex justify-center">
                    <button
                      disabled
                      type="button"
                      class="py-3 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="#1C64F2"
                        />
                      </svg>
                      Loading...
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="lg:grid lg:grid-cols-3 lg:gap-3 md:grid md:grid-cols-2 md:gap-3 xl:grid xl:grid-cols-3 xl:gap-3 2xl:grid 2xl:grid-cols-3 2xl:gap-3 ">
                      {paginationProductData.map((dataList) => (
                        <div className="p-5 shadow-md  bg-[#e0d9cf] rounded-md  my-5 md:my-0">
                          <div className="card-body">
                            <div className="card-image">
                              <img
                                src={dataList.image}
                                alt="dataList.title"
                                className="w-[100%] h-[150px] object-cover rounded-md"
                              />
                            </div>
                            <div>
                              <h2 className="text-md font-bold line-clamp-2 py-1">
                                {dataList.title}
                              </h2>
                              <p className="line-clamp-2 h-[50px] py-1">
                                {dataList.description}
                              </p>
                              <p className="mt-2 py-1">
                                Date:{" "}
                                {formatDateRange(
                                  dataList.date,
                                  dataList.duration
                                )}
                              </p>
                              <p className="py-1">
                                Location: {dataList.location}
                              </p>
                              <p className="py-1">Price: ${dataList.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center m-4">
                      <button
                        onClick={handlePreviousPage}
                        className={`bg-[#1b3252] p-2 text-center text-white text-base font-medium rounded-md mr-2 ${
                          page === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-white hover:border border-[#1b3252] hover:text-[#1b3252]"
                        } `}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNextPage}
                        className={`bg-[#1b3252] p-2 text-center text-white text-base font-medium rounded-md ml-2 ${
                          page === 5
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-white hover:border border-[#1b3252] hover:text-[#1b3252]"
                        } `}
                        disabled={page === 5}
                      >
                        Next
                      </button>
                    </div>
                    <div>
                      <p className="text-center text-sm">
                        © 2024 Wellness Retreats. All rights reserved.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
