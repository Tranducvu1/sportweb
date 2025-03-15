import React, { useState } from "react";
import axios from "axios";

const API_KEY = "AIzaSyB53p79JWHQ258vmlBy8NzrWUfUI8FViU8";  // Nhập đúng API Key của Google AI Gemini
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const AIChatbox = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      console.log("🔄 Đang gửi yêu cầu đến API...");

      const res = await axios.post(
        API_URL,
        {
          contents: [{ role: "user", parts: [{ text: question }] }], // Định dạng đúng cho Gemini
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ API Response:", res.data);

      setResponse(res.data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có câu trả lời.");
    } catch (error) {
      console.error("❌ Lỗi API:", error.response?.data || error.message);
      setResponse("⚠️ Lỗi khi gọi AI. Hãy thử lại sau!");
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 p-4 bg-white shadow-lg rounded-xl border border-gray-200">
      <h3 className="text-lg font-bold mb-2">Chat với AI</h3>
      <textarea
        className="w-full p-2 border rounded-md text-sm"
        rows="3"
        placeholder="Nhập câu hỏi..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 mt-2 rounded-md"
        onClick={handleAskAI}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Hỏi AI"}
      </button>
      <div className="mt-3 text-sm bg-gray-100 p-2 rounded-md min-h-[50px]">
        {response || "AI sẽ trả lời tại đây..."}
      </div>
    </div>
  );
};

export default AIChatbox;
