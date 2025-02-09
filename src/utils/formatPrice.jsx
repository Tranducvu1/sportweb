export const formatPrice = (price) => {
  // Định dạng số theo kiểu tiền tệ Việt Nam
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);

  // Kiểm tra và cắt bớt phần thập phân nếu có nhiều hơn một chữ số
  const [integerPart, decimalPart] = formattedPrice.split(',');

  // Nếu có phần thập phân, chỉ lấy chữ số đầu tiên
  if (decimalPart) {
    return `${integerPart},${decimalPart[0]}`;
  }
  
  return formattedPrice;
};
