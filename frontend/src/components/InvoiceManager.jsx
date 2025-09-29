import React, { useState } from "react";
import api from "../services/api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceDocument from "./InvoiceDocument";

const InvoiceRow = ({ invoice }) => {
  const [isPreparing, setIsPreparing] = useState(false);
  const [invoiceForDownload, setInvoiceForDownload] = useState(null);

  const handleDownload = async () => {
    setIsPreparing(true);
    try {
      const response = await api.getInvoiceById(invoice.id);
      setInvoiceForDownload(response.data); // Set the data, which will trigger the PDFDownloadLink to render
    } catch (error) {
      alert("Failed to fetch invoice details for download.");
      console.error(error);
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <tr>
      <td>{invoice.invoice_number}</td>
      <td>{invoice.client_name}</td>
      <td>{new Date(invoice.date_created).toLocaleDateString()}</td>
      <td className="amount-cell">
        ₹{parseFloat(invoice.grand_total).toLocaleString("en-IN")}
      </td>
      <td className="actions-cell">
        {!invoiceForDownload ? (
          <button
            className="download-btn"
            onClick={handleDownload}
            disabled={isPreparing}
          >
            {isPreparing ? "Loading..." : "Download"}
          </button>
        ) : (
          <PDFDownloadLink
            document={<InvoiceDocument invoice={invoiceForDownload} />}
            fileName={`Invoice-${invoiceForDownload.invoice_number}.pdf`}
            className="download-btn"
          >
            {({ loading }) => (loading ? "Preparing..." : "Click to Save")}
          </PDFDownloadLink>
        )}
      </td>
    </tr>
  );
};

function InvoiceManager({ invoices, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content wide-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Invoice Management</h2>
        <div className="table-container">
          <table className="invoice-management-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client Name</th>
                <th>Date Created</th>
                <th className="amount-cell">Amount</th>
                <th className="actions-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((inv) => <InvoiceRow key={inv.id} invoice={inv} />)
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InvoiceManager;
