function homeCtrl($rootScope, $location) {
    if ($rootScope.loggedInUserId) {
        $location.path('/index')
    } else {
        $location.path('/login')
    }
}

module.exports = homeCtrl;