export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const { name, email, phone } = req.body;
  
    const botToken = "7587323191:AAGtQh_tpjh1A8_t88mhYi8usMVfro1qPS8"; // Replace with your Telegram bot token
    const chatId = "5421063181"; // Replace with your Telegram chat ID
  
    const message = `📢 New Registration:\n\n👤 Name: ${name}\n📧 Email: ${email}\n📞 Phone: ${phone}`;
  
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
  
    const response = await fetch(telegramUrl);
  
    if (response.ok) {
      res.status(200).json({ message: "Success" });
    } else {
      res.status(500).json({ message: "Failed to send message" });
    }
  }
  