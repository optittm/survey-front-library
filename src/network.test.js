const Network = require('./network');
const axios = require('axios');


jest.mock('axios');

describe('initConfig', () => {

    it('Init correctly data and get a good answer(need to display the modal)', async () => {
        const network = new Network();
        const data = true; // Represent a configuration when the modal need to be displayed
        axios.get.mockResolvedValue({data});
        return network.initConfig().then(dataReceive => expect(dataReceive).toEqual(true));
    });

    it('Init correctly data and get a bad answer (no need to display the modal)', async () => {
        const network = new Network();
        const data = false; // Represent a configuration when the modal doesn't need to be displayed
        axios.get.mockResolvedValue({data});
        return network.initConfig().then(dataReceive => expect(dataReceive).toEqual(false));
    });

});