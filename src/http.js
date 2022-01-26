export default {
    async get(url) {
        let res = await fetch(url, {
            credentials: 'include'
        })
        let data = await res.json();
        return Promise.resolve(data)
    },

    async post(url, body) {
        let res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            credentials: 'include'
        })
        let data = await res.json();
        return Promise.resolve(data)
    },

    async put(url, body) {
        let res = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(body),
            credentials: 'include'
        });
        let data = await res.json();
        return Promise.resolve(data)
    },

    async delete(url) {
        await fetch(url, {
            method: "DELETE",
            credentials: 'include'
        });
        return Promise.resolve();
    }
};
