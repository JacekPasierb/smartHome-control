import {useEffect, useState} from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/home/123/state`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{padding: 20}}>
      <h1>SmartHome Control Center</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
