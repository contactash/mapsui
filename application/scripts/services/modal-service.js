var signalling = require('../signalling'),
  main = function($modal, $sce) {
    var modalDefaults = {
      keyboard: true,
      modalFade: true,
      templateUrl: 'views/modal.html'
    },
    modalOptions = {
      closeButtonText: 'Close',
      actionButtonText: 'OK',
      headerText: 'Continue?',
      additionalText: '',
      bodyText: $sce.trustAsHtml('Are you sure you want to perform this action?'),
      bodyTexts: [],
      data: {}
    },
    tmpModalDefaults = {},
    tmpModalOpts = {},
    showModal = function (customModalDefaults, customModalOptions) {
      if (!customModalDefaults) {
        customModalDefaults = {};
      }
      
      tmpModalDefaults = {};
      tmpModalOpts = {};
      
      // Unconditionally set backdrop to static to ensure consistent behaviour for all modals across
      // the application
      customModalDefaults.backdrop = 'static';
      return show(customModalDefaults, customModalOptions);
    },
    show = function (customModalDefaults, customModalOptions) { 

      signalling.setup('modal');
      signalling.setup('modalRender');

      angular.extend(tmpModalDefaults, modalDefaults, customModalDefaults);
      angular.extend(tmpModalOpts, modalOptions, customModalOptions);
      
      // If body text has been supplied that has NOT previously been trusted as HTML, 
      // trust it as HTML now.
      if ( tmpModalOpts.bodyText ){
        try {
            $sce.getTrustedHtml(tmpModalOpts.bodyText);
        } catch (e){
          tmpModalOpts.bodyText = $sce.trustAsHtml(tmpModalOpts.bodyText);
        }
      }

      if (!tmpModalDefaults.controller) {
        tmpModalDefaults.controller = ['$scope', '$modalInstance',function ($scope, $modalInstance) {
          $scope.modalOptions = tmpModalOpts;
  
          $scope.modalOptions.ok = function (result) {
            $modalInstance.close(result ? result : "ok");
            signalling.resolve('modal');
          };

          $scope.modalOptions.close = function (result) {
            $modalInstance.dismiss('cancel');
            signalling.resolve('modal');
          };
        }];
      }
      signalling.resolve('modalRender');

      return $modal.open(tmpModalDefaults).result;
    },
    
    getConfig = function(){
      return {options : tmpModalOpts,
              defaults : tmpModalDefaults };
    };

    return {
      showModal: showModal,
      getConfig: getConfig
    };
  };
if (typeof module !== 'undefined') {
  module.exports = main;
}
if (typeof define === 'function') {
  define(main);
}