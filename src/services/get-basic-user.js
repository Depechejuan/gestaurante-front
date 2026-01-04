const host = import.meta.env.VITE_API_HOST;

export default async function getBasicUser(token) {
    try {
        const obj = {id: token.id}
        console.log(obj);
        const response = await fetch(`${host}/admin/getbasicuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(obj)
        });
        if (!response.ok) {
            throw new Error("Something Went Wrong");
        }

        const data = await response.json()
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}