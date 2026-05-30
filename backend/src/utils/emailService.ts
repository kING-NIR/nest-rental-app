import nodemailer, { Transporter } from "nodemailer";
import logger from "./logger";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      // For development, use Gmail or a mock service
      if (process.env.EMAIL_SERVICE === "gmail") {
        this.transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
      } else {
        // Use placeholder transporter for development without credentials
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "localhost",
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: false,
          auth: process.env.EMAIL_USER ? {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          } : undefined,
        });
      }
      logger.info("Email service initialized");
    } catch (error) {
      logger.error("Failed to initialize email service", error);
      // Continue without email service
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      logger.warn("Email service not configured", { to: options.to });
      // In development without email configured, just log
      if (process.env.NODE_ENV === "development") {
        logger.info("Email would be sent (dev mode)", {
          to: options.to,
          subject: options.subject,
        });
        return true;
      }
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER || "noreply@nest-rental.com",
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      logger.info("Email sent successfully", { messageId: info.messageId, to: options.to });
      return true;
    } catch (error) {
      logger.error("Failed to send email", error, { to: options.to });
      return false;
    }
  }

  // Convenience methods for specific email types
  async sendBookingConfirmation(
    email: string,
    propertyName: string,
    checkIn: string,
    checkOut: string
  ): Promise<boolean> {
    const html = `
      <h2>Booking Confirmed!</h2>
      <p>Your booking for <strong>${propertyName}</strong> is confirmed.</p>
      <p><strong>Check-in:</strong> ${checkIn}</p>
      <p><strong>Check-out:</strong> ${checkOut}</p>
      <p>We look forward to hosting you!</p>
    `;

    return this.sendEmail({
      to: email,
      subject: `Booking Confirmation - ${propertyName}`,
      html,
      text: `Booking confirmed for ${propertyName} from ${checkIn} to ${checkOut}`,
    });
  }

  async sendPaymentNotification(
    email: string,
    amount: number,
    propertyName: string,
    transactionId: string
  ): Promise<boolean> {
    const html = `
      <h2>Payment Received</h2>
      <p>Thank you for your payment!</p>
      <p><strong>Amount:</strong> $${amount}</p>
      <p><strong>Property:</strong> ${propertyName}</p>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
      <p>If you have any questions, please contact support.</p>
    `;

    return this.sendEmail({
      to: email,
      subject: `Payment Confirmation - ${propertyName}`,
      html,
      text: `Payment of $${amount} received for ${propertyName}`,
    });
  }

  async sendAppointmentNotification(
    email: string,
    propertyName: string,
    date: string,
    time: string
  ): Promise<boolean> {
    const html = `
      <h2>Appointment Scheduled</h2>
      <p>Your appointment has been scheduled.</p>
      <p><strong>Property:</strong> ${propertyName}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p>Please arrive 5 minutes early.</p>
    `;

    return this.sendEmail({
      to: email,
      subject: `Appointment Scheduled - ${propertyName}`,
      html,
      text: `Appointment scheduled for ${propertyName} on ${date} at ${time}`,
    });
  }
}

export default new EmailService();
