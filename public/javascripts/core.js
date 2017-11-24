var app = angular.module('stockTodo',['ui.bootstrap','ngMaterial', 'mgcrea.ngStrap','ngMessages','smart-table','ngAnimate']);
var myStorage = window.localStorage;

app.controller('mainController', mainCtrl);
function mainCtrl($scope,$http,$mdSidenav,$interval){
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
  $scope.refresh = function (){
    console.log("refresh");
    for (key in myStorage){
      var temp = key;
      $scope.getlist(temp);
    }  
  }
  $scope.refresh();
  $scope.isFavorite = false;
  $scope.listtemplate = 'templates/list.html';
  $scope.tabletemplate = "templates/table.html";
  $scope.tabtemplate = 'templates/tab.html';
  $scope.historicaltemplate = "templates/historical.html";
  $scope.newstemplate = "templates/news.html";
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
  $scope.submitSymbol = function(symbol) {
    $scope.searchSymbol = symbol;
    $scope.isFavorite = $scope.checkFavorite();
    $scope.mySwitch = 'detail';
    $scope.wave = 'detail';
    console.log("submit");
    $scope.loader.result = true;
    $scope.tableloader = false;
    $scope.loader['Table'] = false;
    $scope.loader['Historical'] = false;
    $scope.loader['Price'] = false;
    $scope.loader['SMA'] = false;
    $scope.loader['EMA'] = false;
    $scope.loader['STOCH'] = false;
    $scope.loader['RSI'] = false;
    $scope.loader['ADX'] = false;
    $scope.loader['CCI'] = false;
    $scope.loader['BBANDS'] = false;
    $scope.loader['MACD'] = false;
    $scope.loader['News'] = false;
    $scope.err['Table'] = false;
    $scope.err['Historical'] = false;
    $scope.err['Price'] = false;
    $scope.err['SMA'] = false;
    $scope.err['EMA'] = false;
    $scope.err['STOCH'] = false;
    $scope.err['RSI'] = false;
    $scope.err['ADX'] = false;
    $scope.err['CCI'] = false;
    $scope.err['BBANDS'] = false;
    $scope.err['MACD'] = false;
    $scope.err['News'] = false;
    $scope.stockCollapsed = false;

    $scope.listCollpased = !$scope.listCollpased;
    

    $http.get('/price/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 100) {
          $scope.err['Historical'] = true;
          return false;
        }
        try{
          if (addHistorical(JSON.parse(res.data), $scope.searchSymbol)){
              $scope.loader['Historical'] = true;
              return true;
          } 
          $scope.err['Historical'] = true;
        } catch(e){
          $scope.err['Historical'] = true;
        }
      }, function(res){
        $scope.err['Historical'] = true;
      });

    $http.get('/table/'+$scope.searchSymbol)
      .then(function (res){
        try{
        $scope.tabledata = getTableData(JSON.parse(res.data), $scope.searchSymbol);
        if ($scope.tabledata){
          $scope.loader['Table'] = true;
          $scope.tableloader = true;
          return true;
        } else
          $scope.err['Table'] = true;
        } catch(e){
          $scope.err['Table'] = true;
        }
      }, function(res){
        $scope.err['Table'] = true;
      });
    $http.get('/price/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 100) {
          $scope.err['Price'] = true;
          return false;
        }
        try{
          if (res.data.length == 0) return false; 
          if (addPrice(JSON.parse(res.data), $scope.searchSymbol)){
              $scope.loader['Price'] = true;
              return true;
          }
          $scope.err['Price'] = true;
        } catch (e){
          $scope.err['Price'] = true;
        }
      }, function(res){
        $scope.err['Price'] = true;
      });
    $http.get('/SMA/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 100) {
          $scope.err['SMA'] = true;
          return false;
        }
        try {
          if (addSMA(JSON.parse(res.data), $scope.searchSymbol)){
                $scope.loader['SMA'] = true;
                return true;
          }
          $scope.err['SMA'] = true;
        } catch (e){
          $scope.err['SMA'] = true;
        }
      },function(res){
        $scope.err['SMA'] = true;
      });
    $http.get('/EMA/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 100) {
          $scope.err['EMA'] = true;
          return false;
        }
        try{
          if (addEMA(JSON.parse(res.data), $scope.searchSymbol)){
                $scope.loader['EMA'] = true;
                return true;
          } 
          $scope.err['EMA'] = true;
        } catch (e){
          $scope.err['EMA'] = true;
        }
      });
    $http.get('/STOCH/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 100) {
          $scope.err['STOCH'] = true;
          return false;
        }
        try {
          if (addSTOCH(JSON.parse(res.data), $scope.searchSymbol)){
                $scope.loader['STOCH'] = true;
                return true;
          } 
          $scope.err['STOCH'] = true;
        } catch (e){
          $scope.err['STOCH'] = true;
        }
      });
    $http.get('/RSI/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 100) {
          $scope.err['RSI'] = true;
         return false;
       }
       try{
          if (addRSI(JSON.parse(res.data), $scope.searchSymbol)){
                $scope.loader['RSI'] = true;
                return true;
          } 
          $scope.err['RSI'] = true;
        } catch (e){
          $scope.err['RSI'] = true;
        }
      });      
    $http.get('/ADX/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 100) {
          $scope.err['ADX'] = true;
          return false;
        }
        try{
          if (addADX(JSON.parse(res.data), $scope.searchSymbol)){
                $scope.loader['ADX'] = true;
                return true;
          } 
          $scope.err['ADX'] = true;
        } catch(e){
          $scope.err['ADX'] = true;
        }
      }); 
    $http.get('/CCI/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 100) {
          $scope.err['CCI'] = true;
          return false;
        }
        try{
          if (addCCI(JSON.parse(res.data), $scope.searchSymbol)){
                $scope.loader['CCI'] = true;
                return true;
          } 
          $scope.err['CCI'] = true;
        } catch(e){
          $scope.err['CCI'] = true;
        }
      });          
    $http.get('/BBANDS/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 100) {
          $scope.err['BBANDS'] = true;
          return false;
        }
        try{
          if (addBBANDS(JSON.parse(res.data), $scope.searchSymbol)){
                $scope.loader['BBANDS'] = true;
                return true;
          } 
          $scope.err['BBANDS'] = true;
        } catch(e){
          $scope.err['BBANDS'] = true;
        }
      });
    $http.get('/MACD/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 100) {
          $scope.err['MACD'] = true;
          return false;
        }
        try{
          if (addMACD(JSON.parse(res.data), $scope.searchSymbol)){
                $scope.loader['MACD'] = true;
                return true;
          } 
          $scope.err['MACD'] = true;
        } catch(e){
          $scope.err['MACD'] = true;
        }
      });
    $http.get('/News/'+$scope.searchSymbol)
      .then(function (res){
        if (res.data.length < 10) return false;
        try{
          $scope.News = getNews(res.data, $scope.searchSymbol);
          if (!$scope.News){
            $scope.err['News'] = true;
            return false;
          }
          $scope.loader['News'] = true;
        } catch(e){
          $scope.loader['News'] = true;
        }
      });  
               
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
