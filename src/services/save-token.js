import { dispatchSessionChanged } from "./session-events";

function saveToken(response) {
    const token = response.token;
    const id = response.id;
    localStorage.setItem("GST_Token", token)
    localStorage.setItem("GST_id", id)
    dispatchSessionChanged();
}
export default saveToken;
