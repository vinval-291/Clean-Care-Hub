import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for sending emails
  app.post('/api/send-booking-email', async (req, res) => {
    const { bookingData } = req.body;
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP credentials not configured. Skipping email send.');
      return res.status(200).json({ success: true, message: 'Email skipped (not configured)' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Clean & Care Hub" <${process.env.SMTP_USER}>`,
      to: 'cleanandcarehub26@gmail.com',
      subject: `New Booking Request: ${bookingData.service}`,
      text: `
        New Booking Request Received:
        
        Service: ${bookingData.service}
        Date: ${bookingData.date}
        Time: ${bookingData.time}
        
        Customer Details:
        Name: ${bookingData.fullName}
        Phone: ${bookingData.phone}
        Address: ${bookingData.address}
        
        Additional Notes:
        ${bookingData.notes || 'None'}
        
        Booking ID: ${bookingData.id}
      `,
      html: `
        <h2>New Booking Request Received</h2>
        <p><strong>Service:</strong> ${bookingData.service}</p>
        <p><strong>Date:</strong> ${bookingData.date}</p>
        <p><strong>Time:</strong> ${bookingData.time}</p>
        <hr />
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${bookingData.fullName}</p>
        <p><strong>Phone:</strong> ${bookingData.phone}</p>
        <p><strong>Address:</strong> ${bookingData.address}</p>
        <hr />
        <h3>Additional Notes</h3>
        <p>${bookingData.notes || 'None'}</p>
        <p><strong>Booking ID:</strong> ${bookingData.id}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
