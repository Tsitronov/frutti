import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchBotResult } from "../../redux/botSlice";

export default function BotChat() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleSend = () => {
    if (!message.trim()) return;
    dispatch(fetchBotResult(message));
    setMessage("");
  };

  return (
    <div className="bot-chat" title={"Search residents — e.g.: dept 3, Smith, or room 201"}>
      <input
        type="text"
        value={message}
        placeholder="dept 2, Smith, or 201"
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
      />
      <button style={{ marginTop: "10px" }} onClick={handleSend}>Cerca</button>
    </div>
  );
}
