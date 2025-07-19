import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

function App() {
  const [inputHost, setInputHost] = useState("");
  const [message, setMessage] = useState("");
  const [hosts, setHosts] = useState([]);
  const [results, setResults] = useState({});

  useEffect(() => {
    socket.on("pingResult", (data) => {
      setResults((prev) => ({
        ...prev,
        [data.host]: data,
      }));
    });

    return () => {
      socket.off("pingResult");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      hosts.forEach((host) => socket.emit("pingHost", host));
    }, 10000); // cada 10 segundos

    return () => clearInterval(interval);
  }, [hosts]);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const addHost = () => {
    const trimmedHost = inputHost.trim();

    if (!trimmedHost) {
      setMessage("⚠️ Ingresá una IP o dominio válido.");
      return;
    }

    if (hosts.includes(trimmedHost)) {
      setMessage(`⚠️ El host "${trimmedHost}" ya está en la lista.`);
      return;
    }

    setHosts([...hosts, trimmedHost]);
    socket.emit("pingHost", trimmedHost);
    setInputHost("");
    setMessage(""); // limpia el mensaje si todo está bien
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🌐 Network Monitor Dashboard</h1>

      <div>
        {message && (
          <p style={{ color: "orange", marginTop: "0.5rem" }}>{message}</p>
        )}
        <input
          type="text"
          placeholder="Ingresa IP o dominio"
          value={inputHost}
          onChange={(e) => setInputHost(e.target.value)}
        />
        <button onClick={addHost}>Agregar IP</button>
      </div>

      <table
        style={{ marginTop: "2rem", width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Host</th>
            <th>Estado</th>
            <th>Latencia (ms)</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map((host) => (
            <tr key={host}>
              <td>{host}</td>
              <td>
                {results[host]?.success === true
                  ? "✅ Conectado"
                  : results[host]?.success === false
                  ? "❌ Sin respuesta"
                  : "⏳ Esperando..."}
              </td>
              <td>{results[host]?.latency ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
