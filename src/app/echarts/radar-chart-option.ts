export const RadarChartOptions = {
  tooltip: {
    show: true,
    formatter: function (value) {

    }
//     formatter: function (value, index) {
//       console.log(value,index)
//     // 格式化成月/日，只在第一个刻度显示年份
//     var date = new Date(value);
//     var texts = [(date.getMonth() + 1), date.getDate()];
//     return texts.join('/');
// }
  },
  radar: [
    {
      indicator: [],
      radius: 80,
      name: {
        textStyle: {
          color: '#fdcb04',
          fontSize: 14
        }
      },
      splitLine: {
        lineStyle: { color: 'rgba(127,127,127,1)' }
      },
      splitArea: { show: false },
      axisLine: { show: false }
    }
  ],
  series: [
    {
      name: '我的竞争力',
      type: 'radar',
      symbol: 'none',
      lineStyle: {
        normal: {
          opacity: 0
        }
      },
      areaStyle: {
        normal: {
          opacity: 0.7,
          color: {
            type: 'linear',
            x: 0, y: 0,
            x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#fb9a02' },
              { offset: 1, color: '#fdbf04' }
            ]
          }
       }
     },
      data: [{ value: [] }]
    }
  ]
};
