angular.module('controladores',[])
    .controller('MapasController',function($scope,Geolocalizacion,OfertasOcio){

        $scope.mapaCargado=function(map){
            $scope.map=map;

            Geolocalizacion.getPosicionActual().then(

                function(pos){

                    OfertasOcio.getOfertasOcio().then(
                        function(res){
                            $scope.puntosInteres=res;

                            for(i=0;i<$scope.puntosInteres.length;i++){
                                var punto = new google.maps.Marker({
                                    position: new google.maps.LatLng($scope.puntosInteres[i].longitud,$scope.puntosInteres[i].latitud),
                                    map: map,
                                    title: $scope.puntosInteres[i].nombre,
                                    icon: $scope.puntosInteres[i].foto
                                });
                            }
                        },
                        function(err){
                            alert(err);
                        }
                    );

                    $scope.map.setCenter(new google.maps.LatLng(
                        pos.latitud,
                        pos.longitud)
                    );

                    var url_imagen ='http://'+ window.location.host+'/turismogeo/WWW/img/usuario.png';
                    var p1 = new google.maps.Marker({
                        position: new google.maps.LatLng(pos.latitud,pos.longitud),
                        map: map,
                        title: "Yo",
                        icon: url_imagen
                    });
                },
                function (err) {
                    alert(err.message);
                })


        };
    })


.controller('LoginCtrl', function($scope,$ionicLoading,$ionicPopup,
                                  $state,$ionicPlatform,Usuarios) {
    $scope.usuario={};



    $scope.iniciarSesion=function(){
        $ionicLoading.show(
            {
                template:'Validando cuenta de usuario'

            });


        Usuarios.validarUsuario($scope.usuario).then(
            function(res){
                $ionicLoading.hide();
                if(res.length>0) {
                    localStorage.usuario = JSON.stringify(res[0]);
                    $state.go("geoturismo.listado");
                }
                else{
                    localStorage.setItem("usuario", "undefined");
                    $ionicPopup.alert({
                        template:'Credenciales incorrectas',
                        title: '¡Error!'
                    });
                }
            },
            function(err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    template:'Error al validar el usuario',
                    title: '¡Error!'
                });
            });
    };

        $scope.nuevoRegistro=function(){
            $scope.usuario.email="";
            $scope.usuario.password="";
            $state.go("geoturismo.registro");
        }


    $ionicPlatform.ready(function(){
        // navegador kompatible kn localstorage
        if(typeof(Storage) !== "undefined") {
            //si tiene datos, los pasamos a la vista
            if(localStorage.usuario !== "undefined" && localStorage.usuario !== undefined){
                /*
                $scope.usuario.email=JSON.parse(localStorage.usuario).Email;
                $scope.usuario.password=JSON.parse(localStorage.usuario).Password;
                */
                $state.go("geoturismo.listado");
            }
            else {
                ;
            }

        } else {
            // Sorry! No Web Storage support..
            alert("Su navegador no soporta localstorage");
        }
    });

})


.controller('RegistroCtrl', function($scope,$http,$state,
                                     $ionicLoading,$ionicPopup) {
    $scope.usuario={};
    $scope.registro=function(){
        var url="https://turismociudadgeo.azure-mobile.net/tables/usuarios";
        $http.defaults.headers.common={
            'X-ZUMO-APPLICATION':'xcbHUQtJLDiIWhdvACLUNdWAMeAgRo89',
            'Access-Control-Allow-Origin':'*'
        };

        $ionicLoading.show(
            {
                template:'Creando cuenta de usuario'

            }

        );

        $http.post(url,$scope.usuario).then(
            function(res){
                $ionicLoading.hide();

                $ionicPopup.alert({
                    template:'Usuario creado con exito',
                    title: '¡Exito!'
                });

                localStorage.setItem("usuario", "undefined");
                $state.go("geoturismo.login");
            }
            ,
            function(err){
                $ionicLoading.hide();

                $ionicPopup.alert({
                    template:'Error al crear el usuario',
                    title: '¡Error!'
                });
            }
        );
    }
})

.controller('ListadoCtrl', function($scope,$http,$state,OfertasOcio) {
    $scope.puntosInteres=[];

        $scope.goMapa=function(){
            $state.go("geoturismo.mapa");

        }
    OfertasOcio.getOfertasOcio().then(
        function(res){
            $scope.puntosInteres=res;
        },
        function(err){
            alert(err);
        }
    );
})