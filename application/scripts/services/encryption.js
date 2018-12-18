/*
 Implementation Details: https://github.com/diafygi/webcrypto-examples#aes-cbc
 Picking an AES Cipher:  http://stackoverflow.com/questions/1220751/how-to-choose-an-aes-encryption-mode-cbc-ecb-ctr-ocb-cfb
 Usage in Chrome:        https://www.chromium.org/blink/webcrypto#TOC-Supported-algorithms-as-of-Chrome-46-
 */

function encryption(global) {
  var globalApi = {
    hash: function (data) {
      if (!hasCryptoAvailable) {
        return Promise.resolve(data);
      }
      // data is ArrayBuffer of data you want to hash
      return crypto.digest('SHA-256', data);
    },
    encrypt: function (key, iv, data) {
      if (!hasCryptoAvailable) {
        return Promise.resolve(data);
      }
      // data is ArrayBuffer of data you want to encrypt
      try {
        // try the Chrome way
        return crypto.encrypt({ name: "AES-CBC", iv: iv }, key, data);
      } catch (error) {
        // try the standards way
        return crypto.encrypt("AES-CBC", key, data);
      }
    },
    decrypt: function (key, iv, data) {
      if (!hasCryptoAvailable) {
        return Promise.resolve(data);
      }
      try {
        // try the Chrome way
        return crypto.decrypt({ name: "AES-CBC", iv: iv }, key, data);
      } catch (error) {
        // try the standards way
        return crypto.decrypt("AES-CBC", key, data);
      }
    },
    generateKey: function () {
      if (!hasCryptoAvailable) {
        return Promise.resolve('no-key');
      }
      return crypto.generateKey({ name: "AES-CBC", length: 256 }, true, ["encrypt", "decrypt"]);
    },
    importKey: function (k) {
      if (!hasCryptoAvailable) {
        return Promise.resolve(k);
      }
      return crypto.importKey("jwk", //can be "jwk" or "raw"
        { // this is an example jwk key, "raw" would be an ArrayBuffer
          kty: "oct",
          k: k,
          alg: "A256CBC",
          ext: true
        },
        { name: "AES-CBC" }, //this is the algorithm options
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"]); //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
    },
    exportKey: function (key) {
      if (!hasCryptoAvailable) {
        return Promise.resolve({ k: key });
      }
      // can be "jwk" or "raw"
      return crypto.exportKey("jwk", key); // extractable must be true
    },
    generateIv: function () {
      if (!hasCryptoAvailable) {
        return Promise.resolve('no-iv');
      }
      return global.crypto.getRandomValues(new Uint8Array(16));
    }
  },
    getKey = function () {
      if (global && typeof global.getEncryptionKey === 'function') {
        return Promise.resolve(global.getEncryptionKey());
      }
      return globalApi.generateKey()
        .then(function (key) {
          return globalApi.exportKey(key);
        })
        .then(function (output) {
          global.getEncryptionKey = function () {
            return output.k;
          };
          console.log('FALLBACK: Transient global encryption key created: ' + output.k);
          return output.k;
        });
    },
    toArrayBuffer = function (jsonData) {
      if (jsonData && jsonData.constructor.name === 'Blob') {
        return new Promise(function (resolve) {
          var fileReader = new FileReader();
          fileReader.onload = function () {
            resolve(this.result);
          };
          fileReader.readAsArrayBuffer(jsonData);
        });
      }
      var input = JSON.stringify(jsonData),
        len = input.length,
        arrayBuffer = new ArrayBuffer(len * 4),
        floatBuffer = new Float32Array(arrayBuffer),
        i;

      for (i = 0; i < len; i += 1) {
        floatBuffer[i] = input[i].charCodeAt(0);
      }
      return Promise.resolve(arrayBuffer);
    },
    arrayBufferToJson = function (arrayBuffer) {
      var floatBuffer = new Float32Array(arrayBuffer),
        serialised = '',
        len = floatBuffer.length,
        i;

      for (i = 0; i < len; i += 1) {
        serialised += String.fromCharCode(floatBuffer[i]);
      }

      return JSON.parse(serialised);
    },
    hash = function (jsonData) {
      return toArrayBuffer(jsonData)
        .then(function (arrayBuffer) {
          return globalApi.hash(arrayBuffer);
        })
        .then(function (encryptedArrayBuffer) {
          return tool.fromArrayBuffer(encryptedArrayBuffer);
        })
        /*jshint -W024 */
        .catch(function (e) {
          console.log('HASH FAILED');
          console.log(JSON.stringify(e));
          return Promise.reject(e);
        });
    },
    encrypt = function (jsonData) {
      var iv, arrayBuffer;
      return toArrayBuffer(jsonData)
        .then(function (buffer) {
          arrayBuffer = buffer;
          return getKey();
        })
        .then(function (k) {
          return globalApi.importKey(k);
        })
        .then(function (key) {
          iv = globalApi.generateIv();
          return globalApi.encrypt(key, iv, arrayBuffer);
        })
        .then(function (encryptedArrayBuffer) {
          return {
            isEncrypted: true,
            iv: tool.fromArrayBuffer(iv),
            data: tool.fromArrayBuffer(encryptedArrayBuffer),
            isBlob: jsonData && jsonData.constructor.name === 'Blob',
            blobType: jsonData.type
          };
        })
        /*jshint -W024 */
        .catch(function (e) {
          console.log('ENCRYPTION FAILED');
          console.log(JSON.stringify(e));
          return Promise.reject(e);
        });
    },
    decrypt = function (data) {
      if (data && data.isEncrypted) {
        return getKey()
          .then(function (k) {
            return globalApi.importKey(k);
          })
          .then(function (key) {
            return globalApi.decrypt(key, tool.toArrayBuffer(data.iv), tool.toArrayBuffer(data.data));
          })
          .then(function (decryptedArrayBuffer) {
            if (data.isBlob) {
              return new Blob([decryptedArrayBuffer], {
                type: data.blobType
              });
            }
            return arrayBufferToJson(decryptedArrayBuffer);
          })
          /*jshint -W024 */
          .catch(function (e) {
            console.log('DECRYPTION FAILED');
            console.log(JSON.stringify(e));
            return Promise.reject(e);
          });
      }
      return Promise.reject('Data is invalid');
    },
    generateKey = function () {
      return globalApi.generateKey()
        .then(function (key) {
          return globalApi.exportKey(key);
        })
        .then(function (output) {
            return output.k;

        });
    },
    tool = {},
    crypto = (global.crypto || global.msCrypto),// && (global.crypto.subtle || global.crypto.webkitSubtle),
    hasCryptoAvailable = crypto && typeof crypto.encrypt === 'function';

  tool.base64String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  tool.base64DecodeLookup = (function () {
    var coreArrayBuffer = new ArrayBuffer(256),
      base64DecodeLookupTable = new Uint8Array(coreArrayBuffer),
      len = tool.base64String.length,
      i;
    for (i = 0; i < len; i += 1) {
      base64DecodeLookupTable[tool.base64String[i].charCodeAt(0)] = i;
    }
    return base64DecodeLookupTable;
  }());
  tool.fromArrayBuffer = function (arraybuffer) {
    /*jshint bitwise: false*/
    /*jshint singleGroups: false*/
    var bytes = new Uint8Array(arraybuffer), i, len = bytes.buffer.byteLength, base64 = '';
    for (i = 0; i < len; i += 3) {
      base64 += tool.base64String[bytes[i] >> 2];
      base64 += tool.base64String[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += tool.base64String[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += tool.base64String[bytes[i + 2] & 63];
    }
    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + '=';
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + '==';
    }
    return base64;
  };
  tool.toArrayBuffer = function (base64) {
    /*jshint bitwise: false*/
    /*jshint singleGroups: false*/
    var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = tool.base64DecodeLookup[base64.charCodeAt(i)];
      encoded2 = tool.base64DecodeLookup[base64.charCodeAt(i+1)];
      encoded3 = tool.base64DecodeLookup[base64.charCodeAt(i+2)];
      encoded4 = tool.base64DecodeLookup[base64.charCodeAt(i+3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return arraybuffer;
  };

  return {
    encrypt: encrypt,
    decrypt: decrypt,
    getKey: getKey,
    generateKey: generateKey,
    hash: hash
  };
}

module.exports = encryption;