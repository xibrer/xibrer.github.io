/**
 * Self-hosted visitor analytics.
 *
 * Emits one small inline script — no third-party library, no external file
 * request for code. It is only rendered when NEXT_PUBLIC_ANALYTICS_ENDPOINT is
 * set at build time, so the site ships zero analytics code until the Worker in
 * workers/analytics has been deployed and the endpoint configured.
 *
 * Privacy: no cookies, no user id, no fingerprint. Honours DNT and Sec-GPC by
 * simply not sending. The endpoint is also hard-guarded to the production
 * hostname so localhost, previews, and forks never report.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

export default function Analytics() {
  if (!ENDPOINT) return null;

  // Escape only inside the JSON string literal, so a `</script>` in the URL
  // cannot terminate the tag. `\u003c` is valid there and nowhere else.
  const endpointLiteral = JSON.stringify(ENDPOINT).replace(/</g, '\\u003c');

  const script = `
(function () {
  var endpoint = ${endpointLiteral};
  if (!endpoint) return;
  if (location.hostname !== 'xibrer.github.io') return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;

  function send(payload) {
    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        // A text/plain Blob is a CORS-simple request, so no preflight.
        navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
      } else {
        fetch(endpoint, {
          method: 'POST',
          body: body,
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          keepalive: true,
          mode: 'cors'
        }).catch(function () {});
      }
    } catch (e) {}
  }

  send({ t: 'pageview', p: location.pathname });

  // Outbound intent (PDF / DOI / Code) via one delegated listener, so no
  // per-button wiring and it keeps working for links added later.
  document.addEventListener('click', function (event) {
    var node = event.target;
    var link = node && node.closest ? node.closest('a[data-track]') : null;
    if (!link) return;
    send({ t: 'event', e: link.getAttribute('data-track'), p: location.pathname });
  }, true);
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
