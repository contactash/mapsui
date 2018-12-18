describe('Service: mapsUIApp.logger', function () {

    // load the logger's module
    beforeEach(module('mapsUIApp'));

    // instantiate logger
    var logger = {},
        error = {status : "errorStatus"};

    //update the injection
    beforeEach(inject(function (_logger_, _$rootScope_, _syncPersistenceService_) {
        logger = _logger_;
        $rootScope = _$rootScope_;
        syncPersistenceService = _syncPersistenceService_;
    }));

    it('should call the sync persistence add log entry method', function () {
        expect(logger).toBeDefined();
        var addLogEntry = spyOn(syncPersistenceService, 'addLogEntry');
        expect(addLogEntry).not.toHaveBeenCalled();
        logger.addErrorLog(error);
        expect(addLogEntry).toHaveBeenCalled();
    });
});
