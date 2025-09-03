
// Google Analytics utility functions
export const gtag = (...args) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

// Track page views
export const trackPageView = (url) => {
  const analyticsId = process.env.REACT_APP_GA_ID || 'G-SD5ZWC6C45';
  gtag('config', analyticsId, {
    page_path: url,
  });
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track conversions (bookings, quotes, etc.)
export const trackConversion = (eventName, parameters = {}) => {
  gtag('event', eventName, {
    currency: 'BRL',
    ...parameters,
  });
};

// Track user interactions
export const trackInteraction = (elementName, action = 'click') => {
  gtag('event', action, {
    event_category: 'engagement',
    event_label: elementName,
  });
};

// Track form submissions
export const trackFormSubmission = (formName, success = true) => {
  gtag('event', success ? 'form_submit_success' : 'form_submit_error', {
    event_category: 'form',
    event_label: formName,
  });
};

// Track service selections
export const trackServiceSelection = (serviceName, serviceValue) => {
  gtag('event', 'select_service', {
    event_category: 'service',
    event_label: serviceName,
    value: serviceValue,
  });
};

// Track quote requests
export const trackQuoteRequest = (serviceType, estimatedValue) => {
  gtag('event', 'generate_lead', {
    event_category: 'lead',
    event_label: serviceType,
    value: estimatedValue,
  });
};

// Track booking completions
export const trackBookingCompletion = (serviceType, bookingValue) => {
  gtag('event', 'purchase', {
    event_category: 'booking',
    event_label: serviceType,
    value: bookingValue,
    currency: 'BRL',
  });
};
