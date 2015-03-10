angular.module('misMapas',['ionic','controladores','servicios','directivas'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('geoturismo', {
        url: "/geoturismo",
        abstract: true,
        templateUrl: "templates/geoturismo.html"
    })
    // Each tab has its own nav history stack:
    .state('geoturismo.login', {
        url: '/login',
        views: {
            'plantillaView': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            }
        }
    })

    .state('geoturismo.registro', {
        url: '/registro',
        views: {
            'plantillaView': {
                templateUrl: 'templates/registro.html',
                controller: 'RegistroCtrl'
            }
        }
    })

    .state('geoturismo.listado', {
        url: '/listado',
        views: {
            'plantillaView': {
                templateUrl: 'templates/listado.html',
                controller: 'ListadoCtrl'
            }
        }
    })

    .state('geoturismo.mapa', {
        url: '/mapa',
        views: {
            'plantillaView': {
                templateUrl: 'templates/mapa.html',
                controller: 'MapasController'
            }
        }
    })

    .state('geoturismo.portada', {
        url: '/portada',
        views: {
            'plantillaView': {
                templateUrl: 'templates/portada.html',
                controller: 'PortadaCtrl'
            }
        }
    })

    .state('geoturismo.detalle', {
        url: '/detalle/:idItem',
        views: {
            'plantillaView': {
                templateUrl: 'templates/detalle.html',
                controller: 'DetalleCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/geoturismo/portada');

});