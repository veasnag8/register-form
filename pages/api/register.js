export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Destructure registration data from the request body
  const { name, email, phone } = req.body;

  // Telegram bot settings
  const botToken = "7587323191:AAGtQh_tpjh1A8_t88mhYi8usMVfro1qPS8"; // Replace with your Telegram bot token
  const chatId = "5421063181"; // Replace with your Telegram chat ID

  // Format the message to send to the Telegram bot
  const message = `📢 New Registration:\n\n👤 Name: ${name}\n📧 Email: ${email}\n📞 Phone: ${phone}`;

  // Create the URL to send the message via Telegram Bot API
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

  try {
    // Send the request to Telegram API
    const response = await fetch(telegramUrl);

    // If the response is okay, return success
    if (response.ok) {
      return res.status(200).json({ message: "Success" });
    } else {
      return res.status(500).json({ message: "Failed to send message" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error sending data" });
  }
}
