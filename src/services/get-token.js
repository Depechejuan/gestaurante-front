function getToken() {
    const token = localStorage.getItem("GST_Token");
    const id = localStorage.getItem("GST_id")

    return {
        token,
        id
    }
}
export default getToken;