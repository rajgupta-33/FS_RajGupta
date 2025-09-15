import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
  InfoWindow
} from "@react-google-maps/api";

const socket = io("http://localhost:5000");

const containerStyle = { width: "100%", height: "500px" };
const center = { lat: 12.9716, lng: 77.5946 };

function App() {
  const [home, setHome] = useState(null);
  const [destination, setDestination] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Chat
  const [room, setRoom] = useState("");
  const [username] = useState("student_" + Math.floor(Math.random() * 10000));
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  // Join Group Chat
  const joinGroupChat = async () => {
    if (home && destination) {
      const res = await axios.post("http://localhost:5000/generateRoom", { home, destination });
      const roomId = res.data.roomId;
      setRoom(roomId);

      socket.emit("join_room", roomId);

      // Fetch old chat
      const chatRes = await axios.get(`http://localhost:5000/chat/${roomId}`);
      setChat(chatRes.data);
    }
  };

  // Send message
  const sendMessage = () => {
    if (message !== "") {
      const data = { room, author: username, message, time: new Date().toLocaleTimeString() };
      socket.emit("send_message", data);
      setChat([...chat, data]);
      setMessage("");
    }
  };

  // Receive messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });
  }, []);

  return (
    <LoadScript googleMapsApiKey= "Your Google API Key" libraries={["places"]}>
      <div style={{ padding: "20px" }}>
        <h2>🚗 Student Commute Optimizer</h2>

        {/* Location Inputs */}
        <Autocomplete onLoad={(ac) => (window.homeAC = ac)} onPlaceChanged={() => {
          const place = window.homeAC.getPlace();
          setHome({ type: "Point", coordinates: [place.geometry.location.lng(), place.geometry.location.lat()] });
        }}>
          <input type="text" placeholder="Enter Home Location" />
        </Autocomplete>

        <Autocomplete onLoad={(ac) => (window.destAC = ac)} onPlaceChanged={() => {
          const place = window.destAC.getPlace();
          setDestination({ type: "Point", coordinates: [place.geometry.location.lng(), place.geometry.location.lat()] });
        }}>
          <input type="text" placeholder="Enter Destination" />
        </Autocomplete>

        <button onClick={joinGroupChat}>Join Group Chat</button>

        {/* Map */}
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          {home && <Marker position={{ lat: home.coordinates[1], lng: home.coordinates[0] }} />}
          {destination && <Marker position={{ lat: destination.coordinates[1], lng: destination.coordinates[0] }} />}
        </GoogleMap>

        {/* Chat UI */}
        {room && (
          <div style={{ marginTop: "20px" }}>
            <h3>💬 Group Chat</h3>
            <div style={{ height: "200px", overflowY: "scroll", border: "1px solid gray", padding: "5px" }}>
              {chat.map((msg, idx) => (
                <p key={idx}><strong>{msg.author}</strong>: {msg.message} <em>({msg.time})</em></p>
              ))}
            </div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type message..." />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </LoadScript>
  );
}

export default App;
