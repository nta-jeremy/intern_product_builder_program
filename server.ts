import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  const introStaticPath = path.join(process.cwd(), "public", "intro");

  // Support JSON request bodies
  app.use(express.json());

  // Serve the standalone intro page outside the React SPA.
  app.use("/intro", express.static(introStaticPath));

  // Initialize Gemini AI Client
  let ai: GoogleGenAI | null = null;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey: geminiApiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Successfully initialized GoogleGenAI client on backend.");
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client:", e);
    }
  } else {
    console.warn("GEMINI_API_KEY env variable not found. AI assistant features will be simulated.");
  }

  // API Endpoint: AI Assist for Intern Journal Template
  app.post("/api/gemini/assist", async (req, res) => {
    const { templateId, fieldKey, fieldLabel, roughNotes, contextData } = req.body;

    if (!roughNotes || roughNotes.trim() === "") {
      return res.status(400).json({ error: "Vui lòng nhập ý tưởng thô để AI hỗ trợ phát triển." });
    }

    // Build context prompt
    const contextPrompt = contextData ? `\nNgữ cảnh hiện tại của các trường khác trong biểu mẫu là:\n${JSON.stringify(contextData, null, 2)}` : "";

    const promptMessage = `Bạn là trợ lý AI của Chương trình Thực tập Intern Product Builder tại YODY.
Nhiệm vụ của bạn là giúp thực tập sinh viết rõ nội dung trong sổ tay thực tập dựa trên ghi chú và dữ kiện họ cung cấp.

Bạn được yêu cầu viết nội dung cho trường dữ liệu: "${fieldLabel}" (mã trường: "${fieldKey}") thuộc biểu mẫu "${templateId.toUpperCase()}".

Ghi chú thô của thực tập sinh:
"${roughNotes}"
${contextPrompt}

Nguyên tắc phản hồi:
1. Viết bằng tiếng Việt phổ thông, câu ngắn, rõ ý và phù hợp với nội dung sổ tay thực tập.
2. Giữ đúng dữ kiện gốc. Không tự bịa số liệu, kết quả, liên kết, phản hồi, bằng chứng hoặc xác nhận chưa được cung cấp.
3. Nếu ghi chú thiếu dữ kiện quan trọng, nêu rõ phần cần bổ sung thay vì tự suy đoán.
4. Tập trung vào hành động, kết quả đã có, vướng mắc và bước tiếp theo. Tránh sáo rỗng và từ ngữ khoa trương.
5. Chỉ trả về nội dung đã biên tập, không kèm lời chào, lời dẫn hoặc Markdown bọc ngoài.`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptMessage,
          config: {
            temperature: 0.8,
          },
        });

        const reply = response.text || "Không có phản hồi từ mô hình AI.";
        return res.json({ result: reply.trim() });
      } catch (err: any) {
        console.error("Gemini API call error:", err);
        return res.status(500).json({ error: `Lỗi kết nối API Gemini: ${err?.message || err}` });
      }
    } else {
      // Simulate response if API key is not configured
      setTimeout(() => {
        let simulatedReply = "";
        if (fieldKey === "problem") {
          simulatedReply = `[PHẢN HỒI MÔ PHỎNG] Vấn đề được ghi nhận: ${roughNotes}\n\nCần bổ sung người dùng bị ảnh hưởng, bằng chứng đã thu thập và tác động thực tế nếu các dữ kiện này chưa có trong ghi chú.`;
        } else if (fieldKey === "successMetrics") {
          simulatedReply = `[PHẢN HỒI MÔ PHỎNG] Chỉ số thành công dự kiến: ${roughNotes}\n\nCần bổ sung giá trị ban đầu, mục tiêu, cách đo và thời điểm kiểm tra nếu ghi chú chưa nêu rõ.`;
        } else {
          simulatedReply = `[PHẢN HỒI MÔ PHỎNG - CHƯA CẤU HÌNH API KEY] ${fieldLabel}: ${roughNotes}\n\nHãy bổ sung dữ kiện hoặc bằng chứng còn thiếu trước khi dùng nội dung này trong sổ tay thực tập.`;
        }
        return res.json({ result: simulatedReply, simulated: true });
      }, 1000);
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/intro")) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
