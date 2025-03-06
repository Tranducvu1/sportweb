export const formatPrice = (price) => {
  if (!price) return "0"; // Xử lý trường hợp giá trị không hợp lệ

  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
