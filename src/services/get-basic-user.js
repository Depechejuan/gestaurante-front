const host = import.meta.env.VITE_API_HOST;

export default async function getBasicUser(token) {
    try {
        const obj = {"id": token.id}
        const bearer = `Bearer ${token.token}`
        const response = await fetch(`${host}/Admin/getbasicuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${bearer}`
            },
            body: JSON.stringify(obj)
        });
        if (!response.ok) {
            throw new Error("Something Went Wrong");
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}