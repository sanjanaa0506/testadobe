/**
 * Picasoo & Threads — Data Layer
 * Custom-built for the art commission site (github.io/testadobe)
 * Feeds into Adobe Web SDK (alloy.js) -> XDM -> Adobe Analytics + Target
 */

window.digitalData = {

  // ---------- PAGE INFO ----------
  page: {
    pageName: "homepage",                // e.g. "homepage", "gallery", "faq", "commission-form"
    pageType: "home",                    // home, gallery, service-detail, faq, contact, confirmation
    siteSection: "homepage",             // homepage, gallery, process, about, contact
    breadcrumb: "Home",
    language: "en-US",
    referringURL: document.referrer || "",
    errorCode: ""                        // populate only if a page/form error occurs
  },

  // ---------- USER INFO ----------
  user: {
    loginStatus: "guest",                // guest, returning, commissioner
    userType: "visitor",                 // visitor, prospective-client, past-client
    visitCount: ""                       // populate from a cookie/localStorage if you track repeat visits
  },

  // ---------- SERVICE INFO (replaces retail "product") ----------
  // Populate when a visitor is viewing/interacting with a specific service card
  service: {
    serviceName: "",       // "Hand Portraits" | "Textile & Thread Work" | "Fine-Art Prints"
    serviceCategory: "",   // "portrait" | "textile" | "print"
    ctaLocation: ""        // "hero" | "nav" | "mid-page" | "footer"
  },

  // ---------- COMMISSION INFO (replaces retail "cart") ----------
  // Populate on the "Start a commission" / "Commission a piece" flow
  commission: {
    commissionID: "",
    stage: "",             // "inquiry" | "sketch-review" | "approved" | "in-progress"
    estimatedValue: "",
    currency: "USD"
  },

  // ---------- TESTIMONIAL / SOCIAL PROOF ----------
  testimonial: {
    testimonialShown: "",  // e.g. "Reva K. — memory portrait"
    testimonialPosition: ""
  },

  // ---------- FAQ INTERACTION ----------
  faq: {
    questionText: "",      // which FAQ item was expanded
    faqIndex: ""
  },

  // ---------- EVENT INFO ----------
  event: {
    eventName: "",         // "commissionCTAClick" | "serviceCardView" | "faqExpand" | "formSubmit" | "formError"
    eventType: ""          // "interaction" | "conversion" | "error"
  }

};

/**
 * ---------- HELPER: push/update events cleanly ----------
 * Use this instead of mutating window.digitalData.event directly everywhere,
 * so every event push is consistent before you call alloy("sendEvent", ...).
 */
window.trackDLEvent = function (eventName, eventType, extra) {
  window.digitalData.event.eventName = eventName;
  window.digitalData.event.eventType = eventType;

  if (extra && typeof extra === "object") {
    Object.keys(extra).forEach(function (key) {
      if (window.digitalData[key]) {
        Object.assign(window.digitalData[key], extra[key]);
      }
    });
  }

  // Example hook point for your Web SDK call:
  // if (window.alloy) {
  //   window.alloy("sendEvent", { xdm: buildXdmFromDataLayer() });
  // }
};

/**
 * ---------- EXAMPLE USAGE ----------
 *
 * On a service card click:
 * window.trackDLEvent("serviceCardView", "interaction", {
 *   service: { serviceName: "Hand Portraits", serviceCategory: "portrait", ctaLocation: "mid-page" }
 * });
 *
 * On FAQ expand:
 * window.trackDLEvent("faqExpand", "interaction", {
 *   faq: { questionText: "How long does a commission take?", faqIndex: "1" }
 * });
 *
 * On "Start a commission" CTA click:
 * window.trackDLEvent("commissionCTAClick", "interaction", {
 *   commission: { stage: "inquiry" }
 * });
 */
