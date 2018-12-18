function allocationService($http, $q, jsonToXml, xmlBuilder, jsonHelper, config, $filter, $rootScope, requestService, logger){
    "use strict";

    var userId = $rootScope.loggedInUserObj.userId,
        ipAddress = $rootScope.ipAddress;

    return {
        claimants: [],
        allocate: allocate
    };

    function createSoapRequest(allocation) {
        var staffNumber = $rootScope.staffNumber,
            now = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss'), // 2015-11-10-T13:11:03
            userToken = $rootScope.loggedInUserObj.token,
            requestJson = requestService.allocateAssessment(allocation, userId, ipAddress, now, staffNumber),
            soapBody = jsonToXml.jstoxml(requestJson);

        return xmlBuilder.addRequestHeaders(soapBody, userToken);
    }

    function allocate(allocations){

        var promises = [];

        angular.forEach(allocations , function(allocation) {
            var def = $q.defer(),
                soapRequest = createSoapRequest(allocation),
                ALLOCATE_ASSESSMENT_URL = config.URL + config.ALLOCATE_ASSESSMENT_PATH;

            $http.post(ALLOCATE_ASSESSMENT_URL, soapRequest, {
                'headers': {
                    'SOAPAction': 'http://uk.gov.dwp.maps/allocate/MAPSAllocate',
                    'Content-Type': 'text/xml; charset=utf-8'
                }}).then(successCallback, errorCallback);

            function processResponse(response) {
                try {
                    var responseData = response.data.replace(/(\r\n|\n|\r)/gm, "").replace(/\t/g, ''),
                        xmlDoc = jsonHelper.getXMLDoc(responseData),
                        result = jsonHelper.xmlToJson(xmlDoc),
                        MAPSAllocateUserResponse = result.Envelope.Body.MAPSAllocateUserResponse,
                        MAPSOpsResponseHeader = MAPSAllocateUserResponse.MAPSOpsResponseHeader,
                        ResponseStatus = MAPSOpsResponseHeader.ResponseStatus["#text"],
                        ClientRequestId = MAPSOpsResponseHeader.RequestHeader.ClientRequestId["#text"];
                
                    return {
                        ResponseStatus : ResponseStatus,
                        ClientRequestId : ClientRequestId,
                        MAPSAllocateUserResponse : MAPSAllocateUserResponse
                    };
                
                } catch (error) {
                    var faultString = 'MAPS Allocation service invalid response',
                        operationType = 'Allocation';
                    logger.addErrorLog(error, faultString, allocation, operationType);
                    def.reject(response);

                }
            }

            function successCallback(response){
                try{
                    var __ret = processResponse(response),
                        ResponseStatus =  __ret.ResponseStatus,
                        ClientRequestId = __ret.ClientRequestId;

                    def.resolve({
                        ResponseStatus : ResponseStatus,
                        ClientRequestId : ClientRequestId,
                        FaultCode : null
                    });

                } catch(error) {
                    var faultString = 'MAPS Allocation service error processing response',
                        operationType = 'Allocation';
                    logger.addErrorLog(error, faultString, allocation, operationType);
                    def.reject("Failed to allocate "+ error);
                }
            }


            function errorCallback(response){
                var faultString = 'MAPS de-allocation service returned soap fault',
                    operationType = 'Allocation';

                try{
                    var __ret = processResponse(response),
                        ResponseStatus =  __ret.ResponseStatus,
                        ClientRequestId = __ret.ClientRequestId,
                        MAPSResponseFault = __ret.MAPSAllocateUserResponse.MAPSResponseFault,
                        FaultCode = MAPSResponseFault.FaultItem.FaultCode["#text"];

                    def.resolve({
                        ResponseStatus : ResponseStatus,
                        ClientRequestId : ClientRequestId,
                        FaultCode : FaultCode
                    });
                    logger.addErrorLog(response, faultString, allocation, operationType);

                } catch(error) {
                    faultString = 'MAPS Allocation service error processing response';
                    logger.addErrorLog(error, faultString, allocation, operationType);
                    def.reject("Failed to allocate "+ error);
                }
            }
      
            promises.push(def.promise);
        });
        return $q.all(promises);
    }

}

module.exports = allocationService;