function deAllocationService($http, $q, jsonToXml, xmlBuilder, jsonHelper, config, $filter, $rootScope, requestService, logger) {
    "use strict";

    var userId = $rootScope.loggedInUserObj.userId,
        ipAddress = $rootScope.ipAddress;

    return {
        allocations: [],
        deAllocate: deAllocate
    };

    function createSoapRequest(assessment) {
        var now = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss'), // 2015-11-10-T13:11:03
            requestJson = requestService.deallocateAssessment(assessment, userId, ipAddress, now),
            userToken = $rootScope.loggedInUserObj.token,
            soapBody = jsonToXml.jstoxml(requestJson);

        return xmlBuilder.addRequestHeaders(soapBody, userToken);
    }

    function deAllocate(assessments){

        var promises = [];
        angular.forEach(assessments , function(assessment) {

            var def = $q.defer(),
                soapRequest = createSoapRequest(assessment),
                DEALLOCATE_URL = config.URL + config.DEALLOCATE_ALLOCATIONS_PATH;

            $http.post(DEALLOCATE_URL, soapRequest, {
                'headers': {
                    'SOAPAction': 'http://uk.gov.dwp.maps/deallocate/MAPSDeallocate',
                    'Content-Type': 'text/xml; charset=utf-8'
                }}).then(successCallback, errorCallback);

            function processResponse(response) {
                try {
                    var responseData = response.data.replace(/(\r\n|\n|\r)/gm, "").replace(/\t/g, ''),
                        xmlDoc = jsonHelper.getXMLDoc(responseData),
                        result = jsonHelper.xmlToJson(xmlDoc),
                        mapsDeallocateUserResponse = result.Envelope.Body.MAPSDeallocateUserResponse,
                        MAPSOpsResponseHeader = mapsDeallocateUserResponse.MAPSOpsResponseHeader,
                        ResponseStatus = MAPSOpsResponseHeader.ResponseStatus["#text"],
                        ClientRequestId = MAPSOpsResponseHeader.RequestHeader.ClientRequestId["#text"];
                    return {
                        ResponseStatus : ResponseStatus,
                        ClientRequestId : ClientRequestId,
                        mapsDeallocateUserResponse : mapsDeallocateUserResponse
                    };
                } catch (error) {
                    var faultString = 'MAPS de-allocation service invalid response',
                        operationType = 'De-Allocation';
                    logger.addErrorLog(error, faultString, assessment, operationType);
                    def.reject(response);
                }
            }

            function successCallback(response){
                try{
                    var __ret = processResponse(response),
                        ResponseStatus = __ret.ResponseStatus,
                        ClientRequestId = __ret.ClientRequestId;
                    def.resolve({
                        ResponseStatus : ResponseStatus,
                        ClientRequestId : ClientRequestId,
                        FaultCode : null
                    });
                } catch(error) {
                    var faultString = 'MAPS de-allocation service error processing response',
                        operationType = 'De-Allocation';
                    logger.addErrorLog(error, faultString, assessment, operationType);
                    def.reject(response);
                }
            }

            function errorCallback(response){
                var faultString = 'MAPS de-allocation service returned soap fault',
                    operationType = 'De-Allocation';
                try {
                    var __ret = processResponse(response),
                        ResponseStatus = __ret.ResponseStatus,
                        ClientRequestId = __ret.ClientRequestId,
                        mapsResponseFault = __ret.mapsDeallocateUserResponse.MAPSResponseFault,
                        faultResponseCode = mapsResponseFault.FaultItem.FaultCode["#text"];
                    def.resolve({
                        ResponseStatus : ResponseStatus,
                        ClientRequestId : ClientRequestId,
                        FaultCode : faultResponseCode
                    });
                    logger.addErrorLog(response, faultString, assessment, operationType);
                } catch (error) {
                    faultString = 'MAPS de-allocation service error processing soap fault';
                    logger.addErrorLog(error, faultString, assessment, operationType);
                    def.reject(response);
                }

            }
            promises.push(def.promise);
        });
        return $q.all(promises);
    }

}

module.exports = deAllocationService;