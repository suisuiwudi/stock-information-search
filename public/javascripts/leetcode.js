var app = angular.module('stockTodo',['ui.bootstrap','ngMaterial', 'mgcrea.ngStrap','ngMessages','smart-table','ngAnimate']);
var myStorage = window.localStorage;

app.controller('lcController', lcCtrl);
function lcCtrl($scope,$http,$mdSidenav,$interval){
  $scope.loader = {
    result: false,
    Price: false,
    SMA: false,
    EMA: false,
    STOCH: false,
    RSI: false,
    ADX: false,
    CCI: false,
    BBANDS: false,
    MACD: false,
    Table: false,
    Historical: false,
    News: false
  };
  $scope.err= {
    SMA: false,
    EMA: false,
    STOCH: false,
    RSI: false,
    ADX: false,
    CCI: false,
    BBANDS: false,
    MACD: false,
    Table: false,
    Historical: false,
    News: false
  }
  $scope.tableloader = false;
  $scope.tabs = [
      {title:"Price", template: 'templates/Price.html'},
      {title:"SMA", template: 'templates/SMA.html'},
      {title:"EMA", template: 'templates/EMA.html'},
      {title:"STOCH", template: 'templates/STOCH.html'},
      {title:"RSI", template: 'templates/RSI.html'},
      {title:"ADX", template: 'templates/ADX.html'},
      {title:"CCI", template: 'templates/CCI.html'},
      {title:"BBANDS", template: 'templates/BBANDS.html'},
      {title:"MACD", template: 'templates/MACD.html'}
  ];
  $scope.sort = {
      options:[
        {name: 'Default', value:'time'},
        {name: 'Symbol', value:'symbol'},
        {name: 'Price', value:'close'},
        {name: 'Change', value:'change'},
        {name: 'Change Percent', value: 'changepercent'},
        {name: 'Volume', value: 'volume'}
      ]
    }
  $scope.sortReverse = false;
  $scope.order = { 
      options:[
        {name: 'Ascending', value: false},
        {name: 'Descending', value: true}
      ]
    }  
  
  $scope.lists = []
  $scope.stockCollapsed = false;
  $scope.listCollpased = false;
  $scope.today = {score : 0}
  $scope.getlist = function (temp){
      $http.get('/table/'+ temp)
        .then(function (res){
          var tempData = getTableData(JSON.parse(res.data), temp);
          if (tempData){
            for (i = 0; i < $scope.lists.length; i++){
              if ($scope.lists[i].symbol == temp){
                $scope.lists[i] = tempData;
                return true;
              }
            }
            $scope.lists.push(tempData);
          }
        })  
  }

  $scope.isFavorite = false;
  $scope.mySwitch = 'list';
  $scope.wave = 'list';
  var autorefreshtoggle = false;
  $(function(){
    $('#autorefresh').change(function(){
      if ($(this).prop('checked')){
        console.log("start");
        autorefreshtoggle = true;
        stop = $interval(function(){
          $scope.refresh();
        }, 5000);
      } else {
        console.log("stop");
        $interval.cancel(stop);
        autorefreshtoggle = false;
      }
    })
  });

  $scope.getSymbols = function(viewValue) {
      console.log(viewValue);
      if (viewValue.length == 0) return;
      return $http.get('/autocomplete/'+viewValue)
      .then(function (res) {
        var jsonobj = JSON.parse(res.data);
        var transfer = [];
        for (i = 0; i < jsonobj.length; i++){
          transfer.push({'Symbol':(jsonobj[i].Symbol), 'Value' : (jsonobj[i].Symbol + " - " + jsonobj[i].Name + " (" + jsonobj[i].Exchange +")")});
        }
        return transfer;
      })
  };
  $scope.saveSymbol = function(){
    myStorage.setItem($scope.searchSymbol,"true");
    $scope.refresh();
  }
  $scope.removeSymbol = function(symbol){
    console.log(symbol);
    myStorage.removeItem(symbol);
    for (i = 0; i < $scope.lists.length; i++){
        if ($scope.lists[i].symbol == symbol){
            $scope.lists.splice(i, 1);
        }
    }
    $scope.refresh();
  }
  $scope.changeFavorite = function (){
      var item = myStorage.getItem($scope.searchSymbol);
      if (item){
        $scope.removeSymbol($scope.searchSymbol);
        return false;
      } {
        $scope.saveSymbol();
        return true;
      }
    }
  $scope.checkFavorite = function(){
      var item = myStorage.getItem($scope.searchSymbol);
      if (item){
        return true;
      } {
        return false;
      }
  }
  $scope.feedFB = function (){
    var chart = $("#"+$scope.tabs.activeTab+"Highcharts").highcharts();
    console.log(chart);
    var options = {
      options: JSON.stringify(chart.options),
      filename: $scope.tabs.activeTab,
      type: 'image/png',
      async: true
    };
    var exportUrl = 'http://export.highcharts.com/';
    $.post(exportUrl, options, function(data){
      var url = exportUrl + data;
      FB.ui({
        method: 'share',
        href: url,
        mobile_iFrame: true,
      },function(response){});
    })
  }
  $scope.sort.selected = $scope.sort.options[0];
  $scope.order.selected = $scope.order.options[0];
  $scope.switchToList = function(){
    $scope.mySwitch = 'list';
    $scope.wave='list';
  }
  $scope.switchToDetail = function(){
    $scope.mySwitch = 'detail';
    $scope.wave='detail';
  }

  $scope.calculateScore = function(symbol){
  	$http.get('/leetcode/'+$scope.searchSymbol)
      .then(function (res){
      	var set = new Set()
      	var today = moment().endOf('day')
      	var yesterday = moment().add(-1, 'day').endOf('day')
      	$scope.today.score = 0
      	for (i = 0; i < res.data.length; i++){
      		if (moment(res.data[i].time) > yesterday && !set.has(res.data[i].problem_name)){
      			$scope.today.score += res.data[i].score;
      			set.add(res.data[i].problem_name)

      		}
      	}
      	$scope.submitted = true;
      	console.log(res.data);
      }, function(res){
        $scope.err['Historical'] = true;
      });
  }
  $scope.submitSymbol = function(symbol) {
    $scope.searchSymbol = symbol;
    $scope.calculateScore();           
  }
  $scope.refresh = function (){
    console.log("refresh");
    $scope.calculateScore()
  }
}


app.controller('tabController', tabCtrl);
  function tabCtrl($scope){

}

app.controller('resultController', resultCtrl);
  function resultCtrl($scope){
}

app.controller('navController', navCtrl);
  function navCtrl($scope,$mdSidenav){
  $scope.toggleRight = function(){
    $mdSidenav('right').toggle().then(function(){
      console.log("right");
    })
  }
}
