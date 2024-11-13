import { useMutation } from "@tanstack/react-query";
import axios from "../../api/axios";

export const useGoogleLogin = () => {
  return useMutation({
    mutationKey: ["googleLogin"],
    mutationFn: async (token: string) => {
      const response = await axios.post(`/Account/google-callback`, { token });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Login Successfull:", data);
      localStorage.setItem("id", data.id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("displayName", data.displayName);
      localStorage.setItem("token", data.token);
      window.location.replace("/");
    },
    onError: (error) => {
      console.log("Login Error:", error);
    },
  });
};
