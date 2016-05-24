angular.module('modal.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, LoginService, RenameFlight, Flight, $interval) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};
    $scope.refreshPageActive = {checked: true};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('modals/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.loginmodal = modal;
    });

    // Create the Flight renaming modal that we will use later
    $ionicModal.fromTemplateUrl('modals/flight_administration.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.flight_admininstration_modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.loginmodal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.loginmodal.show();
    };

    // Triggered in the Flight renaming modal to close it
    $scope.closeFlightAdministrationModal = function () {
        $scope.flight_admininstration_modal.hide();
    };

    // Open the Flight renaming modal
    $scope.openFlightAdministrationModal = function () {
        $scope.flight_admininstration_modal.show();
        $scope.listFlightsforAdministration();
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
        RenameFlight.rename(flight);
        $scope.closeFlightAdministrationModal();
        document.getElementById("flight_list").options.length = 0;
        $scope.listFlightsforMainPage();
    };

    //Get all Flights from the database for the Administration
    $scope.listFlightsforAdministration = function () {
        Flight.listAll()
        .then(function (data) {
            // Create the list of flights for the Administration table
            $scope.createFlightsList(data.flights);
        }, function (data) {
            //failed
        });
    };

    //Get all Flights from the database for the Main Page (Select Box)
    $scope.listFlightsforMainPage = function () {
        Flight.listAll()
        .then(function (data) {
            //data.flights.forEach(function(entry) {
            //console.log(entry);
            //});
            $scope.createFlightsSelectList(data.flights);
        }, function (data) {
            //failed
        });
    };

    //Function for the table creation
    $scope.createFlightsList = function (data) {
        var body = document.getElementById('list_of_flights');
        body.innerHTML = "";

        var list = document.createElement('ul');
        list.className = "list";

        data.forEach(function (entry) {
            // Create the list item
            var item = document.createElement('li');
            item.className = "item";
            //item.setAttribute("ng-click","selectItem('"+ entry +"')")
            item.setAttribute("ng-click", "selectItem('" + entry + "')")
            // Set its contents
            item.appendChild(document.createTextNode(entry));

            // Add it to the list
            list.appendChild(item);
            body.appendChild(list);
        })
        $scope.compile(body);
    };

    //Function for the Selectbox creation
    $scope.createFlightsSelectList = function (data) {
        var selectBox = document.getElementById('flight_list');

        data.forEach(function (entry) {
            // Create the list item
            var item = document.createElement('option');
            // Set its contents
            item.appendChild(document.createTextNode(entry));
            // Add it to the list
            selectBox.appendChild(item);
        })
        $scope.compile(selectBox);
    }

    //Select a flight for renaming
    $scope.selectItem = function (flightname) {
        var newName = prompt("Wie soll der Flug neu heissen?", "");

        if (newName != null) {
            var flight = { oldName: flightname, newName: newName };
            $scope.renameFlight(flight);
        }
    };

    //Select a flight for the charts filter
    $scope.selectFlight = function (flightname) {
        $scope.currentflight = flightname;
        //console.log(flightname)
        $scope.refreshChart();
    };

    //Refresh the charts
    $scope.refreshChart = function () {
        //Temperature
        c3.generate({
            bindto: '#diagram_temperature',
            data: {
                url: 'http://www.segas.ch/flyingberry/php/get_sensordata.php?flight=' + $scope.currentflight,
                type: 'line',
                mimeType: 'json',
                xFormat: '%Y-%m-%d %H:%M:%S',
                keys: {
                    x: 'datetime', // it's possible to specify 'x' when category axis
                    value: ['temperature'],
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        culling: {
                            max: 3 // the number of tick texts will be adjusted to less than this value
                        },
                        format: '%Y-%m-%d %H:%M:%S'
                    }
                }
            },
            point: {
                show: false
            }
        });
        //Feuchtigkeit
        c3.generate({
            bindto: '#diagram_humidity',
            data: {
                url: 'http://www.segas.ch/flyingberry/php/get_sensordata.php?flight=' + $scope.currentflight,
                type: 'line',
                mimeType: 'json',
                xFormat: '%Y-%m-%d %H:%M:%S',
                keys: {
                    x: 'datetime', // it's possible to specify 'x' when category axis
                    value: ['humidity'],
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        culling: {
                            max: 3 // the number of tick texts will be adjusted to less than this value
                        },
                        format: '%Y-%m-%d %H:%M:%S'
                    }
                }
            },
            point: {
                show: false
            }
        });
        //Luftdruck
        c3.generate({
            bindto: '#diagram_pressure',
            data: {
                url: 'http://www.segas.ch/flyingberry/php/get_sensordata.php?flight=' + $scope.currentflight,
                type: 'line',
                mimeType: 'json',
                xFormat: '%Y-%m-%d %H:%M:%S',
                keys: {
                    x: 'datetime', // it's possible to specify 'x' when category axis
                    value: ['pressure'],
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        culling: {
                            max: 3 // the number of tick texts will be adjusted to less than this value
                        },
                        format: '%Y-%m-%d %H:%M:%S'
                    }
                }
            },
            point: {
                show: false
            }
        });
        //Höhe über Meer
        c3.generate({
            bindto: '#diagram_altitude',
            data: {
                url: 'http://www.segas.ch/flyingberry/php/get_sensordata.php?flight=' + $scope.currentflight,
                type: 'line',
                mimeType: 'json',
                xFormat: '%Y-%m-%d %H:%M:%S',
                keys: {
                    x: 'datetime', // it's possible to specify 'x' when category axis
                    value: ['altitude'],
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        culling: {
                            max: 3 // the number of tick texts will be adjusted to less than this value
                        },
                        format: '%Y-%m-%d %H:%M:%S'
                    }
                }
            },
            point: {
                show: false
            }
        });
        //Höhe über Meer
        c3.generate({
            bindto: '#diagram_altitude_pressure',
            data: {
                url: 'http://www.segas.ch/flyingberry/php/get_sensordata.php?flight=' + $scope.currentflight,
                type: 'line',
                mimeType: 'json',
                xFormat: '%Y-%m-%d %H:%M:%S',
                keys: {
                    x: 'altitude', // it's possible to specify 'x' when category axis
                    value: ['pressure'],
                }
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        culling: {
                            max: 3 // the number of tick texts will be adjusted to less than this value
                        }
                    }
                }
            },
            point: {
                show: false
            }
        });
    }

    // This function is to recompile the html page after I create a table of select box
    $scope.compile = function (element) {
        var el = angular.element(element);
        $sc = el.scope();
        $injector = el.injector();
        $injector.invoke(function ($compile) {
            $compile(el)($sc)
        })
    };

    // Function to download file
    $scope.download_androidapp = function () {
        window.location = "./apk/flyingberry.apk"
    };

    // Autorefresh the charts
    $scope.autoRefresh = function () {
        if ($scope.refreshPageActive.checked === true) {
            $scope.refreshChart();
            console.log("Autorefresh: " + $scope.refreshPageActive.checked);
        } 
    };

    // On the Pageload

    // Create the Selectbox options
    var listFlight = $scope.listFlightsforMainPage();
    // Refresh the chart data every 5 seconds (in miliseconds)
    var refreshPage = $interval($scope.autoRefresh, 5000);
})

//The Service for the Login
.service('LoginService', function ($q, $http) {
    return {
        loginUser: function (loginData) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            $http({
                url: 'http://www.segas.ch/flyingberry/php/login.php',
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
//The Service for the renaming
.service('RenameFlight', function ($q, $http) {
    return {
        rename: function (flight) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            $http({
                url: 'http://www.segas.ch/flyingberry/php/renaming_flight.php',
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
//The Service for the list of flights
.service('Flight', function ($q, $http) {
    return {
        listAll: function (loginData) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            $http({
                url: 'http://www.segas.ch/flyingberry/php/list_flights.php',
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
