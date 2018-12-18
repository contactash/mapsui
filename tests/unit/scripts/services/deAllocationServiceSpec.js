describe('Service: app.deAllocationService', function () {

    // load the deAllocationService's module
    beforeEach(module('mapsUIApp'));

    // instantiate deAllocationService
    var deAllocationService,  $httpBackend, result ,

        expectedUrl = "http://localhost:8080/mapsmock/mockMAPSAllocateDeallocateUserBinding",
        assessments = [{"AssessmentId":{"#text":"AA111111A"},"LocalAssessmentId":{"#text":"?"},"AlternateLocalAssessmentId":{"#text":"?"},"AssessmentProviderLotId":{"#text":"1"},"#comment":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"CRN":{"#text":"AA111111A"},"AssessmentType":{"#text":"?"},"AssessmentEdition":{"#text":"?"},"ChangeOfCircsOccurred":{"#text":"?"},"CreatedDateTime":{"#text":"?"},"State":{"#text":"Submitted"},"StateDateTime":{"#text":"?"},"assessmentId":"AA111111A","state":"Submitted","ninoOrCrn":"AA111111A","selected":true,"$$hashKey":"object:119"}],

        response =
            '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:uk="http://uk.gov.dwp.maps">\n   <soap:Header/>\n   <soap:Body>\n      <uk:MAPSDeallocateUserResponse>\n         <uk:MAPSOpsResponseHeader>\n            <uk:RequestHeader>\n               <uk:ClientRequestId>DA111111A</uk:ClientRequestId>\n               <uk:UserId>?</uk:UserId>\n               <uk:Benefit>?</uk:Benefit>\n               <uk:Operation>?</uk:Operation>\n               <uk:IPAddress>?</uk:IPAddress>\n               <uk:HostName>?</uk:HostName>\n               <uk:RequestDateTime>?</uk:RequestDateTime>\n            </uk:RequestHeader>\n            <uk:ResponseStatus>De Allocated</uk:ResponseStatus>\n         </uk:MAPSOpsResponseHeader>\n      </uk:MAPSDeallocateUserResponse>\n   </soap:Body>\n</soap:Envelope>',

        faultResponse_9005 = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Body><MAPSDeallocateUserResponse xmlns="http://uk.gov.dwp.maps"><MAPSOpsResponseHeader><RequestHeader><ClientRequestId>AA111111C</ClientRequestId><UserId>tester</UserId><Benefit>PIP</Benefit><Operation>Deallocate</Operation><IPAddress>1.1.1.1</IPAddress><HostName>test</HostName><RequestDateTime>2015-10-08T15:00:00.000</RequestDateTime></RequestHeader><ResponseStatus>500</ResponseStatus></MAPSOpsResponseHeader><MAPSResponseFault><FaultItem><FaultCode>9005</FaultCode><FaultString>Deallocate request failed</FaultString><FaultActor>Dellocate User Flow</FaultActor><FaultDetail><![CDATA[Assessment state is invalid<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:uk="http://uk.gov.dwp.maps">   <soap:Header/>   <soap:Body>  <uk:MAPSDeallocateUserRequest> <uk:MAPSOpsRequestHeader><uk:ClientRequestId>123</uk:ClientRequestId><uk:UserId>tester</uk:UserId><uk:Benefit>PIP</uk:Benefit><uk:Operation>Deallocate</uk:Operation><uk:IPAddress>1.1.1.1</uk:IPAddress><uk:HostName>test</uk:HostName><uk:RequestDateTime>2015-10-08T15:00:00.000</uk:RequestDateTime> </uk:MAPSOpsRequestHeader> <uk:MAPSDeallocateUserRequestBody><uk:AssessmentId>PIP39425</uk:AssessmentId><uk:AssessmentProviderLotId>1</uk:AssessmentProviderLotId>   </uk:MAPSDeallocateUserRequestBody>  </uk:MAPSDeallocateUserRequest>   </soap:Body></soap:Envelope>AvailableForOffline]]></FaultDetail></FaultItem></MAPSResponseFault></MAPSDeallocateUserResponse></soap:Body></soap:Envelope>',

        faultResponse_9003 = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Body><MAPSDeallocateUserResponse xmlns="http://uk.gov.dwp.maps"><MAPSOpsResponseHeader><RequestHeader><ClientRequestId>AA111111Y</ClientRequestId><UserId>tester</UserId><Benefit>PIP</Benefit><Operation>Deallocate</Operation><IPAddress>1.1.1.1</IPAddress><HostName>test</HostName><RequestDateTime>2015-10-08T15:00:00.000</RequestDateTime></RequestHeader><ResponseStatus>500</ResponseStatus></MAPSOpsResponseHeader><MAPSResponseFault><FaultItem><FaultCode>9003</FaultCode><FaultString>Deallocate request failed</FaultString><FaultActor>Dellocate User Flow</FaultActor><FaultDetail><![CDATA[Assessment state is invalid<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:uk="http://uk.gov.dwp.maps">   <soap:Header/>   <soap:Body>  <uk:MAPSDeallocateUserRequest> <uk:MAPSOpsRequestHeader><uk:ClientRequestId>123</uk:ClientRequestId><uk:UserId>tester</uk:UserId><uk:Benefit>PIP</uk:Benefit><uk:Operation>Deallocate</uk:Operation><uk:IPAddress>1.1.1.1</uk:IPAddress><uk:HostName>test</uk:HostName><uk:RequestDateTime>2015-10-08T15:00:00.000</uk:RequestDateTime> </uk:MAPSOpsRequestHeader> <uk:MAPSDeallocateUserRequestBody><uk:AssessmentId>PIP39425</uk:AssessmentId><uk:AssessmentProviderLotId>1</uk:AssessmentProviderLotId>   </uk:MAPSDeallocateUserRequestBody>  </uk:MAPSDeallocateUserRequest>   </soap:Body></soap:Envelope>AvailableForOffline]]></FaultDetail></FaultItem></MAPSResponseFault></MAPSDeallocateUserResponse></soap:Body></soap:Envelope>',

        faultResponse_9002 = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Body><MAPSDeallocateUserResponse xmlns="http://uk.gov.dwp.maps"><MAPSOpsResponseHeader><RequestHeader><ClientRequestId>AA111111Z</ClientRequestId><UserId>tester</UserId><Benefit>PIP</Benefit><Operation>Deallocate</Operation><IPAddress>1.1.1.1</IPAddress><HostName>test</HostName><RequestDateTime>2015-10-08T15:00:00.000</RequestDateTime></RequestHeader><ResponseStatus>500</ResponseStatus></MAPSOpsResponseHeader><MAPSResponseFault><FaultItem><FaultCode>9002</FaultCode><FaultString>Deallocate request failed</FaultString><FaultActor>Dellocate User Flow</FaultActor><FaultDetail><![CDATA[Assessment state is invalid<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:uk="http://uk.gov.dwp.maps">   <soap:Header/>   <soap:Body>  <uk:MAPSDeallocateUserRequest> <uk:MAPSOpsRequestHeader><uk:ClientRequestId>123</uk:ClientRequestId><uk:UserId>tester</uk:UserId><uk:Benefit>PIP</uk:Benefit><uk:Operation>Deallocate</uk:Operation><uk:IPAddress>1.1.1.1</uk:IPAddress><uk:HostName>test</uk:HostName><uk:RequestDateTime>2015-10-08T15:00:00.000</uk:RequestDateTime> </uk:MAPSOpsRequestHeader> <uk:MAPSDeallocateUserRequestBody><uk:AssessmentId>PIP39425</uk:AssessmentId><uk:AssessmentProviderLotId>1</uk:AssessmentProviderLotId>   </uk:MAPSDeallocateUserRequestBody>  </uk:MAPSDeallocateUserRequest>   </soap:Body></soap:Envelope>AvailableForOffline]]></FaultDetail></FaultItem></MAPSResponseFault></MAPSDeallocateUserResponse></soap:Body></soap:Envelope>',

        expectedResponse = { ResponseStatus: 'De Allocated', ClientRequestId: 'DA111111A', FaultCode: null },

        expectedFaultResponse_9005 = { ResponseStatus: '500', ClientRequestId: 'AA111111C', FaultCode: '9005' },

        expectedFaultResponse_9003 = { ResponseStatus: '500', ClientRequestId: 'AA111111Y', FaultCode: '9003' };

        expectedFaultResponse_9002 = { ResponseStatus: '500', ClientRequestId: 'AA111111Z', FaultCode: '9002' };

    //update the injection
    beforeEach(inject(function (_deAllocationService_, _$httpBackend_) {
        deAllocationService = _deAllocationService_;
        $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should return correct http response on de-allocating assessment ', function () {
        expect(deAllocationService).toBeDefined();
        expect(deAllocationService.deAllocate).toBeDefined();

        $httpBackend.when('POST', expectedUrl)
            .respond(200, response);

        deAllocationService.deAllocate(assessments)
            .then(function (data) {
                result = data;
            });

        $httpBackend.flush();

        var actualResponse = result[0];
        expect(actualResponse).toEqual(expectedResponse);

    });

    it('should return fault code 9005 when de-allocating assessment ', function () {
        expect(deAllocationService).toBeDefined();
        expect(deAllocationService.deAllocate).toBeDefined();

        $httpBackend.when('POST', expectedUrl)
            .respond(500, faultResponse_9005);

        deAllocationService.deAllocate(assessments)
            .then(function (data) {
                result = data;
            });

        $httpBackend.flush();

        var actualResponse = result[0];
        expect(actualResponse).toEqual(expectedFaultResponse_9005);

    });

    it('should return fault code 9003 when de-allocating assessment ', function () {
        expect(deAllocationService).toBeDefined();
        expect(deAllocationService.deAllocate).toBeDefined();

        $httpBackend.when('POST', expectedUrl)
            .respond(500, faultResponse_9003);

        deAllocationService.deAllocate(assessments)
            .then(function (data) {
                result = data;
            });

        $httpBackend.flush();

        var actualResponse = result[0];
        expect(actualResponse).toEqual(expectedFaultResponse_9003);

    });

    it('should return fault code 9002 when de-allocating assessment ', function () {
        expect(deAllocationService).toBeDefined();
        expect(deAllocationService.deAllocate).toBeDefined();

        $httpBackend.when('POST', expectedUrl)
            .respond(500, faultResponse_9002);

        deAllocationService.deAllocate(assessments)
            .then(function (data) {
                result = data;
            });

        $httpBackend.flush();

        var actualResponse = result[0];
        expect(actualResponse).toEqual(expectedFaultResponse_9002);

    });

});
