import { useState, useContext } from "react";
import { SmsContext } from "../context/SmsContext";

export default function Dashboard() {
  const [senderId, setSenderId] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const { detectSms } = useContext(SmsContext);

  const handleDetect = async () => {
    if (!text.trim()) return;

    const res = await detectSms(text, senderId);
    setResult(res);

    setSenderId("");
    setText("");
  };

  return (
    <div className="dashboard">
  <h2>SMS Detection</h2>

  {/* Sender ID FIRST */}
  <input
    type="text"
    value={senderId}
    onChange={(e) => setSenderId(e.target.value)}
    placeholder="Enter Sender ID..."
     style={{ 
  width: "200px", 
  height: "30px", 
  display: "block", 
  margin: "10px auto" 
}}

  />

  {/* Message Box SECOND */}
  <textarea
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="Paste your SMS here..."
    style={{ 
  width: "600px", 
  height: "60px", 
  display: "block", 
  margin: "10px auto" 
}}

  />

  <div className="btn-center">
    <button onClick={handleDetect}>Detect</button>
  </div>

  {result && <p className="result">Detected: {result}</p>}
</div>
  );
}
