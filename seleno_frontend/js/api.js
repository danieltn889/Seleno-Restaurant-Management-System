class ApiClient {
    constructor() {
        this.baseUrl = 'http://localhost:8080/SRMS/seleno_backend/';
        this.token = localStorage.getItem('token');
    }

    async login(email, password) {
        const response = await fetch(this.baseUrl + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    }

    async request(endpoint, method = 'GET', data = null) {
        let url = this.baseUrl + endpoint;
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = 'Bearer ' + this.token;
        }
        const config = {
            method,
            headers
        };
        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        } else if (data && method === 'GET') {
            const params = new URLSearchParams(data);
            url = url + '?' + params.toString();
        }
        const response = await fetch(url, config);
        return await response.json();
    }
}