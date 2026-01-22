const host = import.meta.env.VITE_API_HOST;

export default async function getEmpleado(id, token) {
    try {
        const response = await fetch(`${host}/admin/user/${id}`,  {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Something Went Wrong");
        }
        const data = await response.json()
        return data.data;
    } catch (err) {
        console.log(err);
    }
}