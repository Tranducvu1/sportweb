export const createUrlSlug = (text) => {
    return text
      .toLowerCase() // chuyển thành chữ thường
      .normalize('NFD') // tách dấu thành các ký tự riêng
      .replace(/[\u0300-\u036f]/g, '') // xóa các dấu
      .replace(/đ/g, 'd') // thay thế đ thành d
      .replace(/[^a-z0-9\s]/g, '') // chỉ giữ lại chữ cái, số và khoảng trắng
      .trim() // xóa khoảng trắng đầu cuối
      .replace(/\s+/g, '-'); // thay thế khoảng trắng bằng dấu gạch ngang
  };