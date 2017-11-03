export const LineBarChartOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type : 'shadow' }
  },
  calculable : true,
  legend: {
    data: ['申请单量', '放款单量', '合同金额'],
    right: 0,
    textStyle: { color: '#ccc' }
  },
  xAxis : [
    {
      type: 'category',
      data: [],
      axisTick: { show: false },
      axisLabel: {
        textStyle: { color: '#ccc' }
      },
    }
  ],
  yAxis: [
    {
      type : 'value',
      name: '单位(件)',
      nameTextStyle: { color: '#ccc' },
      splitNumber: 3,
      axisTick: { show: false },
      axisLabel: {
        textStyle: { color: '#ccc' }
      },
      axisLine: { show: false },
      splitLine: { show: false },
    },
    {
      type : 'value',
      name: '单位(万元)',
      nameTextStyle: { color: '#ccc' },
      splitNumber: 3,
      axisTick: { show: false },
      axisLabel: {
        formatter: '{value}',
        textStyle: { color: '#ccc' }
      },
      axisLine: { show: false },
      splitLine: { show: false },
    }

  ],
  series: [
    {
      name: '申请单量',
      type: 'bar',
      data: [],
      barWidth: '40%',
      itemStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0, y: 0,
            x2: 0, y2: 1,
            colorStops: [
              {offset: 0, color: '#fdbf04'},
              {offset: 1, color: '#fb9a02'}
            ],
          }
        }
      }
    },
    {
      name: '放款单量',
      type: 'bar',
      yAxisIndex: 0,
      data: [],
      barGap: 0,
      barWidth: '40%',
      itemStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0, y: 0,
            x2: 0, y2: 1,
            colorStops: [
              {offset: 0, color: '#fd6204'},
              {offset: 1, color: '#9a2819'}
            ],
          }
        }
      }
    },
    {
      name: '合同金额',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      data: [],
      itemStyle: {
        normal: {
          color: '#51c3cd',
        },
        opacity: 0
      },
      lineStyle: {
        normal: {
          color: '#51c3cd',
          shadowColor: 'rgba(3, 3, 3, 0.26)',
          shadowBlur: 10,
          shadowOffsetY: 2,
          shadowOffsetX: 2
        }
      }
    }
  ]
};
