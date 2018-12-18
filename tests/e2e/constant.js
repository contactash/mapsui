module.exports = new Constant();

function Constant() {

var applicationURL = "http://localhost:9999";
    function getApplicationURL() {
        return applicationURL;
    }

    return {
        getApplicationURL : getApplicationURL
    }

}