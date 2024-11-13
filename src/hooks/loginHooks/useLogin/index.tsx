import { useMutation } from "@tanstack/react-query";
import axios from "../../../api/axios";

interface LoginData {
  email: string;
  password: string;
}

interface Otp {
  email: string;
}

interface resetPassword {
  email: string;
  token: string;
  newPassword: string;
}

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (loginData: LoginData) => {
      const response = await axios.post("/Account/Login", loginData);
      return response.data;
    },
  });
};

export const useOtp = () => {
  return useMutation({
    mutationKey: ["otp"],
    mutationFn: async (otp: Otp) => {
      const response = await axios.post("/Account/forgot-password", otp);
      return response.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: async (resetPassword: resetPassword) => {
      const response = await axios.post("/Account/reset-password", resetPassword);
      return response.data;
    },
  });
};
