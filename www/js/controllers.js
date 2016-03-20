angular.module('modal.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, LoginService, RenameFlight, Flight) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('views/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginmodal = modal;
  });

  // Create the Flight renaming modal that we will use later
  $ionicModal.fromTemplateUrl('views/flight_administration.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.flight_admininstration_modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginmodal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginmodal.show();
  };

  // Triggered in the Flight renaming modal to close it
  $scope.closeFlightAdministrationModal = function() {
    $scope.flight_admininstration_modal.hide();
  };

  // Open the Flight renaming modal
  $scope.openFlightAdministrationModal = function() {
    $scope.flight_admininstration_modal.show();
    $scope.listFlights();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function (userLogin) {
    LoginService.loginUser(userLogin)
    .then(function (data) {
        //log in successfull
        //window.alert("Login funktioniert")
        $scope.closeLogin();
        window.location = "#/app/admin";
    }, function (data) {
        //log in failed
    });
  };

  // Perform the Flight renaming action when the user submits the Flight renaming form
  $scope.renameFlight = function (flight) {
    //.then(function (data) {
    RenameFlight.rename(flight)
    //log in successfull
    $scope.closeFlightAdministrationModal();
  };

  $scope.listFlights = function (){
    Flight.listAll()
    .then(function (data) {
      //data.flights.forEach(function(entry) {
        //console.log(entry);
      //});
      $scope.createFlightsList(data.flights);
    }, function (data) {
      //failed
    });
  };

  $scope.createFlightsList = function(data){
    var body = document.getElementById('list_of_flights');
    body.innerHTML = "";

    var list = document.createElement('ul');
    list.className = "list";

    data.forEach(function(entry){
      // Create the list item
      var item = document.createElement('li');
      item.className = "item";
      //item.setAttribute("ng-click","selectItem('"+ entry +"')")
      item.setAttribute("ng-click","selectItem('" + entry + "')")
      // Set its contents
      item.appendChild(document.createTextNode(entry));

      // Add it to the list
      list.appendChild(item);
      body.appendChild(list);
    })
    $scope.compile(body);
  }

  $scope.selectItem = function(flightname){
    var newName = prompt("Wie soll der Flug neu heissen?", "");

    if (newName != null) {
      var flight = {oldName: flightname, newName: newName};
      $scope.renameFlight(flight);
    }
  };

  $scope.compile = function(element){
    var el = angular.element(element);
    $sc = el.scope();
      $injector = el.injector();
      $injector.invoke(function($compile){
        $compile(el)($sc)
      })
  };
})

.service('LoginService', function ($q, $http) {
    return {
        loginUser: function (loginData) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            $http({
                url: 'http://88.84.20.245/flyingberry/php/login.php',
                method: "POST",
                data: loginData,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function (response) {
                    if (response.data.error.code === "000") {
                        //console.log("User login successful: " + JSON.stringify(response.data));
                        deferred.resolve(response.data);
                    } else {
                        //console.log("User login failed: " + JSON.stringify(response.data.error));
                        deferred.reject(response.data);
                    }
                }, function (error) {
                    //console.log("Server Error on login: " + JSON.stringify(error));
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
})

.service('RenameFlight', function ($q, $http) {
    return {
        rename: function (flight) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            $http({
                url: 'http://88.84.20.245/flyingberry/php/renaming_flight.php',
                method: "POST",
                data: flight,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function (response) {
                    if (response.data.error.code === "000") {
                        console.log("Flightnames renamed: " + JSON.stringify(response.data));
                        //deferred.resolve(response.data);
                    } else {
                        console.log("Flightnames renamed: " + JSON.stringify(response.data));
                        //deferred.reject(response.data);
                    }
                }, function (error) {
                    console.log("Server Error on renaming: " + JSON.stringify(error));
                    //deferred.reject(error);
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
})

.service('Flight', function ($q, $http) {
    return {
        listAll: function (loginData) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            $http({
                url: 'http://88.84.20.245/flyingberry/php/list_flights.php',
                method: "POST",
                data: null,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function (response) {
                    if (response.data.error.code === "000") {
                        //console.log("Flights: " + JSON.stringify(response.data));
                        deferred.resolve(response.data);
                    }
                }, function (error) {
                    //console.log("Server Error on login: " + JSON.stringify(error));
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
