import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({
  children,
  onShowClientManager,
  onShowItemManager,
  onShowInvoiceManager,
}) {
  return (
    <div className="layout">
      <Sidebar
        onShowClientManager={onShowClientManager}
        onShowItemManager={onShowItemManager}
        onShowInvoiceManager={onShowInvoiceManager}
      />
      <div className="main-content">
        <Header />
        <main className="main-content-inner">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
