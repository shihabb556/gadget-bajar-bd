export async function sendTelegramNotification(order: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN!
  const chatId = process.env.TELEGRAM_CHAT_ID!
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

  const orderUrl = `${baseUrl}/admin/orders`

  const message = `
🛒 New Order Received!

📦 Order ID: ${order._id}
💰 Total: ৳${order.totalAmount}
🚚 Delivery Area: ${order.deliveryArea}
💳 Payment: ${order.paymentStatus.method}
📌 Status: ${order.status}

🔎 View Order:
${orderUrl}
  `

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔎 View Order",
              url: orderUrl
            }
          ]
        ]
      }
    })
  })
}
