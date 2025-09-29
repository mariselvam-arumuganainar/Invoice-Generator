import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import styles from "./InvoiceStyles";

// ✅ Ultra-safe currency formatter (handles hidden symbols like ¹)
const formatCurrency = (value) => {
  try {
    if (value === null || value === undefined) return "0.00";

    // 🔹 Step 1: Convert to string and sanitize
    const cleanString = String(value)
      .normalize("NFKC") // Normalize Unicode (fix hidden symbols)
      .replace(/[^\d.-]/g, ""); // Remove everything except digits, dot, dash

    // 🔹 Step 2: Convert to float
    const number = parseFloat(cleanString);
    if (isNaN(number)) return "0.00";

    // 🔹 Step 3: Round to 2 decimals
    const roundedValue = Math.round(number * 100) / 100;

    // 🔹 Step 4: Format as string with 2 decimals
    const fixed = roundedValue.toFixed(2);
    const [integerPartRaw, decimalPart] = fixed.split(".");

    // 🔹 Step 5: Add comma separators
    let integerPart = integerPartRaw;
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(integerPart)) {
      integerPart = integerPart.replace(rgx, "$1,$2");
    }

    return `${integerPart}.${decimalPart}`;
  } catch (e) {
    console.error("Currency formatting error:", e);
    return "0.00";
  }
};

const InvoiceDocument = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.brandLogo} />
          <View style={styles.brandText}>
            <Text style={styles.brandName}>SIVASAKTHI & CO.</Text>
            <Text style={styles.brandSlogan}>Scaffolding Experts</Text>
          </View>
        </View>
        <Text style={styles.invoiceTitle}>INVOICE</Text>
      </View>

      {/* Invoice Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Invoice No:</Text>
          <Text style={styles.infoValue}>{invoice?.invoiceNumber}</Text>

          <Text style={styles.infoLabel}>Invoice Date:</Text>
          <Text style={styles.infoValue}>{invoice?.date}</Text>
        </View>

        <View style={[styles.infoColumn, { textAlign: "right" }]}>
          <Text style={styles.infoLabel}>Invoice to:</Text>
          <Text style={styles.infoValue}>{invoice?.client?.name}</Text>
          <Text style={{ fontSize: 9, color: "#555" }}>
            {invoice?.client?.address}
          </Text>
          <Text style={{ fontSize: 9, color: "#555" }}>
            GSTIN: {invoice?.client?.gstin}
          </Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableColHeader, styles.colSl]}>SL.</Text>
          <Text style={[styles.tableColHeader, styles.colDesc]}>
            ITEM DESCRIPTION
          </Text>
          <Text style={[styles.tableColHeader, styles.colPrice]}>PRICE</Text>
          <Text style={[styles.tableColHeader, styles.colQty]}>QTY</Text>
          <Text style={[styles.tableColHeader, styles.colTotal]}>TOTAL</Text>
        </View>

        {invoice?.items?.map((item, index) => (
          <View
            style={[
              styles.tableRow,
              index % 2 === 1 && styles.tableRowAlternate,
            ]}
            key={item.id || index}
          >
            <Text style={[styles.tableCol, styles.colSl]}>
              {String(index + 1).padStart(2, "0")}
            </Text>

            <Text style={[styles.tableCol, styles.colDesc]}>
              {item.description}
            </Text>

            <Text style={[styles.tableCol, styles.colPrice]}>
              ₹{formatCurrency(item.rate)}
            </Text>

            <Text style={[styles.tableCol, styles.colQty]}>{item.sqft}</Text>

            <Text style={[styles.tableCol, styles.colTotal]}>
              ₹{formatCurrency(item.amount)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals Section */}
      <View style={styles.totalsContainer}>
        <View style={styles.totals}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Sub Total:</Text>
            <Text style={styles.totalsValue}>
              ₹{formatCurrency(invoice?.subtotal)}
            </Text>
          </View>

          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>SGST ({invoice?.sgst}%):</Text>
            <Text style={styles.totalsValue}>
              ₹{formatCurrency(invoice?.sgstAmount)}
            </Text>
          </View>

          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>CGST ({invoice?.cgst}%):</Text>
            <Text style={styles.totalsValue}>
              ₹{formatCurrency(invoice?.cgstAmount)}
            </Text>
          </View>

          <View style={[styles.totalsRow, styles.totalLine]}>
            <Text style={[styles.totalsLabel, styles.totalLabel]}>Total:</Text>
            <Text style={[styles.totalsValue, styles.totalValue]}>
              ₹{formatCurrency(invoice?.grandTotal)}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.terms}>
          <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 5 }}>
            Terms & conditions
          </Text>
          <Text style={{ fontSize: 8 }}>
            Payment is due within 30 days. Thank you for your business.
          </Text>
        </View>

        <View style={styles.signature}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Authorised Signature</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoiceDocument;
