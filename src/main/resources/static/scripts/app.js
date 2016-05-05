define(['angular', 'script/service/dependencyResolverFor','script/service/loginService','../script/service/rentalPackService','script/service/cityService','script/service/weatherService','angularRoute','angularResource'], function(angular, dependencyResolverFor,LoginService,PackService,CityService,WeatherService){
    var app = angular.module('app', ['ngRoute','ngResource']);

    app.routes = {
        '/': { templateUrl: 'view/home.html', dependencies: [] },
        //新页面
        '/web/shortRentCar/:modelType': { templateUrl: 'viewNew/shortRentCar.html', dependencies: ['viewNew/shortRentCarCtrl']}, //短租自驾
        '/web/confirmOrder/:vmid/:vid/:sid/:takeTimeHaoMiao/:rentalTimeHaoMiao': { templateUrl: 'viewNew/confirmOrder.html', dependencies: ['viewNew/confirmOrderCtrl']},//提交订单
        '/web/submissionOrder/:orderId': { templateUrl: 'viewNew/submissionOrder.html', dependencies: ['viewNew/submissionOrderCtrl']},//订单提交成功
        '/web/userCenternew/:jumpType': { templateUrl: 'viewNew/userCenter.html', dependencies: ['viewNew/userCenterCtrl']},
        '/web/userCenter/shortRent': { templateUrl: 'viewNew/userCenterShortRent.html', dependencies: ['viewNew/userCenterShortRentCtrl']},//个人中心短租自驾订单查询
        '/web/userCenter/shortGeneration': { templateUrl: 'viewNew/userCenterShortGeneration.html', dependencies: ['viewNew/userCenterShortGenerationCtrl']},//个人中心短租代驾订单查询
        '/web/userCenter/tailoredTaxi': { templateUrl: 'viewNew/userCenterTailoredTaxi.html', dependencies: ['viewNew/userCenterTailoredTaxiCtrl']},//个人中心专车服务页面
        '/web/userCenter/myGift': { templateUrl: 'viewNew/userCenterMyGift.html', dependencies: ['viewNew/userCenterMyGiftCtrl']},//个人中心我的礼券
        '/web/userCenter/userInfo': { templateUrl: 'viewNew/userCenterUserInfo.html', dependencies: ['viewNew/userCenterUserInfoCtrl']},//个人中心个人资料
        '/web/orderdetails/:orderId': { templateUrl: 'viewNew/Orderdetails.html', dependencies: ['viewNew/OrderdetailsCtrl']},//订单详情
        '/web/motorcycleList': { templateUrl: 'viewNew/motorcycleList.html', dependencies: ['viewNew/motorcycleListCtrl']},
        '/web/storemotorcycleList/:sid/:startDate/:endDate/:returnCarCityId': { templateUrl: 'viewNew/StoremotorcycleList.html', dependencies: ['viewNew/StoremotorcycleListCtrl']},
        '/web/storePosition/:sid': { templateUrl: 'viewNew/storePosition.html', dependencies: ['viewNew/storePositionCtrl']},//查看门店地图
        '/web/vehicleBooking/:vmid/:vid/:sid': { templateUrl: 'viewNew/vehicleBooking.html', dependencies: ['viewNew/vehicleBookingCtrl']},
        '/web/login': { templateUrl: 'viewNew/login.html', dependencies: ['viewNew/loginCtrl']},
        '/web/join': { templateUrl: 'viewNew/join.html', dependencies: ['viewNew/joinCtrl']},
        '/web/active': { templateUrl: 'viewNew/active.html', dependencies: ['viewNew/activeCtrl']},
        '/web/company': { templateUrl: 'viewNew/company.html', dependencies: ['viewNew/companyCtrl']},
        '/web/forgetpwd': { templateUrl: 'viewNew/forgetpwd.html', dependencies: ['viewNew/forgetpwdCtrl']},





        //旧页面
        '/web/about': { templateUrl: 'view/about.html', dependencies: ['view/about']},
        // '/web/login': { templateUrl: 'view/login.html', dependencies: ['view/loginCtrl']},
        // '/web/join': { templateUrl: 'view/join.html', dependencies: ['view/joinCtrl']},
        '/web/send': { templateUrl: 'view/send.html', dependencies: ['view/sendCtrl']},
        '/web/modifyPwd': { templateUrl: 'view/modifyPwd.html', dependencies: ['view/modifyPwdCtrl']},
        '/web/placeOrder': { templateUrl: 'view/placeOrder.html', dependencies: ['view/placeOrderCtrl']},
        '/web/schedule/:pid': { templateUrl: 'view/schedule.html', dependencies: ['view/scheduleCtrl']},
        '/web/userCenter/:id': { templateUrl: 'view/usercenter.html', dependencies: ['view/userCenterCtrl']},
        '/web/enterpriseservice': { templateUrl: 'view/enterpriseservice.html', dependencies: ['view/enterpriseserviceCtrl']},
        '/web/myOrder': { templateUrl: 'view/myorder.html', dependencies: ['view/myOrderCtrl']},
        '/web/map/:cId': { templateUrl: 'view/baidumap.html', dependencies: ['view/baidumapCtrl']},
        '/web/orderDetails/:orderId': { templateUrl: 'view/orderDetails.html', dependencies: ['view/orderDetailsCtrl']},
        '/web/city': { templateUrl: 'view/city.html', dependencies: ['view/cityCtrl']},
        '/web/vendor': { templateUrl: 'view/vendor.html', dependencies: ['view/vendorCtrl']},
        '/web/vendordetails/:vId': { templateUrl: 'view/vendordetails.html', dependencies: ['view/vendordetailsCtrl']}
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

        var _this = this;
        this.isLogin = false; //判断是否登录
        var loginCookie = commonService.getCookie('token');//获取token
        //通过token判断是否处于登录状态
        var loginService = new LoginService($resource);
        this.loginMain = function(loginCookie){   //通过token登陆
            var _this = this;
            loginService.loginInfo(loginCookie,function(data){
                //  console.log(data);
                if(data.status =='true'){
                    //   console.log("success");
                    _this.userDetail = data.message;
                }else{
                    //  console.log("fail");
                }
            })
        };

        //判断登陆的状态
        if (loginCookie != "") {
            _this.isLogin = true;
            this.loginMain(loginCookie);
        }else{
            _this.isLogin = false;
        }

        //注销登陆
        this.signOut=function(){
            loginService.logout(function(data){
                commonService.deleteCookie('token');  //防止服务器注销失败后，浏览器还保留token
                if(data.status == 'true'){
                    _this.isLogin = false;
                    window.location.href = "/";
                }else{
                    //console.log(data.message);
                }
            });
        };

        //查询天气信息
        this.weatherInfo = {};//天气信息
        var weatherService = new WeatherService($resource);
        this.queryWeatherInfo = function(){
            weatherService.getWeatherInfo(function(data){
                _this.weatherInfo = data.message;
                _this.weatherInfo.temperatureArea = _this.weatherInfo.retData.l_tmp + "-"+ _this.weatherInfo.retData.h_tmp + "°C";
            });
        };

        this.queryWeatherInfo();

        // angularjs ng-show指令有延迟，加载完毕后使用jQuery移除选择器隐藏样式
        $(".hide").removeClass("hide");

        var cityService = new CityService($resource);
        $scope.category = {}; //城市类别查询条件
        $scope.cities = []; //选择器城市
        $scope.citiesB = []; //底部快捷入口城市
        //按类别查询城市
        $scope.getCategoryCities = function(tag,val,area){
            $scope.category = {};
            $scope.category[tag] = val;
            cityService.getCategoryCities($scope.category,function(data){
                //console.log(JSON.stringify(data.message));
                if(area == 'top'){
                    $scope.cities = data.message;
                } else if(area == 'bottom'){
                    $scope.citiesB = data.message;
                }

            });

        }
        $scope.getCategoryCities('isHot',1,'top');
        $scope.getCategoryCities('isHot',1,'bottom');

        //订车条件
        $scope.bookParams = {
            takeCarCity:'武汉',
            takeCarCityId: '', //取车城市Id
            takeCarArea:'',
            takeCarAreaId:'', //商圈Id
            fromTime:'',
            toTime:''
        };


        //分页条件
        $scope.backPageObject= {
            currentPage : 1,
            totalPage : 0,
            pageSize : 5,
            pages : []
        };


        //控制选择器影藏显示
        $scope.isIFocus = false; //input框是否获得焦点
        $scope.isSFocus = false; //选择器是获得焦点
        $scope.isYMFocus = false; //年月选择是否获得焦点
        $scope.selectorIndex = -1; //选择器索引
        this.ymIndex = -1; //年月选择索引
        $scope.showSelector = function(index){
            $scope.selectorIndex = index;
            _this.selectorMenuIndex = 0;
            _this.ymIndex  = -1;
            switch(index){
                case 2: //取车时间选择器
                    $scope.initDatePicker("rental");
                    break;
                case 3: //还车时间选择器
                    $scope.initDatePicker("return");
                    break;
            }
        };
        //隐藏选择器
        var hideSelector = function(){
            $scope.selectorIndex = -1;
            _this.ymIndex = -1;
        };
        //点击屏幕除选择器地点隐藏
        $(document).click(function(){
            if(!$scope.isIFocus && !$scope.isSFocus && !$scope.isYMFocus){
                $scope.$apply(hideSelector);
            }
        });


        //城市区域选择控件
        this.selectorMenuIndex = 0; //选择器菜单索引
        //选取城市
        this.selectCityVal = function(val,cId){
            $scope.bookParams.takeCarCity = val;
            $scope.bookParams.takeCarCityId = cId;
            $scope.getAreasByCityId(cId);
            hideSelector();
        };
        //选取商圈
        this.selectAreaVal = function(val,tId){
            $scope.bookParams.takeCarArea = val;
            $scope.bookParams.takeCarAreaId = tId;
            hideSelector();
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


        //人气车型
        var packService = new PackService($resource);
        $scope.packs = [];
        //查询产品包列表
        this.getAllPack = function(){
            var takeTimeHaoMiao = new Date($scope.bookParams.fromTime).setHours(new Date().getHours());
            var returnTimeHaoMiao = new Date($scope.bookParams.toTime).setHours(new Date().getHours());
            this.backData = {
                takeCarCityId: 3, //取车城市
                takeCarTradeAreaId:504, //商圈ID 504武汉3
                startDate:takeTimeHaoMiao, //取车时间
                endDate:returnTimeHaoMiao, //还车时间
                pageSize:$scope.backPageObject.pageSize,
                currentPage:$scope.backPageObject.currentPage
            };
            packService.getAllPack(this.backData,function(data,headers){
                $scope.backPageObject.totalPage = headers('Page-Count'); //总页数
                $scope.packs = data.message.content; //当前页的信息
                // console.log(JSON.stringify(data));
            });
        };
        this.getAllPack();

        //预定
        this.checkSubscribe = function(vmid,vid,sid){
            $location.path("/web/vehicleBooking/"+vmid+"/"+vid+"/"+sid);
        };

        //获取热门城市
        $scope.cityArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        $scope.cityCategory = ['A-F','G-J','K-N','P-W','X-Z'];
        $scope.category = {}; //查询参数
        $scope.cities = []; //选择器城市
        $scope.citiesB = []; //底部快捷入口城市
        this.cityIndex = 0; //底部城市索引
        $scope.getCategoryCities = function(tag,val,area){
            $scope.category = {};
            $scope.category[tag] = val;
            cityService.getCategoryCities($scope.category,function(data){
                //console.log(JSON.stringify(data.message));
                if(area == 'top'){
                    $scope.cities = data.message;
                    //console.log(JSON.stringify($scope.cities));
                } else if(area == 'bottom'){
                    $scope.citiesB = data.message;
                }

            });

        }
        $scope.getCategoryCities('isHot',1,'top');
        $scope.getCategoryCities('isHot',1,'bottom');

        //根据城市获取商圈
        $scope.city = {}; //查询参数
        $scope.areas = [];
        $scope.getAreasByCityId = function(cId){
            $scope.city.cid = cId;
            cityService.getTradeAreas(cId,function(data){
                // console.log(JSON.stringify(data));
                $scope.areas = data.message;
                if($scope.areas.length > 0){
                    $scope.bookParams.takeCarArea = $scope.areas[0].name;
                    $scope.bookParams.takeCarAreaId = $scope.areas[0].id;
                } else{
                    $scope.bookParams.takeCarArea = '';
                    $scope.bookParams.takeCarAreaId = '';
                }

            });
        };

        //初始第一次
        $scope.bookParams.takeCarCity = '武汉';
        $scope.bookParams.takeCarCityId = 3;
        $scope.bookParams.takeCarAreaId = 504;
        $scope.getAreasByCityId(3);

        //点击立即订车
        this.bookCar = function(){
            commonService.addCookie('searchParams',$scope.bookParams.takeCarCityId + "&" + $scope.bookParams.takeCarAreaId + "&" + $scope.bookParams.fromTime + "&" + $scope.bookParams.toTime);
            $location.path("/web/shortRentCar/list");
        };

        //跳转到后台登录页面
        this.jumnpToMgr = function(){
          window.location.href = "/mgr/login";
        };


        //跳转到发送订单页面
        this.jump = function(pa){
            //$location.path("web/schedule/"+pa.id);
            window.location.href = '/web/schedule/' + pa.id;
        };

        //跳转到更多页面
        this.jumpToMotorcycle = function(){
            commonService.deleteCookie('motorcycleParams');
            commonService.addCookie('motorcycleParams',$scope.bookParams.takeCarCityId + "&" + $scope.bookParams.takeCarAreaId + "&" + $scope.bookParams.fromTime + "&" + $scope.bookParams.toTime);
            $location.path('/web/motorcycleList');
        };

        this.userLogin = function(){
            window.location.href = 'web/login';
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