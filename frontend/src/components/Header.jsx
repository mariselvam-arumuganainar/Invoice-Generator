import React from "react";

const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const BellIcon = () => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

function Header() {
  return (
    <header className="header">
      <div className="header-title">
        <h2>Dashboard</h2>
        <p>Morning, Shane. Welcome to your Dashboard.</p>
      </div>
      <div className="header-actions">
        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search transaction, invoices or help"
          />
        </div>
        <button className="icon-btn">
          <BellIcon />
        </button>
        <div className="user-profile">
          <img src="https://i.pravatar.cc/40" alt="User avatar" />
          <span>Shane</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
