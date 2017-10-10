import { NgModule,  Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { throwIfAlreadyLoaded } from './module-import-guard';

import { TabnavComponent } from './tabnav/tabnav.component';

import { BackendService } from './services/backend.service';
// import { UserService } from './services/user.service';
import { SpinnerService } from './services/spinner.service';
import { WaterMarkService } from './services/watermark.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    TabnavComponent,
  ],
  exports: [
    TabnavComponent,
  ],
  providers: [
    // UserService,
    BackendService,
    SpinnerService,
    WaterMarkService
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
      throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
