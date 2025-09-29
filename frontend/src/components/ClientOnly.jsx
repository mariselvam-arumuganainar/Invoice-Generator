import React, { useState, useEffect } from "react";

/**
 * This wrapper component ensures its children are only rendered on the client side.
 * This is a standard and reliable workaround for libraries like react-pdf that
 * can have issues with Server-Side Rendering or React's Strict Mode.
 */
function ClientOnly({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    setIsClient(true);
  }, []);

  // If we are on the server or during the initial render, return null.
  // Otherwise, render the children.
  return isClient ? <>{children}</> : null;
}

export default ClientOnly;
