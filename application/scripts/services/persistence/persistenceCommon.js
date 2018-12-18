function persistenceCommon(global, encryption, configEnvironment) {
  var open = function (name, version, upgradeAction) {
    return new Promise(function (resolve, reject) {
      var indexedDB = exposed.getIndexedDBReference(),
        request = indexedDB.open(name, version);

      request.onupgradeneeded = upgradeAction;

      request.onsuccess = function (e) {
        resolve(e.target.result);
      };

      request.onerror = function (e) {
        reject(e);
      };
    });
  },
    getStore = function (db, storeName, openType) {
      return new Promise(function (resolve, reject) {
        if (db && db.objectStoreNames && db.objectStoreNames.contains(storeName)) {
          var transaction = db.transaction([storeName], openType || 'readonly'),
            store = transaction.objectStore(storeName);

          resolve(store);
        } else {
          reject('PERSISTENCE: Cannot open store, ' + storeName);
        }
      });
    },
    encrypt = function (storeName, value) {
      if (value && configEnvironment.CRYPTO && configEnvironment.CRYPTO.STORES.indexOf(storeName) >= 0) {
        return encryption.encrypt(value);
      }
      return Promise.resolve(value);
    },
    mapEncryptedValue = function (store, encrypted, original) {
      if (encrypted.isEncrypted) {
        encrypted[store.keyPath] = original[store.keyPath];
        if (store.indexNames && store.indexNames.length > 0) {
          for (var i = 0; i < store.indexNames.length; i += 1) {
            encrypted[store.indexNames[i]] = original[store.indexNames[i]];
          }
        }
      }
      return encrypted;
    },
    decrypt = function (storeName, value) {
      if (value && value.isEncrypted && configEnvironment.CRYPTO && configEnvironment.CRYPTO.STORES.indexOf(storeName) >= 0) {
        return encryption.decrypt(value);
      }
      return Promise.resolve(value);
    },
    getAllEntries = function (db, storeName, range, direction, index) {
      return getStore(db, storeName)
        .then(function (store) {
          return new Promise(function (resolve, reject) {
            var request = (index && store.indexNames.contains(index) ? store.index(index) : store).openCursor(range, direction || 'next'),
              entries = [],
              promises = [];

            request.onsuccess = function (e) {
              var cursor = e.target.result;
              if (cursor) {
                cursor.value.key = cursor.key;
                promises.push(decrypt(storeName, cursor.value)
                  .then(function (data) {
                    entries.push(data);
                  })
                  /*jshint -W024 */
                  .catch(function (error) {
                    reject(error);
                  })
                );
                /*jshint -W024 */
                cursor.continue();
              } else {
                Promise.all(promises)
                  .then(function () {
                    resolve(entries);
                  });
              }
            };

            request.onerror = reject;
          });
        });
    },
    getFirstKey = function (db, storeName, range, direction, index) {
      return getStore(db, storeName)
        .then(function (store) {
          return new Promise(function (resolve, reject) {
            var request = (index ? store.index(index) : store).openCursor(range, direction || 'next');

            request.onsuccess = function (e) {
              if (e && e.target && !e.target.error && e.target.result && e.target.result.key >= 0) {
                resolve(e.target.result.key);
              } else {
                reject('PERSISTENCE: Cannot get first key in, ' + storeName);
              }
            };

            request.onerror = reject;
          });
        });
    },
    deleteEntry = function (db, storeName, key, index) {
      return getStore(db, storeName, 'readwrite')
        .then(function (store) {
          return new Promise(function (resolve, reject) {
            /*jshint -W024 */
            var request = store.delete(key);

            request.onsuccess = function (e) {
              resolve(key);
            };
            request.onerror = reject;
          });
        });
    },
    clearStore = function (db, storeName) {
      return getStore(db, storeName, 'readwrite')
        .then(function (store) {
          return new Promise(function (resolve, reject) {
            var request = store.clear();

            request.onsuccess = resolve;
            request.onerror = reject;
          });
        });
    },
    addEntry = function (db, storeName, entry, key, index) {
      var encrypted;
      return encrypt(storeName, entry)
        .then(function (data) {
          encrypted = data;
          return getStore(db, storeName, 'readwrite');
        })
        .then(function (store) {
          return new Promise(function (resolve, reject) {
            encrypted = mapEncryptedValue(store, encrypted, entry);
            var request = key ? store.put(encrypted, key) : store.put(encrypted);
            request.onsuccess = function (e) {
              resolve(entry);
            };
            request.onerror = function(event){
                reject(event);
            };
          });
        });
    },
    getEntry = function (db, storeName, key, index) {
      return getStore(db, storeName)
        .then(function (store) {
          return new Promise(function (resolve, reject) {
            var request = store.get(key);

            request.onsuccess = function (e) {
              if (e && e.target && !e.target.error) {
                decrypt(storeName, e.target.result)
                  .then(function (decrypted) {
                    resolve(decrypted);
                  })
                  /*jshint -W024 */
                  .catch(function (error) {
                    reject(error);
                  });
              } else {
                reject('PERSISTENCE: Value not in DB, ' + storeName + ', ' + key);
              }
            };

            request.onerror = reject;
          });
        });
    },
    getCount = function (db, storeName) {
      return getStore(db, storeName)
        .then(function (store) {
          return new Promise(function (resolve, reject) {
            var request = store.count();

            request.onsuccess = function (e) {
              if (e && e.target && !e.target.error && e.target.result >= 0) {
                resolve(e.target.result);
              } else {
                resolve(0);
              }
            };

            request.onerror = function () {
              resolve(0);
            };
          });
        });
    },
    getIndexedDBReference = function () {
      return global.indexedDB;
    },
    onerror = function (a, b, c, d) {
      getIndexedDBReference().onerror(a, b, c, d);
    },
    exposed = {
      open: open,
      getAllEntries: getAllEntries,
      addEntry: addEntry,
      deleteEntry: deleteEntry,
      getEntry: getEntry,
      clearStore: clearStore,
      getIndexedDBReference: getIndexedDBReference,
      getCount: getCount,
      getFirstKey: getFirstKey,
      getStore: getStore,
      onerror: onerror
    };

  return exposed;
}
module.exports = persistenceCommon;