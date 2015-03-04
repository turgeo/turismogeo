angular.module('controladores',[]).
    controller('MapasController',function($scope,Geolocalizacion){

        $scope.mapaCargado=function(map){
            $scope.map=map;

            Geolocalizacion.getPosicionActual().then(

                function(pos){

                    $scope.map.setCenter(new google.maps.LatLng(
                        pos.latitud,
                        pos.longitud));
                },
                function (err) {
                    alert(err.message);
                })
        };
    });


/*angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});*/
