export const GaugeChartOptions = {
  tooltip : { show: false },
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      radius: '95%',
      axisLine: {
        show: true,
        lineStyle: {
          color: [
            [0,
              {
                type: 'linear',
                x: 0, y: 0,
                x2: 1, y2: 0,
                colorStops: [
                  { offset: 0, color: '#fdbf04'},
                  { offset: 1, color: '#fb9a02'}
                ],
              }
            ],
            [1, '#363125']
          ],
          width: 23
        }
      },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
       detail : {
        show : true,
        offsetCenter: [0, -15],
        formatter: '{value}%',
        textStyle: {
            fontSize : 20,
            color: '#fe4504',
            fontWeight: 'bold'
        }
      },
      data: [{value: 0}]
    }
  ]
};
