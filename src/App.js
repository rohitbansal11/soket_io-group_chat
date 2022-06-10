import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import React, { useState, useEffect } from "react";

const socket = io.connect("http://localhost:3001");
function App() {
  const [newfile, setNewFile] = useState(false);
  const [name, steName] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const ConectToApp = () => {
    let checkValue = "123";
    socket.emit("join_room", checkValue);
    setNewFile(true);
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: "123",
        auther: name,
        massage: currentMessage,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receve_massage", (data) => {
      console.log(data);
      setMessageList((list) => [...list, data]);
    });

    return () => {
      socket.off();
    };
  }, [socket]);
  return (
    <div
      style={{
        marginLeft: "100px",
        border: "2px solid red",
      }}
    >
      {!newfile ? (
        <>
          <input
            type="text"
            onChange={(e) => {
              steName(e.target.value);
            }}
          />
          <button onClick={ConectToApp}>Connect</button>
        </>
      ) : (
        <>
          <div
            style={{
              height: "500px",
              overflow: "scrollX",
            }}
          >
            {messageList?.map((w) => {
              return (
                <p
                  style={
                    w.auther == name
                      ? { marginLeft: "400px" }
                      : { marginLeft: "0px" }
                  }
                >
                  {w.massage}
                </p>
              );
            })}
          </div>
          <input
            type="text"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </>
      )}
    </div>
  );
}

export default App;
