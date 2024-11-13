import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios";

export const useChat = (_senderId: string, receiverId: string, defaultReceiverId: string) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<{ senderId: string; content: string; sentAt: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/chatHub")
      .withAutomaticReconnect()
      .build();

    connect.on("ReceiveMessage", (senderId: string, receiverId: string, message: string) => {
      if (receiverId === senderId || receiverId === defaultReceiverId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId, content: message, sentAt: new Date().toISOString() },
        ]);
      }
    });

    const startConnection = async () => {
      try {
        await connect.start();
        console.log("Connected to chat!");
        setConnection(connect);
      } catch (err) {
        console.error("Failed to connect to chat:", err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [receiverId, defaultReceiverId]);

  return { connection, messages, setMessages, messagesEndRef };
};

export const useFetchChatHistory = (senderId: string, receiverId: string) => {
  const fetchChatHistory = async () => {
    const response = await axios.get("/Message/history", {
      params: { senderId, receiverId },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["chatHistory", senderId, receiverId],
    queryFn: fetchChatHistory,
    enabled: !!receiverId,
  });
};

export const useFetchUsers = () => {
  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/api/Account/all");
    return response.data;
  };

  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
