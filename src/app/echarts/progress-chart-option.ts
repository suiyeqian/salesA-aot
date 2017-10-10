export const ProgressChartOptions = {
  series : [
    {
      type : 'pie',
      radius : [40, 60],
      itemStyle : {
        normal : {
          label : {
            formatter : '销售进度',
            textStyle: {
              color: '#ccc',
              fontSize : 12,
              baseline : 'top'
            }
          }
        },
      },
      data : [
        {
          value: 0,
          itemStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0, y: 0,
                x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#fdbf04'},
                  { offset: 1, color: '#fb9a02'}
                ],
              },
              label : {
                show : true,
                position : 'center',
                formatter : '{c}%',
                textStyle: {
                  color: '#fe4504',
                  fontSize : 18,
                  fontWeight : 'bold',
                  baseline : 'bottom'
                }
              },
              labelLine : {
                show : false
              }
            }
          }
        },
        {
          value: 100 - 0,
          itemStyle: {
            normal: {
              color: '#352e28',
              label: {
                show: true,
                position: 'center'
              },
              labelLine: { show : false }
            },
          }
        },
      ]
    },
  ]
};
