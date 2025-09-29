import React, { useState, useEffect } from "react";

function ClientManager({ client, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gstin: "",
  });
  const isEditing = !!client;

  useEffect(() => {
    if (isEditing) {
      setFormData(client);
    }
  }, [client, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content client-manager-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h3>{isEditing ? "Edit Client" : "Add New Client"}</h3>
        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-group">
            <label>Client Name (*)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address (*)</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Party's GSTIN No. (*)</label>
            <input
              type="text"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              required
              maxLength="15"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="action-btn preview"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="action-btn save">
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientManager;
