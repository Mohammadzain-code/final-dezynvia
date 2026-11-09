/* =========================================================
   DEZYNVIA — Site configuration
   Edit the values below. This file is loaded on every page
   BEFORE the other scripts. Never put passwords or secret
   API keys here: anything in this file is public.
   ========================================================= */

window.DEZYNVIA_CONFIG = {
  // WhatsApp number in INTERNATIONAL format, digits only (no +, spaces or dashes).
  // Example for a Pakistan number: "923001234567"
  whatsappNumber: "923395518866",

  // Message pre-filled when a visitor opens WhatsApp.
  whatsappMessage: "Hello Dezynvia! I'm interested in your digital services. I'd like to discuss a project.",

  // Contact form endpoint. Plain HTML/JS cannot send email by itself, so use a
  // form service (e.g. Formspree, Web3Forms, Getform) or your own backend.
  // Paste the public endpoint URL they give you, e.g. "https://formspree.io/f/xxxxxxxx".
  // Leave as "" to keep the form in "not configured" mode (it will NOT pretend to send).
  formEndpoint: "",

  // Placeholders shown in the footer and contact page. Replace with real details.
  contact: {
    email: "shahzadaftab8866@yahoo.com",
    phone: "+92339-5518866",
    address: "",        // your office address, if you want to show one
    hours: ""           // e.g. "Mon–Sat, 10:00–18:00"
  },

  // Social profile URLs. Leave "" for any you do not have; empty ones show as "coming soon".
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    behance: "",
    github: ""
  }
};
