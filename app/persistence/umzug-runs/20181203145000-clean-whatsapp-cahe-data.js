/* eslint-disable no-unused-vars */

// This migration is used to trigger a cache reset after changing the user-agent for Whatsapp.
// WhatsApp cached (via service-worker's cache system) a version of the `index.html` that displays an error
// message because we used a different user-agent than the one expected by WhatsApp: we change the user agent
// and reset the cache.

export default {
  up(query, DataTypes) {
    return null;
  },

  down(query, DataTypes) {
    return null;
  }
};
