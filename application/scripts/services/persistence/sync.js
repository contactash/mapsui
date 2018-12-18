function syncPersistenceService(config, persistenceCommon, global) {
    var sync = 'Y',
        open = function (userId) {
            if (!userId || userId === 'undefined') {
                return Promise.reject('SYNCPERSISTENCE: Invalid Username');
            }
            return persistenceCommon.open(userId + "-syncDatabase", config.SYNC_DB_VERSION, function (e) {
                var db = e.target.result || e.target.transaction.db;

                if (!db) {
                    return Promise.reject('Upgrade Event Ended');
                }

                e.target.transaction.onerror = persistenceCommon.onerror;

                if (db.objectStoreNames.contains("technicalLogs")) {
                    db.deleteObjectStore("technicalLogs");
                }
                var techLogs = db.createObjectStore("technicalLogs", { autoIncrement : true });
                techLogs.createIndex("assessmentId", ["sync", "assessmentId"], { unique: false });
                techLogs.createIndex("operationType", ["operationType"], { unique: false });
                techLogs.createIndex("assessmentOpTypeErrCode", ["assessmentId", "operationType", "errorCode"], { unique: false });

                //name value pair store for keeping the sync state
                if (db.objectStoreNames.contains("state")) {
                    db.deleteObjectStore("state");
                }
                db.createObjectStore("state", { keyPath: "name" });

                // table to store local sync activity:
                if (db.objectStoreNames.contains("syncActivity")) {
                    db.deleteObjectStore("syncActivity");
                }
                db.createObjectStore("syncActivity", { autoIncrement : true });
            });
        },
        getLogs = function (userId) {
            return open(userId)
                .then(function (db) {
                    return persistenceCommon.getAllEntries(db, 'technicalLogs', null, 'prev');
                });
        },
        getLogsByOperationType = function (userId, opType) {
            return open(userId)
                .then(function (db) {
                    return persistenceCommon.getAllEntries(db, 'technicalLogs', global.IDBKeyRange.only([opType]), undefined, 'operationType');
                });
        },
        getLogsByAssessment = function (userId, assessmentId) {
            return open(userId)
                .then(function (db) {
                    return persistenceCommon.getAllEntries(db, 'technicalLogs', global.IDBKeyRange.only([sync, assessmentId]), undefined, 'assessmentId');
                });
        },
        getLogsByAssessmentOpTypeErrCode = function (userId, assessmentId, opType, errCode) {
            return open(userId)
                .then(function (db) {
                    return persistenceCommon.getAllEntries(db, 'technicalLogs', global.IDBKeyRange.only([assessmentId, opType, errCode]), undefined, 'assessmentOpTypeErrCode');
                });
        },
        deleteLogEntry = function (userId, id) {
            return open(userId)
                .then(function (db) {
                    return persistenceCommon.deleteEntry(db, 'technicalLogs', id);
                });
        },
        purgeAllLogEntries = function (userId) {
            return open(userId)
                .then(function (db) {
                    return persistenceCommon.clearStore(db, 'technicalLogs');
                });
        },
        addSecurityLog = function (userId, operationType, faultActor, faultString, faultDetails, errorCode) {
            var logEntry = {
                userId: userId,
                operationType: operationType,
                faultActor: faultActor,
                faultString: faultString,
                faultDetails: faultDetails,
                errorCode: errorCode,
                logTime: Date.now()
            };

            return open(userId)
                .then(truncateDb)
                .then(function (db) {
                    return persistenceCommon.addEntry(db, 'technicalLogs', logEntry);
                });
        },
        addLogEntry = function (userId, operationType, faultActor, nino, crn, assessmentId, faultString, faultDetails, errorCode, validationErrors, subOperationType, description) {
            var logEntry = {
                userId: userId,
                operationType: operationType,
                faultActor: faultActor,
                nino: nino,
                crn: crn,
                assessmentId: assessmentId,
                faultString: faultString,
                faultDetails: faultDetails,
                errorCode: errorCode,
                validationErrors: validationErrors,
                subOperationType: subOperationType,
                description: description
            };

            if (!logEntry || !logEntry.userId) {
                console.log('SYNCPERSISTENCESERVICE:ADDLOGENTRY - Refusing to store object');
            }
            if (logEntry.validationErrors instanceof Error) {
                console.log('SYNCPERSISTENCESERVICE:ADDLOGENTRY - Refusing to store object');
                console.log(logEntry.validationErrors);
                logEntry.validationErrors = logEntry.validationErrors.message + '\n' + logEntry.validationErrors.stack.toString();
            } else if (logEntry.validationErrors && logEntry.validationErrors.length > 0) {
                logEntry.validationErrors = logEntry.validationErrors.map(function (error) {
                    if (error instanceof Error) {
                        console.log('SYNCPERSISTENCESERVICE:ADDLOGENTRY - Refusing to store object');
                        console.log(error);
                        return error.message + '\n' + error.stack.toString();
                    }
                    return error;
                });
            }

            logEntry.logTime = Date.now();

            return open(logEntry.userId)
                .then(truncateDb)
                .then(function (db) {
                    return persistenceCommon.addEntry(db, 'technicalLogs', logEntry);
                })
                /*jshint -W024 */
                .catch(function (e) {
                    if (e && e.target && e.target.error && e.target.error.message) {
                        console.log(e.target.error.message);
                    } else {
                        console.log('SYNCPERSISTENCESERVICE:ADDLOGENTRY - Something wrong with logEntry');
                    }
                    console.log(logEntry);
                });
        },
        addSyncAction = function (userId, operationType, uiOpType, description, status) {
            var logEntry = {
                logTime: Date.now(),
                userId: userId,
                uiOpType: uiOpType,
                operationType: operationType,
                description: description,
                status: status
            };

            return open(userId)
                .then(truncateDb)
                .then(function (db) {
                    return persistenceCommon.addEntry(db, 'syncActivity', logEntry);
                });
        },
        getSyncActivities = function (userId) {
            return open(userId)
                .then(function (db) {
                    return persistenceCommon.getAllEntries(db, 'syncActivity', null, 'prev');
                });
        },
        setState = function (userId, name, value) {
            return open(userId)
                .then(function (db) {
                    return persistenceCommon.addEntry(db, 'state', { name: name, value: value });
                });
        },
        getState = function (userId, name) {
            return open(userId)
                .then(function (db) {
                    return persistenceCommon.getEntry(db, 'state', name);
                });
        },
        truncateDb = function (db) {
            return persistenceCommon.getCount(db, 'technicalLogs')
                .then(function (count) {
                    if (count > config.technicalExceptionLogLimit) {
                        return persistenceCommon.getFirstKey(db, 'technicalLogs')
                            .then(function (key) {
                                persistenceCommon.persistenceCommon(db, 'technicalLogs', key);
                            });
                    }
                })
                .then(function () {
                    return db;
                });
        },
        exposed = {
            getLogs: getLogs,
            purgeAllLogEntries: purgeAllLogEntries,
            deleteLogEntry: deleteLogEntry,
            addLogEntry: addLogEntry,
            setState: setState,
            getState: getState,
            getLogsByAssessment: getLogsByAssessment,
            getLogsByOperationType: getLogsByOperationType,
            addSyncAction: addSyncAction,
            getSyncActivities: getSyncActivities,
            getLogsByAssessmentOpTypeErrCode: getLogsByAssessmentOpTypeErrCode,
            addSecurityLog: addSecurityLog
        };

    return exposed;
}

module.exports = syncPersistenceService;


