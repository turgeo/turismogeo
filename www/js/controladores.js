angular.module('controladores',[])
    .controller('MapasController',function($scope,$ionicLoading,Geolocalizacion,OfertasOcio,Portada){
        
        $scope.mapaCargado=function(map){
            $scope.map=map;

            $ionicLoading.show( { template:'Cargando...' } );

            //obtenemos la ubicación del usuario
            Geolocalizacion.getPosicionActual().then(
                function(pos){
                    //obtenemos el listado de ofertas de la bbdd, en concreto la ubicación
                    OfertasOcio.getOfertasOcio(Portada.getCiudad()).then(
                        function(res){
                            //y entonces ya tenemos todos los datos necesarios para construir el mapa,
                            //así q vamos a pintarlo

                            //1_ DECLARAMOS LAS VARIABLES
                            //..binding para la vista
                            $scope.puntosInteres=res;

                            //..url kn la imagen para pintar el punto en el mapa
                            //var url_evento ='http://'+ window.location.host+'/turismogeo/WWW/img/evento.png';
                            var url_evento ='https://turismociudadgeo.blob.core.windows.net/fotos/evento.png';

                            //..url para pintar el geoposicionamiento del usuario
                            //var url_usuario ='http://'+ window.location.host+'/turismogeo/WWW/img/usuario.png';
                            var url_usuario ='https://turismociudadgeo.blob.core.windows.net/fotos/usuario.png';

                            //..variable para cerrar los popups
                            var popup;

                            //..función para pintar 1 punto en el mapa, y q
                            //al hacer clic se muestre 1 popup informativo
                            $scope.pintarPunto=function(map, opcionesInfobox, latitud, longitud, titulo, urlIcono){
                                var marker = new google.maps.Marker({
                                    position: new google.maps.LatLng( parseFloat(latitud), parseFloat(longitud) ),
                                    map: map,
                                    title: titulo,
                                    icon: urlIcono
                                });

                                //al hacer clic en el mapa, cerramos los popups
                                google.maps.event.addListener(map, 'click', function() {
                                    if(popup!=undefined)
                                        popup.close();
                                });

                                //al hacer clic en un marker, se muestra su popup
                                var infobox = new InfoBox(opcionesInfobox);
                                google.maps.event.addListener(marker, 'click', function(){
                                        //si estuviese abierto otro popup, se cierra
                                        if(popup!=undefined)
                                            popup.close();
                                        infobox.open(map, marker);
                                        popup=infobox;
                                    }
                                );
                            };

                            //2_ centramos el mapa
                            $scope.map.setCenter(new google.maps.LatLng(
                                    pos.latitud,
                                    pos.longitud)
                            );

                            //3_ PINTAMOS LOS PUNTOS DE LAS OFERTAS DE OCIO
                            for(i=0;i<$scope.puntosInteres.length;i++){
                                //..creamos el infobox
                                var info='<div class="contenedor">'
                                    +'<span class="contenedorTitulo">'+$scope.puntosInteres[i].nombre+'</span>'
                                    +'<div class="subcontenedor">'
                                    +'<div><img src="'+$scope.puntosInteres[i].foto+'" /></div>'
                                    +'<div>'+$scope.puntosInteres[i].descripcion+'</div>'
                                        //+'<div>Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.</div>'
                                    +'</div>'
                                    +'</div>';
                                var myOptions = {
                                    content: info,
                                    boxStyle: {
                                        backgroundColor: "#FFFF80"
                                        ,opacity: 0.75,
                                        width: "375px",
                                        height: "305px",
                                        padding: "3px"
                                    }
                                };
                                //infobox = new InfoBox(myOptions);

                                $scope.pintarPunto( map,
                                                    myOptions,
                                                    parseFloat($scope.puntosInteres[i].latitud),
                                                    parseFloat($scope.puntosInteres[i].longitud),
                                                    $scope.puntosInteres[i].nombre,
                                                    url_evento );
                            }

                            //4_ PINTAMOS EL PUNTO DONDE ESTÁ SITUADO EL USUARIO
                            //..creamos el infobox
                            var info = '<div class="contenedorMini">Usted se encuentra aquí</div>';
                            var myOptions = {
                                content: info,
                                boxStyle: {
                                    backgroundColor: "#FFFF80"
                                    ,opacity: 0.75,
                                    width: "120px",
                                    padding: "3px"
                                }
                            };
                            //infobox = new InfoBox(myOptions);

                            $scope.pintarPunto( map,
                                                myOptions,
                                                parseFloat(pos.latitud),
                                                parseFloat(pos.longitud),
                                                'Yo',
                                                url_usuario );

                            $ionicLoading.hide();
                        },
                        function(err){
                            alert(err);
                            $ionicLoading.hide();
                        }
                    );
                },
                function (err) {
                    alert(err.message);
                    $ionicLoading.hide();
                })
        };
    })


    .controller('PortadaCtrl',function($scope, $state, Portada,$ionicLoading){
        //$scope.urlFoto='http://'+ window.location.host+'/turismogeo/www/img/portada2.jpg';
        $scope.urlFoto='https://turismociudadgeo.blob.core.windows.net/fotos/portada2.jpg';

        $ionicLoading.show({template:'Cargando...'});
        $ionicLoading.hide();

        $scope.guiaMadrid=function(){
            Portada.setCiudad("Madrid");
            $state.go("geoturismo.login");
        };
        $scope.guiaBarcelona=function(){
            Portada.setCiudad("Barcelona");
            $state.go("geoturismo.login");
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

            $ionicLoading.show( { template:'Creando cuenta de usuario' } );

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

    .controller('ListadoCtrl', function($scope,$http,$state,$ionicLoading,OfertasOcio,Portada) {
        $scope.puntosInteres=[];
        $scope.goMapa=function(){
            $state.go("geoturismo.mapa");
        }

        $ionicLoading.show(
            {
                template:'Cargando...'
            }
        );

        OfertasOcio.getOfertasOcio(Portada.getCiudad()).then(
            function(res){
                $scope.puntosInteres=res;
                $ionicLoading.hide();
            },
            function(err){
                alert(err);
                $ionicLoading.hide();
            }
        );
    })

    .controller('DetalleCtrl', function($scope,$http,$stateParams,$ionicPlatform,$ionicLoading,OfertaOcioDetalle) {
        $scope.datos;

        $ionicLoading.show({template:'Cargando...'});
        OfertaOcioDetalle.dameDetalleOferta($stateParams.idItem).then(
            function(res){
                //$scope.datos=JSON.stringify(res);
                $scope.datos=res;
                $ionicLoading.hide();
            },
            function(err){
                alert(err);
                $ionicLoading.hide();
            }
        );

        /*
        $scope.puntoInteres={};

        $ionicLoading.show( { template:'Cargando...' } );

        $ionicPlatform.ready(function(){
            OfertaOcioDetalle.dameDetalleOferta($stateParams.idItem).then(
                function(res){
                    $ionicLoading.hide();
                    $scope.puntoInteres=res;
                },
                function(err){
                    alert(err);
                    $ionicLoading.hide();
                }
            );
        });
        */
    })