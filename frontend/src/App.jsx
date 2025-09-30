import React, { useState, useEffect, useMemo } from "react";
import api from "./services/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
} from "./services/notification";
import Layout from "./components/Layout";
import ClientManager from "./components/ClientManager";
import ItemManager from "./components/ItemManager";
import InvoiceManager from "./components/InvoiceManager";

const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

function App() {
  const [clients, setClients] = useState([]);
  const [itemsCatalog, setItemsCatalog] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClientManager, setShowClientManager] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showItemManager, setShowItemManager] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showInvoiceManager, setShowInvoiceManager] = useState(false);

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

  const handleSaveItem = async (itemData) => {
    try {
      const isEditing = !!editingItem;
      if (isEditing) {
        await api.updateItem(editingItem.id, itemData);
        notifySuccess("Item updated successfully!");
      } else {
        await api.createItem(itemData);
        message = "Item created successfully!";
      }
      await fetchAllData();
      setShowItemManager(false);
      setEditingItem(null);
    } catch (error) {
      notifyError(error.response?.data?.message || "Error saving item.");
    }
  };

  const dashboardStats = useMemo(
    () => ({
      totalIncome: invoices.reduce(
        (sum, inv) => sum + parseFloat(inv.grand_total || 0),
        0
      ),
      invoiceCount: invoices.length,
      clientCount: clients.length,
    }),
    [invoices, clients]
  );

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Layout
        onShowClientManager={() => {
          setEditingClient(null);
          setShowClientManager(true);
        }}
        onShowItemManager={() => {
          setEditingItem(null);
          setShowItemManager(true);
        }}
        onShowInvoiceManager={() => setShowInvoiceManager(true)}
      >
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Revenue</h3>
            <p>₹{dashboardStats.totalIncome.toLocaleString("en-IN")}</p>
          </div>
          <div className="stat-card">
            <h3>Invoices</h3>
            <p>{dashboardStats.invoiceCount}</p>
          </div>
          <div className="stat-card">
            <h3>Clients</h3>
            <p>{dashboardStats.clientCount}</p>
          </div>
          <div className="stat-card">
            <h3>Avg. Price</h3>
            <p>
              ₹
              {dashboardStats.invoiceCount > 0
                ? (
                    dashboardStats.totalIncome / dashboardStats.invoiceCount
                  ).toLocaleString("en-IN", { maximumFractionDigits: 0 })
                : 0}
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <div className="table-header">
            <h3>Recent Invoices</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoice_number}</td>
                  <td>{inv.client_name}</td>
                  <td>{new Date(inv.date_created).toLocaleDateString()}</td>
                  <td>
                    ₹{parseFloat(inv.grand_total).toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className="status-badge success">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>

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
      {showInvoiceManager && (
        <InvoiceManager
          invoices={invoices}
          onClose={() => setShowInvoiceManager(false)}
        />
      )}
    </>
  );
}

export default App;
