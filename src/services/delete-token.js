import { dispatchSessionChanged } from "./session-events";

export default function deleteToken() {
    localStorage.removeItem("GST_Token");
    localStorage.removeItem("GST_id")
    dispatchSessionChanged();
}
