const host = import.meta.env.VITE_API_HOST;

export default async function getEmpleados(token) {
    try {
        const response = await fetch(`${host}/admin/getusers`,  {
            method: "POST",
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