import React, { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import {
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon } from "@mui/icons-material";
import { useUserOptions } from "../../hooks/rentalRequestHooks/useUserOption";
import { useMessageHistory } from "../../hooks/mesageHooks/useHistoryChat";
import { CHAT_URL } from "../../api/axios";
import { formatMessageContent } from "../../utils";

interface Message {
  sender: string;
  content: string;
  sentAt: string;
}

const Dial: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  const senderId = localStorage.getItem("id") || "";
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [receiverId, setReceiverId] = useState<string>("320d00a0-1c68-420a-bbfa-946fd9d9bc24");

  const { data: users, isLoading: loadingUsers, error: userError } = useUserOptions();

  const { data: history, isLoading: loadingHistory } =
    senderId && token ? useMessageHistory(senderId, receiverId) : { data: null, isLoading: false };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!senderId || !token) return;
    if (role === "User") {
      setReceiverId("320d00a0-1c68-420a-bbfa-946fd9d9bc24");
    }

    const connect = new signalR.HubConnectionBuilder()
      .withUrl(CHAT_URL + "/chatHub", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();

    connect
      .start()
      .then(() => console.log("Connected to SignalR"))
      .catch((err) => console.error("SignalR Connection Error: ", err));

    connect.on("ReceiveMessage", (sender: string, content: string) => {
      setMessages((prevMessages) => [...prevMessages, { sender, content, sentAt: new Date().toISOString() }]);
    });

    setConnection(connect);

    return () => {
      connect.stop();
    };
  }, [role]);

  useEffect(() => {
    if (!senderId || !token) return;
    if (history) {
      const formattedHistory = history.map((msg: any) => ({
        sender: msg.senderId.trim().toLowerCase(),
        content: msg.content,
        sentAt: msg.sentAt,
      }));
      setMessages(formattedHistory);
    }
  }, [history, senderId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (connection && message.trim()) {
      try {
        await connection.invoke("SendMessage", senderId, receiverId, message);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: senderId, content: message, sentAt: new Date().toISOString() },
        ]);
        setMessage("");
      } catch (err) {
        console.error("Send Message Error:", err);
      }
    }
  };

  if (!senderId || !token) {
    return null;
  }

  return (
    <div>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 bg-yellow-500 text-white rounded-full p-4 shadow-lg hover:bg-yellow-500 focus:outline-none"
          aria-label="Open Chat"
        >
          <ChatIcon fontSize="large" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 right-5 bg-white shadow-xl w-72 md:w-96 rounded-lg border border-gray-200 z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <span className="text-xs md:text-[16px] font-semibold">Chat Support</span>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="p-4 h-60  overflow-y-auto space-y-4">
            {loadingHistory ? (
              <CircularProgress />
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === senderId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[18rem] p-3 rounded-lg ${
                        msg.sender === senderId ? "bg-yellow-400 text-black" : "bg-gray-200 text-black"
                      }`}
                    >
                      {formatMessageContent(msg.content).map((line, lineIndex) => (
                        <p key={lineIndex} className="break-words text-[10px] md:text-xs">
                          {line}
                        </p>
                      ))}
                      <small
                        className={`text-[8px] md:text-xs block mt-1 ${
                          msg.sender === senderId ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {role === "Admin" && (
            <div className="p-4">
              {loadingUsers ? (
                <CircularProgress />
              ) : userError ? (
                <div>Error loading users</div>
              ) : (
                <FormControl fullWidth>
                  <InputLabel id="receiver-label">Receiver</InputLabel>
                  <Select
                    labelId="receiver-label"
                    label="Receiver"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    displayEmpty
                  >
                    {users.map((user: { id: string; displayName: string }) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
          )}

          <div className="p-4 border-t flex items-center space-x-4">
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              fullWidth
              placeholder="Type your message..."
              size="small"
            />
            <IconButton onClick={handleSendMessage} disabled={!message.trim()}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dial;
