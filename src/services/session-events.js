export const SESSION_CHANGED_EVENT = "gst:session-changed";

export function dispatchSessionChanged() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(SESSION_CHANGED_EVENT));
}
