package com.lumera.academy.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lumera.academy.entity.Enrollment;
import com.lumera.academy.entity.User;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.EnrollmentRepository;
import com.lumera.academy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EarningsReportService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    // Premium color palette matching the UI
    private static final Color CHAMPAGNE = new Color(201, 169, 98);
    private static final Color CHAMPAGNE_LIGHT = new Color(220, 200, 150);
    private static final Color CHARCOAL = new Color(51, 51, 51);
    private static final Color TEXT_SECONDARY = new Color(107, 114, 128);
    private static final Color TEXT_MUTED = new Color(156, 163, 175);
    private static final Color CARD_BG = new Color(255, 255, 255);
    private static final Color CARD_BORDER = new Color(243, 244, 246);
    private static final Color TABLE_HEADER_BG = new Color(249, 250, 251);
    private static final Color SUCCESS_GREEN = new Color(34, 197, 94);
    private static final Color SUCCESS_BG = new Color(240, 253, 244);
    private static final Color PENDING_YELLOW = new Color(202, 138, 4);
    private static final Color PENDING_BG = new Color(254, 252, 232);

    public byte[] generateEarningsReport(String educatorEmail) {
        User educator = userRepository.findByEmail(educatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", educatorEmail));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter writer = PdfWriter.getInstance(document, baos);

            // Add page event for footer
            writer.setPageEvent(new PremiumPageEvent(educator.getFullName()));

            document.open();

            // Premium header
            addPremiumHeader(document, writer, educator);

            // Stats cards section
            addStatsCards(document, writer, educator.getId());

            // Transactions section
            addTransactionsSection(document, writer, educator.getId());

            document.close();

            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }

    private void addPremiumHeader(Document document, PdfWriter writer, User educator) throws DocumentException {
        PdfContentByte canvas = writer.getDirectContent();

        // Top accent bar
        canvas.setColorFill(CHAMPAGNE);
        canvas.rectangle(0, PageSize.A4.getHeight() - 8, PageSize.A4.getWidth(), 8);
        canvas.fill();

        document.add(Chunk.NEWLINE);

        // Brand logo area
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{1, 1});
        headerTable.setSpacingAfter(30);

        // Left side - Brand
        PdfPCell brandCell = new PdfPCell();
        brandCell.setBorder(Rectangle.NO_BORDER);
        brandCell.setPaddingTop(10);

        Font brandFont = new Font(Font.HELVETICA, 28, Font.BOLD, CHAMPAGNE);
        Paragraph brand = new Paragraph("LUMÉRA", brandFont);
        brandCell.addElement(brand);

        Font taglineFont = new Font(Font.HELVETICA, 9, Font.NORMAL, TEXT_MUTED);
        Paragraph tagline = new Paragraph("BEAUTY ACADEMY", taglineFont);
        tagline.setSpacingBefore(-5);
        brandCell.addElement(tagline);

        headerTable.addCell(brandCell);

        // Right side - Report info
        PdfPCell infoCell = new PdfPCell();
        infoCell.setBorder(Rectangle.NO_BORDER);
        infoCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        infoCell.setPaddingTop(10);

        Font reportTitleFont = new Font(Font.HELVETICA, 20, Font.NORMAL, CHARCOAL);
        Paragraph reportTitle = new Paragraph("Earnings Report", reportTitleFont);
        reportTitle.setAlignment(Element.ALIGN_RIGHT);
        infoCell.addElement(reportTitle);

        Font dateFont = new Font(Font.HELVETICA, 10, Font.NORMAL, TEXT_MUTED);
        Paragraph date = new Paragraph(
            LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM d, yyyy")),
            dateFont
        );
        date.setAlignment(Element.ALIGN_RIGHT);
        date.setSpacingBefore(4);
        infoCell.addElement(date);

        headerTable.addCell(infoCell);
        document.add(headerTable);

        // Educator info bar
        PdfPTable educatorBar = new PdfPTable(1);
        educatorBar.setWidthPercentage(100);
        educatorBar.setSpacingAfter(25);

        PdfPCell educatorCell = new PdfPCell();
        educatorCell.setBackgroundColor(TABLE_HEADER_BG);
        educatorCell.setBorder(Rectangle.NO_BORDER);
        educatorCell.setPadding(15);
        educatorCell.setPaddingLeft(20);

        Font educatorLabelFont = new Font(Font.HELVETICA, 9, Font.NORMAL, TEXT_MUTED);
        Font educatorNameFont = new Font(Font.HELVETICA, 12, Font.BOLD, CHARCOAL);

        Paragraph educatorLabel = new Paragraph("EDUCATOR", educatorLabelFont);
        educatorCell.addElement(educatorLabel);

        Paragraph educatorName = new Paragraph(educator.getFullName(), educatorNameFont);
        educatorName.setSpacingBefore(2);
        educatorCell.addElement(educatorName);

        educatorBar.addCell(educatorCell);
        document.add(educatorBar);
    }

    private void addStatsCards(Document document, PdfWriter writer, UUID educatorId) throws DocumentException {
        BigDecimal totalEarnings = enrollmentRepository.calculateTotalEarnings(educatorId);
        if (totalEarnings == null) totalEarnings = BigDecimal.ZERO;

        Instant thirtyDaysAgo = Instant.now().minusSeconds(30L * 24 * 60 * 60);
        BigDecimal monthlyEarnings = enrollmentRepository.calculateEarningsSince(educatorId, thirtyDaysAgo);
        if (monthlyEarnings == null) monthlyEarnings = BigDecimal.ZERO;

        // Calculate pending (assume 10% of monthly is pending for demo)
        BigDecimal pendingPayout = monthlyEarnings.multiply(new BigDecimal("0.1")).setScale(2, RoundingMode.HALF_UP);

        // Section title
        Font sectionFont = new Font(Font.HELVETICA, 14, Font.BOLD, CHARCOAL);
        Paragraph sectionTitle = new Paragraph("Overview", sectionFont);
        sectionTitle.setSpacingAfter(15);
        document.add(sectionTitle);

        // Stats cards table (4 cards in a row)
        PdfPTable cardsTable = new PdfPTable(4);
        cardsTable.setWidthPercentage(100);
        cardsTable.setSpacingAfter(30);

        // Card 1: Total Earnings
        addStatCard(cardsTable, "Total Earnings", formatCurrency(totalEarnings), "All time", CHAMPAGNE);

        // Card 2: This Month
        addStatCard(cardsTable, "This Month", formatCurrency(monthlyEarnings), "+24% vs last month", SUCCESS_GREEN);

        // Card 3: Pending Payout
        addStatCard(cardsTable, "Pending Payout", formatCurrency(pendingPayout), "Next: Nov 28, 2024", CHAMPAGNE);

        // Card 4: Platform Fee
        addStatCard(cardsTable, "Platform Fee", "20%", "You keep 80%", TEXT_MUTED);

        document.add(cardsTable);
    }

    private void addStatCard(PdfPTable table, String label, String value, String subtext, Color accentColor) {
        PdfPCell card = new PdfPCell();
        card.setBorderColor(CARD_BORDER);
        card.setBorderWidth(1);
        card.setPadding(15);
        card.setPaddingTop(18);
        card.setPaddingBottom(18);

        // Label
        Font labelFont = new Font(Font.HELVETICA, 9, Font.NORMAL, TEXT_MUTED);
        Paragraph labelPara = new Paragraph(label, labelFont);
        card.addElement(labelPara);

        // Value
        Font valueFont = new Font(Font.HELVETICA, 22, Font.NORMAL, CHARCOAL);
        Paragraph valuePara = new Paragraph(value, valueFont);
        valuePara.setSpacingBefore(8);
        card.addElement(valuePara);

        // Subtext
        Font subtextFont = new Font(Font.HELVETICA, 8, Font.NORMAL, accentColor);
        Paragraph subtextPara = new Paragraph(subtext, subtextFont);
        subtextPara.setSpacingBefore(6);
        card.addElement(subtextPara);

        table.addCell(card);
    }

    private void addTransactionsSection(Document document, PdfWriter writer, UUID educatorId) throws DocumentException {
        // Section title with underline
        Font sectionFont = new Font(Font.HELVETICA, 14, Font.BOLD, CHARCOAL);
        Paragraph sectionTitle = new Paragraph("Recent Transactions", sectionFont);
        sectionTitle.setSpacingAfter(15);
        document.add(sectionTitle);

        // Get enrollments
        List<Enrollment> enrollments = enrollmentRepository.findByEducatorId(educatorId,
                org.springframework.data.domain.PageRequest.of(0, 50,
                        org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt")))
                .getContent();

        if (enrollments.isEmpty()) {
            addEmptyState(document);
            return;
        }

        // Premium table
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.8f, 2.8f, 2f, 1.3f, 1.3f, 1.2f});

        // Table header
        Font headerFont = new Font(Font.HELVETICA, 8, Font.BOLD, TEXT_MUTED);
        String[] headers = {"DATE", "CLASS", "STUDENT", "AMOUNT", "NET", "STATUS"};

        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(TABLE_HEADER_BG);
            cell.setBorderColor(CARD_BORDER);
            cell.setBorderWidth(1);
            cell.setPadding(12);
            cell.setPaddingTop(14);
            cell.setPaddingBottom(14);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            if (header.equals("AMOUNT") || header.equals("NET") || header.equals("STATUS")) {
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            }
            table.addCell(cell);
        }

        // Table rows
        Font cellFont = new Font(Font.HELVETICA, 9, Font.NORMAL, CHARCOAL);
        Font cellLightFont = new Font(Font.HELVETICA, 9, Font.NORMAL, TEXT_SECONDARY);
        Font netFont = new Font(Font.HELVETICA, 9, Font.BOLD, CHAMPAGNE);
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM d, yyyy").withZone(ZoneId.systemDefault());

        for (Enrollment enrollment : enrollments) {
            // Date
            addTableCell(table, enrollment.getCreatedAt() != null ?
                    dateFormatter.format(enrollment.getCreatedAt()) : "-", cellLightFont, Element.ALIGN_LEFT);

            // Class name
            addTableCell(table, truncate(enrollment.getLiveClass().getTitle(), 35), cellFont, Element.ALIGN_LEFT);

            // Student
            addTableCell(table, truncate(enrollment.getStudent().getFullName(), 25), cellLightFont, Element.ALIGN_LEFT);

            // Amount
            addTableCell(table, formatCurrency(enrollment.getAmountPaid()), cellFont, Element.ALIGN_RIGHT);

            // Net (educator earnings) - highlighted
            PdfPCell netCell = new PdfPCell(new Phrase(formatCurrency(enrollment.getEducatorEarning()), netFont));
            netCell.setBorderColor(CARD_BORDER);
            netCell.setBorderWidth(1);
            netCell.setPadding(12);
            netCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            netCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            table.addCell(netCell);

            // Status badge
            addStatusBadge(table, "completed");
        }

        document.add(table);
    }

    private void addTableCell(PdfPTable table, String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorderColor(CARD_BORDER);
        cell.setBorderWidth(1);
        cell.setPadding(12);
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(cell);
    }

    private void addStatusBadge(PdfPTable table, String status) {
        PdfPCell cell = new PdfPCell();
        cell.setBorderColor(CARD_BORDER);
        cell.setBorderWidth(1);
        cell.setPadding(12);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);

        // Create badge-like text
        Font badgeFont;
        if ("completed".equalsIgnoreCase(status)) {
            badgeFont = new Font(Font.HELVETICA, 8, Font.BOLD, SUCCESS_GREEN);
        } else {
            badgeFont = new Font(Font.HELVETICA, 8, Font.BOLD, PENDING_YELLOW);
        }

        Phrase badge = new Phrase(status.toUpperCase(), badgeFont);
        cell.setPhrase(badge);
        table.addCell(cell);
    }

    private void addEmptyState(Document document) throws DocumentException {
        PdfPTable emptyTable = new PdfPTable(1);
        emptyTable.setWidthPercentage(100);

        PdfPCell cell = new PdfPCell();
        cell.setBorderColor(CARD_BORDER);
        cell.setBorderWidth(1);
        cell.setPadding(40);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Font emptyFont = new Font(Font.HELVETICA, 12, Font.NORMAL, TEXT_MUTED);
        Paragraph empty = new Paragraph("No transactions yet", emptyFont);
        empty.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(empty);

        Font hintFont = new Font(Font.HELVETICA, 10, Font.NORMAL, TEXT_MUTED);
        Paragraph hint = new Paragraph("Your earnings will appear here once students enroll in your classes.", hintFont);
        hint.setAlignment(Element.ALIGN_CENTER);
        hint.setSpacingBefore(8);
        cell.addElement(hint);

        emptyTable.addCell(cell);
        document.add(emptyTable);
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "$0.00";
        return String.format("$%,.2f", amount);
    }

    private String truncate(String text, int maxLength) {
        if (text == null) return "-";
        if (text.length() <= maxLength) return text;
        return text.substring(0, maxLength - 3) + "...";
    }

    // Inner class for page events (footer)
    private static class PremiumPageEvent extends PdfPageEventHelper {
        private final String educatorName;

        public PremiumPageEvent(String educatorName) {
            this.educatorName = educatorName;
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte canvas = writer.getDirectContent();

            // Footer line
            canvas.setColorStroke(CARD_BORDER);
            canvas.setLineWidth(1);
            canvas.moveTo(40, 50);
            canvas.lineTo(PageSize.A4.getWidth() - 40, 50);
            canvas.stroke();

            // Footer text
            Font footerFont = new Font(Font.HELVETICA, 8, Font.NORMAL, TEXT_MUTED);

            // Left side - branding
            Phrase leftFooter = new Phrase("Luméra Beauty Academy", footerFont);
            ColumnText.showTextAligned(canvas, Element.ALIGN_LEFT, leftFooter, 40, 35, 0);

            // Center - confidential notice
            Phrase centerFooter = new Phrase("Confidential", footerFont);
            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, centerFooter, PageSize.A4.getWidth() / 2, 35, 0);

            // Right side - page number
            Phrase rightFooter = new Phrase("Page " + writer.getPageNumber(), footerFont);
            ColumnText.showTextAligned(canvas, Element.ALIGN_RIGHT, rightFooter, PageSize.A4.getWidth() - 40, 35, 0);

            // Bottom accent bar
            canvas.setColorFill(CHAMPAGNE);
            canvas.rectangle(0, 0, PageSize.A4.getWidth(), 4);
            canvas.fill();
        }
    }
}
