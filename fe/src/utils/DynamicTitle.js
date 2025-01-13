const TitleMap = {
  "/login": "Đăng nhập",
  "/app/home": "Trang chủ",
  "/app/products": "Các sản phẩm",
  "/app/compare": "So sánh",
  "/app/shop": "Mua sắm",
  "/app/contact": "Liên hệ",
  "/app/favourite": "Sản phẩm yêu thích",
  "/app/chatbot": "Trò chuyện",
};

const DynamicTitle = (path) => {
  if (TitleMap[path]) {
    return `${TitleMap[path]} | VBMatch`;
  }

  const parts = path.split("/");
  if (parts.length > 2 && parts[0] === "" && parts[1] === "app") {
    // Check TitleMap for section-specific titles (e.g., /app/home)
    const sectionPath = `/${parts[1]}/${parts[2]}`; // Construct section path
    if (TitleMap[sectionPath]) {
      return `${TitleMap[sectionPath]} | VBMatch`;
    } else {
      // Fallback to section name for unmatched section paths
      return `${parts[2]} | VBMatch`;
    }
  }

  return "VBMatch"; // Default title
};

export default DynamicTitle;
