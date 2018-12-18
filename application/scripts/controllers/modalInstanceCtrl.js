
function modalInstanceCtrl($scope, $modalInstance, modalOptions) {
  
  modalOptions.headerText = modalOptions.headerText ? modalOptions.headerText : 'Confirmation';

  $scope.modalOptions = modalOptions;
  


  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}
module.exports = modalInstanceCtrl;
