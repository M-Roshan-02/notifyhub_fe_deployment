const getFetcher = (url: string) => fetch(url).then(res => res.json());

const postFetcher = async (url: string, body: any) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return res.json();
};

const putFetcher = async (url: string, body: any) => {
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return res.json();
};

const patchFetcher = async (url: string, body: any) => {
    const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return res.json();
};

const deleteFetcher = async (url: string, body: any) => {
    const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return res.json();
};

export { getFetcher, postFetcher, putFetcher, patchFetcher, deleteFetcher };