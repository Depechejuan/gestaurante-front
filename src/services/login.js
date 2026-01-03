const host = import.meta.env.VITE_API_HOST;

async function sendLogin(form) {
    const requestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(form)
    }

    try {
        const response = await fetch(`${host}/User/login`, requestInit)
        if (!response.ok) {
            throw new Error("Something Went Wrong")
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

export default sendLogin;