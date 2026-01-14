const host = import.meta.env.VITE_API_HOST;

async function sendRegister(form, token) { // añadir TOKEN
    try {
        const response = await fetch(`${host}/admin/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.token}`,
            },
            body: JSON.stringify(form),
        });

        const body = await response.json();
        if (!response.ok) {
            throw new Error("Something Went Wrong");
        }
        return body;
    } catch (err) {
        console.error(err);
    }
}

export default sendRegister;