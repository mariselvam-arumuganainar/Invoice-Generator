import React, { useState, useEffect } from "react";

function ItemManager({ item, onSave, onClose }) {
  const [formData, setFormData] = useState({
    description: "",
    hsn_code: "",
    default_rate: "",
  });
  const isEditing = !!item;

  useEffect(() => {
    if (isEditing) {
      setFormData(item);
    }
  }, [item, isEditing]);

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
        <h3>{isEditing ? "Edit Item" : "Add New Item"}</h3>
        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-group">
            <label>Item Description (*)</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>HSN Code</label>
            <input
              type="text"
              name="hsn_code"
              value={formData.hsn_code}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Default Rate (*)</label>
            <input
              type="number"
              name="default_rate"
              value={formData.default_rate}
              onChange={handleChange}
              required
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
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemManager;
