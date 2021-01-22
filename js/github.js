window.turnonio = (function () {

    const org = 'Turnonio';
    const repo = 'bookmarks';

    function fetchPage(token) {
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
                    localStorage.setItem('githubPagesAuth', token);
                    response.json()
                        .then(function (json) { // 5
                            const content = json.encoding === 'base64' ? atob(json.content) : json.content;
                            document.body.innerHTML = content;
                            document.querySelectorAll(".reload_script").forEach(scriptElm => {
                                console.log("Append Scripts from loaded side");
                                let newScriptElement = document.createElement("script");
                                newScriptElement.src = scriptElm.src;
                                document.head.appendChild(newScriptElement);
                            });
                        });
                }
            });

        return false;
    }

    function _onSubmit(form) {
        const login = form.username || form.querySelector('#login').value;
        const password = form.token || form.querySelector('#password').value;

        const token = btoa(`${login}:${password}`);
        return fetchPage(token);
    }

    let existingToken = localStorage.getItem('githubPagesAuth');
    if (existingToken) {
        fetchPage(existingToken);
    }

    return {
        onSubmit: _onSubmit
    }

})();
