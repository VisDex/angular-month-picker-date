import { MONTHS, NUMERIC_VALUES } from "./monthpicker.constant";

export class MonthPickerModel {
  constructor() {
    this.selectedYearDate = new Date();
    this.updateYearText();

    this.selectedMonthDate = new Date();

    this.months = MONTHS;

    this.selectedMonthIndex = this.selectedMonthDate.getMonth();
    this.selectedMonthYear = this.selectedYearDate.getFullYear();
  }

  public selectedYearDate: Date;
  public selectedYearText: string;

  public selectedMonthDate: Date;
  public selectedMonthIndex: number;
  public selectedMonthYear: number;

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
  getDateInFormat(monthIndex, year): string {
    const mm = monthIndex > 8 ? `${monthIndex + NUMERIC_VALUES.one}` : `0${monthIndex + NUMERIC_VALUES.one}`;
    return mm + '/' + year;
  }
}
