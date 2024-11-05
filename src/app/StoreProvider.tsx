"use client";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { NEXT_SERVER_URL, NUM_PER_PAGE } from "@/config";
import { userApiRequest } from "./fetch/user.api";
import { AppStore, makeStore } from "@/libs/store";
import { login } from "@/libs/features/authSlice";
import { setNotify } from "@/libs/features/notifySlice";
import { getProducts } from "@/libs/features/productSlice";
import { Category } from "@/libs/interfaces/schema/category/category.interface";
import { getCategories } from "@/libs/features/categorySlice";

export default function StoreProvider({
  refreshToken,
  children,
}: {
  refreshToken: string | undefined;
  children: React.ReactNode;
}) {
  const [accessToken, setAccessToken] = useState(null);

  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  
  useEffect(() => {
    if (refreshToken) {
      fetch(`${NEXT_SERVER_URL}/api/auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            await userApiRequest.logOut();
            return (window.location.href = "/auth");
          }
          const token = await res.json();
          setAccessToken(token);
        })
        .catch(async (error) => {
          console.log(error);
          await userApiRequest.logOut();
          window.location.href = "/auth";
        });
    }
  }, [refreshToken]);

  //   useEffect(() => {
  //     if (accessToken) {
  //       // create new socket
  //       const socket = io((BACKEND_SERVER_URL ? BACKEND_SERVER_URL : ''), {
  //         extraHeaders: {
  //           Authorization: `Bearer ${accessToken}` // WARN: this will be ignored in a browser
  //         }
  //       })

  //       socket.on('connect', () => {
  //         if (storeRef.current) {
  //           // Create the store instance the first time this renders
  //           storeRef.current.dispatch(connect(socket))
  //         }
  //       });

  //       return () => {
  //         socket.off('connect', () => {
  //           if (storeRef.current) {
  //             // Create the store instance the first time this renders
  //             storeRef.current.dispatch(connect(socket))
  //           }
  //         })
  //       }
  //     }
  //   }, [accessToken])

  useEffect(() => {
    if (accessToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/current`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            await userApiRequest.logOut();
            return (window.location.href = "/auth");
          }
          const data = await res.json();
          if (storeRef.current) {
            // Create the store instance the first time this renders
            storeRef.current.dispatch(
              login({ token: accessToken, user: data })
            );
          }
        })
        .catch(async (error) => {
          console.log(error);
          await userApiRequest.logOut();
          window.location.href = "/auth";
        });
    }
  }, [accessToken]);

  //   useEffect(() => {
  //     if (accessToken && storeRef.current) {
  //       const fetch = async () => {
  //         try {
  //             const response = await privateNotificationRequest.get(accessToken, storeRef.current?.dispatch, 10, 1);
  //             if (storeRef.current) {
  //               storeRef.current.dispatch(getAdminNotifications({
  //                 data: response.payload.data,
  //                 total: response.payload.total,
  //                 page: parseInt(response.payload.page),
  //               }))
  //             }
  //         } catch (error) {
  //           if (error instanceof HttpError) {
  //             if (storeRef.current) {
  //               // Create the store instance the first time this renders
  //               storeRef.current.dispatch(setNotify({ error: error.message }))
  //             }
  //           } else {
  //             // Handle other types of errors
  //             console.log("An unexpected error occurred:", error);
  //             if (storeRef.current) {
  //               storeRef.current.dispatch(setNotify({ error: 'Lỗi hệ thống.' }))

  //             }
  //           }
  //         }
  //       }
  //       fetch()
  //     }
  //   }, [accessToken])

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?limit=${NUM_PER_PAGE}&page=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          throw Error("Fetch products failed.");
        }
        const productsData = await res.json();
        if (storeRef.current) {
          // Create the store instance the first time this renders
          storeRef.current.dispatch(
            getProducts({
              data: productsData.data,
              total: productsData.total,
              page: Number(productsData.page),
            })
          );
        }
      })
      .catch(async (error) => {
        console.log(error);
        if (storeRef.current) {
          // Create the store instance the first time this renders
          storeRef.current.dispatch(
            setNotify({ error: "Lỗi khi tải sản phẩm." })
          );
        }
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw Error("Fetch categories failed.");
        }

        const categoriesData: Category[] = await res.json();

        if (storeRef.current) {
          // Create the store instance the first time this renders
          storeRef.current.dispatch(getCategories(categoriesData));
        }
      })
      .catch(async (error) => {
        console.log(error);
        if (storeRef.current) {
          // Create the store instance the first time this renders
          storeRef.current.dispatch(
            setNotify({ error: "Lỗi khi tải danh mục sản phẩm." })
          );
        }
      });
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>
}
