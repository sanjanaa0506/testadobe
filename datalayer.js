window.digitalData = {
 
  // ---------- PAGE INFO ----------
  page: {
    pageName: "homepage",              // Unique, readable page name
    pageType: "home",                  // e.g. home, category, product, cart, checkout
    pageURL: window.location.href,     // Full URL of the current page
    referringURL: document.referrer,   // Previous page URL
    language: "en-US",
    siteSection: "homepage",           // Top-level section/category of site
    breadcrumb: "Home"
  },
 
  // ---------- USER INFO ----------
  user: {
    loginStatus: "logged out",         // "logged in" / "logged out"
    userID: "",                        // Populate only if logged in (hashed/anonymized ID, not PII)
    userType: "guest",                 // guest, member, subscriber, etc.
    membershipTier: ""                 // e.g. "gold", "free" — if applicable
  },
 
  // ---------- PRODUCT INFO (only on product pages) ----------
  product: [
    {
      productID: "",
      productName: "",
      category: "",
      price: "",
      currency: "USD",
      inStock: true
    }
  ],
 
  // ---------- CART INFO (only on cart/checkout pages) ----------
  cart: {
    cartID: "",
    cartTotal: "",
    currency: "USD",
    items: []
  },
 
  // ---------- EVENT INFO (used for tracking specific actions) ----------
  event: {
    eventName: "",     // e.g. "addToCart", "formSubmit", "videoPlay"
    eventType: ""       // e.g. "interaction", "conversion"
  }
 
};
