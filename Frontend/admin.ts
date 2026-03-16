import { Product } from "./models/Product";

const productTable: HTMLElement | null =
  document.getElementById("product-body");
const productForm = document.getElementById("product-form") as HTMLFormElement;
const categorySelect = document.getElementById(
  "product-categoryId",
) as HTMLSelectElement;
const variantsList = document.getElementById("variants-list") as HTMLElement;
const addVariantBtn = document.getElementById(
  "add-variant-btn",
) as HTMLButtonElement;

let variants: { id: number; color: string; size: string; stock: number }[] = [];
let categoryData: { id: string; name: string }[] = [];
let editingProductId: string | null = null;
let productsData: Product[] = [];
let usersData: { id: string; email: string }[] = [];
let ordersData: any[] = [];

// Load categories
async function loadCategories() {
  try {
    const res = await fetch("http://localhost:3000/categories");
    categoryData = await res.json();
    categoryData.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Lỗi khi load categories:", error);
  }
}

// Render variants list
function renderVariants() {
  variantsList.innerHTML = "";
  variants.forEach((variant, index) => {
    const variantHTML = `
      <div class="variant-item">
        <div class="form-group">
          <label>Màu</label>
          <input type="text" value="${variant.color}" placeholder="Nhập màu" 
            onchange="updateVariant(${index}, 'color', this.value)" />
        </div>
        <div class="form-group">
          <label>Size</label>
          <input type="text" value="${variant.size}" placeholder="Nhập size (M, L, XL...)" 
            onchange="updateVariant(${index}, 'size', this.value)" />
        </div>
        <div class="form-group">
          <label>Số lượng</label>
          <input type="number" value="${variant.stock}" min="0" placeholder="Nhập số lượng" 
            onchange="updateVariant(${index}, 'stock', parseInt(this.value))" />
        </div>
        <button type="button" class="remove-variant" onclick="removeVariant(${index})">×</button>
      </div>
    `;
    variantsList.insertAdjacentHTML("beforeend", variantHTML);
  });
}

// Update variant (window functions for onclick handlers)
declare global {
  function updateVariant(index: number, field: string, value: any): void;
  function removeVariant(index: number): void;
}

(window as any).updateVariant = (index: number, field: string, value: any) => {
  const variant = variants[index] as any;
  if (field === "stock") {
    variant[field] = parseInt(value);
  } else {
    variant[field] = value;
  }
};

(window as any).removeVariant = (index: number) => {
  variants.splice(index, 1);
  renderVariants();
};

// Add variant
addVariantBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  const newVariant = {
    id: Date.now(),
    color: "",
    size: "",
    stock: 0,
  };
  variants.push(newVariant);
  renderVariants();
});

// Load products
async function loadProducts() {
  if (!productTable) return;

  try {
    const res = await fetch("http://localhost:3000/products");
    const data: Product[] = await res.json();
    productsData = data;

    // clear existing rows
    productTable.innerHTML = "";

    data.forEach((product: Product) => {
      let variantString = "";
      if (product.variants && product.variants.length > 0) {
        variantString = product.variants
          .map((v) => `${v.color}${v.size ? " - " + v.size : ""} (${v.stock})`)
          .join("<br>");
      } else {
        variantString = "Không có biến thể";
      }

      const totalStock =
        product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;

      productTable.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td><img src="${product.image}" /></td>
          <td>₫${product.price.toLocaleString()}</td>
          <td>${product.sale}%</td>
          <td>${totalStock}</td>
          <td>${variantString}</td>
          <td>
            <button onclick="editProduct('${product.id}')">Sửa</button>
            <button onclick="deleteProduct('${product.id}')">Xóa</button>
          </td>
        </tr>
        `,
      );
    });
    renderStats();
  } catch (error) {
    console.error("Lỗi khi load products:", error);
  }
}

async function fetchUsers() {
  try {
    const res = await fetch("http://localhost:3000/users");
    usersData = await res.json();
  } catch (err) {
    console.error("Lỗi khi load users:", err);
  }
}

// Orders
async function fetchOrders() {
  try {
    const res = await fetch("http://localhost:3000/orders");
    ordersData = await res.json();
    renderOrders();
  } catch (err) {
    console.error("Lỗi khi load orders:", err);
  }
}

function renderOrders() {
  try {
    const tbody = document.getElementById("orders-body");
    if (!tbody) return;
    const filterEl = document.getElementById(
      "orders-filter",
    ) as HTMLSelectElement | null;
    const filter = filterEl?.value || "all";
    tbody.innerHTML = "";
    const list =
      filter === "all"
        ? ordersData
        : ordersData.filter((o) => o.status === filter);
    list.forEach((o) => {
      const itemsSummary = (o.items || [])
        .map((i: any) => `${i.name} x${i.quantity}`)
        .join("<br>");
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.customerName || o.userId}<br><span class="tiny">${o.email || ""}</span></td>
      <td>${itemsSummary}</td>
      <td>₫${(o.total || 0).toLocaleString()}</td>
      <td>${o.status || ""}</td>
      <td>${new Date(o.createdAt || "").toLocaleString() || ""}</td>
      <td>
        <button onclick="viewOrder('${o.id}')">Xem</button>
        <button onclick="changeOrderStatus('${o.id}','shipped')">Đã gửi</button>
        <button onclick="changeOrderStatus('${o.id}','cancelled')">Hủy</button>
        <button onclick="deleteOrder('${o.id}')">Xóa</button>
      </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Lỗi render orders:", err);
  }
}

(window as any).viewOrder = function (id: string) {
  const o = ordersData.find((x) => x.id === id);
  if (!o) return alert("Không tìm thấy đơn");
  const details = `ID: ${o.id}\nKhách: ${o.customerName || o.userId} <${o.email || ""}>\nĐịa chỉ: ${o.address || ""}\nTrạng thái: ${o.status || ""}\nTổng: ₫${(o.total || 0).toLocaleString()}\n\nItems:\n${(o.items || []).map((i: any) => `${i.name} x${i.quantity} - ₫${i.price.toLocaleString()}`).join("\n")}`;
  alert(details);
};

(window as any).changeOrderStatus = async function (
  id: string,
  status: string,
) {
  if (!confirm(`Chuyển đơn ${id} sang trạng thái ${status}?`)) return;
  try {
    const res = await fetch(`http://localhost:3000/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    await fetchOrders();
    alert("Cập nhật trạng thái thành công");
  } catch (err) {
    console.error(err);
    alert("Lỗi khi cập nhật trạng thái");
  }
};

(window as any).deleteOrder = async function (id: string) {
  if (!confirm("Bạn có chắc muốn xóa đơn này?")) return;
  try {
    const res = await fetch(`http://localhost:3000/orders/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    await fetchOrders();
    alert("Đã xóa");
  } catch (err) {
    console.error(err);
    alert("Lỗi khi xóa đơn");
  }
};

document
  .getElementById("orders-filter")
  ?.addEventListener("change", renderOrders);
document
  .getElementById("orders-refresh")
  ?.addEventListener("click", fetchOrders);

function renderStats() {
  try {
    const totalProducts = productsData.length;
    const totalStock = productsData.reduce(
      (sum, p) =>
        sum + (p.variants?.reduce((s, v) => s + (v.stock || 0), 0) || 0),
      0,
    );
    const totalCategories = categoryData.length;
    const totalUsers = usersData.length;
    const lowStock = productsData.filter(
      (p) => (p.variants?.reduce((s, v) => s + (v.stock || 0), 0) || 0) < 5,
    ).length;

    const el = (id: string) => document.getElementById(id);
    el("stat-total-products")!.textContent = String(totalProducts);
    el("stat-total-stock")!.textContent = String(totalStock);
    el("stat-total-categories")!.textContent = String(totalCategories);
    el("stat-total-users")!.textContent = String(totalUsers);
    el("stat-low-stock")!.textContent = String(lowStock);
  } catch (err) {
    console.error("Lỗi render stats:", err);
  }
}

// Handle form submit
if (productForm) {
  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (variants.length === 0) {
      alert("Vui lòng thêm ít nhất một biến thể");
      return;
    }

    const nameInput = document.getElementById(
      "product-name",
    ) as HTMLInputElement;
    const priceInput = document.getElementById(
      "product-price",
    ) as HTMLInputElement;
    const saleInput = document.getElementById(
      "product-sale",
    ) as HTMLInputElement;
    const imageInput = document.getElementById(
      "product-image",
    ) as HTMLInputElement;
    const descInput = document.getElementById(
      "product-description",
    ) as HTMLInputElement;
    const imagesInput = document.getElementById(
      "product-images",
    ) as HTMLInputElement;
    const categoryInput = document.getElementById(
      "product-categoryId",
    ) as HTMLSelectElement;

    // Parse images
    const images = imagesInput.value
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img);

    // Calculate salePrice
    const price = parseInt(priceInput.value);
    const sale = parseInt(saleInput.value);
    const salePrice = Math.round(price * (1 - sale / 100));

    const newProduct = {
      name: nameInput.value,
      price: price,
      sale: sale,
      salePrice: salePrice,
      description: descInput.value,
      image: imageInput.value,
      images: images,
      categoryId: parseInt(categoryInput.value),
      variants: variants.map((v) => ({
        id: v.id,
        color: v.color,
        size: v.size,
        stock: v.stock,
      })),
    };

    try {
      if (editingProductId) {
        // Update product
        const res = await fetch(
          `http://localhost:3000/products/${editingProductId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
          },
        );

        if (res.ok) {
          alert("✅ Sản phẩm đã cập nhật thành công!");
          productForm.reset();
          variants = [];
          renderVariants();
          editingProductId = null;
          location.reload();
        } else {
          alert("❌ Lỗi khi cập nhật sản phẩm");
        }
      } else {
        // Create new product
        const res = await fetch("http://localhost:3000/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });

        if (res.ok) {
          alert("✅ Sản phẩm đã thêm thành công!");
          productForm.reset();
          variants = [];
          renderVariants();
          location.reload();
        } else {
          alert("❌ Lỗi khi thêm sản phẩm");
        }
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("❌ Đã xảy ra lỗi");
    }
  });
}

// Delete product
(window as any).deleteProduct = async (id: string) => {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

  try {
    const res = await fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("✅ Sản phẩm đã xóa thành công!");
      location.reload();
    } else {
      alert("❌ Lỗi khi xóa sản phẩm");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("❌ Đã xảy ra lỗi khi xóa");
  }
};

// Edit product
(window as any).editProduct = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/products/${id}`);
    const product: Product = await res.json();

    // Scroll to form
    const form = document.getElementById("product-form");
    form?.scrollIntoView({ behavior: "smooth" });

    // Check and open form checkbox
    const toggleCheckbox = document.getElementById(
      "toggle-form",
    ) as HTMLInputElement;
    if (toggleCheckbox) {
      toggleCheckbox.checked = true;
    }

    // Populate form fields
    const nameInput = document.getElementById(
      "product-name",
    ) as HTMLInputElement;
    const priceInput = document.getElementById(
      "product-price",
    ) as HTMLInputElement;
    const saleInput = document.getElementById(
      "product-sale",
    ) as HTMLInputElement;
    const imageInput = document.getElementById(
      "product-image",
    ) as HTMLInputElement;
    const descInput = document.getElementById(
      "product-description",
    ) as HTMLInputElement;
    const imagesInput = document.getElementById(
      "product-images",
    ) as HTMLInputElement;
    const categoryInput = document.getElementById(
      "product-categoryId",
    ) as HTMLSelectElement;
    const formTitle = document.querySelector("#product-form h2") as HTMLElement;

    nameInput.value = product.name;
    priceInput.value = product.price.toString();
    saleInput.value = product.sale.toString();
    imageInput.value = product.image;
    descInput.value = product.description;
    imagesInput.value = product.images.join(", ");
    categoryInput.value = product.categoryId.toString();

    // Update form title
    if (formTitle) {
      formTitle.textContent = "✏️ Chỉnh sửa sản phẩm";
    }

    // Update button text
    const submitBtn = document.getElementById(
      "save-product-btn",
    ) as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.textContent = "Cập nhật sản phẩm";
    }

    // Load variants
    if (product.variants && product.variants.length > 0) {
      variants = product.variants.map((v) => ({
        id: v.id,
        color: v.color,
        size: v.size || "",
        stock: v.stock,
      }));
    } else {
      variants = [];
    }
    renderVariants();

    // Set editing mode
    editingProductId = product.id ? product.id.toString() : null;
  } catch (error) {
    console.error("Lỗi:", error);
    alert("❌ Lỗi khi tải thông tin sản phẩm");
  }
};

// Reset form when cancel
const toggleForm = document.getElementById("toggle-form") as HTMLInputElement;
if (toggleForm) {
  toggleForm.addEventListener("change", (e) => {
    if (!(e.target as HTMLInputElement).checked) {
      // Form is being closed
      setTimeout(() => {
        productForm.reset();
        variants = [];
        renderVariants();
        editingProductId = null;
        const formTitle = document.querySelector(
          "#product-form h2",
        ) as HTMLElement;
        if (formTitle) {
          formTitle.textContent = "➕ Thêm sản phẩm mới";
        }
        const submitBtn = document.getElementById(
          "save-product-btn",
        ) as HTMLButtonElement;
        if (submitBtn) {
          submitBtn.textContent = "Lưu sản phẩm";
        }
      }, 100);
    }
  });
}

// Initialize admin data and stats
async function initAdmin() {
  await Promise.all([
    loadCategories(),
    loadProducts(),
    fetchUsers(),
    fetchOrders(),
  ]);
  renderStats();
}

initAdmin();
