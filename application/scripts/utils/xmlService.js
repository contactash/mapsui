function xmlService() {

    return {
        getNodeValues : getNodeValues,
        getOperationValue : getOperationValue,
        getXMLDoc : getXMLDoc
    };

    function getAttribute(xmlDoc, attributeValue) {
        if (typeof xmlDoc.querySelector === 'function') {
            return xmlDoc.querySelector("Attribute[Name='" + attributeValue + "']");
        }
    }

    function getAttributeValues(attribute) {
        return attribute.querySelectorAll('AttributeValue');
    }

    function getNodeValues(xmlDoc, attributeValue) {
        var nodeValues = [];
        var attribute = getAttribute(xmlDoc, attributeValue);
        //if attribute is present get the values
        if (attribute) {
            var nodes = getAttributeValues(attribute);
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].innerHTML === undefined && nodes[i].childNodes) {
                    nodeValues.push(nodes[i].childNodes[0].nodeValue);
                } else {
                    nodeValues.push(nodes[i].innerHTML);
                }
            }
        }
        return nodeValues;
    }


    function getOperationValue(xmlDoc, operationQueryName) {
        if (typeof xmlDoc.querySelector === 'function') {
            return xmlDoc.querySelector(operationQueryName).innerHTML;
        }
        return extractValueFromXML(xmlDoc, "ns2:" + operationQueryName);
    }

    function extractValueFromXML(xmlDoc, parentTag) {
        var element = xmlDoc.getElementsByTagName(parentTag)[0].childNodes[0];
        return element.getXML() ? element.getXML().replace(/\s\s+/g, ' ') : '';
    }

    function getXMLDoc(xmlText) {
        var isDomParser = typeof global.DOMParser !== 'undefined',
            supportActiveX = typeof global.ActiveXObject !== 'undefined',
            parser,
            xmlDoc;

        if (xmlText || xmlText === '') {
            if (isDomParser) {
                parser = new global.DOMParser();
                xmlDoc = parser.parseFromString(xmlText, "text/xml");
            } else if (supportActiveX) {
                xmlDoc = new global.ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlText);
            } else {
                var xmlSaxImplementation = new global.DOMImplementation();
                xmlSaxImplementation.errorChecking = false;
                xmlDoc = xmlSaxImplementation.loadXML(xmlText);
            }
        }
        return xmlDoc;
    }

}

module.exports = xmlService;