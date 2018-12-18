function requestGenerator() {
    return {
        generateAuthRequest : generateAuthRequest,
        generateChangePasswordRequest : generateChangePasswordRequest
    };

     function generateAuthRequest(username, password) {
        var request = '<?xml version="1.0" encoding="utf-8"?>';
        request += '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">';
        request += '<s:Header><a:Action s:mustUnderstand="1">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</a:Action>';
        request += '<a:To s:mustUnderstand="1">https://fedsvcs.linkgtm.gpn.gov.uk/adfs/services/trust/13/usernamemixed</a:To>';
        request += '<o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">';
        request += '<o:UsernameToken u:Id="uuid-6a13a244-dac6-42c1-84c5-cbb345b0c4c4-1"><o:Username>' + username + '</o:Username>';
        request += '<o:Password>' + password + '</o:Password></o:UsernameToken></o:Security>';
        request += '</s:Header>';
        request += '<s:Body><trust:RequestSecurityToken xmlns:trust="http://docs.oasis-open.org/ws-sx/ws-trust/200512">';
        request += '<wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">';
        request += '<a:EndpointReference><a:Address>https://mapsservice.dwp.gov.uk</a:Address></a:EndpointReference></wsp:AppliesTo>';
        request += '<trust:KeyType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Bearer</trust:KeyType>';
        request += '<trust:RequestType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue</trust:RequestType>';
        request += '<trust:TokenType>http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0</trust:TokenType>';
        request += '</trust:RequestSecurityToken></s:Body></s:Envelope>';

        return request;
    }

         function generateChangePasswordRequest(username, password, newPassword) {
            var request = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing">';
            request += '<soap:Header>';
            request += '<a:Action soap:mustUnderstand="1">https://np-PIPATMobilepwreset.link2.gpn.gov.uk/IPasswordChangeService/ChangePassword</a:Action>';
            request += '<a:To soap:mustUnderstand="1">https://passwordchange.dwp.gov.uk/PasswordChangeService/PasswordChangeService.svc</a:To>';
            request += '<wsse:Security soap:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">';
            request += '<wsse:UsernameToken><wsse:Username>' + username + '</wsse:Username>';
            request += '<wsse:Password>' + password + '</wsse:Password></wsse:UsernameToken>';
            request += '</wsse:Security></soap:Header><soap:Body><ChangePassword xmlns="https://np-PIPATMobilepwreset.link2.gpn.gov.uk"><newPassword xmlns="">' + newPassword + '</newPassword>';
            request += '</ChangePassword></soap:Body></soap:Envelope>';

            return request;
        }
}

module.exports = requestGenerator;