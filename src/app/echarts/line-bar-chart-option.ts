export const LineBarChartOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type : 'shadow' }
  },
  calculable : true,
  legend: {
    data: ['合同金额', '申请单量', '放款单量'],
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
    },
    {
      type : 'value',
      splitNumber: 3,
      axisTick: { show: false },
      axisLabel: {
        textStyle: { color: '#ccc' }
      },
      axisLine: { show: false },
      splitLine: { show: false },
    }
  ],
  series: [
    {
      name: '合同金额',
      type: 'line',
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
    },
    {
      name: '申请单量',
      type: 'bar',
      yAxisIndex: 1,
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
      yAxisIndex: 1,
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
    }
  ]
};
