export async function sendTelegramNotification(order: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  const message = `
🛒 New Order Received!

📦 Order ID: ${order.id}
👤 Name: ${order.name}
📞 Phone: ${order.phone}
💰 Total: ৳${order.total}
📍 Address: ${order.address}
  `

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  })
}
