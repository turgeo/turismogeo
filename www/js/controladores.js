angular.module('controladores',[])
    .controller('MapasController',function($scope,Geolocalizacion,OfertasOcio){

        $scope.mapaCargado=function(map){
            $scope.map=map;

            Geolocalizacion.getPosicionActual().then(

                function(pos){

                    OfertasOcio.getOfertasOcio().then(
                        function(res){
                            //1_ DECLARAMOS LAS VARIABLES
                            //..binding para la vista
                            $scope.puntosInteres=res;

                            //..url kn la imagen para pintar el punto en el mapa
                            var url_evento ='http://'+ window.location.host+'/turismogeo/WWW/img/evento.png';

                            //..url para pintar el geoposicionamiento del usuario
                            var url_usuario ='http://'+ window.location.host+'/turismogeo/WWW/img/usuario.png';

                            //..ventanita para mostrar al hacer clic en el punto
                            var infowindow = new google.maps.InfoWindow(
                                {
                                    size: new google.maps.Size(150,50)
                                });

                            //..función para krear los markers
                            function createMarker(latlng, html) {
                                var contentString = html;
                                var marker = new google.maps.Marker({
                                    position: latlng,
                                    map: map,
                                    icon: url_evento,
                                    title: $scope.puntosInteres[0].nombre
                                    //zIndex: Math.round(latlng.lat()*-100000)<<5
                                });

                                google.maps.event.addListener(marker, 'click', function() {
                                    infowindow.setContent(contentString);
                                    infowindow.open(map,marker);
                                });
                            }

                            //..
                            google.maps.event.addListener(map, 'click', function() {
                                infowindow.close();
                                infowindowUsuario.close();
                            });

                            //3_ centramos el mapa
                            $scope.map.setCenter(new google.maps.LatLng(
                                    pos.latitud,
                                    pos.longitud)
                            );

                            //4_ PINTAMOS LOS PUNTOS DE LAS OFERTAS DE OCIO
                            for(i=0;i<$scope.puntosInteres.length;i++){
                                var point = new google.maps.LatLng($scope.puntosInteres[i].longitud,$scope.puntosInteres[i].latitud);
                                var marker = createMarker(point,$scope.puntosInteres[i].descripcion);
                            }

                            //5_ PINTAMOS EL PUNTO DONDE ESTÁ SITUADO EL USUARIO
                            var info = "Usted se encuentra aquí";
                            var infowindowUsuario = new google.maps.InfoWindow({
                                //content: info
                                content: "<div style='border: 1px solid deeppink;'>Hola soy un div<img src='"+url_evento+"'/></div>"
                            });
                            var puntoUsuario = new google.maps.Marker({
                                position: new google.maps.LatLng(pos.latitud,pos.longitud),
                                map: map,
                                title: "Yo",
                                icon: url_usuario
                            });

                            google.maps.event.addListener(puntoUsuario, 'click', function() {
                                infowindowUsuario.open(map,puntoUsuario);
                            });

                        },
                        function(err){
                            alert(err);
                        }
                    );
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