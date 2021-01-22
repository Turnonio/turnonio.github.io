const org = 'Turnonio';
const repo = 'bookmarks';

function onSubmit(form) {
    const login = form.username || form.querySelector('#login').value;
    const password = form.token || form.querySelector('#password').value;

    const token = btoa(`${login}:${password}`);
    const request = new Request(
        `https://api.github.com/repos/${org}/${repo}/contents/src/overview.html`,
        {
            method: 'GET',
            credentials: 'omit',
            headers: {
                Accept: 'application/json',
                Authorization: `Basic ${token}`
            },
        });

    fetch(request)
        .then(function (response) {
            if (response.status !== 200) { // 4
                document.querySelector('#loginForm').innerHTML = `Failed to load document (status: ${response.status})`;
            } else {
                response.json()
                    .then(function (json) { // 5
                        const content = json.encoding === 'base64' ? atob(json.content) : json.content;
                        document.body.innerHTML = content;
                    });
            }
        });

    return false;
}
