import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [host, setHost] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    socket.on("pingResult", (data) => {
      setResult(data);
    });

    return () => {
      socket.off("pingResult");
    };
  }, []);

  const handlePing = () => {
    if (host) {
      socket.emit("pingHost", host);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🌐 Network Monitor Dashboard</h1>
      <input
        type="text"
        placeholder="Ingresa una IP o dominio"
        value={host}
        onChange={(e) => setHost(e.target.value)}
      />
      <button onClick={handlePing}>Hacer Ping</button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Resultado:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
