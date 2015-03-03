angular.module('directivas',[]).
    directive('mapa',function(){
        return{
            restrict:'E',
            scope:{
                onCreate: '&'

            },
            link:function($scope,$element,$attr){
                function initialize(){
                    var mapOptions={
                        center:new google.maps.LatLng(42.366246,-71.062199),
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map=new google.maps.Map($element[0],mapOptions);

                    $scope.onCreate({map:map});
                    google.maps.event.addDomListener($element[0],
                        'mousedown',function(e){
                            e.preventDefault();
                            return false;
                        }
                    );
                }
                if(document.readyState==="complete"){

                    initialize();
                }
                else{
                    google.maps.event.
                        addDomListener(window,'load',initialize);
                }
            }
        }
    });
