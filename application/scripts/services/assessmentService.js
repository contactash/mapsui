function assessmentService($http, $q, jsonToXml, xmlBuilder, jsonHelper, config, $filter, $rootScope, requestService, logger) {

    var userId = $rootScope.loggedInUserObj.userId,
        ipAddress = $rootScope.ipAddress;

    return {
        searchAssessments : searchAssessments
    };

    function addStaffNumberToJson(requestJson, _staffNumber) {
        requestJson["soap:Body"]["uk:MAPSAssessmentMetadataDetailListRequest"]["uk:MAPSAssessmentMetadataDetailListRequestBody"]["uk:AllocatedUserId"] = _staffNumber;
    }

    function addNinoOrCrnToRequestJson(requestJson, _staffNumber) {
        var reqBody = requestJson["soap:Body"]["uk:MAPSAssessmentMetadataDetailListRequest"]["uk:MAPSAssessmentMetadataDetailListRequestBody"],
            isCrn = !isNaN(_staffNumber);
        if (isCrn) {
            reqBody["uk:CRN"] = _staffNumber;
        } else {
            reqBody["uk:NINO"] = _staffNumber;
        }
    }

    function searchAssessments(staffNumber, isClaimantSearch) {

        var now = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss'), // 2015-11-10-T13:11:03
            userToken = $rootScope.loggedInUserObj.token,
            def = $q.defer(),
            _staffNumber = staffNumber.toUpperCase(),
            requestJson = requestService.createRequestToGetAssessments(_staffNumber, now, userId, ipAddress);

        if(isClaimantSearch) {
            addNinoOrCrnToRequestJson(requestJson, _staffNumber)
        } else {
            addStaffNumberToJson(requestJson, _staffNumber);
        }


        var soapBody = jsonToXml.jstoxml(requestJson),
            soapRequest = xmlBuilder.addRequestHeaders(soapBody, userToken),
            SEARCH_ASSESSMENT_URL = config.URL + config.SEARCH_ASSESSMENTS_PATH;

        $http.post(SEARCH_ASSESSMENT_URL, soapRequest, {
            'headers': {
                'SOAPAction': 'http://uk.gov.dwp.maps/getassessmentmetadatadetaillist',
                'Content-Type': 'text/xml; charset=utf-8'
            }}).then(successCallback, errorCallback);

        function successCallback(response) {
            try{
                var responseData = response.data.replace(/(\r\n|\n|\r)/gm, "").replace(/\t/g, ''),
                    xmlDoc = jsonHelper.getXMLDoc(responseData),
                    result = jsonHelper.xmlToJson(xmlDoc),
                    assessmentDLResponse = result.Envelope.Body.MAPSAssessmentMetadataDetailListResponse,
                    mapsAssessmentDetailListBody = assessmentDLResponse.MAPSAssessmentMetadataDetailListResponseBody,
                    DetailListItem = mapsAssessmentDetailListBody.DetailListItem;

                if (DetailListItem) {
                    def.resolve(angular.isArray(DetailListItem) ? DetailListItem : new Array(DetailListItem));
                } else {
                    def.resolve(null);
                }
            } catch(error) {
                var faultString = 'MAPS search service returned an invalid response',
                    operationType = 'Search Assessments';
                logger.addErrorLog(error, faultString, requestJson, operationType, _staffNumber);
                def.reject(error);
            }
        }
        
        function errorCallback(error) {
            var faultString = 'No response from MAPS',
                operationType = 'Search Assessments';
            logger.addErrorLog(error, faultString, requestJson, operationType, _staffNumber);
            def.reject("Failed to get allocations");
        }

        return def.promise;
    }

}

module.exports = assessmentService;
