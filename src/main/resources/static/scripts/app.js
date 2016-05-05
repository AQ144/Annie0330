define(['angular','angularRoute','angularResource'], function(angular){
    var app = angular.module('app', ['ngRoute','ngResource']);

    app.routes = {
        '/': { templateUrl: 'view/home.html', dependencies: [] }
    };

    app.config([
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide)
        {
            app.controller = $controllerProvider.register;
            app.directive  = $compileProvider.directive;
            app.filter     = $filterProvider.register;
            app.factory    = $provide.factory;
            app.service    = $provide.service;

            $locationProvider.html5Mode(true);
            angular.forEach(app.routes, function(route, path)
            {
                $routeProvider
                    .when(path, {
                        templateUrl:route.templateUrl,
                        resolve:dependencyResolverFor(route.dependencies)
                    });
            });
            // $routeProvider.otherwise({redirectTo: '/' });
        }
    ]);

    app.controller('main', function($rootScope,$scope,$location,$resource,commonService){

        $rootScope.selectoMain = -1; //主菜单索引

        $rootScope.isHome = true;
        $rootScope.$on('$locationChangeSuccess', function(e){
            $rootScope.path = $location.path();
            if($rootScope.path === '/')
                $rootScope.isHome = true;
            else
                $rootScope.isHome = false;
        });

        //分页条件
        $scope.backPageObject= {
            currentPage : 1,
            totalPage : 0,
            pageSize : 5,
            pages : []
        };

        //日期控件
        var today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
        var tempDate = new Date();
        $scope.monthArray = [1,2,3,4,5,6,7,8,9,10,11,12];  //月数组
        $scope.yearArray = []; //年数组
        for(var i=0;i<10;i++){
            $scope.yearArray.push(today.getFullYear() + i);
        }
        //取车时间控件日期model
        tempDate.setDate(tempDate.getDate() + 1);
        $scope.rentalDate = {
            rentalYear : tempDate.getFullYear(),
            rentalMonth: fixDate(tempDate.getMonth() + 1),
            rentalDay: tempDate.getDate()
        };
        //还车时间控件日期model
        tempDate.setDate(tempDate.getDate() + 2);
        $scope.returnDate = {
            returnYear: tempDate.getFullYear(),
            returnMonth:fixDate(tempDate.getMonth() + 1),
            returnDay:tempDate.getDate()
        };
        $scope.bookParams.fromTime = $scope.rentalDate.rentalYear + '-' +
            $scope.rentalDate.rentalMonth + '-' + fixDate($scope.rentalDate.rentalDay);
        $scope.bookParams.toTime = $scope.returnDate.returnYear + '-' +
            $scope.returnDate.returnMonth + '-' + fixDate($scope.returnDate.returnDay);
        //时间选择器日期模型
        $scope.datePicker = {
            weekDay: 0, //[0,1,2,3,4,5,6] 星期几
            days: 0,  //月天数
            dayTag:[] //标签
        };
        $scope.rentalEndDay = new Date(today.getFullYear(),today.getMonth(),today.getDate());
        $scope.rentalEndDay.setDate($scope.rentalEndDay.getDate() + 30); //取车时间最大值
        $scope.returnEndDay = new Date(today.getFullYear(),today.getMonth(),today.getDate());
        $scope.returnEndDay.setDate($scope.returnEndDay.getDate() + 89); //还车时间最大值
        //初始化日期控件及添加限定条件
        $scope.initDatePicker = function(flag){
            //console.log(flag);
            var selDate; //时间控件选中的日期
            var curDate; //当前对比的日期
            if(flag == 'rental'){ //取车时间控件
                selDate = new Date($scope.rentalDate.rentalYear,$scope.rentalDate.rentalMonth*1-1,$scope.rentalDate.rentalDay);
                curDate = today;
            }else if(flag == 'return'){
                selDate = new Date($scope.returnDate.returnYear,$scope.returnDate.returnMonth*1-1,$scope.returnDate.returnDay);
                curDate = parseDate($scope.bookParams.fromTime);
            }
            $scope.datePicker = getMonthDateInfo(selDate);
            for(var i=0;i<$scope.datePicker.dayTag.length;i++){
                if(typeof $scope.datePicker.dayTag[i].tagName == 'string') continue;
                var itemDate;
                if(flag == 'rental'){
                    itemDate = new Date($scope.rentalDate.rentalYear,$scope.rentalDate.rentalMonth*1-1,$scope.datePicker.dayTag[i].tagName);
                } else if(flag == 'return'){
                    itemDate = new Date($scope.returnDate.returnYear,$scope.returnDate.returnMonth*1-1,$scope.datePicker.dayTag[i].tagName);
                }
                //console.log(itemDate.toLocaleString() + ":" + curDate);
                if(itemDate.getTime() == today.getTime()) {
                    if(flag != 'return'){
                        $scope.datePicker.dayTag[i].enable = true;
                        $scope.datePicker.dayTag[i].isCur = true;
                    }
                }
                if(itemDate.getTime() >= curDate){
                    if(flag == 'rental' && itemDate < $scope.rentalEndDay){
                        $scope.datePicker.dayTag[i].enable = true;
                    } else if(flag == 'return' && itemDate < $scope.returnEndDay){
                        $scope.datePicker.dayTag[i].enable = true;
                    }
                }
                //console.log(JSON.stringify($scope.datePicker.dayTag[i]));
            }
        };
        //获取选中日期月的月份信息
        var getMonthDateInfo = function(selDate){
            var datePicker = {
                weekDay:0,
                days:0,
                dayTag:[]
            };
            var firstDay = new Date(selDate);
            firstDay.setDate(1); //当月第一天
            var endDay = new Date(firstDay);
            endDay.setMonth(firstDay.getMonth() + 1); //下一个月第一天
            datePicker.weekDay = firstDay.getDay(); //当月第一天星期几
            datePicker.days = (endDay.getTime() - firstDay.getTime()) / (1000*60*60*24);
            for(var i=1;i<=42;i++){
                if(datePicker.weekDay == 0){ //星期天
                    datePicker.weekDay = 7;
                }
                if(i<datePicker.weekDay){
                    datePicker.dayTag.push({id:i,tagName:'',enable:false,isCur:false});
                } else if(i>=datePicker.weekDay && i<(datePicker.days+datePicker.weekDay)){
                    datePicker.dayTag.push({id:i,tagName:(i+1-datePicker.weekDay),enable:false,isCur:false});
                } else{
                    datePicker.dayTag.push({id:i,tagName:'',enable:false,isCur:false});
                }
            }
            return datePicker;
        };
        //选取取车时间日期
        $scope.selectRentalDate = function(val,flag){
            if(flag){
                return;
            }
            $scope.rentalDate.rentalDay = val;
            $scope.selectorIndex = -1;
        };
        //选取还车时间日期
        $scope.selectReturnDate = function(val,flag){
            if(flag){
                return;
            }
            $scope.returnDate.returnDay = val;
            $scope.selectorIndex = -1;
        };
        //选择年
        $scope.selectYear = function(val,flag){
            _this.ymIndex=-1
            if(flag == 'rental'){
                $scope.rentalDate.rentalYear = val;
            } else if(flag == 'return'){
                $scope.returnDate.returnYear = val;
            }
            $scope.initDatePicker(flag);
        };
        //选择月
        $scope.selectMonth = function(val,flag){
            _this.ymIndex=-1
            val = parseInt(val) < 10 ? '0' + parseInt(val) : val;
            if(flag == 'rental'){
                $scope.rentalDate.rentalMonth = val;
            } else if(flag == 'return'){
                $scope.returnDate.returnMonth = val;
            }
            $scope.initDatePicker(flag);
        };
        //监听取车时间日期控件模型
        var renDate = null;
        $scope.$watch('rentalDate',function(to,from){
            renDate = new Date($scope.rentalDate.rentalYear,$scope.rentalDate.rentalMonth*1-1,$scope.rentalDate.rentalDay);
            if(today > renDate) return;
            if(renDate > $scope.rentalEndDay) return;
            renDate.setDate(renDate.getDate() + 2);
            $scope.returnDate.returnYear = renDate.getFullYear();
            $scope.returnDate.returnMonth = fixDate(renDate.getMonth() + 1);
            $scope.returnDate.returnDay = renDate.getDate();
            $scope.bookParams.fromTime = $scope.rentalDate.rentalYear + '-' +
                $scope.rentalDate.rentalMonth + '-' + fixDate($scope.rentalDate.rentalDay);
        },true);
        //监听还车时间日期控件模型
        var fromDay = null;
        var returnDay = null;
        $scope.$watch('returnDate',function(to,from){
            fromDay = parseDate($scope.bookParams.fromTime);
            returnDay = new Date($scope.returnDate.returnYear,$scope.returnDate.returnMonth*1-1,$scope.returnDate.returnDay);
            if(fromDay > returnDay) return;
            if(returnDay > $scope.returnEndDay) return;
            if(returnDay.getTime() == fromDay.getTime()){
                $scope.returnDate = from;
                return;
            }
            $scope.bookParams.toTime = $scope.returnDate.returnYear + '-' +
                $scope.returnDate.returnMonth + '-' + fixDate($scope.returnDate.returnDay);
        },true);
        //取车时间改变后，还车最大时间改为以当前时间加89
        $scope.$watch('bookParams.fromTime',function(to,from){
            $scope.returnEndDay = new Date(parseDate($scope.bookParams.fromTime));
            $scope.returnEndDay.setDate($scope.returnEndDay.getDate() + 89);
        });
        function fixDate(val){
            return val < 10 ? '0' + val : val;
        }
        //字符串转日期
        function parseDate(str){
            return new Date(parseInt(str.split('-')[0]),parseInt(str.split('-')[1])-1,parseInt(str.split('-')[2]));
        }

        Phantom.post(); // 'ready'
    });

    app.run(function(){
        // PhantomJS Test
        window.Phantom = {
            post: function(ev, src){
                if (typeof window.callPhantom === 'function') {
                    setTimeout(function(){
                        var data = { src: "phantom", ev: "ready" };
                        if(ev) data.ev = ev;
                        if(src) data.src = src;
                        window.callPhantom(data);
                    },0);
                }
            },
            send: function(ev, src){
                if (typeof window.callPhantom === 'function') {
                    var data = { src: "phantom", ev: "ready" };
                    if(ev) data.ev = ev;
                    if(src) data.src = src;
                    window.callPhantom(data);
                }
            }
        };
    });

    return app;
});