import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MonthPickerModel } from './monthpicker.model';
import { NUMERIC_VALUES, REGEX_MMYYYY } from './monthpicker.constant';

@Component({
  selector: 'cs-month-picker',
  templateUrl: './monthpicker.component.html',
  styleUrls: ['./monthpicker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsMonthPickerComponent implements OnInit, OnDestroy {
  @Input() renderOption: string;
  @Input() year: number;
  @Input() month: number;
  @Input() disabledMonths: Array<number> = [];
  @Input() disabledYears: Array<number> = [];
  @Input() startYear: number;
  @Input() endYear: number;

  // Flyout
  @Input() appendTo?: string;
  @Input() position?: string;
  @Input() alignment?: string;

  @Output() change = new EventEmitter<{ monthIndex: number; year: number }>();

  public model: MonthPickerModel;
  public isShowYears: boolean;
  public years: Array<number> = [];
  public selectedYearAsText: string;
  public selectedMonthAsText: string;
  public yearRanges: Array<number>;
  public yearStartIndex: number;
  public yearEndIndex: number;
  public inputText: string;
  public validFormat: boolean;
  public yearInRange: boolean;
  public showCalendar = false;
  private escListenerFunc: any; // callBack to destroy listening to Esc Key
  private clickListenerFunc: any; // callBack to destroy listening to click outside component
  @ViewChild('inputTextBox') inputTextBox: ElementRef<HTMLElement>;
  @ViewChild('calendar') calendar: ElementRef;

  constructor(
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.setModelOnInit();
    this.startListening();
  }

  setModelOnInit() {
    this.model = new MonthPickerModel();
    this.yearRanges = this.model.generateYears(this.startYear, this.endYear);

    if (
      this.year >= this.yearRanges[NUMERIC_VALUES.zero] &&
      this.year <= this.yearRanges[this.yearRanges.length - NUMERIC_VALUES.one]
    ) {
      this.model.selectedYearDate.setFullYear(this.year);
      this.model.updateYearText();
    }

    if (
      this.month >= NUMERIC_VALUES.zero &&
      this.month < NUMERIC_VALUES.twelve
    ) {
      this.model.selectedMonthIndex = this.month;
      this.model.selectedMonthDate.setMonth(this.month);
      if (this.year) {
        this.model.selectedMonthYear = this.year;
      }
    }

    this.onChange(this.model.selectedMonthIndex, this.model.selectedMonthYear);
  }

  decrementMonth() {
    if (
      this.model.selectedYearDate.getFullYear() >
      this.yearRanges[NUMERIC_VALUES.zero]
    ) {
      const [monthIndex, year] = this.model.decrementMonth(
        this.model.selectedMonthIndex,
        this.model.selectedMonthYear
      );
      this.onChange(monthIndex, year);
    }
  }

  incrementMonth() {
    if (
      this.model.selectedYearDate.getFullYear() <
      this.yearRanges[this.yearRanges.length - NUMERIC_VALUES.one]
    ) {
      const [monthIndex, year] = this.model.incrementMonth(
        this.model.selectedMonthIndex,
        this.model.selectedMonthYear
      );
      this.onChange(monthIndex, year);
    }
  }

  decrementYear() {
    if (
      this.model.selectedYearDate.getFullYear() >
      this.yearRanges[NUMERIC_VALUES.zero]
    ) {
      this.model.decrementYear();
    }
  }

  incrementYear() {
    if (
      this.model.selectedYearDate.getFullYear() <
      this.yearRanges[this.yearRanges.length - NUMERIC_VALUES.one]
    ) {
      this.model.incrementYear();
    }
  }

  selectMonth(index: number) {
    this.model.selectMonth(index);
    this.toggleCalendar(false);
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
    if (
      this.disabledMonths &&
      this.disabledMonths.length > NUMERIC_VALUES.zero
    ) {
      disabled = this.disabledMonths.indexOf(index) >= NUMERIC_VALUES.zero;
    }
    return disabled;
  }

  toggleShowYears() {
    // as row * column 5*5
    this.isShowYears = !this.isShowYears;
    if (this.isShowYears) {
      const selectedYearIndex = this.yearRanges.findIndex(
        (x) => x === this.model.selectedMonthYear
      );
      this.yearStartIndex =
        selectedYearIndex - NUMERIC_VALUES.twelve < NUMERIC_VALUES.zero
          ? NUMERIC_VALUES.zero
          : selectedYearIndex - NUMERIC_VALUES.twelve;
      if (this.yearStartIndex === NUMERIC_VALUES.zero) {
        this.yearEndIndex =
          this.yearStartIndex + NUMERIC_VALUES.twentyFive >
          this.yearRanges.length
            ? this.yearRanges.length
            : this.yearStartIndex + NUMERIC_VALUES.twentyFive;
      } else {
        this.yearEndIndex =
          selectedYearIndex + NUMERIC_VALUES.thirteen > this.yearRanges.length
            ? this.yearRanges.length
            : selectedYearIndex + NUMERIC_VALUES.thirteen;
      }
      this.renderYears();
    }
  }
  decrementYearRanges() {
    // as row * column 5*5
    this.yearEndIndex = this.yearStartIndex;
    this.yearStartIndex =
      this.yearStartIndex - NUMERIC_VALUES.twentyFive < NUMERIC_VALUES.zero
        ? NUMERIC_VALUES.zero
        : this.yearStartIndex - NUMERIC_VALUES.twentyFive;
    this.renderYears();
  }

  incrementYearRanges() {
    // as row * column 5*5
    this.yearStartIndex = this.yearEndIndex;
    this.yearEndIndex =
      this.yearStartIndex + NUMERIC_VALUES.twentyFive > this.yearRanges.length
        ? this.yearRanges.length
        : this.yearStartIndex + NUMERIC_VALUES.twentyFive;
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
      disabled =
        this.disabledYears.findIndex((y) => y === year) >= NUMERIC_VALUES.zero;
    }
    return disabled;
  }

  onMonthYearInput() {
    if (this.renderOption === 'input' && this.inputText) {
      this.matchesMonthAndYear(this.inputText);
      if (this.validFormat && this.yearInRange) {
        let monthIndex =
          +this.inputText.split('/')[NUMERIC_VALUES.zero] - NUMERIC_VALUES.one;
        let year = +this.inputText.split('/')[NUMERIC_VALUES.one];
        this.model.selectedYearDate.setMonth(monthIndex);
        this.model.selectedYearDate.setFullYear(year);
        [monthIndex, year] = this.model.updateMonthYearChanges();
        this.onChange(monthIndex, year);
      }
    }
  }

  public clearDate() {
    this.showCalendar = false;
    this.resetMonthPicker(true);
  }

  public toggleCalendar(show = !this.showCalendar) {
    this.showCalendar = show;
    if (!this.showCalendar) {
      // on Calendar Close
      this.resetMonthPicker(false);
    }
    this.changeDetector.detectChanges();

    const nativeElement =
      this.inputTextBox?.nativeElement?.querySelector('input');
    if (!nativeElement) {
      // if ng-content does not have input box
      return;
    }

    if (this.showCalendar) {
      nativeElement.focus();
    } else {
      this.inputText = this.model.getDateInFormat(
        this.model.selectedMonthIndex,
        this.model.selectedYearText
      );
      nativeElement.blur();
    }
  }

  ngOnDestroy(): void {
    if (this.clickListenerFunc) {
      this.clickListenerFunc();
    }
    if (this.escListenerFunc) {
      this.escListenerFunc();
    }
  }

  private startListening() {
    this.clickListenerFunc = this.renderer.listen(
      'document',
      'click',
      (e: Event) => {
        if (
          this.inputTextBox &&
          !this.inputTextBox.nativeElement.contains(e.target as Node) &&
          !this.calendar &&
          !this.calendar.nativeElement.contains(e.target)
        ) {
          this.toggleCalendar(false);
        }
      }
    );
    this.escListenerFunc = this.renderer.listen(
      'document',
      'keydown.esc',
      (e) => {
        this.toggleCalendar(false);
      }
    );
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

  private resetMonthPicker(clear: boolean) {
    if (clear) {
      const currentMonthYear = new Date();
      this.month = currentMonthYear.getMonth();
      this.year = currentMonthYear.getFullYear();
      this.inputText = '';
    } else {
      this.month = this.model.selectedMonthIndex;
      this.year = this.model.selectedMonthYear;
    }
    this.setModelOnInit();
  }

  private matchesMonthAndYear(input: string) {
    this.validFormat = REGEX_MMYYYY.test(input);
    if (this.validFormat) {
      const year = +input.split('/')[NUMERIC_VALUES.one];
      this.yearInRange =
        year >= this.yearRanges[NUMERIC_VALUES.zero] &&
        year <= this.yearRanges[this.yearRanges.length - NUMERIC_VALUES.one];
    }
  }
}
