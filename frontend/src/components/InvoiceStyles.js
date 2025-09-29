import { StyleSheet, Font } from "@react-pdf/renderer";

// ✅ Register DejaVu Sans for ₹ symbol support & better baseline alignment
Font.register({
  family: "DejaVu",
  src: "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37/ttf/DejaVuSans.ttf",
});

const styles = StyleSheet.create({
  // 📄 Page Setup
  page: {
    fontFamily: "DejaVu",
    fontSize: 10,
    backgroundColor: "#ffffff",
    color: "#333",
    padding: 40,
    flexDirection: "column",
    lineHeight: 1.4,
  },

  // 🏷 Header Section
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // aligns brand + invoice title to top
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
  },
  brandText: { marginLeft: 10 },
  brandName: { fontFamily: "DejaVu", fontSize: 14, color: "#008080" },
  brandSlogan: { fontSize: 9, color: "#555" },
  invoiceTitle: {
    fontFamily: "DejaVu",
    fontSize: 28, // ↓ slightly smaller for balance
    color: "#008080",
    letterSpacing: 1,
    marginTop: 5,
  },

  // 🧾 Invoice Info
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoColumn: { width: "48%" },
  infoLabel: { fontSize: 9, color: "#555" },
  infoValue: {
    fontFamily: "DejaVu",
    fontSize: 11,
    color: "#008080",
    marginBottom: 8,
  },

  // 📋 Table Layout
  table: {
    display: "table",
    width: "auto",
    minWidth: "100%",
    backgroundColor: "#fcfcfc", // subtle tint for premium look
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#008080",
    color: "white",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableColHeader: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontFamily: "DejaVu",
    fontSize: 9.5,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableRowAlternate: { backgroundColor: "#f6f6f6" },
  tableCol: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    lineHeight: 1.6,
  },

  // 📏 Column Widths
  colSl: { width: "10%" },
  colDesc: { width: "45%" },
  colPrice: {
    width: "15%",
    textAlign: "right",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexShrink: 0,
    minWidth: 70,
    whiteSpace: "nowrap",
  },
  colQty: {
    width: "15%",
    textAlign: "right",
  },
  colTotal: {
    width: "15%",
    textAlign: "right",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexShrink: 0,
    minWidth: 90,
    whiteSpace: "nowrap",
  },

  // 💰 Totals Section
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  totals: {
    width: "35%",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    boxShadow: "0 1 3 rgba(0, 0, 0, 0.1)",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    alignItems: "center",
  },
  totalsLabel: { fontSize: 10 },
  totalsValue: {
    fontFamily: "DejaVu",
    textAlign: "right",
    lineHeight: 1.6,
    paddingVertical: 2,
  },
  totalLine: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 6,
    paddingTop: 6,
  },
  totalLabel: {
    color: "#006666",
    fontFamily: "DejaVu",
    fontSize: 11,
  },
  totalValue: {
    fontFamily: "DejaVu",
    textAlign: "right",
    lineHeight: 1.6,
    paddingVertical: 2,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },

  // 🧱 Separator Line (Optional)
  separator: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginVertical: 10,
  },

  // 🖋 Footer Section
  footer: {
    marginTop: "auto",
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  terms: { width: "60%" },
  signature: { width: "35%", alignItems: "center" },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 5,
    marginTop: 20,
  },
  signatureText: { fontSize: 9, color: "#555" },
});

export default styles;
