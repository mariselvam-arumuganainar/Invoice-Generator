import React, { useState, useEffect, useMemo } from "react";
import api from "./services/api";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
} from "./services/notification";
import InvoiceDocument from "./components/InvoiceDocument";
import ClientManager from "./components/ClientManager";
import ItemManager from "./components/ItemManager";
import InvoiceManager from "./components/InvoiceManager";

const FileTextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const PackageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

function App() {
  const [isClient, setIsClient] = useState(false);
  const [clients, setClients] = useState([]);
  const [itemsCatalog, setItemsCatalog] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [hiringFrom, setHiringFrom] = useState("");
  const [hiringTo, setHiringTo] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([
    {
      catalog_id: "",
      description: "",
      hsn_code: "",
      sqft: "",
      rate: "",
      amount: 0,
    },
  ]);
  const [sgst, setSgst] = useState(9);
  const [cgst, setCgst] = useState(9);
  const [loading, setLoading] = useState(true);
  const [showClientManager, setShowClientManager] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showItemManager, setShowItemManager] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showInvoiceManager, setShowInvoiceManager] = useState(false);
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.body.className = prefersDark ? "dark-theme" : "light-theme";
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [clientsRes, itemsRes, invoicesRes] = await Promise.all([
        api.getClients(),
        api.getItems(),
        api.getInvoices(),
      ]);
      setClients(clientsRes.data);
      setItemsCatalog(itemsRes.data);
      setInvoices(invoicesRes.data);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      notifyError("Could not fetch data. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const totalDays = useMemo(() => {
    if (!hiringFrom || !hiringTo) return 0;
    const diff =
      Math.ceil(
        (new Date(hiringTo) - new Date(hiringFrom)) / (1000 * 60 * 60 * 24)
      ) + 1;
    return diff > 0 ? diff : 0;
  }, [hiringFrom, hiringTo]);
  const subtotal = useMemo(
    () =>
      roundToTwo(
        invoiceItems.reduce(
          (acc, item) => acc + (parseFloat(item.amount) || 0),
          0
        )
      ),
    [invoiceItems]
  );
  const sgstAmount = useMemo(
    () => roundToTwo((subtotal * sgst) / 100),
    [subtotal, sgst]
  );
  const cgstAmount = useMemo(
    () => roundToTwo((subtotal * cgst) / 100),
    [subtotal, cgst]
  );
  const grandTotal = useMemo(
    () => roundToTwo(subtotal + sgstAmount + cgstAmount),
    [subtotal, sgstAmount, cgstAmount]
  );

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;
    const { sqft, rate } = newItems[index];
    if ((field === "sqft" || field === "rate") && sqft && rate && totalDays) {
      newItems[index].amount = roundToTwo(
        parseFloat(sqft) * parseFloat(rate) * totalDays
      );
    }
    setInvoiceItems(newItems);
  };
  const handleCatalogItemSelect = (index, itemId) => {
    const selected = itemsCatalog.find((i) => i.id === parseInt(itemId));
    const newItems = [...invoiceItems];
    if (selected) {
      newItems[index] = {
        ...newItems[index],
        catalog_id: selected.id,
        description: selected.description,
        hsn_code: selected.hsn_code,
        rate: selected.default_rate,
      };
      const { sqft, rate } = newItems[index];
      if (sqft && rate && totalDays) {
        newItems[index].amount = roundToTwo(
          parseFloat(sqft) * parseFloat(rate) * totalDays
        );
      }
    } else {
      newItems[index] = {
        catalog_id: "",
        description: "",
        hsn_code: "",
        sqft: "",
        rate: "",
        amount: 0,
      };
    }
    setInvoiceItems(newItems);
  };
  const addItem = () =>
    setInvoiceItems([
      ...invoiceItems,
      {
        catalog_id: "",
        description: "",
        hsn_code: "",
        sqft: "",
        rate: "",
        amount: 0,
      },
    ]);
  const removeItem = (index) =>
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));

  const handleSaveClient = async (clientData) => {
    try {
      const isEditing = !!editingClient;
      if (isEditing) {
        await api.updateClient(editingClient.id, clientData);
        notifySuccess("Client updated successfully!");
      } else {
        await api.createClient(clientData);
        notifySuccess("Client created successfully!");
      }
      await fetchAllData();
      setShowClientManager(false);
      setEditingClient(null);
    } catch (error) {
      notifyError(
        error.response?.data?.message || "An unknown error occurred."
      );
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await api.deleteClient(clientId);
        await fetchAllData();
        notifySuccess("Client deleted successfully.");
      } catch (error) {
        notifyError(
          error.response?.data?.message || "Failed to delete client."
        );
      }
    }
  };

  const handleSaveItem = async (itemData) => {
    try {
      const isEditing = !!editingItem;
      if (isEditing) {
        await api.updateItem(editingItem.id, itemData);
        notifySuccess("Item updated successfully!");
      } else {
        await api.createItem(itemData);
        notifySuccess("Item created successfully!");
      }
      await fetchAllData();
      setShowItemManager(false);
      setEditingItem(null);
    } catch (error) {
      notifyError(error.response?.data?.message || "Error saving item.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.deleteItem(itemId);
        await fetchAllData();
        notifySuccess("Item deleted successfully.");
      } catch (error) {
        notifyError(error.response?.data?.message || "Failed to delete item.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedClient ||
      invoiceItems.some((item) => !item.description) ||
      !hiringFrom ||
      !hiringTo
    ) {
      notifyInfo("Please fill all required fields before saving.");
      return;
    }
    const invoiceData = {
      client_id: selectedClient.id,
      hiring_start: hiringFrom,
      hiring_end: hiringTo,
      items: invoiceItems.map((item) => ({
        ...item,
        item_description: item.description,
      })),
      sgst_pct: sgst,
      cgst_pct: cgst,
      total_amount: subtotal,
      grand_total: grandTotal,
    };
    try {
      await api.createInvoice(invoiceData);
      await fetchAllData();
      notifySuccess("Invoice created successfully!");
    } catch (error) {
      notifyError(error.response?.data?.message || "Error creating invoice.");
    }
  };

  const dashboardStats = useMemo(
    () => ({
      totalIncome: invoices.reduce(
        (sum, inv) => sum + parseFloat(inv.grand_total),
        0
      ),
      invoiceCount: invoices.length,
      itemsOut: Math.round(invoices.length > 0 ? invoices.length * 2.5 : 0),
    }),
    [invoices]
  );
  const handlePreviewClick = () => {
    if (!selectedClient || invoiceItems.some((item) => !item.description)) {
      notifyInfo(
        "Please select a client and ensure all items have a description."
      );
      return;
    }
    const dataForPdf = {
      client: selectedClient,
      invoiceNumber: "PREVIEW",
      hiringFrom,
      hiringTo,
      items: invoiceItems,
      subtotal,
      sgst,
      cgst,
      sgstAmount,
      cgstAmount,
      grandTotal,
      date: new Date().toLocaleDateString("en-CA"),
    };
    setPdfData(dataForPdf);
  };
  const closePreview = () => {
    setPdfData(null);
  };

  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <header className="app-header">
        <div>
          <h1>Invoice Portal</h1>
          <p>SIVASAKTHI & CO. Scaffolding</p>
        </div>
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title="Toggle Theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </header>
      <main>
        <section className="bento-grid">
          <div className="bento-box box-large">
            <h3>Overall Income</h3>
            <p>
              ₹
              {dashboardStats.totalIncome.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div
            className="bento-box clickable"
            onClick={() => setShowInvoiceManager(true)}
          >
            <div className="box-icon">
              <FileTextIcon />
            </div>
            <h3>Invoices Generated</h3>
            <p>{dashboardStats.invoiceCount}</p>
          </div>
          <div className="bento-box">
            <div className="box-icon">
              <PackageIcon />
            </div>
            <h3>Items on Hire (Est.)</h3>
            <p>{dashboardStats.itemsOut}</p>
          </div>
        </section>
        <section className="invoice-form-section">
          <h2>Create New Invoice</h2>
          <form className="invoice-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>To Address (*)</label>
                <div className="input-with-button">
                  <select
                    value={selectedClient?.id || ""}
                    onChange={(e) =>
                      setSelectedClient(
                        clients.find((c) => c.id === parseInt(e.target.value))
                      )
                    }
                    required
                  >
                    <option value="" disabled>
                      Select a Client
                    </option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="manage-btn"
                    onClick={() => {
                      setEditingClient(null);
                      setShowClientManager(true);
                    }}
                  >
                    Manage
                  </button>
                </div>
                {selectedClient && (
                  <div className="client-details">
                    {selectedClient.address}
                    <br />
                    GSTIN: {selectedClient.gstin}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Hiring From (*)</label>
                <input
                  type="date"
                  value={hiringFrom}
                  onChange={(e) => setHiringFrom(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>To Date (*)</label>
                <input
                  type="date"
                  value={hiringTo}
                  onChange={(e) => setHiringTo(e.target.value)}
                  required
                />
              </div>
              <div className="form-group total-days-display">
                <label>Total Days</label>
                <p>{totalDays}</p>
              </div>
            </div>
            <div className="form-row items-table">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>Items</h3>
                <button
                  type="button"
                  className="manage-btn"
                  onClick={() => {
                    setEditingItem(null);
                    setShowItemManager(true);
                  }}
                >
                  Manage Items
                </button>
              </div>
              {invoiceItems.map((item, index) => (
                <div className="item-row" key={index}>
                  <select
                    className="item-description-select"
                    value={item.catalog_id || ""}
                    onChange={(e) =>
                      handleCatalogItemSelect(index, e.target.value)
                    }
                  >
                    <option value="">Select an item...</option>
                    {itemsCatalog.map((catItem) => (
                      <option key={catItem.id} value={catItem.id}>
                        {catItem.description}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Or type custom description"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="HSN"
                    value={item.hsn_code}
                    onChange={(e) =>
                      handleItemChange(index, "hsn_code", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Sq.Ft (*)"
                    value={item.sqft}
                    onChange={(e) =>
                      handleItemChange(index, "sqft", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Rate (*)"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    readOnly
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(index)}
                  >
                    －
                  </button>
                </div>
              ))}
              <button type="button" className="add-item-btn" onClick={addItem}>
                + Add Custom Item
              </button>
            </div>
            <div className="form-row totals-section">
              <div className="taxes">
                <div className="form-group">
                  <label>SGST (%)</label>
                  <input
                    type="number"
                    value={sgst}
                    onChange={(e) => setSgst(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>CGST (%)</label>
                  <input
                    type="number"
                    value={cgst}
                    onChange={(e) => setCgst(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="summary">
                <p>
                  Subtotal: <span>₹{subtotal.toFixed(2)}</span>
                </p>
                <p>
                  SGST: <span>₹{sgstAmount.toFixed(2)}</span>
                </p>
                <p>
                  CGST: <span>₹{cgstAmount.toFixed(2)}</span>
                </p>
                <hr />
                <h3>
                  Grand Total: <span>₹{grandTotal.toFixed(2)}</span>
                </h3>
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="action-btn preview"
                onClick={handlePreviewClick}
              >
                Preview Invoice
              </button>
              <button type="submit" className="action-btn save">
                Save Invoice
              </button>
            </div>
          </form>
        </section>
        <section className="client-list">
          <h2>Client Directory</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>GSTIN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.gstin}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => {
                        setEditingClient(client);
                        setShowClientManager(true);
                      }}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="client-list">
          <h2>Item Catalog</h2>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>HSN Code</th>
                <th>Default Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {itemsCatalog.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{item.hsn_code}</td>
                  <td>₹{item.default_rate}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowItemManager(true);
                      }}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
      {showClientManager && (
        <ClientManager
          client={editingClient}
          onSave={handleSaveClient}
          onClose={() => setShowClientManager(false)}
        />
      )}
      {showItemManager && (
        <ItemManager
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => setShowItemManager(false)}
        />
      )}
      {isClient && showInvoiceManager && (
        <InvoiceManager
          invoices={invoices}
          onClose={() => setShowInvoiceManager(false)}
        />
      )}
      {isClient && pdfData && (
        <div className="modal-overlay" onClick={closePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePreview}>
              &times;
            </button>
            <h3>Invoice Preview</h3>
            <div className="pdf-viewer-container">
              <PDFViewer width="100%" height="100%">
                <InvoiceDocument invoice={pdfData} />
              </PDFViewer>
            </div>
            <PDFDownloadLink
              document={<InvoiceDocument invoice={pdfData} />}
              fileName={`Invoice-PREVIEW.pdf`}
              className="action-btn download-pdf"
            >
              {({ loading }) => (loading ? "Loading..." : "Download PDF")}
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
