/**
 * tldraw license keys are validated in the browser and are safe to ship to the client.
 * Keep a source fallback so production still works if Vercel mangles `+` in env vars.
 */
const FALLBACK_TLDRAW_LICENSE_KEY =
  "tldraw-2026-11-23/WyIyb212ZDlKWiIsWyIqIl0sMTYsIjIwMjYtMTEtMjMiXQ.Zf9ndrPwOG/gS9HBu7T37VGleslMD01lw1CRBbG8ApZ1wxJZ+IAIwi+mI31ruep8xikVbY/WVQv00gLsYT8hrQ";

export function getTldrawLicenseKey(explicit?: string) {
  const raw =
    explicit?.trim() ||
    process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY?.trim() ||
    process.env.TLDRAW_LICENSE_KEY?.trim() ||
    FALLBACK_TLDRAW_LICENSE_KEY;

  // Some hosts turn `+` into a space when storing env values.
  return raw.replace(/ /g, "+");
}
