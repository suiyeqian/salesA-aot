import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PERSONSCORE } from './modal.constant';

@Component({
  selector: 'ngbd-modal',
  templateUrl: './modal.component.html'
})
export class NgbdModalComponent implements OnInit {
  @Input() isTeamLeader = false;
  firScores = [1, 2, 3, 4, 5];
  secScores = [6, 7, 8, 9, 10];
  contentObj = [];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
      this.contentObj = PERSONSCORE;
      this.secScores = [];
  }
   closeModal() {
     let ele = document.querySelector('.modal');
     ele.className = ele.className + ' close';
     setTimeout(() => {
       this.activeModal.close();
     }, 300);
   }
}
