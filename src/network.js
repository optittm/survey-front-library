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
    #sendRequestWithOAuth(requestPromise, ...args) {
        return new Promise((resolve, reject) => {
            let retried = false;
            
            const executePromise = async () => {
                requestPromise(...args)
                .then(resolve)
                .catch(async (error) => {
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
                            executePromise();
                        } catch(error) {
                            reject(error);
                        }
                    } else {
                        reject(error);
                    }
                });
            }
            executePromise();
        })
    }

    #checkDisplayPromise() {
        return new Promise((resolve, reject) => {
            axios.get(this.url + '/rules', {
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.accessToken
                },
                params: {
                    featureUrl: this.featureUrl
                },
            }).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    #postCommentPromise(rating, comment) {
        return new Promise(async (resolve, reject) => {
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
            }).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * 
     * @returns {boolean} represents if the modal need to be displayed or not.
     */
    async initConfig() {
        const request = this.#sendRequestWithOAuth(this.#checkDisplayPromise.bind(this));
        return request.then((response) => {
            return response.data;
        }).catch(error => {
            console.log(error);
        });
    }

    /**
     * 
     * @param {number} rating evaluation of the feature for the user
     * @param {string} comment (optional) user's feedback
     * @returns {boolean} if the request was successful or not
     */
    async sendUserFeedback(rating, comment = '') {
        const request = this.#sendRequestWithOAuth(this.#postCommentPromise.bind(this), rating, comment);
        return request.then(() => {
            return true;
        }).catch(error => {
            console.log(error);
            return false;
        });
    }
}

module.exports = Network;