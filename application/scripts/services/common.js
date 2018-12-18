function commonService() {

    return {
        parseStatus : parseStatus
    };

    function parseStatus(state) {

        var status = {};
        status['Not Available For Offline'] = 'Not Available';
        status['NotAvailableForOffline'] = 'Not Available';
        status['Available For Offline'] = 'Available';
        status['AvailableForOffline'] = 'Available';
        status['SubmittedIncomplete'] = 'Submitted Incomplete';
        status['Returned'] = 'Submitted Incomplete';

        if (status.hasOwnProperty(state)) {
            return status[state];
        } else {
            return state;
        }
    }
}

module.exports = commonService;