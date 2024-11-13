import { useMutation } from "@tanstack/react-query";
import axios from "../../api/axios";

export const useFacebookLogin = () => {
  return useMutation({
    mutationKey: ["facebookLogin"],
    mutationFn: async (accessToken: string) => {
      const response = await axios.post(`/Account/fb-login?accessToken=${accessToken}`, {});
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
