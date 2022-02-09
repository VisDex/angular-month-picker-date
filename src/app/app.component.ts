import { Component } from '@angular/core';
import { MONTHS } from './monthpicker/monthpicker.constant';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent {

  selectedYearAsText: string;
  selectedMonthIndex: number;
  selectedMonthAsText: string;
  months = MONTHS;

  onChange(event: { monthIndex: number, year: number }) {
    this.selectedYearAsText = event.year.toString();
    this.selectedMonthIndex = event.monthIndex;
    this.selectedMonthAsText = this.months[event.monthIndex];

    console.warn(this.selectedYearAsText, this.selectedMonthAsText, `(month index: ${this.selectedMonthIndex})`);
  }
}
