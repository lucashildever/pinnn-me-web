"use client";

import { useEffect } from "react";

import { setToken } from "@/lib/state/slices/authSlice";
import { useAppDispatch } from "@/lib/state/hooks";

export default function ReduxHydration() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      dispatch(setToken(savedToken));
    }
  }, [dispatch]);

  return null;
}
