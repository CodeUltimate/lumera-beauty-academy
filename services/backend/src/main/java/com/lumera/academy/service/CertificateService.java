package com.lumera.academy.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lumera.academy.dto.CertificateDTO;
import com.lumera.academy.entity.Certificate;
import com.lumera.academy.entity.Enrollment;
import com.lumera.academy.entity.LiveClass;
import com.lumera.academy.entity.User;
import com.lumera.academy.exception.BadRequestException;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.CertificateRepository;
import com.lumera.academy.repository.EnrollmentRepository;
import com.lumera.academy.repository.LiveClassRepository;
import com.lumera.academy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final LiveClassRepository liveClassRepository;
    private final EnrollmentRepository enrollmentRepository;

    // Premium color palette
    private static final Color CHAMPAGNE = new Color(201, 169, 98);
    private static final Color CHAMPAGNE_DARK = new Color(166, 136, 70);
    private static final Color CHARCOAL = new Color(51, 51, 51);
    private static final Color TEXT_MUTED = new Color(107, 114, 128);
    private static final Color BORDER_GOLD = new Color(212, 175, 55);

    /**
     * Issue a certificate to a student for completing a class
     */
    @Transactional
    public CertificateDTO issueCertificate(UUID userId, UUID liveClassId) {
        // Check if certificate already exists
        if (certificateRepository.existsByUserIdAndLiveClassId(userId, liveClassId)) {
            log.info("Certificate already exists for user {} and class {}", userId, liveClassId);
            return certificateRepository.findByUserIdAndLiveClassId(userId, liveClassId)
                    .map(CertificateDTO::fromEntity)
                    .orElse(null);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        LiveClass liveClass = liveClassRepository.findById(liveClassId)
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", liveClassId));

        // Verify enrollment exists
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndLiveClassId(userId, liveClassId)
                .orElseThrow(() -> new BadRequestException("Student is not enrolled in this class"));

        // Create certificate
        Certificate certificate = Certificate.builder()
                .user(user)
                .liveClass(liveClass)
                .issuedAt(Instant.now())
                .build();

        Certificate saved = certificateRepository.save(certificate);

        // Update enrollment
        enrollment.setCertificateIssued(true);
        enrollmentRepository.save(enrollment);

        log.info("Certificate {} issued to {} for class {}",
                saved.getCertificateNumber(), user.getFullName(), liveClass.getTitle());

        return CertificateDTO.fromEntity(saved);
    }

    /**
     * Get certificate by ID
     */
    public CertificateDTO getCertificateById(UUID id) {
        return certificateRepository.findById(id)
                .map(CertificateDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "id", id));
    }

    /**
     * Get certificate by certificate number (for verification)
     */
    public CertificateDTO getCertificateByNumber(String certificateNumber) {
        return certificateRepository.findByCertificateNumber(certificateNumber)
                .map(CertificateDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "number", certificateNumber));
    }

    /**
     * Get certificates for a user
     */
    public Page<CertificateDTO> getUserCertificates(UUID userId, Pageable pageable) {
        return certificateRepository.findByUserIdAndRevokedFalse(userId, pageable)
                .map(CertificateDTO::fromEntity);
    }

    /**
     * Get certificates issued for educator's classes
     */
    public Page<CertificateDTO> getEducatorCertificates(UUID educatorId, Pageable pageable) {
        return certificateRepository.findByEducatorId(educatorId, pageable)
                .map(CertificateDTO::fromEntity);
    }

    /**
     * Count certificates issued for educator's classes
     */
    public long countEducatorCertificates(UUID educatorId) {
        return certificateRepository.countByEducatorId(educatorId);
    }

    /**
     * Generate PDF certificate
     */
    public byte[] generateCertificatePdf(UUID certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "id", certificateId));

        if (certificate.isRevoked()) {
            throw new BadRequestException("Cannot generate PDF for a revoked certificate");
        }

        return generatePdf(certificate);
    }

    /**
     * Generate PDF certificate by certificate number
     */
    public byte[] generateCertificatePdfByNumber(String certificateNumber) {
        Certificate certificate = certificateRepository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "number", certificateNumber));

        if (certificate.isRevoked()) {
            throw new BadRequestException("Cannot generate PDF for a revoked certificate");
        }

        return generatePdf(certificate);
    }

    private byte[] generatePdf(Certificate certificate) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            // Landscape A4
            Document document = new Document(PageSize.A4.rotate(), 60, 60, 60, 60);
            PdfWriter writer = PdfWriter.getInstance(document, baos);

            document.open();

            PdfContentByte canvas = writer.getDirectContent();
            float pageWidth = PageSize.A4.getHeight(); // Rotated
            float pageHeight = PageSize.A4.getWidth();

            // Draw elegant border
            drawCertificateBorder(canvas, pageWidth, pageHeight);

            // Add content
            addCertificateContent(document, certificate);

            // Add certificate number at bottom
            addCertificateFooter(canvas, certificate, pageWidth);

            document.close();

            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate certificate PDF", e);
            throw new RuntimeException("Failed to generate certificate PDF", e);
        }
    }

    private void drawCertificateBorder(PdfContentByte canvas, float pageWidth, float pageHeight) {
        // Outer border
        canvas.setColorStroke(BORDER_GOLD);
        canvas.setLineWidth(3);
        canvas.rectangle(30, 30, pageWidth - 60, pageHeight - 60);
        canvas.stroke();

        // Inner border
        canvas.setLineWidth(1);
        canvas.rectangle(40, 40, pageWidth - 80, pageHeight - 80);
        canvas.stroke();

        // Corner decorations
        float cornerSize = 20;
        float margin = 50;

        // Top-left corner
        drawCornerDecoration(canvas, margin, pageHeight - margin, cornerSize, true, true);
        // Top-right corner
        drawCornerDecoration(canvas, pageWidth - margin, pageHeight - margin, cornerSize, false, true);
        // Bottom-left corner
        drawCornerDecoration(canvas, margin, margin, cornerSize, true, false);
        // Bottom-right corner
        drawCornerDecoration(canvas, pageWidth - margin, margin, cornerSize, false, false);
    }

    private void drawCornerDecoration(PdfContentByte canvas, float x, float y, float size, boolean left, boolean top) {
        canvas.setColorStroke(CHAMPAGNE);
        canvas.setLineWidth(2);

        float hDir = left ? 1 : -1;
        float vDir = top ? -1 : 1;

        canvas.moveTo(x, y + (size * vDir));
        canvas.lineTo(x, y);
        canvas.lineTo(x + (size * hDir), y);
        canvas.stroke();
    }

    private void addCertificateContent(Document document, Certificate certificate) throws DocumentException {
        // Spacing from top
        document.add(new Paragraph("\n\n"));

        // "Certificate of Completion" title
        Font preHeaderFont = new Font(Font.HELVETICA, 14, Font.NORMAL, TEXT_MUTED);
        Paragraph preHeader = new Paragraph("CERTIFICATE OF", preHeaderFont);
        preHeader.setAlignment(Element.ALIGN_CENTER);
        document.add(preHeader);

        Font headerFont = new Font(Font.HELVETICA, 42, Font.BOLD, CHAMPAGNE);
        Paragraph header = new Paragraph("COMPLETION", headerFont);
        header.setAlignment(Element.ALIGN_CENTER);
        header.setSpacingAfter(30);
        document.add(header);

        // Decorative line
        Font lineFont = new Font(Font.ZAPFDINGBATS, 12, Font.NORMAL, CHAMPAGNE);
        Paragraph decorLine = new Paragraph("✦ ✦ ✦", lineFont);
        decorLine.setAlignment(Element.ALIGN_CENTER);
        decorLine.setSpacingAfter(25);
        document.add(decorLine);

        // "This is to certify that"
        Font introFont = new Font(Font.HELVETICA, 14, Font.NORMAL, TEXT_MUTED);
        Paragraph intro = new Paragraph("This is to certify that", introFont);
        intro.setAlignment(Element.ALIGN_CENTER);
        intro.setSpacingAfter(15);
        document.add(intro);

        // Student name
        Font nameFont = new Font(Font.HELVETICA, 32, Font.BOLD, CHARCOAL);
        Paragraph name = new Paragraph(certificate.getUser().getFullName(), nameFont);
        name.setAlignment(Element.ALIGN_CENTER);
        name.setSpacingAfter(15);
        document.add(name);

        // "has successfully completed"
        Paragraph completed = new Paragraph("has successfully completed", introFont);
        completed.setAlignment(Element.ALIGN_CENTER);
        completed.setSpacingAfter(15);
        document.add(completed);

        // Class name
        Font classFont = new Font(Font.HELVETICA, 22, Font.BOLD, CHAMPAGNE_DARK);
        Paragraph className = new Paragraph(certificate.getLiveClass().getTitle(), classFont);
        className.setAlignment(Element.ALIGN_CENTER);
        className.setSpacingAfter(30);
        document.add(className);

        // Date
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy")
                .withZone(ZoneId.systemDefault());
        Font dateFont = new Font(Font.HELVETICA, 12, Font.NORMAL, TEXT_MUTED);
        Paragraph date = new Paragraph("Issued on " + formatter.format(certificate.getIssuedAt()), dateFont);
        date.setAlignment(Element.ALIGN_CENTER);
        date.setSpacingAfter(40);
        document.add(date);

        // Educator signature section
        PdfPTable sigTable = new PdfPTable(2);
        sigTable.setWidthPercentage(60);
        sigTable.setHorizontalAlignment(Element.ALIGN_CENTER);

        // Educator
        PdfPCell educatorCell = new PdfPCell();
        educatorCell.setBorder(Rectangle.TOP);
        educatorCell.setBorderColor(CHARCOAL);
        educatorCell.setBorderWidth(1);
        educatorCell.setPaddingTop(10);
        educatorCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Font sigNameFont = new Font(Font.HELVETICA, 12, Font.BOLD, CHARCOAL);
        Paragraph educatorName = new Paragraph(certificate.getLiveClass().getEducator().getFullName(), sigNameFont);
        educatorName.setAlignment(Element.ALIGN_CENTER);
        educatorCell.addElement(educatorName);

        Font sigTitleFont = new Font(Font.HELVETICA, 10, Font.NORMAL, TEXT_MUTED);
        Paragraph educatorTitle = new Paragraph("Educator", sigTitleFont);
        educatorTitle.setAlignment(Element.ALIGN_CENTER);
        educatorCell.addElement(educatorTitle);

        sigTable.addCell(educatorCell);

        // Academy
        PdfPCell academyCell = new PdfPCell();
        academyCell.setBorder(Rectangle.TOP);
        academyCell.setBorderColor(CHARCOAL);
        academyCell.setBorderWidth(1);
        academyCell.setPaddingTop(10);
        academyCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Font brandFont = new Font(Font.HELVETICA, 12, Font.BOLD, CHAMPAGNE);
        Paragraph brandName = new Paragraph("Luméra Beauty Academy", brandFont);
        brandName.setAlignment(Element.ALIGN_CENTER);
        academyCell.addElement(brandName);

        Paragraph brandTitle = new Paragraph("Official Certificate", sigTitleFont);
        brandTitle.setAlignment(Element.ALIGN_CENTER);
        academyCell.addElement(brandTitle);

        sigTable.addCell(academyCell);

        document.add(sigTable);
    }

    private void addCertificateFooter(PdfContentByte canvas, Certificate certificate, float pageWidth) {
        Font footerFont = new Font(Font.HELVETICA, 9, Font.NORMAL, TEXT_MUTED);

        // Certificate number
        Phrase certNumber = new Phrase("Certificate ID: " + certificate.getCertificateNumber(), footerFont);
        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, certNumber, pageWidth / 2, 55, 0);

        // Verification notice
        Font verifyFont = new Font(Font.HELVETICA, 8, Font.ITALIC, TEXT_MUTED);
        Phrase verify = new Phrase("Verify at lumera.academy/verify/" + certificate.getCertificateNumber(), verifyFont);
        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, verify, pageWidth / 2, 42, 0);
    }

    /**
     * Revoke a certificate
     */
    @Transactional
    public void revokeCertificate(UUID certificateId, String reason) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "id", certificateId));

        certificate.setRevoked(true);
        certificate.setRevokedReason(reason);
        certificate.setRevokedAt(Instant.now());

        certificateRepository.save(certificate);

        log.info("Certificate {} revoked: {}", certificate.getCertificateNumber(), reason);
    }
}
