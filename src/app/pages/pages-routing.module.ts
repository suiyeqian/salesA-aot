import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { TrackComponent } from './track/track.component';

// import { UserService } from '../core/services/user.service';
import { UserInfoResolver }   from './user-info-resolver.service';

const pagesRoutes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    // canActivate: [ UserService ],
    resolve: { userInfo: UserInfoResolver },
    children: [
      {
        path: '',
        // canActivateChild: [UserService],
        children: [
          { path: '', redirectTo: 'track', pathMatch: 'full' },
          { path: 'track', component: TrackComponent },
          { path: 'review', loadChildren: 'app/pages/review/review.module#ReviewModule'},
          { path: 'rank', loadChildren: 'app/pages/rank/rank.module#RankModule'},
          { path: 'info', loadChildren: 'app/pages/info/info.module#InfoModule'}
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'pages/track' }
];

@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    UserInfoResolver
  ]
})
export class PagesRoutingModule {}
