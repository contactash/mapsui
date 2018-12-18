var signalling = require('./signalling');
var config = require('./services/config/config')();
angular.module('mapsUIApp',['ngAnimate', 'ui.bootstrap', 'ngRoute', 'route-segment', 'view-segment'])

    .run(function ($interval, $rootScope, $http, $location, $routeParams, $anchorScroll, $window) {
        $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
            $location.hash($routeParams.scrollTo);
            $anchorScroll();
        });
        // to do
        $interval(function () {
            if (typeof $rootScope.logout === 'function' &&  $rootScope.loggedInUserId && $rootScope.lastSessionActivityTime && $rootScope.lastSessionActivityTime + config.SESSION_TIMEOUT < Date.now()) {
                $rootScope.logout();
                $rootScope.timedOut = true;
            }
        }, 2000);
        $rootScope.loggedInUserObj =
        {
            user: '',
            loginAttempts: 0,
            firstName: '',
            lastName: '',
            userId: ''
        };
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var loggedInUserObj = $rootScope.loggedInUserObj;
            if (loggedInUserObj && loggedInUserObj.userId !== '') {
                $rootScope.lastSessionActivityTime = Date.now();
                $rootScope.loggedInUserId = loggedInUserObj.userId;
                //$rootScope.loginComplete = true;
                signalling.resolve('userLoaded');
            } else {
                $location.path('/login');
            }
        });

        $rootScope.ipAddress = '0.0.0.0'; //require('./services/ip').address();

        $rootScope.online = navigator.onLine;
        $window.addEventListener("offline", function () {
            $rootScope.$apply(function() {
                $rootScope.online = false;
            });
        }, false);

        $window.addEventListener("online", function () {
            $rootScope.$apply(function() {
                $rootScope.online = true;
            });

        }, false);

        if($rootScope.online){
            // to do - needs internal service
            try{
                /*$.get("http://ipinfo.io", function(response) {
                 $rootScope.ipAddress = response.ip;
                 }, "jsonp");*/
                $rootScope.ipAddress = '0.0.0.0';
            }catch(e){
                $rootScope.ipAddress = '0.0.0.0';
            }
        }else{
            $rootScope.ipAddress = '0.0.0.0';
        }
    })

    .controller("loginCtrl", ['$rootScope', require('./controllers/loginCtrl')])
    .controller("accessibilityCtrl", ['$scope', require('./controllers/accessibilityCtrl')])
    .controller("deAllocationCtrl", ['$scope', 'deAllocationService', 'assessmentService', '$uibModal', 'constants', '$rootScope', 'commonService', 'config', require('./controllers/deAllocationCtrl')])
    .controller("allocationCtrl", ['$scope', 'allocationService', 'assessmentService', '$uibModal', '$rootScope', 'constants', 'commonService', 'config', require('./controllers/allocationCtrl')])
    .controller("navigationCtrl", ['$scope', '$location', '$anchorScroll', '$rootScope', require('./controllers/navigationCtrl')])
    .controller('modalInstanceCtrl', ['$scope','$modalInstance', 'modalOptions', require('./controllers/modalInstanceCtrl')])
    .controller('security', ['$timeout', '$scope', '$rootScope', '$sce', '$location', 'securityService', 'config', 'constants', 'modalService', '$uibModal', require('./controllers/security')])
    .controller('change-password', ['$scope', '$rootScope', '$modalInstance', 'data', 'passwordValidationService', 'securityService', 'config', 'constants', require('./controllers/change-password')])
    .controller('logs', ['$scope', '$rootScope', 'syncPersistenceService', '_', '$timeout', '$location', require('./controllers/logs')])
    .controller('homeCtrl', ['$rootScope', '$location', require('./controllers/homeCtrl')])

    .service('_', [require('./services/lodash')])
    .factory('jsonHelper', [require('./utils/jsonHelper')])
    .factory('jsonToXml',[require('./utils/jsonToXml')])
    .factory('xmlBuilder',[require('./utils/xmlBuilder')])
    .factory('xmlService', [require('./utils/xmlService')])
    .factory('xmlConstants', [require('./utils/xmlConstants')])
    .factory('deAllocationService', ['$http', '$q', 'jsonToXml', 'xmlBuilder', 'jsonHelper', 'config', '$filter', '$rootScope', 'requestService', 'logger', require('./services/deAllocationService')])
    .factory('assessmentService', ['$http', '$q', 'jsonToXml', 'xmlBuilder', 'jsonHelper', 'config', '$filter', '$rootScope', 'requestService', 'logger', require('./services/assessmentService')])
    .factory('allocationService', ['$http', '$q', 'jsonToXml', 'xmlBuilder', 'jsonHelper', 'config', '$filter', '$rootScope', 'requestService', 'logger', require('./services/allocationService')])
    .factory('commonService', [require('./services/common')])
    .factory('requestService', [require('./services/requestService')])
    .factory('logger', ['$rootScope','syncPersistenceService', require('./services/logger')])
    .service('modalService', ['$uibModal', '$sce', require('./services/modal-service')])
    .service('passwordValidationService', ['encryption', '_', 'constants', require('./services/password-validation-service')])
    .factory('requestGenerator', [require('./services/maps/requestGenerator')])
    .factory('securityMapsService', ['constants', 'config', 'syncPersistenceService','$window', 'xmlService', 'xmlConstants', 'requestGenerator', require('./services/maps/security')])
    .factory('securityService', ['$rootScope', 'config', 'constants', 'securityMapsService', 'encryption', require('./services/security')])
    .factory('syncPersistenceService', ['config', 'persistenceCommon', '$window', require('./services/persistence/sync')])
    .service("encryption", ['$window', require('./services/encryption')])
    .service("persistenceCommon", ['$window', 'encryption', 'config', require('./services/persistence/persistenceCommon')])
    .service('constants', [require('./services/constants')])
    .service('config',[require('./services/config/config')])


    /**
     *******************************************************
     configure the angular route module
     *******************************************************
     */
    .config(['$routeSegmentProvider', '$routeProvider', function ($routeSegmentProvider, $routeProvider) {
        $routeSegmentProvider.options.autoLoadTemplates = true;

        $routeSegmentProvider.
        when('/home', 'index').
        when('/index', 'index').
        when('/logs', 'logs').
        when('/login', 'login').

        segment('index', {
            "default": true,
            templateUrl: 'views/home.html',
            controller : 'homeCtrl',
            title: 'MAPS UI' }).

        segment('logs', {
            "default": true,
            templateUrl: 'views/logs.html',
            controller: 'logs',
            title: 'Technical Exception Log' }).

        segment('login', {
            "default": true,
            templateUrl: 'views/login.html',
            controller: 'security',
            title: 'Login' });

        $routeProvider.otherwise({
            redirectTo: '/login'
        });
    }]);
