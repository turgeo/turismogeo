angular.module('servicios',[])

    .factory('Portada', function () {
        var ciudad='';
        return {
            getCiudad: function () {
                return ciudad;
            },
            setCiudad: function (valor) {
                ciudad=valor;
            }
        }
    })

    .factory('Geolocalizacion',function($q){
        return{

            getPosicionActual:function(){

                var deferred=$q.defer();

                if(navigator.geolocation){

                    navigator.geolocation.watchPosition(

                        function(pos){

                            var miPosicion={
                                latitud:pos.coords.latitude,
                                longitud:pos.coords.longitude


                            };
                            deferred.resolve(miPosicion);
                        },
                        function (err) {

                            deferred.reject(err);
                        }
                    );
                }
                else{

                    deferred.reject({message:'No esta presente la geolocalización'});

                }
                return deferred.promise;
            }
        }
    })



.factory('Usuarios', function ($http, $q) {
        var url="https://turismociudadgeo.azure-mobile.net/tables/usuarios";
        $http.defaults.headers.common={
            'X-ZUMO-APPLICATION':'xcbHUQtJLDiIWhdvACLUNdWAMeAgRo89',
            'Access-Control-Allow-Origin':'*'

    };


    return {
        validarUsuario: function (usuario) {
            var query = "?$filter=email eq '" + usuario.email +
                "' and password eq '" + usuario.password + "'";
            var request = $http(
                {
                    url: url + query,
                    method: 'get'

                });

            return request.then(ok, err);
        }
    }

    function ok(resp) {
        return resp.data;

    }

    function err(resp) {
        if (!angular.isObject(resp.data) || !resp.data.message) {
            return ($q.reject("Error desconocido"));

        }
        return ($q.reject(resp.data.message));
    }

})


.factory('OfertasOcio', function ($http, $q) {
    var url = "https://turismociudadgeo.azure-mobile.net/tables/puntosinteres";

    $http.defaults.headers.common = {
        'X-ZUMO-APPLICATION': 'xcbHUQtJLDiIWhdvACLUNdWAMeAgRo89',
        'Access-Control-Allow-Origin': '*'
    };
    return {
        getOfertasOcio: function (ciudad) {
            var query = "?$filter=ciudad eq '" + ciudad + "'";
            var request = $http(
                {
                    url: url + query,
                    method: 'get'
                });

            return request.then(ok, err);
        }
    }
    function ok(resp) {
        return resp.data;

    }

    function err(resp) {
        if (!angular.isObject(resp.data) || !resp.data.message) {
            return ($q.reject("Error desconocido"));
        }
        return ($q.reject(resp.data.message));
    }
})

    .factory('OfertaOcioDetalle', function ($http, $q) {
        var url='https://turismociudadgeo.azure-mobile.net/tables/puntosInteres'

        $http.defaults.headers.common = {
            'X-ZUMO-APPLICATION': 'xcbHUQtJLDiIWhdvACLUNdWAMeAgRo89',
            'Access-Control-Allow-Origin': '*'
        };
        return {
            dameDetalleOferta: function (id) {
                var query = "?$filter=id eq '" + id+"'";
                var request = $http(
                    {
                        url: url + query,
                        method: 'get'
                    });

                return request.then(ok, err);
            }
        }
        function ok(resp) {
            return resp.data[0];

        }

        function err(resp) {
            if (!angular.isObject(resp.data) || !resp.data.message) {
                return ($q.reject("Error desconocido"));
            }
            return ($q.reject(resp.data.message));
        }

    })