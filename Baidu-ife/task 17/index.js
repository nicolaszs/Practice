/* 数据格式演示
var aqiSourceData = {
  "北京": {
  "2016-01-01": 10,
  "2016-01-02": 10,
  "2016-01-03": 10,
  "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date('2016-01-01');
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};


// 用于渲染图表的数据
var chartData = {};


// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: 'day',
};

/**
 * 获取柱子背景
 */

var colors = [
    '#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95',
    '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'
];


/**
 * 渲染图表
 */
function renderChart() {
    //获取图表所在位置
    //重置表格内容
    //给图表添加css样式
    var aqiChartWrap = document.getElementsByClassName('aqi-chart-wrap')[0];
    aqiChartWrap.innerHTML = '';
    aqiChartWrap.style.cssText = 'border:2px solid #ddd; width: 90%; height: 550px;' +
           'display: flex; justify-content: center;align-items: flex-end; align-content:center;' +
           'margin: 10px auto; padding: 10px;';

    //渲染每个图表的样式
    //获取表格数据中的date属性
    //创建子元素
    //给图表添加内容并且给子元素添加样式
    for (var date in chartData) {
        var aqiValue = chartData[date];
        var li = document.createElement('li');
        aqiChartWrap.innerHTML += '<li style = "background-color:' + colors[Math.floor(aqiValue / 50)] +'; margin:0 1px; width: 100px;' + 'list-style: none;' + 'height:' + aqiValue + 'px;" title =' + (date + '空气质量：' + aqiValue) + '></li>';
    }
    
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定时间选项是否发生了变化 
    // 设置对应数据
    // 调用图表渲染函数
    if (pageState.nowGraTime === this.value) {
        return;
    } else {
        pageState.nowGraTime = this.value;        
    }
    initAqiChartData();
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定城市选项是否发生了变化 
    // 设置对应数据
    // 调用图表渲染函数
    if (pageState.nowSelectCity === this[this.selectedIndex].value) {
        return;
    } else {
        pageState.nowSelectCity = this[this.selectedIndex].value;
    }
    initAqiChartData();
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    //获取时间选项按钮
    //给时间选项按钮绑定点击事件
    var inputs = document.getElementById('form-gra-time').getElementsByTagName('input');
    for (var i = inputs.length - 1; i >= 0; i--) {
        inputs[i].onclick = graTimeChange;
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var options = '';
    for (var cityName in aqiSourceData) {
        if (pageState.nowSelectCity === -1) {
            pageState.nowSelectCity = cityName;
        }
        options += '<option>' + cityName + '</option>';
    }

    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    var citySelect = document.getElementById('city-select');
    citySelect.innerHTML = options;
    citySelect.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var cityAqiData = aqiSourceData[pageState.nowSelectCity];

    //日期为day传出数据
    if (pageState.nowGraTime === 'day') {
        chartData = cityAqiData;
    }
    
    //日期为week传出数据
    if (pageState.nowGraTime === 'week') {
        chartData = {};
        var aqiSum = 0;
        var dayNum = 0;
        var strStartDate = '';

        for (var strdate in cityAqiData) {
            var date = new Date(strdate);
            var day = date.getDay();

            // 一周从周日开始，也就是day为0
            if (day === 0 && aqiSum > 0) {
                var aqi = Math.floor(aqiSum / dayNum);
                var key = strStartDate + '-' + strdate + '平均';
                chartData[key] = aqi;
            } else if (day === 0 && aqiSum <= 0) {
                dayNum = 0;
                aqiSum = 0;
                strStartDate = strdate;
            } else if (strStartDate === '') {
                strStartDate = strdate;
            } else {                
                dayNum++;
                aqiSum += cityAqiData[strdate];
            }
        }

        if (aqiSum > 0) {
            var aqi = Math.floor(aqiSum / dayNum);
            var key = strStartDate + '-' + strdate + '平均';
            chartData[key] = aqi;
        }
    }

    //日期为month传出数据
    if (pageState.nowGraTime === 'month') {
        chartData = {};
        var curMonth = -1;
        var dayNum = 0;
        var aqiSum = 0;

        for (var strdate in cityAqiData) {
            var date = new Date(strdate);
            var month = date.getMonth();

            if (month !== curMonth && dayNum > 0) {
                    var aqi = Math.floor(aqiSum / dayNum);
                    var key = date.getFullYear() + '年' + date.getMonth() + '月' + '平均';
                    chartData[key] = aqi;
            } else if (month !== curMonth && dayNum <= 0) {
                curMonth = month;
                dayNum = 0;
                aqiSum = 0;
            } else {   
                dayNum++;
                aqiSum += cityAqiData[strdate];
            }
        }

        if (dayNum > 0) {
            var aqi = Math.floor(aqiSum / dayNum);
            var key = date.getFullYear() + "年" + (date.getMonth() + 1) + '月' + '平均';
            chartData[key] = aqi;
        }
    }
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();

    renderChart();
}

init();
console.log(aqiSourceData);