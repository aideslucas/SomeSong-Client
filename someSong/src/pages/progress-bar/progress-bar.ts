/**
 * Created by Eylam Milner on 5/27/2017.
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress;

  constructor() {
    this.progress = 0;
    for (let i = 0; i < 100; i++) {
      this.progress++;
    }

  }

}
