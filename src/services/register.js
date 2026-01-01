const host = import.meta.env.VITE_API_HOST;

async function register(post) { // añadir TOKEN
    try {
        const response = await fetch(`${host}/admin/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Authorization: token,
            },
            body: JSON.stringify(post),
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

export default register;