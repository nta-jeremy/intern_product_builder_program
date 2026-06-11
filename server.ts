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

    const promptMessage = `Bạn là Trợ lý AI đồng hành của Chương trình Thực tập Intern Product Builder tại công ty thời trang YODY.
Nhiệm vụ của bạn là giúp lập trình viên thực tập (Intern Product Builder) hoàn thiện tài liệu nhật ký báo cáo (Working Journal) của họ theo phong cách chuyên nghiệp, thực tế, bám sút sâu sắc hoạt động doanh nghiệp và có "AI-First Mindset".

Bạn được yêu cầu viết nội dung cho trường dữ liệu: "${fieldLabel}" (mã trường: "${fieldKey}") thuộc biểu mẫu "${templateId.toUpperCase()}".

Ý tưởng thô (rough notes) của Intern:
"${roughNotes}"
${contextPrompt}

Yêu cầu cụ thể khi phản hồi:
1. Viết bằng tiếng Việt có dấu, lập luận logic, ngôn từ phổ thông chuyên nghiệp của một Product Builder (sản phẩm, kịch bản, kpi, testing, feedback loop, pivot, speed).
2. Tối ưu ý tưởng thô thành một đoạn tài liệu chi tiết, chỉnh chu, sắc bén, hoàn thiện hơn nhưng vẫn giữ đúng bản chất ý tưởng của Intern. Tránh sáo rỗng hoặc từ ngữ quá hoa mỹ. Tập trung vào "Hành động thực tế" và "Đo lường rõ ràng".
3. Chỉ trả về nội dung đã tối ưu hoàn chỉnh, không kèm theo lời chào, không giải thích dài dòng "Đây là kết quả của bạn...", không dùng markdown bọc ngoài nếu không cần thiết. Trả về văn bản thuần của đoạn tài liệu đã được nâng cấp.`;

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
          simulatedReply = `[BẢO LƯU GIẢ LẬP] - Hiện tại quy trình kiểm soát biểu mẫu đang thực hiện hoàn toàn thủ công. Nhân viên phải tự tải file và đối chiếu chéo giữa Excel và Slack. Điều này gây tốn dữ liệu thời gian lên tới 4 giờ mỗi ngày cho mỗi bộ phận thẩm định, đồng thời xác suất bỏ sót các sai lệch là 15%, dễ dẫn tới rủi ro thất thoát doanh số. Hệ thống tự động rà soát AI-First sẽ là giải pháp tối ưu hóa dứt điểm bài toán này.`;
        } else if (fieldKey === "successMetrics") {
          simulatedReply = `[BẢO LƯU GIẢ LẬP] - KPI chính cần đạt: 
1. Cắt giảm 80% thời gian xử lý thủ công (từ 4 giờ xuống còn dưới 30 phút một ngày).
2. Tỷ lệ phát hiện sai sót dữ liệu biểu mẫu (Accuracy) đạt trên 95% sau giai đoạn huấn luyện lặp lại.
3. Điểm hài lòng (CSAT) của nhân viên Compliance đạt tối thiểu 4.5/5 điểm sau 2 tuần go-live.`;
        } else {
          simulatedReply = `[BẢO LƯU GIẢ LẬP - API Key chưa cấu hình] Tối ưu hóa cho trường ${fieldLabel}: "${roughNotes}". Đối với Product Builder tại YODY, chúng tôi ưu tiên dữ liệu thực tế, đo lường rõ ràng, kiểm thử nhanh chóng và tích hợp AI đòn bẩy một cách triệt để nhất.`;
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
