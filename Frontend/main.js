// =======================
// HEADER
// =======================
const header = document.createElement("header");
header.className = "main-header";
header.innerHTML = `
  <div class="top-bar">
    <div class="container">
      <span>Chào mừng đến Hữu Store • Miễn phí vận chuyển toàn quốc từ 299k</span>
      <div class="hotline">Hotline: <strong>0909 123 456</strong></div>
    </div>
  </div>

  <div class="main-nav container">
    <div class="logo">
      <a href="index.html">H<span>Store</span></a>
    </div>

    <nav class="main-menu">
      <ul>
        <li><a href="index.html" class="active">Trang chủ</a></li>
        <li><a href="products.html">Sản phẩm</a></li>
        <li><a href="sale.html">Sale</a></li>
        <li><a href="blog.html">Blog</a></li>
      </ul>
    </nav>

    <div class="header-actions">
      <div class="search-box">
        <input type="text" placeholder="Tìm kiếm sản phẩm..." />
        <button><i class="fas fa-search"></i></button>
      </div>

      <a href="login.html" class="icon-link"><i class="far fa-user"></i></a>

      <a href="cart.html" class="icon-link cart">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count">0</span>
      </a>
    </div>
  </div>
`;
document.body.insertAdjacentElement("afterbegin", header);
// Hàm cập nhật số lượng giỏ hàng (dùng chung nhiều nơi)
async function updateCartCount() {
    try {
        const res = await fetch("http://localhost:3000/carts");
        const carts = await res.json();
        const total = carts.reduce((sum, item) => sum + item.quantity, 0);
        const countEl = document.querySelector(".cart-count");
        if (countEl)
            countEl.textContent = total.toString();
    }
    catch (err) {
        console.error("Lỗi cập nhật cart count:", err);
    }
}
// Gọi lần đầu khi load trang
updateCartCount();
/* =======================
   DANH MỤC (index.html)
======================= */
const categoryList = document.getElementById("category-list");
if (categoryList) {
    const resCate = await fetch("http://localhost:3000/categories");
    const categories = await resCate.json();
    categories.forEach((cate) => {
        categoryList.insertAdjacentHTML("beforeend", `<div class="category-item"><h3>${cate.name}</h3></div>`);
    });
}
/* =======================
   SẢN PHẨM NỔI BẬT & SẢN PHẨM MỚI (index.html)
======================= */
const featuredList = document.getElementById("featured-product-list");
if (featuredList) {
    const resFeatured = await fetch("http://localhost:3000/products?sale_gte=1&_sort=sale&_order=desc&_limit=4");
    const featuredProducts = await resFeatured.json();
    featuredProducts.forEach((product) => {
        const salePrice = product.sale > 0
            ? product.price - Math.round((product.price * product.sale) / 100)
            : product.price;
        featuredList.insertAdjacentHTML("beforeend", `
      <a href="detail.html?id=${product.id}" class="product">
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          ${product.sale > 0 ? `<span class="sale-badge">-${product.sale}%</span>` : ""}
        </div>
        <h3>${product.name}</h3>
        <div class="price-container">
          ${product.sale > 0
            ? `<span class="price-sale">${salePrice.toLocaleString()}₫</span>
               <span class="price-old">${product.price.toLocaleString()}₫</span>`
            : `<span class="current-price">${product.price.toLocaleString()}₫</span>`}
        </div>
        <button class="btn primary">Thêm vào giỏ</button>
      </a>
      `);
    });
}
const newList = document.getElementById("new-product-list");
if (newList) {
    const resNew = await fetch("http://localhost:3000/products?_sort=id&_order=desc&_limit=4");
    const newProducts = await resNew.json();
    newProducts.forEach((product) => {
        const salePrice = product.sale > 0
            ? product.price - Math.round((product.price * product.sale) / 100)
            : product.price;
        newList.insertAdjacentHTML("beforeend", `
      <a href="detail.html?id=${product.id}" class="product">
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          ${product.sale > 0 ? `<span class="sale-badge">-${product.sale}%</span>` : ""}
        </div>
        <h3>${product.name}</h3>
        <div class="price-container">
          ${product.sale > 0
            ? `<span class="price-sale">${salePrice.toLocaleString()}₫</span>
               <span class="price-old">${product.price.toLocaleString()}₫</span>`
            : `<span class="current-price">${product.price.toLocaleString()}₫</span>`}
        </div>
        <button class="btn primary">Thêm vào giỏ</button>
      </a>
      `);
    });
}
// =======================
// TRANG CHI TIẾT SẢN PHẨM (detail.html)
// =======================
const detailDiv = document.getElementById("product-detail");
if (detailDiv) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
        const resDetail = await fetch(`http://localhost:3000/products/${id}`);
        const productDetail = await resDetail.json();
        // Nếu không có images, dùng image làm fallback
        if (!productDetail.images || productDetail.images.length === 0) {
            productDetail.images = [productDetail.image];
        }
        const salePrice = productDetail.sale > 0
            ? productDetail.price -
                Math.round((productDetail.price * productDetail.sale) / 100)
            : productDetail.price;
        const colors = [...new Set(productDetail.variants.map((v) => v.color))];
        const sizes = [
            ...new Set(productDetail.variants.map((v) => v.size).filter((s) => s)),
        ];
        const colorHTML = colors
            .map((color) => `<button class="variant-btn color-btn" data-color="${color}">${color}</button>`)
            .join("");
        const sizeHTML = sizes
            .map((size) => `<button class="variant-btn size-btn" data-size="${size}">${size}</button>`)
            .join("");
        detailDiv.insertAdjacentHTML("beforeend", `
      <div class="product-detail-container">
        <div class="product-gallery">
          <div class="main-image">
            <img src="${productDetail.images[0]}" alt="${productDetail.name}" id="main-image" />
          </div>
          <div class="thumbnail-list">
            ${productDetail.images
            .map((img, index) => `
              <img src="${img}" alt="${productDetail.name} ${index + 1}" 
                   class="${index === 0 ? "active" : ""}" data-index="${index}" />
            `)
            .join("")}
          </div>
        </div>

        <div class="product-info">
          <h2 class="product-title">${productDetail.name}</h2>

          <div class="price-block">
            <span class="current-price">${salePrice.toLocaleString()}₫</span>
            ${productDetail.sale > 0
            ? `
              <span class="original-price">${productDetail.price.toLocaleString()}₫</span>
              <span class="sale-badge-detail">-${productDetail.sale}%</span>
            `
            : ""}
          </div>

          <div class="product-description">
            <p>${productDetail.description || "Đang cập nhật mô tả chi tiết..."}</p>
          </div>

          <div class="variant-section">
            <div class="color-section">
              <h4>Màu sắc</h4>
              <div class="variant-list color-list">${colorHTML}</div>
            </div>
            <div class="size-section">
              <h4>Kích thước</h4>
              <div class="variant-list size-list">${sizeHTML}</div>
            </div>
          </div>

          <p id="stock-info">Chọn màu sắc và kích thước để xem tồn kho</p>

          <div class="action-buttons">
            <button class="btn primary large" id="add-to-cart-btn"  type="button">Thêm vào giỏ hàng</button>
            <button class="btn success large">Mua ngay</button>
          </div>
        </div>
      </div>
    `);
        // Gallery thumbnails
        const mainImage = document.getElementById("main-image");
        const thumbnails = document.querySelectorAll(".thumbnail-list img");
        thumbnails.forEach((thumb) => {
            thumb.addEventListener("click", () => {
                const index = parseInt(thumb.getAttribute("data-index") || "0");
                mainImage.src = productDetail.images[index];
                thumbnails.forEach((t) => t.classList.remove("active"));
                thumb.classList.add("active");
            });
        });
        // Logic chọn biến thể + thêm vào giỏ
        let selectedColor = null;
        let selectedSize = null;
        let selectedVariantId = null;
        const colorBtns = document.querySelectorAll(".color-btn");
        const sizeBtns = document.querySelectorAll(".size-btn");
        const stockInfo = document.getElementById("stock-info");
        const addToCartBtn = document.getElementById("add-to-cart-btn");
        function updateStockAndVariant() {
            if (selectedColor && selectedSize) {
                const variant = productDetail.variants.find((v) => v.color === selectedColor && v.size === selectedSize);
                if (variant) {
                    selectedVariantId = variant.id;
                    stockInfo.textContent = `Còn ${variant.stock} sản phẩm`;
                    addToCartBtn.disabled = variant.stock <= 0;
                    addToCartBtn.textContent =
                        variant.stock <= 0 ? "Hết hàng" : "Thêm vào giỏ hàng";
                }
            }
            else {
                selectedVariantId = null;
                stockInfo.textContent = "Chọn màu sắc và kích thước để xem tồn kho";
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = "Thêm vào giỏ hàng";
            }
        }
        colorBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                colorBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                selectedColor = btn.getAttribute("data-color");
                updateStockAndVariant();
            });
        });
        sizeBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                sizeBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                selectedSize = btn.getAttribute("data-size");
                updateStockAndVariant();
            });
        });
        // Thêm vào giỏ hàng
        addToCartBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            if (!selectedVariantId) {
                alert("Vui lòng chọn màu và kích thước!");
                return;
            }
            const variant = productDetail.variants.find((v) => v.id === selectedVariantId);
            if (!variant || variant.stock < 1) {
                alert("Sản phẩm đã hết hàng!");
                return;
            }
            const quantity = 1; // Có thể thêm input số lượng sau
            // Kiểm tra đã có trong giỏ chưa
            const resCarts = await fetch("http://localhost:3000/carts");
            const carts = await resCarts.json();
            const existing = carts.find((item) => item.productId === productDetail.id &&
                item.variantId === selectedVariantId);
            if (existing) {
                existing.quantity += quantity;
                await fetch(`http://localhost:3000/carts/${existing.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(existing),
                });
            }
            else {
                const newItem = {
                    productId: productDetail.id,
                    variantId: selectedVariantId,
                    quantity: quantity,
                };
                await fetch("http://localhost:3000/carts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newItem),
                });
            }
            // Giảm stock
            variant.stock -= quantity;
            await fetch(`http://localhost:3000/products/${productDetail.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productDetail),
            });
            alert("Đã thêm vào giỏ hàng!");
            updateCartCount(); // Cập nhật icon ngay lập tức
        });
        // Related products (đã có trong code gốc)
        const relatedRes = await fetch(`http://localhost:3000/products?categoryId=${productDetail.categoryId}&id_ne=${id}&_limit=4`);
        const relatedProducts = await relatedRes.json();
        const relatedContainer = document.getElementById("related-products");
        if (relatedContainer) {
            relatedProducts.forEach((product) => {
                const salePrice = product.sale > 0
                    ? product.price - Math.round((product.price * product.sale) / 100)
                    : product.price;
                relatedContainer.insertAdjacentHTML("beforeend", `
          <a href="detail.html?id=${product.id}" class="product">
            <div class="product-image-wrapper">
              <img src="${product.image}" alt="${product.name}" loading="lazy" />
              ${product.sale > 0 ? `<span class="sale-badge">-${product.sale}%</span>` : ""}
            </div>
            <h3>${product.name}</h3>
            <div class="price-container">
              ${product.sale > 0
                    ? `<span class="price-sale">${salePrice.toLocaleString()}₫</span>
                   <span class="price-old">${product.price.toLocaleString()}₫</span>`
                    : `<span class="current-price">${product.price.toLocaleString()}₫</span>`}
            </div>
            <button class="btn primary">Thêm vào giỏ</button>
          </a>
        `);
            });
        }
    }
}
// =======================
// TRANG SẢN PHẨM (products.html)
// =======================
const productList = document.getElementById("product-list");
const categoryFilter = document.getElementById("category-filter");
const loadingEl = document.getElementById("loading");
const noProductsEl = document.getElementById("no-products");
if (productList && categoryFilter) {
    fetch("http://localhost:3000/categories")
        .then((res) => res.json())
        .then((categories) => {
        categories.forEach((cate) => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="#" data-category="${cate.id}">${cate.name}</a>`;
            categoryFilter.appendChild(li);
        });
        categoryFilter.addEventListener("click", (e) => {
            const target = e.target;
            if (target.tagName === "A") {
                e.preventDefault();
                const categoryId = target.getAttribute("data-category");
                categoryFilter
                    .querySelectorAll("li")
                    .forEach((li) => li.classList.remove("active"));
                target.parentElement?.classList.add("active");
                loadProducts(categoryId === "all" ? null : categoryId);
            }
        });
    });
    async function loadProducts(categoryId = null) {
        try {
            loadingEl.style.display = "block";
            productList.innerHTML = "";
            noProductsEl.style.display = "none";
            let url = "http://localhost:3000/products";
            if (categoryId)
                url += `?categoryId=${categoryId}`;
            const res = await fetch(url);
            if (!res.ok)
                throw new Error("Lỗi tải sản phẩm");
            const products = await res.json();
            if (products.length === 0) {
                noProductsEl.style.display = "block";
                return;
            }
            products.forEach((product) => {
                const salePrice = product.sale > 0
                    ? Math.round(product.price * (1 - product.sale / 100))
                    : product.price;
                productList.insertAdjacentHTML("beforeend", `
          <a href="detail.html?id=${product.id}" class="product-link">
            <div class="product">
              <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" loading="lazy" />
                ${product.sale > 0 ? `<span class="sale-badge">-${product.sale}%</span>` : ""}
              </div>
              <h3>${product.name}</h3>
              <div class="price-container">
                ${product.sale > 0
                    ? `<span class="price-sale">${salePrice.toLocaleString()}₫</span>
                     <span class="price-old">${product.price.toLocaleString()}₫</span>`
                    : `<span class="current-price">${product.price.toLocaleString()}₫</span>`}
              </div>
              <button class="btn primary">Thêm vào giỏ</button>
            </div>
          </a>
        `);
            });
        }
        catch (error) {
            console.error(error);
            productList.innerHTML = `<div style="padding: 80px 0; text-align: center; color: var(--danger);">Không thể tải sản phẩm</div>`;
        }
        finally {
            loadingEl.style.display = "none";
        }
    }
    loadProducts();
}
// Đăng ký & Đăng nhập (giữ nguyên)
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password")
            .value;
        const confirm = document.getElementById("password-confirm").value;
        if (password !== confirm)
            return alert("Mật khẩu không khớp");
        const res = await fetch("http://localhost:3000/users");
        const users = await res.json();
        if (users.some((u) => u.email === email))
            return alert("Email đã tồn tại");
        await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        //alert("Đăng ký thành công!");
        window.location.href = "login.html";
    });
}
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password")
            .value;
        const res = await fetch("http://localhost:3000/users");
        const users = await res.json();
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
            alert("Đăng nhập thành công!");
            window.location.href = "index.html";
        }
        else {
            alert("Email hoặc mật khẩu không đúng");
        }
    });
}
// =======================
// FOOTER
// =======================
const footer = document.createElement("footer");
footer.className = "main-footer";
footer.innerHTML = `
  <div class="container footer-grid">
    <!-- Cột 1 -->
    <div class="footer-col">
      <h3 class="footer-logo">H<span>Store</span></h3>
      <p>
        Hữu Store – Thời trang chính hãng, cập nhật xu hướng mới nhất.
        Cam kết chất lượng & dịch vụ tốt nhất cho khách hàng.
      </p>
    </div>

    <!-- Cột 2 -->
    <div class="footer-col">
      <h4>Danh mục</h4>
      <ul>
        <li><a href="#">Thời trang nữ</a></li>
        <li><a href="#">Thời trang nam</a></li>
        <li><a href="#">Hàng mới về</a></li>
        <li><a href="#">Sale</a></li>
      </ul>
    </div>

    <!-- Cột 3 -->
    <div class="footer-col">
      <h4>Hỗ trợ khách hàng</h4>
      <ul>
        <li><a href="#">Chính sách đổi trả</a></li>
        <li><a href="#">Chính sách bảo hành</a></li>
        <li><a href="#">Hướng dẫn mua hàng</a></li>
        <li><a href="#">Câu hỏi thường gặp</a></li>
      </ul>
    </div>

    <!-- Cột 4 -->
    <div class="footer-col">
      <h4>Liên hệ</h4>
      <ul class="footer-contact">
        <li><i class="fas fa-phone"></i> 0909 123 456</li>
        <li><i class="fas fa-envelope"></i> support@hustore.vn</li>
        <li><i class="fas fa-location-dot"></i> TP. Hồ Chí Minh</li>
      </ul>

      <div class="footer-social">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-tiktok"></i></a>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    © 2026 Hữu Store. All rights reserved.
  </div>
`;
// Chèn footer vào cuối body
document.body.insertAdjacentElement("beforeend", footer);
// =======================
// CHATBOT
// =======================
const chatbot = document.createElement("div");
chatbot.className = "chatbot";
chatbot.innerHTML = `
  <div class="chatbot-toggle">
    <i class="fas fa-comments"></i>
  </div>
  <div class="chatbot-window">
    <div class="chatbot-header">
      <h4>Hỗ trợ khách hàng</h4>
      <span class="chatbot-close">&times;</span>
    </div>
    <div class="chatbot-messages">
      <div class="message bot">
        <p>Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?</p>
      </div>
    </div>
    <div class="chatbot-input">
      <input type="text" placeholder="Nhập tin nhắn..." />
      <button><i class="fas fa-paper-plane"></i></button>
    </div>
  </div>
`;
// Chèn chatbot vào cuối body
document.body.insertAdjacentElement("beforeend", chatbot);
// Chatbot functionality
const toggleBtn = chatbot.querySelector(".chatbot-toggle");
const chatWindow = chatbot.querySelector(".chatbot-window");
const closeBtn = chatbot.querySelector(".chatbot-close");
const input = chatbot.querySelector("input");
const sendBtn = chatbot.querySelector("button");
const messages = chatbot.querySelector(".chatbot-messages");
toggleBtn.addEventListener("click", () => {
    chatWindow.style.display =
        chatWindow.style.display === "block" ? "none" : "block";
});
closeBtn.addEventListener("click", () => {
    chatWindow.style.display = "none";
});
sendBtn.addEventListener("click", () => {
    const message = input.value.trim();
    if (message) {
        addMessage("user", message);
        input.value = "";
        // Simple bot response
        setTimeout(() => {
            addMessage("bot", getBotResponse(message));
        }, 1000);
    }
});
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});
function addMessage(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}
function getBotResponse(message) {
    const lower = message.toLowerCase();
    if (lower.includes("giá") || lower.includes("tiền")) {
        return "Bạn có thể xem giá sản phẩm trực tiếp trên trang sản phẩm. Có câu hỏi gì khác không?";
    }
    else if (lower.includes("ship") || lower.includes("giao hàng")) {
        return "Chúng tôi hỗ trợ giao hàng toàn quốc. Đơn hàng từ 299k sẽ được freeship!";
    }
    else if (lower.includes("size") || lower.includes("kích thước")) {
        return "Bạn có thể chọn size khi xem chi tiết sản phẩm. Chúng tôi có size từ S đến XXL.";
    }
    else {
        return "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ hỗ trợ bạn sớm nhất có thể.";
    }
}
// Footer & Chatbot (giữ nguyên như code bạn gửi)
// ... (dán phần footer và chatbot từ code gốc của bạn vào đây nếu cần)
// Export nếu cần
// =======================
// CART PAGE (cart.html)
// =======================
const cartList = document.getElementById("cart-list");
const emptyMsg = document.getElementById("empty-cart-msg");
const summary = document.getElementById("cart-summary");
const totalPriceEl = document.getElementById("total-price");
// 👉 Chỉ chạy khi đang ở cart.html
if (cartList) {
    loadCart();
    cartList.addEventListener("click", async (e) => {
        const target = e.target;
        const cartItem = target.closest(".cart-item");
        if (!cartItem)
            return;
        const cartId = cartItem.getAttribute("data-id");
        if (!cartId)
            return;
        const res = await fetch(`http://localhost:3000/carts/${cartId}`);
        const item = await res.json();
        if (target.classList.contains("increase")) {
            item.quantity += 1;
            await fetch(`http://localhost:3000/carts/${cartId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            // Cập nhật số lượng trên giao diện mà không reload toàn bộ
            const qtySpan = cartItem.querySelector(".qty");
            if (qtySpan)
                qtySpan.textContent = item.quantity.toString();
            updateTotalPrice();
            updateCartCount();
            return;
        }
        if (target.classList.contains("decrease")) {
            if (item.quantity <= 1)
                return;
            item.quantity -= 1;
            await fetch(`http://localhost:3000/carts/${cartId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            // Cập nhật số lượng trên giao diện mà không reload toàn bộ
            const qtySpan = cartItem.querySelector(".qty");
            if (qtySpan)
                qtySpan.textContent = item.quantity.toString();
            updateTotalPrice();
            updateCartCount();
            return;
        }
        if (target.classList.contains("remove-btn")) {
            await fetch(`http://localhost:3000/carts/${cartId}`, {
                method: "DELETE",
            });
            // Xóa item khỏi giao diện mà không reload toàn bộ
            cartItem.remove();
            updateTotalPrice();
            updateCartCount();
            // Kiểm tra giỏ hàng còn items không
            const remainingItems = cartList.querySelectorAll(".cart-item");
            if (remainingItems.length === 0) {
                emptyMsg.style.display = "block";
                summary.style.display = "none";
            }
            return;
        }
    });
}
// Hàm cập nhật tổng tiền mà không reload toàn bộ trang
async function updateTotalPrice() {
    const res = await fetch("http://localhost:3000/carts");
    const carts = await res.json();
    let total = 0;
    for (const item of carts) {
        const resP = await fetch(`http://localhost:3000/products/${item.productId}`);
        const product = await resP.json();
        const price = product.sale > 0
            ? product.price - Math.round((product.price * product.sale) / 100)
            : product.price;
        total += price * item.quantity;
    }
    totalPriceEl.textContent = total.toLocaleString() + "₫";
}
async function loadCart() {
    const res = await fetch("http://localhost:3000/carts");
    const carts = await res.json();
    if (carts.length === 0) {
        emptyMsg.style.display = "block";
        summary.style.display = "none";
        cartList.innerHTML = "";
        return;
    }
    emptyMsg.style.display = "none";
    summary.style.display = "block";
    cartList.innerHTML = "";
    let total = 0;
    for (const item of carts) {
        const resP = await fetch(`http://localhost:3000/products/${item.productId}`);
        const product = await resP.json();
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant)
            continue;
        const price = product.sale > 0
            ? product.price - Math.round((product.price * product.sale) / 100)
            : product.price;
        total += price * item.quantity;
        cartList.insertAdjacentHTML("beforeend", `
  <div class="cart-item" data-id="${item.id}">
    <img src="${product.image}" width="80" />         
    <div class="cart-info">
      <h4>${product.name}</h4>
      <p>${variant.color} - ${variant.size}</p>
      <p>${price.toLocaleString()}₫</p>      

      <div class="cart-actions">
        <button class="qty-btn decrease">-</button>
        <span class="qty">${item.quantity}</span>
        <button class="qty-btn increase">+</button>

        <button class="remove-btn">Xóa</button>
      </div>
    </div>
  </div>
  `);
    }
    totalPriceEl.textContent = total.toLocaleString() + "₫";
}
export { updateCartCount };
