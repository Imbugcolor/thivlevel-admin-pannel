import { ThunkDispatch } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { updateToken } from "./features/authSlice";
import { NEXT_SERVER_URL } from "@/config";
import { setNotify } from "./features/notifySlice";

export const checkTokenExp = async (
  token: string,
  dispatch: ThunkDispatch<any, any, any> | undefined
) => {
  const decode = jwtDecode(token);

  if (decode.exp && decode.exp >= Date.now() / 1000) return null;
  try {
    const res = await fetch(`${NEXT_SERVER_URL}/api/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if(!res.ok) {
      if(dispatch) {
        dispatch(setNotify({ error: 'Authenticate failed.'}))
      }
      const error = await res.json()
      console.log(error)
    }

    const token = await res.json()
    if(dispatch) { 
      dispatch(updateToken(token));
    }

    return token;
  } catch (error) {
    console.log(error);
    if(dispatch) {
      dispatch(setNotify({ error: 'Server error.'}))
    }
  }
};