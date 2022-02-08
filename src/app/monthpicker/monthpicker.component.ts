import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'monthpicker',
  templateUrl: './monthpicker.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthpickerComponent implements OnInit {
  @Input() renderOption: string;
  @Input() year: number;
  @Input() month: number;

  @Input() enabledMonths: Array<number> = [];
  @Input() disabledMonths: Array<number> = [];

  @Input() enabledYears: Array<number> = [];
  @Input() disabledYears: Array<number> = [];
  @Input() startYear: number;
  @Input() endYear: number;
  @Input() locale: string;
  @Output() change = new EventEmitter<{ monthIndex: number; year: number }>();

  model: MonthPickerModel;
  isShowYears: boolean;
  years: Array<number> = [];
  selectedYearAsText: string;
  selectedMonthAsText: string;
  yearRanges: Array<number>;
  currentYear: number;
  yearStartIndex: number;
  yearEndIndex: number;
  inputText = "01/2021"
  validFormat: boolean;
  yearInRange: boolean;

  ngOnInit() {
    this.model = new MonthPickerModel();
    this.yearRanges = this.model.generateYearsBetween(
      this.startYear,
      this.endYear
    );

    if (this.year) {
      this.model.selectedYearDate.setFullYear(this.year);
      this.model.updateYearText();
    }

    if (this.month >= 0 && this.month < 12) {
      this.model.selectedMonthIndex = this.month;
      this.model.selectedMonthDate.setMonth(this.month);
      if (this.year) { this.model.selectedMonthYear = this.year };
    }

    this.onChange(this.model.selectedMonthIndex, this.model.selectedMonthYear);
  }

  decrementMonth() {
    if(this.model.selectedYearDate.getFullYear() > this.yearRanges[0]){
      const [monthIndex, year] = this.model.decrementMonth(
        this.model.selectedMonthIndex,
        this.model.selectedMonthYear
      );
      this.showMonthYear(monthIndex, year);
    }
  }

  incrementMonth() {
    if(this.model.selectedYearDate.getFullYear() < this.yearRanges[this.yearRanges.length - 1]){
      const [monthIndex, year] = this.model.incrementMonth(
        this.model.selectedMonthIndex,
        this.model.selectedMonthYear
      );
      this.showMonthYear(monthIndex, year);
    }
  }

  decrementYear(){
    if(this.model.selectedYearDate.getFullYear() > this.yearRanges[0]){
      this.model.decrementYear();
    }
  }

  incrementYear(){
    if(this.model.selectedYearDate.getFullYear() < this.yearRanges[this.yearRanges.length - 1]){
      this.model.incrementYear();
    }
  }

  selectMonth(index: number) {
    this.model.selectMonth(index);
    this.onChange(this.model.selectedMonthIndex, this.model.selectedMonthYear);
  }

  isSelectedMonth(monthIndex: number): boolean {
    return (
      this.model.selectedMonthIndex === monthIndex &&
      this.model.selectedMonthYear === this.model.selectedYearDate.getFullYear()
    );
  }

  onChange(monthIndex: number, year: number) {
    this.showMonthYear(monthIndex, year);
    this.change.emit({ monthIndex: monthIndex, year: year });
  }

  isDisabled(index: number): boolean {
    let disabled = false;
    if (this.enabledMonths && this.enabledMonths.length > 0) {
      disabled = this.enabledMonths.indexOf(index) < 0;
    }
    if (this.disabledMonths && this.disabledMonths.length > 0) {
      disabled = this.disabledMonths.indexOf(index) >= 0;
    }
    return disabled;
  }

  toggleShowYears() {
    this.isShowYears = !this.isShowYears;
    if (this.isShowYears) {
      const selectedYearIndex = this.yearRanges.findIndex(
        (x) => x === this.model.selectedMonthYear
      );
      this.yearStartIndex = selectedYearIndex - 12 < 0 ? 0: selectedYearIndex - 12;
      if (this.yearStartIndex === 0) {
        this.yearEndIndex =
          this.yearStartIndex + 25 > this.yearRanges.length
            ? this.yearRanges.length
            : this.yearStartIndex + 25;
      } else {
        this.yearEndIndex =
          selectedYearIndex + 13 > this.yearRanges.length
            ? this.yearRanges.length
            : selectedYearIndex + 13;
      }
      this.renderYears();
    }
  }
  decrementYearRanges() {
    this.yearEndIndex = this.yearStartIndex;
    this.yearStartIndex =
      this.yearStartIndex - 25 < 0 ? 0 : this.yearStartIndex - 25;
    this.renderYears();
  }

  incrementYearRanges() {
    this.yearStartIndex = this.yearEndIndex;
    this.yearEndIndex =
      this.yearStartIndex + 25 > this.yearRanges.length
        ? this.yearRanges.length
        : this.yearStartIndex + 25;
    this.renderYears();
  }

  selectYear(year: number) {
    this.isShowYears = false;
    this.model.selectedYearDate.setFullYear(year);
    this.model.updateYearText();
  }

  isSelectedYear(year: number): boolean {
    return this.model.selectedYearDate.getFullYear() === year;
  }

  isDisabledYear(year: number): boolean {
    let disabled = false;
    if (this.enabledYears && this.enabledYears.length > 0) {
      disabled = this.enabledYears.findIndex((y) => y === year) < 0;
    }
    if (this.disabledYears && this.disabledYears.length > 0) {
      disabled = this.disabledYears.findIndex((y) => y === year) >= 0;
    }
    return disabled;
  }

  onMonthYearInput(){
    if(this.renderOption === 'input' && this.inputText){
      this.matchesMonthAndYear(this.inputText);
      if(this.validFormat && this.yearInRange){
        let monthIndex = (+this.inputText.split('/')[0])-1;
        let year = +this.inputText.split('/')[1];
        this.model.selectedYearDate.setMonth(monthIndex);
        this.model.selectedYearDate.setFullYear(year);
        [monthIndex, year] = this.model.updateMonthYearChanges();
        this.showMonthYear(monthIndex, year);
      }
    }
  }

  private showMonthYear(monthIndex: number, year: number) {
    this.selectedYearAsText = year.toString();
    this.selectedMonthAsText = this.model.months[monthIndex];
  }

  private renderYears() {
    this.years = [];
    this.years = this.yearRanges.slice(this.yearStartIndex, this.yearEndIndex);
  }

  private matchesMonthAndYear(input: string) {
    this.validFormat = /((0[1-9]|1[0-2])\/[12]\d{3})/.test(input);
    if(this.validFormat){
      const year = +input.split('/')[1];
      this.yearInRange = year >= this.yearRanges[0] && year <= this.yearRanges[this.yearRanges.length - 1];
    }
  }
}

export class MonthPickerModel {
  constructor() {
    this.selectedYearDate = new Date();
    this.updateYearText();

    this.selectedMonthDate = new Date();

    this.months  = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    this.selectedMonthIndex = this.selectedMonthDate.getMonth();
    this.selectedMonthYear = this.selectedYearDate.getFullYear();
  }

  selectedYearDate: Date;
  selectedYearText: string;

  selectedMonthDate: Date;
  selectedMonthIndex: number;
  selectedMonthYear: number;

  months: Array<string> = [];

  updateYearText() {
    this.selectedYearText = this.selectedYearDate.getFullYear().toString();
  }

  selectMonth(index: number) {
    this.selectedMonthDate.setMonth(index);
    this.selectedMonthIndex = this.selectedMonthDate.getMonth();
    this.selectedMonthYear = this.selectedYearDate.getFullYear();
  }

  incrementYear() {
    this.selectedYearDate.setFullYear(this.selectedYearDate.getFullYear() + 1);
    this.updateYearText();
  }

  decrementYear() {
    this.selectedYearDate.setFullYear(this.selectedYearDate.getFullYear() - 1);
    this.updateYearText();
  }

  incrementMonth(monthIndex, year): Array<number> {
    this.selectedYearDate.setMonth(monthIndex);
    this.selectedYearDate.setFullYear(year);
    this.selectedYearDate.setMonth(this.selectedYearDate.getMonth() + 1);
    return this.updateMonthYearChanges();
  }

  decrementMonth(monthIndex, year): Array<number> {
    this.selectedYearDate.setMonth(monthIndex);
    this.selectedYearDate.setFullYear(year);
    this.selectedYearDate.setMonth(this.selectedYearDate.getMonth() - 1);
    return this.updateMonthYearChanges();
  }

  updateMonthYearChanges(): Array<number> {
    this.selectedMonthIndex = this.selectedYearDate.getMonth();
    this.selectedMonthYear = this.selectedYearDate.getFullYear();
    this.updateYearText();

    return [this.selectedMonthIndex, this.selectedMonthYear];
  }

  generateYearsBetween(startYear, endYear): Array<number> {
    const currentYear = new Date().getFullYear();
    startYear = startYear || currentYear - 100;
    endYear = endYear || currentYear + 100;
    let years = [];
    while (startYear <= endYear) {
      years.push(startYear);
      startYear++;
    }
    return years;
  }
}
