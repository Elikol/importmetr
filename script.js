'use strict';

var industryData = {};
var productData = {};
var industryDataArr = [];
var test = [1, 2, 3];

var importmetrApp = angular.module('importmetrApp', []);
importmetrApp.controller('treeController', ['$scope', '$http', '$timeout', '$sce', function ($scope, $http, $timeout, $sce) {
    $scope.Industries = [];

    $http.get('http://importmetr.ru:8081/importmeter/all_industries').success(function (getAllIndustriesResponse) {
        if (getAllIndustriesResponse != null) {
            $scope.Industries = getAllIndustriesResponse.data;
            console.log("Данные по отраслям загружены -->");
            console.log("Массив из отраслей", $scope.Industries);
        };
    });
    
    $scope.OnIndustryClick = function (industry) {

        $http.get('http://importmetr.ru:8081/importmeter/' + industry.code + '/all_products').success(function (getAllProductsResponse) {
            if (getAllProductsResponse != null) {
                industry.products = getAllProductsResponse.data;
                console.log("Массив из продуктов", industry.products);
            };
        });
    }
}]);


var ChartObject = {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Товарооборот'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'],
        tickmarkPlacement: 'on',
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: 'Тысяч'
        },
        labels: {
            formatter: function () {
                return this.value / 1000;
            }
        } 
    },
    tooltip: {
        split: true,
        valueSuffix: ' тысяч'
    },
    plotOptions: {
        area: {
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        }
    },
    series: [
    {
        name: 'Импорт',
        data: {}
    }, {
        name: 'Экспорт',
        data: {}
    }, {
        name: 'Производство',
        //data: [163, 203, 276, 408, 547, 729, 628, 163, 203, 276, 408, 547]
    }, {
        name: 'Потребление',
        //data: [18, 31, 54, 156, 339, 818, 1201, 18, 31, 54, 156, 339]
    }
    ]
};
var Chart2Object = {
    title: {
        text: 'Доля импорта',
    },
    xAxis: {
        categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек']
    },
    yAxis: {
        title: {
            text: 'Процентов'
        }
    },
    tooltip: {
        valueSuffix: '%'
    },
    series: [{
        name: 'Доля импорта в отрасли',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
    }]
};

function updateChartImport() 
{
    console.log(ChartObject.series);
    var zeroArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i <= ChartObject.series.length-1; i++) 
    {
        if (ChartObject.series[i].name ===  "Импорт") 
        {
            if ( _.isEqual(ChartObject.series[i].data, zeroArray) ) 
                        { ChartObject.series[i].data = getImportIndustry(2016, 1001); }
                    else { ChartObject.series[i].data = zeroArray; }
                }
            };
            $(function () {
                Highcharts.chart('chart', ChartObject);
            });

        };

        function updateChartExport() 
        {
            var zeroArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i <= ChartObject.series.length-1; i++) 
            {
                if (ChartObject.series[i].name ===  "Экспорт") 
                {
                    if ( _.isEqual(ChartObject.series[i].data, zeroArray) ) 
                        { ChartObject.series[i].data = getExportIndustry(2016, 1001); }
                    else { ChartObject.series[i].data = zeroArray; }
                }
            };
            $(function () {
                Highcharts.chart('chart', ChartObject);
            });

        };

        function updateChartProd () 
        {
            var zeroArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i <= ChartObject.series.length-1; i++) 
            {
                if (ChartObject.series[i].name ===  "Производство") 
                {
                    if ( _.isEqual(ChartObject.series[i].data, zeroArray) ) 
                        { ChartObject.series[i].data = [163, 203, 276, 408, 547, 729, 628, 163, 203, 276, 408, 547]; }
                    else { ChartObject.series[i].data = zeroArray; }
                }
            };
            $(function () {
                Highcharts.chart('chart', ChartObject);
            });

        };

        function updateChartCons  () 
        {
            var zeroArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i <= ChartObject.series.length-1; i++) 
            {
                if (ChartObject.series[i].name ===  "Потребление") 
                {
                    if ( _.isEqual(ChartObject.series[i].data, zeroArray) ) 
                        { ChartObject.series[i].data = [18, 31, 54, 156, 339, 818, 1201, 18, 31, 54, 156, 339]; }
                    else { ChartObject.series[i].data = zeroArray; }
                }
            };
            $(function () {
                Highcharts.chart('chart', ChartObject);
            });

        };



        $(function () {
    Highcharts.chart('chart', ChartObject); //Highcharts.stockChart
});

        $(function () {
            Highcharts.chart('chart2', Chart2Object);
        });





        function getImportIndustry(year, industryCode) {

            var url = URI.expand("http://importmetr.ru:8081/importmeter/{code}/{ghod}/import", {
              code: industryCode,
              ghod: year
          });

            url = url.toString();
            axios.get(url).then(function(response)
            {
                console.log(response);
                if (response.data.data.year_import_months_dollars != undefined)
                {
                    var Import = response.data.data.year_import_months_dollars;
                    for (var i = 0; i <= ChartObject.series.length-1; i++) 
                    {
                        if (ChartObject.series[i].name ===  "Импорт") 
                        {
                             ChartObject.series[i].data = Import; //splice? vue.set?
                         }
                     };
                 }
                 else
                 {
                    for (var i = 0; i <= ChartObject.series.length-1; i++) 
                    {
                        if (ChartObject.series[i].name ===  "Импорт") 
                        {
                         ChartObject.series[i].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                     }
                 };
             }
         });

        };



        function getExportIndustry(year, industryCode) {

            var url = URI.expand("http://importmetr.ru:8081/importmeter/{code}/{ghod}/export", {
              code: industryCode,
              ghod: year
          });

            url = url.toString();
            axios.get(url).then(function(response)
            {
             if (response.data.data.year_export_months_dollars != undefined)
             {
                var Export = response.data.data.year_export_months_dollars;
                for (var i = 0; i <= ChartObject.series.length-1; i++) 
                {
                    if (ChartObject.series[i].name ===  "Экспорт") 
                    {
                     ChartObject.series[i].data = Export;
                 }
             };
         }
         else
         {
            for (var i = 0; i <= ChartObject.series.length-1; i++) 
            {
                if (ChartObject.series[i].name ===  "Экспорт") 
                {
                 ChartObject.series[i].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
             }
         };
     }

 });

        };


        function getProdIndustry(year, industryCode) {};
        function getConsIndustry(year, industryCode) {};
        function getImportShareIndustry(year, industryCode) {};
        function getImportTargerIndustry(year, industryCode) {};
        function getImportPredictionIndustry(year, industryCode) {};

        function getImportProduct(year, productCode) {
        };
        function getExportProduct(year, productCode) {
        };
        function getProdProduct(year, productCode) {};
        function getConsProduct(year, productCode) {};
        function getImportShareProduct(year, productCode) {};
        function getImportTargerProduct(year, productCode) {};
        function getImportPredictionProduct(year, productCode) {};

        function setChart(numbers) {

        };
        function setChartImport(numbers) {};
        function setChartExport(numbers) {};
        function setChartProd(numbers) {};
        function setChartCons(numbers) {};
        function setChartImportShare(numbers) {};
        function setChartImportTarget(numbers) {};
        function setChartImportPrediction(numbers) {};
