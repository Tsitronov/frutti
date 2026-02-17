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
    <div className="bot-chat" title={"questo bot  - scrivi per esempio: 23 o rep 2 o GGG o trovi GGG"}>
      <input
        type="text"
        value={message}
        placeholder="rep 2 o GGG o 23"
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
      />
      <button style = {{marginTop: "10px"}} onClick={handleSend}>Отправить</button>
    </div>
  );
}
