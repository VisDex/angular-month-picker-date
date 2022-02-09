import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MONTHS, NUMERIC_VALUES, VALIDATION } from './monthpicker.constant';

@Component({
  selector: 'monthpicker',
  templateUrl: './monthpicker.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthpickerComponent implements OnInit {
  @Input() renderOption: string;
  @Input() year: number;
  @Input() month: number;
  @Input() disabledMonths: Array<number> = [];
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
  yearStartIndex: number;
  yearEndIndex: number;
  inputText: string = '01/2026';
  validFormat: boolean;
  yearInRange: boolean;

  ngOnInit() {
    this.model = new MonthPickerModel();
    this.yearRanges = this.model.generateYears(this.startYear, this.endYear);

    if (this.year >= this.yearRanges[NUMERIC_VALUES.zero] && this.year <= this.yearRanges[this.yearRanges.length - NUMERIC_VALUES.one]) {
      this.model.selectedYearDate.setFullYear(this.year);
      this.model.updateYearText();
    }

    if (this.month >= NUMERIC_VALUES.zero && this.month < NUMERIC_VALUES.twelve) {
      this.model.selectedMonthIndex = this.month;
      this.model.selectedMonthDate.setMonth(this.month);
      if (this.year) { this.model.selectedMonthYear = this.year };
    }

    this.onChange(this.model.selectedMonthIndex, this.model.selectedMonthYear);
  }

  decrementMonth() {
    if (this.model.selectedYearDate.getFullYear() > this.yearRanges[NUMERIC_VALUES.zero]) {
      const [monthIndex, year] = this.model.decrementMonth(
        this.model.selectedMonthIndex,
        this.model.selectedMonthYear
      );
      this.onChange(monthIndex, year);
    }
  }

  incrementMonth() {
    if (this.model.selectedYearDate.getFullYear() < this.yearRanges[this.yearRanges.length - NUMERIC_VALUES.one]) {
      const [monthIndex, year] = this.model.incrementMonth(
        this.model.selectedMonthIndex,
        this.model.selectedMonthYear
      );
      this.onChange(monthIndex, year);
    }
  }

  decrementYear() {
    if (this.model.selectedYearDate.getFullYear() > this.yearRanges[NUMERIC_VALUES.zero]) {
      this.model.decrementYear();
    }
  }

  incrementYear() {
    if (this.model.selectedYearDate.getFullYear() < this.yearRanges[this.yearRanges.length - NUMERIC_VALUES.one]) {
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

    if (!this.isMonthYearDisabled(monthIndex, year)) {
      this.change.emit({ monthIndex: monthIndex, year: year });
    }
  }

  isDisabled(index: number): boolean {
    let disabled = false;
    if (this.disabledMonths && this.disabledMonths.length > NUMERIC_VALUES.zero) {
      disabled = this.disabledMonths.indexOf(index) >= NUMERIC_VALUES.zero;
    }
    return disabled;
  }

  toggleShowYears() { // as row * column 5*5
    this.isShowYears = !this.isShowYears;
    if (this.isShowYears) {
      const selectedYearIndex = this.yearRanges.findIndex((x) => x === this.model.selectedMonthYear);
      this.yearStartIndex = selectedYearIndex - NUMERIC_VALUES.twelve < NUMERIC_VALUES.zero ? NUMERIC_VALUES.zero : selectedYearIndex - NUMERIC_VALUES.twelve;
      if (this.yearStartIndex === NUMERIC_VALUES.zero) {
        this.yearEndIndex = this.yearStartIndex + NUMERIC_VALUES.twentyFive > this.yearRanges.length
          ? this.yearRanges.length : this.yearStartIndex + NUMERIC_VALUES.twentyFive;
      } else {
        this.yearEndIndex = selectedYearIndex + NUMERIC_VALUES.thirteen > this.yearRanges.length
          ? this.yearRanges.length : selectedYearIndex + NUMERIC_VALUES.thirteen;
      }
      this.renderYears();
    }
  }
  decrementYearRanges() { // as row * column 5*5
    this.yearEndIndex = this.yearStartIndex;
    this.yearStartIndex = this.yearStartIndex - NUMERIC_VALUES.twentyFive < NUMERIC_VALUES.zero ? NUMERIC_VALUES.zero : this.yearStartIndex - NUMERIC_VALUES.twentyFive;
    this.renderYears();
  }

  incrementYearRanges() { // as row * column 5*5
    this.yearStartIndex = this.yearEndIndex;
    this.yearEndIndex = this.yearStartIndex + NUMERIC_VALUES.twentyFive > this.yearRanges.length ? this.yearRanges.length : this.yearStartIndex + NUMERIC_VALUES.twentyFive;
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
    if (this.disabledYears && this.disabledYears.length > NUMERIC_VALUES.zero) {
      disabled = this.disabledYears.findIndex((y) => y === year) >= NUMERIC_VALUES.zero;
    }
    return disabled;
  }

  onMonthYearInput() {
    if (this.renderOption === 'input' && this.inputText) {
      this.matchesMonthAndYear(this.inputText);
      if (this.validFormat && this.yearInRange) {
        let monthIndex = (+this.inputText.split('/')[NUMERIC_VALUES.zero]) - NUMERIC_VALUES.one;
        let year = +this.inputText.split('/')[NUMERIC_VALUES.one];
        this.model.selectedYearDate.setMonth(monthIndex);
        this.model.selectedYearDate.setFullYear(year);
        [monthIndex, year] = this.model.updateMonthYearChanges();
        this.onChange(monthIndex, year);
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
  private isMonthYearDisabled(monthIndex: number, year: number): boolean {
    return this.isDisabled(monthIndex) || this.isDisabledYear(year);
  }

  private matchesMonthAndYear(input: string) {
    this.validFormat = VALIDATION.test(input);
    if (this.validFormat) {
      const year = +input.split('/')[NUMERIC_VALUES.one];
      this.yearInRange = year >= this.yearRanges[NUMERIC_VALUES.zero] && year <= this.yearRanges[this.yearRanges.length - NUMERIC_VALUES.one];
    }
  }
}


export class MonthPickerModel {
  constructor() {
    this.selectedYearDate = new Date();
    this.updateYearText();

    this.selectedMonthDate = new Date();

    this.months = MONTHS;
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
    this.selectedYearDate.setFullYear(this.selectedYearDate.getFullYear() + NUMERIC_VALUES.one);
    this.updateYearText();
  }

  decrementYear() {
    this.selectedYearDate.setFullYear(this.selectedYearDate.getFullYear() - NUMERIC_VALUES.one);
    this.updateYearText();
  }

  incrementMonth(monthIndex, year): Array<number> {
    this.selectedYearDate.setMonth(monthIndex);
    this.selectedYearDate.setFullYear(year);
    this.selectedYearDate.setMonth(this.selectedYearDate.getMonth() + NUMERIC_VALUES.one);
    return this.updateMonthYearChanges();
  }

  decrementMonth(monthIndex, year): Array<number> {
    this.selectedYearDate.setMonth(monthIndex);
    this.selectedYearDate.setFullYear(year);
    this.selectedYearDate.setMonth(this.selectedYearDate.getMonth() - NUMERIC_VALUES.one);
    return this.updateMonthYearChanges();
  }

  updateMonthYearChanges(): Array<number> {
    this.selectedMonthIndex = this.selectedYearDate.getMonth();
    this.selectedMonthYear = this.selectedYearDate.getFullYear();
    this.updateYearText();

    return [this.selectedMonthIndex, this.selectedMonthYear];
  }

  generateYears(startYear, endYear): Array<number> {
    const currentYear = new Date().getFullYear();
    startYear = startYear || currentYear - NUMERIC_VALUES.hundred;
    endYear = endYear || currentYear + NUMERIC_VALUES.hundred;
    let years = [];
    while (startYear <= endYear) {
      years.push(startYear);
      startYear++;
    }
    return years;
  }
}
