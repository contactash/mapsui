describe('Service: mapsUIApp.common', function () {

    // load the commonService's module
    beforeEach(module('mapsUIApp'));

    // instantiate commonService
    var commonService = {};

    //update the injection
    beforeEach(inject(function (_commonService_) {
        commonService = _commonService_;
    }));

     it('should parse the response status and return meaningful status', function () {

        expect(commonService).toBeDefined();
        expect(commonService.parseStatus('Not Available For Offline')).toBe('Not Available');
        expect(commonService.parseStatus('NotAvailableForOffline')).toBe('Not Available');
        expect(commonService.parseStatus('Available For Offline')).toBe('Available');
        expect(commonService.parseStatus('AvailableForOffline')).toBe('Available');
        expect(commonService.parseStatus('SubmittedIncomplete')).toBe('Submitted Incomplete');
        expect(commonService.parseStatus('Returned')).toBe('Submitted Incomplete');

        expect(commonService.parseStatus('Allocated')).toBe('Allocated');
        expect(commonService.parseStatus('Available')).toBe('Available');
        expect(commonService.parseStatus('Downloaded')).toBe('Downloaded');
        expect(commonService.parseStatus('Submitted')).toBe('Submitted');
        expect(commonService.parseStatus('blah blah!!! anything else')).toBe('blah blah!!! anything else');
    });
});
