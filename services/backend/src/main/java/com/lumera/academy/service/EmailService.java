package com.lumera.academy.service;

import com.lumera.academy.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.name:Luméra Beauty Academy}")
    private String appName;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(User user, String token) {
        log.info("Starting to send verification email to: {}", user.getEmail());
        String verificationLink = frontendUrl + "/verify-email?token=" + token;
        log.info("Verification link generated: {}", verificationLink);

        try {
            log.info("Creating MIME message for: {}", user.getEmail());
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@lumera.com", appName);
            helper.setTo(user.getEmail());
            helper.setSubject("Verify Your Email - " + appName);
            helper.setText(buildVerificationEmailHtml(user, verificationLink), true);

            log.info("Sending verification email via SMTP to: {}", user.getEmail());
            mailSender.send(message);
            log.info("Verification email successfully sent to: {}", user.getEmail());
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send verification email to: {} - Error: {}", user.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Failed to send verification email", e);
        } catch (Exception e) {
            log.error("Unexpected error sending verification email to: {} - Error: {}", user.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    @Async
    public void sendWelcomeEmail(User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@lumera.com", appName);
            helper.setTo(user.getEmail());
            helper.setSubject("Welcome to " + appName + "!");
            helper.setText(buildWelcomeEmailHtml(user), true);

            mailSender.send(message);
            log.info("Welcome email sent to: {}", user.getEmail());
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send welcome email to: {}", user.getEmail(), e);
        }
    }

    private String buildVerificationEmailHtml(User user, String verificationLink) {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Your Email</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa;">
                    <table role="presentation" style="width: 100%%; border-collapse: collapse;">
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <table role="presentation" style="width: 600px; max-width: 100%%; border-collapse: collapse;">
                                    <!-- Header with Gold Accent -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #C9A962 0%%, #B8956F 100%%); padding: 4px;"></td>
                                    </tr>

                                    <!-- Main Content -->
                                    <tr>
                                        <td style="background-color: #ffffff; padding: 50px 40px;">
                                            <!-- Logo -->
                                            <table role="presentation" style="width: 100%%; margin-bottom: 40px;">
                                                <tr>
                                                    <td align="center">
                                                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #C9A962; letter-spacing: 2px;">LUMÉRA</h1>
                                                        <p style="margin: 5px 0 0 0; font-size: 11px; color: #9CA3AF; letter-spacing: 3px; text-transform: uppercase;">Beauty Academy</p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Greeting -->
                                            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 300; color: #333333; text-align: center;">
                                                Welcome, %s!
                                            </h2>

                                            <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #6B7280; text-align: center;">
                                                Thank you for joining Luméra Beauty Academy as an educator. We're thrilled to have you as part of our community of beauty professionals.
                                            </p>

                                            <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #6B7280; text-align: center;">
                                                Please verify your email address to complete your registration and start sharing your expertise with students worldwide.
                                            </p>

                                            <!-- CTA Button -->
                                            <table role="presentation" style="width: 100%%; margin: 40px 0;">
                                                <tr>
                                                    <td align="center">
                                                        <a href="%s" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #C9A962 0%%, #B8956F 100%%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 4px; letter-spacing: 0.5px;">
                                                            Verify Email Address
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Alternative Link -->
                                            <p style="margin: 30px 0 0 0; font-size: 14px; color: #9CA3AF; text-align: center;">
                                                Or copy and paste this link into your browser:
                                            </p>
                                            <p style="margin: 10px 0 0 0; font-size: 12px; color: #C9A962; text-align: center; word-break: break-all;">
                                                %s
                                            </p>

                                            <!-- Expiry Notice -->
                                            <table role="presentation" style="width: 100%%; margin-top: 40px; background-color: #FEF3C7; border-radius: 8px;">
                                                <tr>
                                                    <td style="padding: 16px 20px;">
                                                        <p style="margin: 0; font-size: 14px; color: #92400E; text-align: center;">
                                                            ⏰ This verification link will expire in 24 hours.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #F9FAFB; padding: 30px 40px; border-top: 1px solid #E5E7EB;">
                                            <table role="presentation" style="width: 100%%;">
                                                <tr>
                                                    <td align="center">
                                                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6B7280;">
                                                            If you didn't create an account with Luméra Beauty Academy, you can safely ignore this email.
                                                        </p>
                                                        <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                                                            © 2024 Luméra Beauty Academy. All rights reserved.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Bottom Gold Accent -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #C9A962 0%%, #B8956F 100%%); padding: 3px;"></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(user.getFirstName(), verificationLink, verificationLink);
    }

    private String buildWelcomeEmailHtml(User user) {
        String dashboardLink = frontendUrl + "/educator";
        boolean isEducator = user.getRole() == User.UserRole.EDUCATOR;

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Luméra</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa;">
                    <table role="presentation" style="width: 100%%; border-collapse: collapse;">
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <table role="presentation" style="width: 600px; max-width: 100%%; border-collapse: collapse;">
                                    <!-- Header with Gold Accent -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #C9A962 0%%, #B8956F 100%%); padding: 4px;"></td>
                                    </tr>

                                    <!-- Main Content -->
                                    <tr>
                                        <td style="background-color: #ffffff; padding: 50px 40px;">
                                            <!-- Logo -->
                                            <table role="presentation" style="width: 100%%; margin-bottom: 40px;">
                                                <tr>
                                                    <td align="center">
                                                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #C9A962; letter-spacing: 2px;">LUMÉRA</h1>
                                                        <p style="margin: 5px 0 0 0; font-size: 11px; color: #9CA3AF; letter-spacing: 3px; text-transform: uppercase;">Beauty Academy</p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Success Icon -->
                                            <table role="presentation" style="width: 100%%; margin-bottom: 30px;">
                                                <tr>
                                                    <td align="center">
                                                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10B981 0%%, #059669 100%%); border-radius: 50%%; display: inline-block; line-height: 80px; text-align: center;">
                                                            <span style="font-size: 40px; color: white;">✓</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Greeting -->
                                            <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 300; color: #333333; text-align: center;">
                                                You're All Set, %s!
                                            </h2>

                                            <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #6B7280; text-align: center;">
                                                Your email has been verified and your account is now active. Welcome to Luméra Beauty Academy!
                                            </p>

                                            %s

                                            <!-- CTA Button -->
                                            <table role="presentation" style="width: 100%%; margin: 40px 0;">
                                                <tr>
                                                    <td align="center">
                                                        <a href="%s" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #C9A962 0%%, #B8956F 100%%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 4px; letter-spacing: 0.5px;">
                                                            Go to Dashboard
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Help Section -->
                                            <table role="presentation" style="width: 100%%; margin-top: 40px; background-color: #F3F4F6; border-radius: 8px;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #374151; text-align: center;">
                                                            Need help getting started?
                                                        </p>
                                                        <p style="margin: 0; font-size: 14px; color: #6B7280; text-align: center;">
                                                            Check out our <a href="%s/help" style="color: #C9A962; text-decoration: none;">Help Center</a> or reply to this email for support.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #F9FAFB; padding: 30px 40px; border-top: 1px solid #E5E7EB;">
                                            <table role="presentation" style="width: 100%%;">
                                                <tr>
                                                    <td align="center">
                                                        <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                                                            © 2024 Luméra Beauty Academy. All rights reserved.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Bottom Gold Accent -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #C9A962 0%%, #B8956F 100%%); padding: 3px;"></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(
                user.getFirstName(),
                isEducator ? getEducatorFeatures() : getStudentFeatures(),
                dashboardLink,
                frontendUrl
        );
    }

    private String getEducatorFeatures() {
        return """
                <!-- Features for Educators -->
                <table role="presentation" style="width: 100%%; margin: 20px 0;">
                    <tr>
                        <td style="padding: 15px; background-color: #FEF3C7; border-radius: 8px; text-align: center;">
                            <p style="margin: 0 0 5px 0; font-size: 20px;">🎓</p>
                            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #92400E;">Create Your First Class</p>
                            <p style="margin: 5px 0 0 0; font-size: 13px; color: #B45309;">Share your expertise with students worldwide</p>
                        </td>
                    </tr>
                </table>
                <table role="presentation" style="width: 100%%;">
                    <tr>
                        <td style="width: 50%%; padding: 10px;">
                            <div style="background-color: #F3F4F6; border-radius: 8px; padding: 15px; text-align: center;">
                                <p style="margin: 0 0 5px 0; font-size: 18px;">📹</p>
                                <p style="margin: 0; font-size: 13px; color: #374151;">Live Classes</p>
                            </div>
                        </td>
                        <td style="width: 50%%; padding: 10px;">
                            <div style="background-color: #F3F4F6; border-radius: 8px; padding: 15px; text-align: center;">
                                <p style="margin: 0 0 5px 0; font-size: 18px;">💰</p>
                                <p style="margin: 0; font-size: 13px; color: #374151;">80%% Earnings</p>
                            </div>
                        </td>
                    </tr>
                </table>
                """;
    }

    private String getStudentFeatures() {
        return """
                <!-- Features for Students -->
                <table role="presentation" style="width: 100%%;">
                    <tr>
                        <td style="width: 50%%; padding: 10px;">
                            <div style="background-color: #F3F4F6; border-radius: 8px; padding: 15px; text-align: center;">
                                <p style="margin: 0 0 5px 0; font-size: 18px;">📚</p>
                                <p style="margin: 0; font-size: 13px; color: #374151;">Browse Classes</p>
                            </div>
                        </td>
                        <td style="width: 50%%; padding: 10px;">
                            <div style="background-color: #F3F4F6; border-radius: 8px; padding: 15px; text-align: center;">
                                <p style="margin: 0 0 5px 0; font-size: 18px;">🏆</p>
                                <p style="margin: 0; font-size: 13px; color: #374151;">Earn Certificates</p>
                            </div>
                        </td>
                    </tr>
                </table>
                """;
    }
}
