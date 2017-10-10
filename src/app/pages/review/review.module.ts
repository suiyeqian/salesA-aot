import { NgModule } from '@angular/core';

import { ReviewComponent } from './review.component';
import { LastMonthReviewComponent } from './part1/part1.component';

import { SharedModule } from '../../shared/shared.module';
import { RibbonModule } from '../../my-components/ribbon/ribbon.module';
import { ReViewRoutingModule } from './review-routing.module';

import { AngularEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    SharedModule,
    AngularEchartsModule,
    RibbonModule,
    ReViewRoutingModule
  ],
  declarations: [
    ReviewComponent,
    LastMonthReviewComponent
  ],
  exports: [ ],
  providers: [ ]
})
export class ReviewModule { }
