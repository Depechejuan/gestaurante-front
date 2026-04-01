import { saveStoredSession } from "./auth-storage";

function saveToken(response) {
    saveStoredSession("GST_Token", "GST_id", response.token, response.id);
}
export default saveToken;
