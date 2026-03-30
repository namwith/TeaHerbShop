const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Lưu vào thư mục backend/uploads/
  },
  filename: function (req, file, cb) {
    // Tạo tên file độc nhất để không bị trùng
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Bộ lọc: Chỉ cho phép các định dạng ảnh phổ biến (Thêm webp và svg)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  // Kiểm tra đuôi file
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  // Kiểm tra kiểu MIME (mimetype)
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Lỗi: Chỉ được phép tải lên file ảnh (.png, .jpg, .jpeg, .webp, .svg)!",
      ),
    );
  }
};

// Khởi tạo middleware upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước ảnh tối đa là 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
