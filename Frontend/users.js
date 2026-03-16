"use strict";
const userForm = document.getElementById("user-form");
const userEmailInput = document.getElementById("user-email");
const userPasswordInput = document.getElementById("user-password");
const usersBody = document.getElementById("users-body");
const formTitle = document.getElementById("form-title");
const toggleForm = document.getElementById("toggle-form");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const refreshBtn = document.getElementById("users-refresh");
const detailModal = document.getElementById("detail-modal");
const detailContent = document.getElementById("detail-content");
let usersData = [];
let editingUserId = null;
// API Base URL
const API_URL = "http://localhost:3000";
// Load users
async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}/users`);
        usersData = await res.json();
        renderUsers(usersData);
    }
    catch (error) {
        console.error("Lỗi khi load users:", error);
        alert("Không thể tải danh sách người dùng");
    }
}
// Render users
function renderUsers(users) {
    usersBody.innerHTML = "";
    if (users.length === 0) {
        usersBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 2rem; color: #9ca3af;">
          Không có người dùng nào
        </td>
      </tr>
    `;
        return;
    }
    users.forEach((user) => {
        const row = document.createElement("tr");
        const maskedPassword = "*".repeat(user.password.length);
        row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.email}</td>
      <td>${maskedPassword}</td>
      <td>
        <div class="action-cell">
          <button class="btn btn-edit" onclick="editUser('${user.id}')">Sửa</button>
          <button class="btn btn-delete" onclick="deleteUser('${user.id}')">Xóa</button>
        </div>
      </td>
    `;
        usersBody.appendChild(row);
    });
}
// Edit user
window.editUser = (id) => {
    const user = usersData.find((u) => u.id === id);
    if (!user)
        return;
    editingUserId = id;
    userEmailInput.value = user.email;
    userPasswordInput.value = user.password;
    formTitle.textContent = "Chỉnh Sửa Người Dùng";
    toggleForm.checked = true;
    userEmailInput.focus();
};
// Delete user
window.deleteUser = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này không?"))
        return;
    try {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            alert("Xóa người dùng thành công");
            loadUsers();
        }
        else {
            alert("Không thể xóa người dùng");
        }
    }
    catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Lỗi khi xóa người dùng");
    }
};
// View user details
window.viewUserDetail = (id) => {
    const user = usersData.find((u) => u.id === id);
    if (!user)
        return;
    detailContent.innerHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 40%;">ID:</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">${user.id}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Email:</td>
        <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">${user.email}</td>
      </tr>
      <tr>
        <td style="padding: 0.75rem; font-weight: 600;">Mật khẩu:</td>
        <td style="padding: 0.75rem;">${"*".repeat(user.password.length)}</td>
      </tr>
    </table>
  `;
    detailModal.classList.add("show");
};
// Close detail modal
window.closeDetailModal = () => {
    detailModal.classList.remove("show");
};
// Close modal when clicking outside
detailModal?.addEventListener("click", (e) => {
    if (e.target === detailModal) {
        window.closeDetailModal();
    }
});
// Form submit (Add or Edit)
userForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value.trim();
    if (!email || !password) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
    }
    try {
        if (editingUserId) {
            // Update existing user
            const res = await fetch(`${API_URL}/users/${editingUserId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                alert("Cập nhật người dùng thành công");
                editingUserId = null;
            }
            else {
                alert("Không thể cập nhật người dùng");
                return;
            }
        }
        else {
            // Create new user
            const res = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                alert("Thêm người dùng thành công");
            }
            else {
                alert("Không thể thêm người dùng");
                return;
            }
        }
        // Reset form
        userForm.reset();
        toggleForm.checked = false;
        formTitle.textContent = "Thêm Người Dùng Mới";
        loadUsers();
    }
    catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi khi lưu người dùng");
    }
});
// Reset form when closing
toggleForm?.addEventListener("change", (e) => {
    if (!e.target.checked) {
        userForm.reset();
        editingUserId = null;
        formTitle.textContent = "Thêm Người Dùng Mới";
    }
});
// Search users
function searchUsers() {
    const query = searchInput.value.toLowerCase();
    const filtered = usersData.filter((user) => user.email.toLowerCase().includes(query));
    renderUsers(filtered);
}
searchBtn?.addEventListener("click", searchUsers);
searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter")
        searchUsers();
});
// Refresh users
refreshBtn?.addEventListener("click", loadUsers);
// Load users on page load
loadUsers();
