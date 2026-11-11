export default async function sendMail({ to, subject, text }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify({
      sender: {
        name: process.env.MAIL_FROM_NAME || "Bulk Mail App",
        email: process.env.SENDER_EMAIL
      },
      to: [{ email: to }],
      subject,
      textContent: text
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Brevo error ${res.status}`);
  }
  return data; // contains messageId
}