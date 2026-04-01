import { getStoredSession } from "./auth-storage";

function getToken() {
    return getStoredSession("GST_Token", "GST_id");
}
export default getToken;
