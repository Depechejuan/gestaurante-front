import { clearStoredSession } from "./auth-storage";

export default function deleteToken() {
    clearStoredSession("GST_Token", "GST_id");
}
