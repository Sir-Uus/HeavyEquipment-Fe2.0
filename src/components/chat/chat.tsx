import { useState, useEffect } from "react";
import { useChat, useFetchChatHistory, useFetchUsers } from "../../hooks/chatHooks";
import { ThreeDot } from "react-loading-indicators";

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [users, setUsers] = useState<{ id: string; displayName: string }[]>([]);
  const [userMapping, setUserMapping] = useState<{ [key: string]: string }>({});

  const senderId = localStorage.getItem("id") || "";
  const userName = localStorage.getItem("displayName");
  const userRole = localStorage.getItem("role");
  const defaultReceiverId = "78cee22d-34ac-44f0-a8aa-0eb4b7a692cd";

  const { connection, messages, setMessages, messagesEndRef } = useChat(
    senderId,
    receiverId,
    defaultReceiverId
  );
  const {
    data: chatHistory,
    isLoading: chatLoading,
    isError: chatError,
  } = useFetchChatHistory(senderId, receiverId);
  const { data: usersData, isLoading: userLoading, isError: userError } = useFetchUsers();

  useEffect(() => {
    setIsAdmin(userRole === "Admin");
    if (userRole !== "Admin") {
      setReceiverId(defaultReceiverId);
    }
  }, [userRole]);

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory);
    }
  }, [chatHistory, setMessages]);

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
      const mapping: { [key: string]: string } = {};
      usersData.forEach((user: any) => {
        mapping[user.id] = user.displayName;
      });
      setUserMapping(mapping);
    }
  }, [usersData]);

  const sendMessage = async () => {
    if (connection && message && receiverId) {
      const newMessage = { senderId, content: message, sentAt: new Date().toISOString() };
      setMessages((prevMessages: any) => [...prevMessages, newMessage]);
      await connection.send("SendMessage", senderId, receiverId, message);
      setMessage("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);

  if (chatLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDot variant="bob" color="#facc15" size="medium" />
      </div>
    );

  if (userLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDot variant="bob" color="#facc15" size="medium" />
      </div>
    );

  if (chatError) return <p>No Data</p>;

  if (userError) return <p>No Data</p>;

  return (
    <div className={`grid ${isAdmin ? "grid-cols-3" : "grid-cols-1"} overflow-hidden`}>
      {isAdmin && (
        <div className="border-r">
          <div className="bg-yellow-400 p-2">
            <h2 className="text-lg font-bold m-2 ml-4">HEAVY EQUIPMENT CHATS</h2>
          </div>
          <div>
            <ul>
              {users.map((user) => (
                <li
                  key={user.id}
                  className={`cursor-pointer p-4 ${
                    user.id === receiverId ? "bg-yellow-100" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setReceiverId(user.id)}
                >
                  <div className="flex gap-4">
                    <p className="w-8 h-8 bg-gray-500 rounded-full text-white flex items-center justify-center text-lg font-bold">
                      {user.displayName
                        .split(" ")
                        .map((name) => name.charAt(0).toUpperCase())
                        .join("")}
                    </p>
                    <p className="mt-2">{user.displayName}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="col-span-2 flex flex-col h-full">
        <div className="p-4 bg-yellow-400 text-white flex items-center justify-between sticky top-0">
          <h2 className="text-lg font-bold">{isAdmin ? "Chat with users" : "Admin"}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-200 mb-4" style={{ maxHeight: "500px" }}>
          {messages.map((msg: any, index: any) => (
            <div
              key={index}
              className={`p-3 rounded-lg mb-4 max-w-xs ${
                msg.senderId === senderId
                  ? "bg-yellow-400 text-gray-900 ml-auto"
                  : "bg-white text-black mr-auto"
              }`}
            >
              <span className="block text-xs font-bold">
                {msg.senderId === senderId ? userName : userMapping[msg.senderId] || msg.senderId}
              </span>
              <span className="block whitespace-pre-wrap break-words">{msg.content}</span>
              <span className="block text-right text-xs mt-2">
                {new Date(msg.sentAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-100 flex items-center fixed bottom-0 w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            className="flex-1 border-2 border-gray-300 p-2 rounded-lg"
          />
          <button onClick={sendMessage} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
