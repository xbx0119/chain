const network = require('./modules/network');


const app = {

    start: function() {
        network.start();
    }

}

module.exports = app;
