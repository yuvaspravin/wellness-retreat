import axios from "axios";

const domain = "https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1";
axios.defaults.baseURL = domain;
const apiService = {
  //  ------product list-------
  allProduct: () => {
    return axios.get("/retreats");
  },
  //  ------pagination product list-------
  paginationAllProduct: (page) => {
    console.log(page, "pagedata");
    return axios.get(`/retreats?page=${page}&limit=5`);
  },
  dateFilteration: (dateRange) => {
    console.log(dateRange, "dateRange");
    return axios.get(`/retreats?search=${dateRange.fromDate}`);
  },
  tageTypeFilteration: (type) => {
    console.log(type, "dateRange");
    return axios.get(`/retreats?search=${type}`);
  },
};
export default apiService;
