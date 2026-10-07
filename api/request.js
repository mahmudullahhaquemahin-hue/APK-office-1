export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      error: "Telegram bot is not configured."
    });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : (req.body || {});

    const appName = String(body.appName || "").trim().slice(0, 120);
    const category = String(body.category || "Other").trim().slice(0, 40);
    const link = String(body.link || "").trim().slice(0, 500);
    const note = String(body.note || "").trim().slice(0, 1500);

    if (!appName) {
      return res.status(400).json({
        error: "App name is required."
      });
    }

    const message =
`📥 <b>APK OFFICE — New App Request</b>

<b>📱 App:</b> ${escapeHtml(appName)}
<b>📂 Category:</b> ${escapeHtml(category)}
<b>🔗 Official Link:</b> ${link ? escapeHtml(link) : "Not provided"}
<b>📝 Note:</b> ${note ? escapeHtml(note) : "None"}

🌐 <b>Source:</b> APK OFFICE`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram API error:", telegramResult);

      return res.status(502).json({
        error: "Telegram message could not be sent."
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Request sent successfully."
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: "Invalid request data."
    });
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
