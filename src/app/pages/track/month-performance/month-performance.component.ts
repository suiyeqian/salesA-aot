import { Component, OnInit, Input } from '@angular/core';

import { BackendService } from '../../../core/services/backend.service';
import * as echart from '../../../echarts';

@Component({
  selector: 'my-month-performance',
  templateUrl: './month-performance.component.html',
  styleUrls: ['./month-performance.component.scss']
})
export class MonthPerformanceComponent implements OnInit {
  private weeklytrendUrl = 'performancetrack/weekly_trend';
  trendOption = Object.assign({});
  private achieveforecastUrl = 'performancetrack/achievement_forecast';
  achieveforecast = Object.assign({});
  // intervalNums = [0, 5, 15, 30, 45];
  // intervalPers = [1.0, 2.3, 3.1, 3.4, 4.0];
  private positionPoint = [0, 12, 27, 45, 66];
  myPctPosition: string;
  myRealPctPosition: string;
  private checkwarningUrl = 'performancetrack/check_warning';
  warningInfos = Object.assign({});
  bonusShow = false;
  awardShow = false;
  private formalProgressUrl = 'performancetrack/formal-progress';
  fullMemObj = Object.assign({});;
  @Input() timeProgress: number;

  constructor(
    private bdService: BackendService
  ) {
  }

  ngOnInit() {
    this.getWeeklyTrend();
    this.getAchieveForecast();
    this.getWarning();
    this.getForamlprogress();
  }

  getWeeklyTrend(): void {
    this.bdService
        .getAll(this.weeklytrendUrl)
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            echart.LineBarChartOptions.xAxis[0].data = ['W1', 'W2', 'W3', 'W4', 'W5'];
            echart.LineBarChartOptions.series[0].data =
              [resData.w1AppNumber, resData.w2AppNumber, resData.w3AppNumber, resData.w4AppNumber, resData.w5AppNumber].reverse();
            echart.LineBarChartOptions.series[1].data =
              [resData.w1Number, resData.w2Number, resData.w3Number, resData.w4Number, resData.w5Number].reverse();
            this.trendOption = echart.LineBarChartOptions;
            echart.LineBarChartOptions.series[2].data =
              [resData.w1Amt, resData.w2Amt, resData.w3Amt, resData.w4Amt, resData.w5Amt].reverse();
          }
        });
  }

  getAchieveForecast(): void {
    this.bdService
        .getAll(this.achieveforecastUrl)
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            // 计算提成系数和位置及预计奖金
            let expectAmt = resData.expectAmt / 10000;
            for (let i = resData.sections.length - 1; i >= 0; i--) {
              if (+expectAmt === +resData.sections[i]) {
                this.myPctPosition = this.positionPoint[i] + '%';
                resData.coefficient = resData.coefficients[i];
                resData.royaltyAmt = resData.expectAmt * resData.coefficient / 100;
                break;
              }
              if (+expectAmt > +resData.sections[i]) {
                resData.coefficient = resData.coefficients[i];
                resData.royaltyAmt = resData.expectAmt * resData.coefficient / 100;
                if (i === resData.sections.length - 1) {
                  this.myPctPosition = '76%';
                  break;
                }
                let interval_n = +resData.sections[i + 1] - resData.sections[i];
                let interval_p = +this.positionPoint[i + 1] - this.positionPoint[i];
                this.myPctPosition = +this.positionPoint[i] + (expectAmt - resData.sections[i]) * interval_p / interval_n + '%';
                break;
              }
            }
            // 计算已完成的提成系数的位置及已完成奖金
            let cmpeAmt = resData.cmpeAmt / 10000;
            for (let i = resData.sections.length - 1; i >= 0; i--) {
              if (+cmpeAmt === +resData.sections[i]) {
                this.myRealPctPosition = this.positionPoint[i] + '%';
                resData.cmpeBonus = resData.cmpeAmt * resData.coefficients[i] / 100;
                break;
              }
              if (+cmpeAmt > +resData.sections[i]) {
                resData.cmpeBonus = resData.cmpeAmt * resData.coefficients[i] / 100;
                if (i === resData.sections.length - 1) {
                  this.myRealPctPosition = '71%';
                  break;
                }
                let interval_n = +resData.sections[i + 1] - resData.sections[i];
                let interval_p = +this.positionPoint[i + 1] - this.positionPoint[i];
                this.myRealPctPosition = +this.positionPoint[i] + (cmpeAmt - resData.sections[i]) * interval_p / interval_n + '%';
                break;
              }
            }
            this.achieveforecast = resData;
          }
        });
  }

  getWarning(): void {
    this.bdService
        .getAll(this.checkwarningUrl)
        .then((res) => {
          if ( res.code === 0) {
            let resData = res.data;
            resData.totalNum = resData.m2Number + resData.m1Number + resData.number;
            resData.cntRate = resData.totalNum / resData.goalCnt;
            resData.totalAmt = resData.m2Amt + resData.m1Amt + resData.amt;
            resData.amtRate = resData.totalAmt / resData.goalAmt;
            this.warningInfos = resData;
          }
        });
  }

  getForamlprogress(): void {
    this.bdService
        .getAll(this.formalProgressUrl)
        .then((res) => {
          if (res.code === 0) {
            this.fullMemObj = res.data;
          }
        })
  }

}
