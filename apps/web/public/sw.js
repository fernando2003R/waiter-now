// Minimal Service Worker for PWA enablement
self.addEventListener('install', (event) => {
  // Activate immediately after installation
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of uncontrolled clients as soon as possible
  self.clients.claim();
});

// Pass-through fetch; extend later for caching strategies if needed
self.addEventListener('fetch', () => {
  // No-op: default network behavior
});