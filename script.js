'use strict';

var industryData = {};
var productData = {};

var importData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var exportData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var prodData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var shareData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//[7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6];

var ChartObject = {
    title: {
        text: 'Товарооборот'
    },
    rangeSelector:
    {
        enabled: false
    },
    chart: {
        renderTo: 'chart',
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
            text: 'Долларов'
        }
    },
    tooltip: {
        split: true,
        valueSuffix: ' долларов'
    },
    /*plotOptions: {
        area: {
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        },
        series: {
            compare: 'percent',
            showInNavigator: true
        }
    },*/
    series: [
    {
        name: 'Импорт',
        data: importData
    }, 
    {
        name: 'Экспорт',
        data: exportData
    }
    /*, 
    {
        name: 'Производство',
        data: prodData
    }*/
    ]
};

var Chart2Object = {

    title: {
        text: 'Доля импорта',
    },
    rangeSelector:
    {
        enabled: false
    },
    chart: {
        renderTo: 'chart2'
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
        data: shareData
    }]
};

var ImportChart;
var ShareChart;

var importmetrApp = angular.module('importmetrApp', []);
importmetrApp.controller('treeController', ['$scope', '$http', '$timeout', '$sce', function ($scope, $http, $timeout, $sce) {
    $scope.Industries = [];
    $scope.selectedYear = 2016;
    $scope.years = [2015, 2016];
    $scope.display = {code: "", name: "", year: ""}

    $http.get('http://importmetr.ru:8081/importmeter/all_industries').success(function (getAllIndustriesResponse) {
        if (getAllIndustriesResponse != null) {
            $scope.Industries = getAllIndustriesResponse.data;
            console.log("Данные по отраслям загружены -->");
            console.log("Массив из отраслей", $scope.Industries);
        };
    });
    
    $scope.OnIndustryClick = function (industry) 
    {

        //Все продукты
        $http.get('http://importmetr.ru:8081/importmeter/' + industry.code + '/all_products').success(function (getAllProductsResponse) {
            if (getAllProductsResponse != null) {
                industry.products = getAllProductsResponse.data;
                console.log("Массив из продуктов", industry.products);
            };
        });

        //Импорт отрасли
        $http.get('http://importmetr.ru:8081/importmeter/' + industry.code + '/' + $scope.selectedYear + '/import').success(function (getImportResponse) {
            if (getImportResponse != null && getImportResponse.data.year_import_months_dollars != null) {
                importData = getImportResponse.data.year_import_months_dollars;
                $scope.display.code = getImportResponse.data.industry_code;
                $scope.display.name = getImportResponse.data.industry_name;
                $scope.display.year = $scope.selectedYear;
                console.log("Массив импорта отрасли", importData);
                ImportChart.series[0].setData(importData, true);

            };
        });

        //Экспорт отрасли
        $http.get('http://importmetr.ru:8081/importmeter/' + industry.code + '/' + $scope.selectedYear + '/export').success(function (getExportResponse) {
            if (getExportResponse != null && getExportResponse.data.year_import_months_dollars != null) {
                exportData = getExportResponse.data.year_import_months_dollars;
                $scope.display.code = getExportResponse.data.industry_code;
                $scope.display.name = getExportResponse.data.industry_name;
                $scope.display.year = $scope.selectedYear;
                console.log("Массив экспорта отрасли", exportData);
                ImportChart.series[1].setData(exportData, true);
                for (var i=0; i<prodData.length-1; i++)
                {
                    shareData[i] = importData[i] / (importData[i] + prodData[i] - exportData[i]);
                };
                ShareChart.series[0].setData(shareData, true);

            };
        });

        //Производство отрасли
       /* $http.get('http://importmetr.ru:8081/importmeter/' + industry.code + '/' + $scope.selectedYear + '/production').success(function (getProdResponse) {
            if (getProdResponse != null && getProdResponse.data.year_import_months_dollars != null) {
                prodData = getProdResponse.data.year_import_months_dollars;
                $scope.display.code = getProdResponse.data.industry_code;
                $scope.display.name = getProdResponse.data.industry_name;
                $scope.display.year = $scope.selectedYear;
                console.log("Массив производства отрасли", prodData);
                ImportChart.series[2].setData(prodData, true);
            };
            for (var i=0; i<prodData.length-1; i++)
            {
                shareData[i] = importData[i] / (importData[i] + prodData[i] - exportData[i]);
            };
            ShareChart.series[0].setData(shareData, true);
        });*/

    }

    $scope.OnProductClick = function (product)
    {

        //Импорт продукта
        $http.get('http://importmetr.ru:8081/importmeter/' + product.tnved4 + '/' + product.tnved6 + '/' + $scope.selectedYear + '/import').success(function (getImportResponse) {
            if (getImportResponse != null && getImportResponse.data.year_import_months_dollars != null) {
                importData = getImportResponse.data.year_import_months_dollars;
                $scope.display.code = getImportResponse.data.product_name;
                $scope.display.name = getImportResponse.data.product_code;
                $scope.display.year = $scope.selectedYear;
                console.log("Массив импорта продуктов", importData);
                ImportChart.series[0].setData(importData, true);
                for (var i=0; i<prodData.length-1; i++)
                {
                    shareData[i] = importData[i] / (importData[i] + prodData[i] - exportData[i]);
                };
                ShareChart.series[0].setData(shareData, true);

            };
        });

        //Экспорт продукта
        $http.get('http://importmetr.ru:8081/importmeter/' + product.tnved4 + '/' + product.tnved6 + '/' + $scope.selectedYear + '/export').success(function (getExportResponse) {
            if (getExportResponse != null && getExportResponse.data.year_import_months_dollars != null) {
                exportData = getExportResponse.data.year_import_months_dollars;
                $scope.display.code = getExportResponse.data.product_name;
                $scope.display.name = getExportResponse.data.product_code;
                $scope.display.year = $scope.selectedYear;
                console.log("Массив экспорта продуктов", exportData);
                ImportChart.series[1].setData(exportData, true);
                for (var i=0; i<prodData.length-1; i++)
                {
                    shareData[i] = importData[i] / (importData[i] + prodData[i] - exportData[i]);
                };
                ShareChart.series[0].setData(shareData, true);

            };
        });

        //Производство продукта
       /* $http.get('http://importmetr.ru:8081/importmeter/' + product.tnved4 + '/' + product.tnved6 + '/' + $scope.selectedYear + '/production').success(function (getProdResponse) {
            if (getProdResponse != null && getProdResponse.data.year_import_months_dollars != null) {
                prodData = getProdResponse.data.year_import_months_dollars;
                $scope.display.code = getProdResponse.data.product_name;
                $scope.display.name = getProdResponse.data.product_code;
                $scope.display.year = $scope.selectedYear;
                console.log("Массив производства", prodData);
                ImportChart.series[2].setData(prodData, true);
            };
            for (var i=0; i<prodData.length-1; i++)
            {
                shareData[i] = importData[i] / (importData[i] + prodData[i] - exportData[i]);
            };
            ShareChart.series[0].setData(shareData, true);
        });*/


    }

}]);

ImportChart = new Highcharts.chart(ChartObject);
ShareChart = new Highcharts.chart(Chart2Object);


        /*
        $(function () {
            ImportChart = Highcharts.stockChart('chart', ChartObject);
        });

        $(function () {
            ShareChart = Highcharts.stockChart('chart2', Chart2Object);
        });

        */



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





        function getImportIndustry(year, industryCode) 
        {

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



        function getExportIndustry(year, industryCode) 
        {

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



