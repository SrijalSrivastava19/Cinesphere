import { useEffect, useState } from "react";

function BackendTest() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Backend connection failed");
      });
  }, []);

  return (
    <div>
      <h2 style={{ color: "white", padding: "100px" }}>{message}</h2>
    </div>
  );
}

export default BackendTest;