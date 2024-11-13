import { useState, useEffect, FormEvent } from "react";
import * as signalR from "@microsoft/signalr";

interface Message {
  user: string;
  message: string;
  timestamp: string;
}

const DirectMessageForm: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sender, setSender] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Inisialisasi koneksi SignalR
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/chathub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.on("ReceiveMessage", (user: string, message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user, message, timestamp: new Date().toLocaleTimeString() },
      ]);
    });

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR!");
      })
      .catch((error: Error) => console.error("SignalR Connection Error: ", error));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();

    if (connection) {
      try {
        if (receiver) {
          await connection.send("SendMessageToReceiver", sender, receiver, message);
        } else {
          await connection.send("SendMessageToAll", sender, message);
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          { user: sender, message, timestamp: new Date().toLocaleTimeString() },
        ]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  return (
    <div>
      <h2>Direct Message Form</h2>
      <div>
        <label>Sender</label>
        <input
          type="text"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="Enter sender's email"
        />
      </div>

      <div>
        <label>Receiver</label>
        <input
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Enter receiver's email"
        />
      </div>

      <div>
        <label>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        ></textarea>
      </div>

      <button onClick={sendMessage}>Send Message</button>

      <div>
        <h3>Messages</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.user}</strong>: {msg.message} <span>({msg.timestamp})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DirectMessageForm;
