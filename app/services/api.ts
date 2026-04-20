const API_URL = "http://localhost:3000";

// Category APIs
export const categoryAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/categories/${id}`);
    if (!response.ok) throw new Error("Failed to fetch category");
    return response.json();
  },

  create: async (data: Record<string, any>, token?: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create category (${response.status}): ${errorText}`,
      );
    }
    return response.json();
  },

  update: async (id: string, data: Record<string, any>, token?: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update category (${response.status}): ${errorText}`,
      );
    }
    return response.json();
  },

  delete: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete category (${response.status}): ${errorText}`,
      );
    }
    return response.json();
  },
};

// Product APIs
export const productAPI = {
  getAll: async (query?: string) => {
    const url = query ? `${API_URL}/products?${query}` : `${API_URL}/products`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  create: async (formData: FormData, token: string) => {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  update: async (id: string, formData: FormData, token: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },

  delete: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return response.json();
  },
};

// Variant APIs
export const variantAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/variants`);
    if (!response.ok) throw new Error("Failed to fetch variants");
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/variants/${id}`);
    if (!response.ok) throw new Error("Failed to fetch variant");
    return response.json();
  },

  create: async (formData: FormData, token: string) => {
    const response = await fetch(`${API_URL}/variants`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create variant: ${response.status} ${errorText}`,
      );
    }
    return response.json();
  },

  update: async (id: string, formData: FormData, token: string) => {
    const response = await fetch(`${API_URL}/variants/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to update variant");
    return response.json();
  },

  delete: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/variants/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete variant");
    return response.json();
  },
};

// User APIs
export const userAPI = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  delete: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return response.json();
  },

  updateRole: async (id: string, role: string, token: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error("Failed to update user role");
    return response.json();
  },
};

export const cartAPI = {
  getMyCart: async (token: string) => {
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch cart");
    return response.json();
  },

  saveCart: async (items: any[], token: string) => {
    const response = await fetch(`${API_URL}/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) throw new Error("Failed to save cart");
    return response.json();
  },

  clearCart: async (token: string) => {
    const response = await fetch(`${API_URL}/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to clear cart");
    return response.json();
  },
};

export const orderAPI = {
  create: async (data: Record<string, any>, token?: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create order (${response.status}): ${errorText}`,
      );
    }

    return response.json();
  },

  getMine: async (token: string) => {
    const response = await fetch(`${API_URL}/orders/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch my orders");
    return response.json();
  },

  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  update: async (id: string, data: Record<string, any>, token: string) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update order (${response.status}): ${errorText}`,
      );
    }
    return response.json();
  },
};
