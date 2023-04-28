const axios = require('axios');


class Network {
    constructor(featureUrl, apiUrl = 'http://localhost:8080') {
        this.url = apiUrl + '/api/v1';
        this.featureUrl = featureUrl
    }

    /**
     * 
     * @returns {boolean} represents if the modal need to be displayed or not.
     */
    async initConfig() {
        const response = await axios.get(this.url + '/rules', {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            params: {
                featureUrl: this.featureUrl
            },
        });
        return response.data;
    }

    /**
     * 
     * @param {number} rating apprehension of the feature for the user
     * @param {string} comment (optional) user's feedback
     */
    sendUserFeedback(rating, comment = '') {
        var data = {
            rating: rating,
            comment: comment,
            feature_url: this.featureUrl
        };
        console.log(comment)
        console.log(data.description)
        axios.post(this.url + '/comments', data, {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }).catch(error => {
                console.log(error);
        });
    }
}

module.exports = Network;