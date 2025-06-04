import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Editor() {
  const [content, setContent] = useState("");
  const textRef = useRef(null);

  useEffect(() => {
    socket.on("load-document", (doc) => {
      setContent(doc);
    });

    socket.on("receive-changes", (newContent) => {
      setContent(newContent);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    const newText = e.target.value;
    setContent(newText);
    socket.emit("send-changes", newText);
  };

  return (
    <textarea
      ref={textRef}
      value={content}
      onChange={handleChange}
      rows={20}
      cols={80}
      placeholder="Start typing..."
    />
  );
}

export default Editor;
