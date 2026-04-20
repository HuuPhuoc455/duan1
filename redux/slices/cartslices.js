//Chèn hàm createSlice để tao ra slice
import { createSlice } from '@reduxjs/toolkit';

const normalizeCartItem = (item) => {
    const productId = item._id ?? item.id ?? item.productId ?? 'unknown';
    const selectedVariant = item.selectedVariant || item.variant || item.variants?.[0] || null;
    const variantId = selectedVariant?._id ?? item.variantId ?? 'default';
    return {
        ...item,
        _id: productId,
        selectedVariant,
        cartItemId: `${productId}-${variantId}`,
    };
};

//Tạo ra slice để xử lý các action
const cartSlice = createSlice({
    name: 'cart', //Tên của slice
    initialState : {
        items: [], //Khởi tạo  trạng thái ban đầu của slice là mảng rỗng
    },
    //Các hàm reducers để xử lý các action
    reducers: {
        //Thêm sản phẩm vào giỏ hàng
        addToCart: (state, action) => { //state: trạng thái hiện tại, action: hành động cần thực hiện
            const productId = action.payload.item._id ?? action.payload.item.id;
            const variant = action.payload.variant || action.payload.item.selectedVariant || action.payload.item.variants?.[0] || null;
            const variantId = variant?._id ?? 'default';
            const cartItemId = `${productId}-${variantId}`;

            const existingItem = state.items.find((item) => item.cartItemId === cartItemId);
            if (existingItem) {
                existingItem.quantity += Number(action.payload.quantity);
                existingItem.selectedVariant = variant;
            } else {
                state.items.push(normalizeCartItem({
                    ...action.payload.item,
                    _id: productId,
                    quantity: Number(action.payload.quantity),
                    selectedVariant: variant,
                    cartItemId,
                }));
            }
        },
        //Giảm số lượng sản phẩm trong giỏ hàng hoặc xóa item nếu quantity về 0
        removeFromCart: (state, action) => {
            const cartItemId = action.payload.cartItemId;
            if (!cartItemId) {
                return;
            }
            const item = state.items.find((item) => item.cartItemId === cartItemId);
            if (!item) {
                return;
            }
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                state.items = state.items.filter((item) => item.cartItemId !== cartItemId);
            }
        },
        //Cập nhật số lượng sản phẩm
        updateQuantity: (state, action) => {
            const cartItemId = action.payload.cartItemId;
            const item = state.items.find((item) => item.cartItemId === cartItemId);
            if (item) {
                item.quantity = Number(action.payload.quantity);
            }
        },
        //Xóa toàn bộ giỏ hàng
        clearCart: (state) => {
            state.items = [];
        },
        setCartItems: (state, action) => {
            state.items = (action.payload || []).map(normalizeCartItem);
        },
    },
    extraReducers: (builder) => {
        builder.addCase('persist/REHYDRATE', (state, action) => {
            if (action.payload?.cart?.items) {
                state.items = action.payload.cart.items.map(normalizeCartItem);
            }
        });
    },
});
//Export các hàm action
export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = cartSlice.actions;
//Export slice
export default cartSlice;
