import { Injectable }             from '@angular/core';
import { Resolve } from '@angular/router';

import { BackendService } from '../core/services/backend.service';

@Injectable()
export class UserInfoResolver implements Resolve<any> {
  private userUrl = 'rest/personalinfo/my_info';
  constructor(private bdService: BackendService) {}

  resolve(): Promise<any> {

    return this.bdService.getAll(this.userUrl).then(res => {
      if ( res.code === 0 && res.data) {
        return res.data;
        // sessionStorage.clear();
        // sessionStorage.setItem('user', JSON.stringify(res.data));
      } else {
        alert('用户不存在！');
        return null;
      }
      // if (crisis) {
      //   return crisis;
      // } else { // id not found
      //   this.router.navigate(['/crisis-center']);
      //   return null;
      // }
    });
  }
}
