"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartAPI } from "../services/api";
import { setCartItems } from "../../redux/slices/cartslices";

export default function CartSync() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const hasInitialized = useRef(false);
  const isApplyingRemoteData = useRef(false);

  useEffect(() => {
    const syncFromServer = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        hasInitialized.current = true;
        return;
      }

      try {
        const serverCart = await cartAPI.getMyCart(token);
        const serverItems = serverCart?.items || [];

        if (serverItems.length > 0) {
          isApplyingRemoteData.current = true;
          dispatch(setCartItems(serverItems));
        } else if (cartItems.length > 0) {
          await cartAPI.saveCart(cartItems, token);
        }
      } catch (error) {
        console.error("Cart sync init error:", error);
      } finally {
        hasInitialized.current = true;
      }
    };

    syncFromServer();
  }, [dispatch]);

  useEffect(() => {
    if (!hasInitialized.current) {
      return;
    }

    if (isApplyingRemoteData.current) {
      isApplyingRemoteData.current = false;
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      return;
    }

    const saveCart = async () => {
      try {
        await cartAPI.saveCart(cartItems, token);
      } catch (error) {
        console.error("Cart sync save error:", error);
      }
    };

    saveCart();
  }, [cartItems]);

  return null;
}
