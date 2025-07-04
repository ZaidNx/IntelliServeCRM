import nodemailer from 'nodemailer';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'zaid.ch20@gmail.com',
      pass: process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD, // Use App Password for Gmail
    },
  });
};

export async function sendContactEmail(
  contactData: ContactMessage
): Promise<boolean> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'zaid.ch20@gmail.com',
      to: 'zaid.ch20@gmail.com',
      subject: `IntelliServe CRM - New Contact from ${contactData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Name:</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              contactData.name
            }</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Email:</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              contactData.email
            }</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Message:</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              contactData.message
            }</td>
          </tr>
        </table>
        <br>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      '✅ Email sent successfully to zaid.ch20@gmail.com via Nodemailer'
    );
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}
