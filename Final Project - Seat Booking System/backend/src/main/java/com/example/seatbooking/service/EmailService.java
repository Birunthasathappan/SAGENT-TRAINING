package com.example.seatbooking.service;

import com.example.seatbooking.entity.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ── Booking Confirmation Mail ─────────────────────────

    public void sendBookingConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String userEmail = booking.getUser().getEmail();
            String userName  = booking.getUser().getName();
            String eventName = booking.getScreening().getEvent().getTitle();
            String venue     = booking.getScreening().getVenue().getVenueName();
            String date      = booking.getScreening().getScreenDate().toString();
            String time      = booking.getScreening().getStartTime().toString();
            String refCode   = booking.getRefCode();
            String amount    = "₹" + booking.getTotalCost();

            helper.setTo(userEmail);
            helper.setSubject("🎟️ Booking Confirmed - " + eventName + " | BOOKIT");

            String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 32px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #f5c518; font-size: 28px; margin: 0;">🎟️ BOOKIT</h1>
                        <p style="color: #aaa; margin: 4px 0;">Your ticket is confirmed!</p>
                    </div>
                    <div style="background: #1a1a1a; border-radius: 10px; padding: 24px; margin-bottom: 20px;">
                        <h2 style="color: #f5c518; margin-top: 0;">Hi %s! 👋</h2>
                        <p style="color: #ccc;">Your booking for <strong style="color: #fff;">%s</strong> has been confirmed.</p>
                    </div>
                    <div style="background: #1a1a1a; border-radius: 10px; padding: 24px; margin-bottom: 20px;">
                        <h3 style="color: #f5c518; margin-top: 0;">📋 Booking Details</h3>
                        <table style="width: 100%%; color: #ccc;">
                            <tr><td style="padding: 8px 0;">🎭 Event</td><td style="color: #fff; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">📍 Venue</td><td style="color: #fff;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">📅 Date</td><td style="color: #fff;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">⏰ Time</td><td style="color: #fff;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">💰 Amount Paid</td><td style="color: #f5c518; font-weight: bold;">%s</td></tr>
                        </table>
                    </div>
                    <div style="background: #f5c518; border-radius: 10px; padding: 16px; text-align: center; margin-bottom: 20px;">
                        <p style="color: #000; margin: 0; font-size: 13px;">Booking Reference</p>
                        <h2 style="color: #000; margin: 4px 0; font-size: 24px; letter-spacing: 3px;">%s</h2>
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        Please carry this reference code at the venue. <br/>
                        Thank you for booking with BOOKIT! 🎉
                    </p>
                </div>
                """.formatted(userName, eventName, eventName, venue, date, time, amount, refCode);

            helper.setText(html, true);
            mailSender.send(message);
            System.out.println("✅ Booking confirmation sent to: " + userEmail);

        } catch (MessagingException e) {
            System.err.println("Email sending failed: " + e.getMessage());
        }
    }

    // ── Cancellation Requested Mail ───────────────────────

    public void sendCancellationMail(Booking booking, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String userEmail = booking.getUser().getEmail();
            String userName  = booking.getUser().getName();
            String eventName = booking.getScreening().getEvent().getTitle();
            String venue     = booking.getScreening().getVenue().getVenueName();
            String date      = booking.getScreening().getScreenDate().toString();
            String time      = booking.getScreening().getStartTime().toString();
            String refCode   = booking.getRefCode();
            String amount    = "₹" + booking.getTotalCost();

            helper.setTo(userEmail);
            helper.setSubject("❌ Booking Cancelled - " + eventName + " | BOOKIT");

            String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 32px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #f5c518; font-size: 28px; margin: 0;">🎟️ BOOKIT</h1>
                        <p style="color: #aaa; margin: 4px 0;">Booking Cancellation</p>
                    </div>
                    <div style="background: #1a1a1a; border-radius: 10px; padding: 24px; margin-bottom: 20px;">
                        <h2 style="color: #ff4d4d; margin-top: 0;">Hi %s! 👋</h2>
                        <p style="color: #ccc;">Your booking for <strong style="color: #fff;">%s</strong> has been <strong style="color: #ff4d4d;">cancelled</strong>.</p>
                    </div>
                    <div style="background: #1a1a1a; border-radius: 10px; padding: 24px; margin-bottom: 20px;">
                        <h3 style="color: #ff4d4d; margin-top: 0;">📋 Cancelled Booking Details</h3>
                        <table style="width: 100%%; color: #ccc;">
                            <tr><td style="padding: 8px 0;">🎭 Event</td><td style="color: #fff; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">📍 Venue</td><td style="color: #fff;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">📅 Date</td><td style="color: #fff;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">⏰ Time</td><td style="color: #fff;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">💰 Amount</td><td style="color: #ff4d4d; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">📝 Reason</td><td style="color: #ffa500; font-weight: bold;">%s</td></tr>
                        </table>
                    </div>
                    <div style="background: #ff4d4d; border-radius: 10px; padding: 16px; text-align: center; margin-bottom: 20px;">
                        <p style="color: #fff; margin: 0; font-size: 13px;">Cancelled Booking Reference</p>
                        <h2 style="color: #fff; margin: 4px 0; font-size: 24px; letter-spacing: 3px;">%s</h2>
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        If you did not request this cancellation, please contact support immediately.<br/>
                        We hope to see you again at BOOKIT! 🎉
                    </p>
                </div>
                """.formatted(userName, eventName, eventName, venue, date, time, amount, reason, refCode);

            helper.setText(html, true);
            mailSender.send(message);
            System.out.println("✅ Cancellation mail sent to: " + userEmail);

        } catch (MessagingException e) {
            System.err.println("Cancellation email sending failed: " + e.getMessage());
        }
    }

    // ── Cancellation Approved Mail ────────────────────────

    public void sendCancellationApprovedMail(Booking booking, double amount) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String userEmail = booking.getUser().getEmail();
            String userName  = booking.getUser().getName();
            String eventName = booking.getScreening().getEvent().getTitle();
            String refCode   = booking.getRefCode();
            String refundAmt = "₹" + amount;

            helper.setTo(userEmail);
            helper.setSubject("✅ Refund Approved - " + eventName + " | BOOKIT");

            String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 32px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #f5c518; font-size: 28px; margin: 0;">🎟️ BOOKIT</h1>
                        <p style="color: #aaa; margin: 4px 0;">Refund Approved</p>
                    </div>
                    <div style="background: #1a1a1a; border-radius: 10px; padding: 24px; margin-bottom: 20px;">
                        <h2 style="color: #00c853; margin-top: 0;">Hi %s! 👋</h2>
                        <p style="color: #ccc;">Your cancellation request for <strong style="color: #fff;">%s</strong> has been <strong style="color: #00c853;">APPROVED</strong>! 🎉</p>
                    </div>
                    <div style="background: #1a1a1a; border-radius: 10px; padding: 24px; margin-bottom: 20px;">
                        <h3 style="color: #00c853; margin-top: 0;">💰 Refund Details</h3>
                        <table style="width: 100%%; color: #ccc;">
                            <tr><td style="padding: 8px 0;">🎭 Event</td><td style="color: #fff; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">💰 Refund Amount</td><td style="color: #00c853; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">📅 Credit Timeline</td><td style="color: #fff;">3-5 business days</td></tr>
                        </table>
                    </div>
                    <div style="background: #00c853; border-radius: 10px; padding: 16px; text-align: center; margin-bottom: 20px;">
                        <p style="color: #fff; margin: 0; font-size: 13px;">Booking Reference</p>
                        <h2 style="color: #fff; margin: 4px 0; font-size: 24px; letter-spacing: 3px;">%s</h2>
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        We hope to see you again at BOOKIT! 🎉
                    </p>
                </div>
                """.formatted(userName, eventName, eventName, refundAmt, refCode);

            helper.setText(html, true);
            mailSender.send(message);
            System.out.println("✅ Approved mail sent to: " + userEmail);

        } catch (MessagingException e) {
            System.err.println("Approved email sending failed: " + e.getMessage());
        }
    }

    // ── Cancellation Rejected Mail ────────────────────────

    public void sendCancellationRejectedMail(Booking booking, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String userEmail = booking.getUser().getEmail();
            String userName  = booking.getUser().getName();
            String eventName = booking.getScreening().getEvent().getTitle();
            String refCode   = booking.getRefCode();

            helper.setTo(userEmail);
            helper.setSubject("❌ Refund Rejected - " + eventName + " | BOOKIT");

            String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; color: #fff; padding: 32px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #f5c518; font-size: 28px; margin: 0;">🎟️ BOOKIT</h1>
                        <p style="color: #aaa; margin: 4px 0;">Refund Update</p>
                    </div>
                    <div style="background: #1a1a1a; border-radius: 10px; padding: 24px; margin-bottom: 20px;">
                        <h2 style="color: #ff4d4d; margin-top: 0;">Hi %s! 👋</h2>
                        <p style="color: #ccc;">Unfortunately your cancellation request for <strong style="color: #fff;">%s</strong> has been <strong style="color: #ff4d4d;">REJECTED</strong>.</p>
                    </div>
                    <div style="background: #1a1a1a; border-radius: 10px; padding: 24px; margin-bottom: 20px;">
                        <h3 style="color: #ff4d4d; margin-top: 0;">📋 Details</h3>
                        <table style="width: 100%%; color: #ccc;">
                            <tr><td style="padding: 8px 0;">🎭 Event</td><td style="color: #fff; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 8px 0;">📝 Reason</td><td style="color: #ffa500; font-weight: bold;">%s</td></tr>
                        </table>
                    </div>
                    <div style="background: #ff4d4d; border-radius: 10px; padding: 16px; text-align: center; margin-bottom: 20px;">
                        <p style="color: #fff; margin: 0; font-size: 13px;">Booking Reference</p>
                        <h2 style="color: #fff; margin: 4px 0; font-size: 24px; letter-spacing: 3px;">%s</h2>
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        For queries contact our support team.<br/>
                        Thank you for using BOOKIT! 🎉
                    </p>
                </div>
                """.formatted(userName, eventName, eventName, reason, refCode);

            helper.setText(html, true);
            mailSender.send(message);
            System.out.println("✅ Rejected mail sent to: " + userEmail);

        } catch (MessagingException e) {
            System.err.println("Rejected email sending failed: " + e.getMessage());
        }
    }

    // ── Forgot Password OTP Mail ──────────────────────────

    public void sendForgotPasswordOtp(String userName, String email, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("🔐 Password Reset OTP - BOOKIT");

            String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;
                            background: #0f0f0f; color: #fff; padding: 32px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #e8184b; font-size: 28px; margin: 0;">🎟️ BOOKIT</h1>
                        <p style="color: #aaa; margin: 4px 0;">Password Reset Request</p>
                    </div>
                    <div style="background: #1a1a1a; border-radius: 10px; padding: 24px; margin-bottom: 20px;">
                        <h2 style="color: #fff; margin-top: 0;">Hi %s! 👋</h2>
                        <p style="color: #ccc;">
                            We received a request to reset your BOOKIT password.
                            Use the OTP below to continue.
                        </p>
                    </div>
                    <div style="background: #e8184b; border-radius: 10px; padding: 32px;
                                text-align: center; margin-bottom: 20px;">
                        <p style="color: #fff; margin: 0; font-size: 14px; opacity: 0.9;">
                            Your OTP Code
                        </p>
                        <h1 style="color: #fff; margin: 12px 0; font-size: 52px;
                                   letter-spacing: 16px; font-weight: bold;">%s</h1>
                        <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 13px;">
                            ⏰ Expires in 5 minutes
                        </p>
                    </div>
                    <div style="background: #1a1a1a; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
                        <p style="color: #aaa; font-size: 13px; margin: 0;">
                            ⚠️ If you didn't request a password reset, please ignore this email.
                            Your password will remain unchanged.
                        </p>
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        Thank you for using BOOKIT! 🎉
                    </p>
                </div>
                """.formatted(userName, otp);

            helper.setText(html, true);
            mailSender.send(message);
            System.out.println("✅ OTP mail sent to: " + email);

        } catch (MessagingException e) {
            System.err.println("OTP email sending failed: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email");
        }
    }
}