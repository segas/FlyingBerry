angular.module('flightmodal', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, RenameFlight) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('views/rename_flight.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeFlightModal = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.openFlightModal = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.renameFlight = function (flightname) {
    //window.alert(flightname);
    RenameFlight.rename(flightname)
    .then(function (data) {
        //log in successfull
        $scope.closeFlightModal();

    }, function (data) {
        //log in failed
    });
  };
})

.service('RenameFlight', function ($q, $http) {
    return {
        rename: function (flightname) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            $http({
                url: 'http://88.84.20.245/flyingberry/php/reset_database.php',
                method: "POST",
                data: flightname,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function (response) {
                    if (response.data.error.code === "000") {
                        console.log("Flightnames successfully renamed: " + JSON.stringify(response.data));
                        deferred.resolve(response.data);
                    } else {
                        console.log("Flightnames failed to rename: " + JSON.stringify(response.data.error));
                        deferred.reject(response.data);
                    }
                }, function (error) {
                    console.log("Server Error on renaming: " + JSON.stringify(error));
                    deferred.reject(error);
                });

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
    };
});
