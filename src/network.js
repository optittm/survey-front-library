import FingerprintJS from '@fingerprintjs/fingerprintjs'
const axios = require('axios');


class Network {
    constructor(featureUrl, apiUrl = 'http://localhost:8080') {
        this.url = apiUrl + '/api/v1';
        this.featureUrl = featureUrl;
        this.accessToken = null;
        // Initialize fingerprint
        this.fpPromise = FingerprintJS.load({monitoring: false});
    }

    /**
     * Execute the request. If it fails with 401 Unauthorized, fetch an access token and retry.
     * 
     * @param {function} requestPromise Function returning a promise which executes the request
     * @returns the request's result
     */
    async #sendRequestWithOAuth(requestFn, ...args) {
        let retried = false;
        
        const executeRequest = async () => {
            try {
                const response = await requestFn(...args);
                return response;
            } catch(error) {
                if (!retried && error.response.status == 401) {
                    try {
                        const authResponse = await axios.post(this.url + '/authorize', {
                            withCredentials: true,
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json'
                            },
                        });
                        const tokenResponse = await axios.post(this.url + '/token', {
                            grant_type: 'authorization_code',
                            code: authResponse.data.code
                        },
                        {
                            withCredentials: false,
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json'
                            },
                        })
                        this.accessToken = tokenResponse.data.access_token;
                        retried = true;
                        return executeRequest();
                    } catch(error) {
                        throw error;
                    }
                } else {
                    throw error;
                }
            }
        };
        return executeRequest();
    }

    async #checkDisplayPromise() {
        try {
            const result = axios.get(this.url + '/rules', {
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.accessToken
                },
                params: {
                    featureUrl: this.featureUrl
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async #postCommentPromise(rating, comment) {
        try {
            // Get the visitor identifier from fingerprint
            const fp = await this.fpPromise;
            const result = await fp.get();
            const user_fingerprint = result.visitorId;

            var data = {
                rating: rating,
                comment: comment,
                feature_url: this.featureUrl,
                user_id: user_fingerprint
            };

            axios.post(this.url + '/comments', data, {
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.accessToken
                }
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @returns {boolean} represents if the modal needs to be displayed or not.
     */
    async initConfig() {
        try {
            const request = await this.#sendRequestWithOAuth(this.#checkDisplayPromise.bind(this));
            console.log(request)
            return request.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * 
     * @param {number} rating evaluation of the feature for the user
     * @param {string} comment (optional) user's feedback
     */
    async sendUserFeedback(rating, comment = '') {
        try {
            const request = await this.#sendRequestWithOAuth(this.#postCommentPromise.bind(this), rating, comment);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = Network;