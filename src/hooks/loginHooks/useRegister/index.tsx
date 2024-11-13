import { useMutation } from "@tanstack/react-query";
import axios from "../../../api/axios";

const registerUser = async (data: any) => {
  const payload = { ...data, role: "User" };
  const response = await axios.post("/Account/register", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useRegister = () => {
  return useMutation({ mutationFn: registerUser });
};
