import API from "@/helpers/API";

export const Products = () => {};

export const fetcher = (...arg) => {
  return API.get(...arg)
    .then((response) => response?.data)
    .catch((err) => console.error(err));
};
