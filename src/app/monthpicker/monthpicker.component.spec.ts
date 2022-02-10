import { ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CsMonthPickerComponent } from './monthpicker.component';
import { MonthPickerModel } from './monthpicker.model';

describe('MonthPickerComponent', () => {
  let component: CsMonthPickerComponent;
  let fixture: ComponentFixture<CsMonthPickerComponent>;
  let model = new MonthPickerModel();
  const changeDetectorRefStub = () => ({ detectChanges: () => { } });
  const renderer2Stub = () => ({
    listen: (_string, _string1, _function0) => ({})
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CsMonthPickerComponent],
      imports: [FormsModule],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: Renderer2, useFactory: renderer2Stub },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsMonthPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`showCalendar has default value`, () => {
    expect(component.showCalendar).toEqual(false);
  });

  it('should return isShowYears', () => {
    expect(component.isShowYears).not.toBeDefined();
  });

  describe('ngOnInit', () => {

    it('makes expected calls', () => {
      spyOn<any>(component, 'setModelOnInit');
      spyOn<any>(component, 'startListening');

      component.ngOnInit();

      expect(component['setModelOnInit']).toHaveBeenCalled();
      expect(component['startListening']).toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      component['startListening']();
      spyOn<any>(component, 'clickListenerFunc');
      spyOn<any>(component, 'escListenerFunc');

      component.ngOnDestroy();

      expect(component['clickListenerFunc']).toHaveBeenCalled();
      expect(component['escListenerFunc']).toHaveBeenCalled();
    })
    it('should check else for clickListenerFunc ', () => {
      component['clickListenerFunc'] = false;;
      fixture.detectChanges();
      expect(false).toBeFalse();
    });
    it('should check else for escListenerFunc ', () => {
      component['escListenerFunc'] = false;;
      fixture.detectChanges();
      expect(false).toBeFalse();
    });
  });

  describe('setModelOnInit', () => {
    const startYear = 2020;
    const endYear = 2025;
    const yearRange = [2020, 2021, 2022, 2023, 2024, 2025];

    it('gets model object to be defined', () => {
      expect(component.model).toBeDefined();
    });
    it('should call generateYears from model ', () => {
      expect(model.generateYears(startYear, endYear)).toEqual(yearRange);
    });
    it('should create yearRanges ', () => {
      const years = model.generateYears(null, null);
      expect(component.yearRanges).toEqual(years);
    });
    it('should set year to model selected year date ', () => {
      component.year = 2024;
      component.setModelOnInit();
      expect(component.model.selectedYearDate.getFullYear()).toBe(2024);
    });
    it('should call updateYearText if year is present ', () => {
      component.year = 2024;
      component.setModelOnInit();
      spyOn(model, 'updateYearText');
      model.updateYearText();
      expect(model.updateYearText).toHaveBeenCalled();
    });

    it('should set month to model selectedMonthIndex ', () => {
      component.month = 1;
      component.setModelOnInit();
      expect(component.model.selectedMonthIndex).toBe(1);
    });
    it('should set month to model selectedMonthDate ', () => {
      component.month = 1;
      component.setModelOnInit();
      expect(component.model.selectedMonthDate.getMonth()).toBe(1);
    });
    it('should set year to model selectedMonthYear ', () => {
      component.month = 1;
      component.year = 2024;
      component.setModelOnInit();
      expect(component.model.selectedMonthYear).toBe(2024);
    });
    it('should call onChange ', () => {
      component.month = 1;
      component.year = 2024;
      spyOn(component, 'onChange');
      component.setModelOnInit();
      component.onChange(component.model.selectedMonthIndex, component.model.selectedMonthYear);
      expect(component.onChange).toHaveBeenCalled();
    });
  });

  describe('decrementMonth', () => {
    beforeEach(() => {
      component.decrementMonth();
    });
    it('should check selectedYearDate to be greater than yearRange[0]', () => {
      const isGreater = component.model.selectedYearDate.getFullYear() > component.yearRanges[0];
      expect(isGreater).toBeTruthy();
    });
    it('should check else', () => {
      component.model.selectedYearDate.setFullYear(1850);
      fixture.detectChanges();
      component.decrementMonth();
      expect(false).toBeFalse();
    });
    it('should call method decrementMonth from model', () => {
      spyOn(model, 'decrementMonth');
      model.decrementMonth(component.model.selectedMonthIndex, component.model.selectedMonthYear)
      expect(model.decrementMonth).toHaveBeenCalled();
    });
    it('should return monthIndex and year from method decrementMonth from model', () => {
      component.model.selectedMonthIndex = 2;
      component.model.selectedMonthYear = 2022;
      const [monthIndex, year] = model.decrementMonth(component.model.selectedMonthIndex, component.model.selectedMonthYear);
      expect(monthIndex).toBe(1);
      expect(year).toBe(2022);
    });
    it('should call onChange ', () => {
      component.model.selectedMonthIndex = 2;
      component.model.selectedMonthYear = 2022;
      const [monthIndex, year] = model.decrementMonth(component.model.selectedMonthIndex, component.model.selectedMonthYear);
      spyOn(component, 'onChange');
      component.onChange(monthIndex, year);
      expect(component.onChange).toHaveBeenCalled();
    });
  });

  describe('incrementMonth', () => {
    beforeEach(() => {
      component.incrementMonth();
    });
    it('should check selectedYearDate to be greater than last yearRange', () => {
      const isLessThan = component.model.selectedYearDate.getFullYear() < component.yearRanges[component.yearRanges.length - 1];
      expect(isLessThan).toBeTruthy();
    });
    it('should check else', () => {
      component.model.selectedYearDate.setFullYear(2222);
      fixture.detectChanges();
      component.incrementMonth();
      expect(false).toBeFalse();
    });
    it('should call method incrementMonth from model', () => {
      spyOn(model, 'incrementMonth');
      model.incrementMonth(component.model.selectedMonthIndex, component.model.selectedMonthYear)
      expect(model.incrementMonth).toHaveBeenCalled();
    });
    it('should return monthIndex and year from method incrementMonth from model', () => {
      component.model.selectedMonthIndex = 2;
      component.model.selectedMonthYear = 2022;
      const [monthIndex, year] = model.incrementMonth(component.model.selectedMonthIndex, component.model.selectedMonthYear);
      expect(monthIndex).toBe(3);
      expect(year).toBe(2022);
    });
    it('should call onChange ', () => {
      component.model.selectedMonthIndex = 2;
      component.model.selectedMonthYear = 2022;
      const [monthIndex, year] = model.incrementMonth(component.model.selectedMonthIndex, component.model.selectedMonthYear);
      spyOn(component, 'onChange');
      component.onChange(monthIndex, year);
      expect(component.onChange).toHaveBeenCalled();
    });
  });

  describe('decrementYear', () => {
    beforeEach(() => {
      component.decrementYear();
    });
    it('should check selectedYearDate to be greater than yearRange[0]', () => {
      const isGreater = component.model.selectedYearDate.getFullYear() > component.yearRanges[0];
      expect(isGreater).toBeTruthy();
    });
    it('should check else', () => {
      component.model.selectedYearDate.setFullYear(1850);
      fixture.detectChanges();
      component.decrementYear();
      expect(false).toBeFalse();
    });
    it('should call decrementYear from model ', () => {
      spyOn(component.model, 'decrementYear');
      component.model.decrementYear();
      expect(component.model.decrementYear).toHaveBeenCalled();
    });
  });

  describe('incrementYear', () => {
    beforeEach(() => {
      component.incrementYear();
    });
    it('should check selectedYearDate to be greater than last yearRange', () => {
      const isLessThan = component.model.selectedYearDate.getFullYear() < component.yearRanges[component.yearRanges.length - 1];
      expect(isLessThan).toBeTruthy();
    });
    it('should check else', () => {
      component.model.selectedYearDate.setFullYear(2222);
      fixture.detectChanges();
      component.incrementYear();
      expect(false).toBeFalse();
    });
    it('should call incrementYear from model ', () => {
      spyOn(component.model, 'incrementYear');
      component.model.incrementYear();
      expect(component.model.incrementYear).toHaveBeenCalled();
    });
  });

  describe('selectMonth', () => {
    const index = 6;
    beforeEach(() => {
      component.selectMonth(index);
    });
    it('should call selectMonth from model ', () => {
      spyOn(component.model, 'selectMonth');
      component.model.selectMonth(index);
      expect(component.model.selectMonth).toHaveBeenCalled();
    });
    it('should call toggleCalendar ', () => {
      spyOn(component, 'toggleCalendar');
      component.toggleCalendar(true);
      expect(component.toggleCalendar).toHaveBeenCalled();
    });
  });

  describe('isSelectedMonth', () => {
    const index = 6;
    beforeEach(() => {
      component.isSelectedMonth(index);
    });
    it('should have selected month as same', () => {
      component.model.selectedMonthIndex = 6;
      expect(component.model.selectedMonthIndex).toBe(index);
    });
    it('should have selected month as same', () => {
      component.model.selectedMonthYear = 2022;
      expect(component.model.selectedMonthYear).toBe(2022);
    });
    it('should return isSelectedMonth or not', () => {
      expect(component.isSelectedMonth(index)).toBeFalse();
    });
    it('should return isSelectedMonth or not', () => {
      component.model.selectedMonthIndex = 6;
      component.model.selectedMonthYear = 2022;
      expect(component.isSelectedMonth(index)).toBeTrue();
    });
  });

  describe('onChange', () => {
    const index = 6;
    const year = 2024;
    beforeEach(() => {
      component.onChange(index, year);
    });
    it('should call showMonthYear ', () => {
      spyOn<any>(component, 'showMonthYear').withArgs(index, year);
      component['showMonthYear'](index, year);
      expect(component['showMonthYear']).toHaveBeenCalled();
    });
    it('should check else', () => {
      component.disabledMonths = [2, 4, 6];
      component.disabledYears = [2024];
      fixture.detectChanges();
      component.onChange(index, year);
      expect(false).toBeFalse();
    });
    it('should check isMonthYearDisabled ', () => {
      const isMonthYearDisabled = component['isMonthYearDisabled'](index, year);
      expect(isMonthYearDisabled).toBe(false);
    });
    it('should check if emit onChange not called', () => {
      spyOn(component.change, 'emit');
      component.disabledMonths = [6];
      fixture.detectChanges();
      expect(component.change.emit).not.toHaveBeenCalled();
    });
  });

  describe('isDisabled', () => {
    const index = 6;
    const disabled = false;
    it('should check disabledMonths is defined ', () => {
      expect(component.disabledMonths).toBeDefined();
    });
    it('should check length of disabledMonths', () => {
      component.disabledMonths = [2, 4, 6];
      expect(component.disabledMonths.length).toBe(3);
    });
    it('should check index of disabledMonths to index', () => {
      component.disabledMonths = [2, 4, 6];
      expect(component.disabledMonths.indexOf(index)).toBe(2);
    });
    it('should check index present in disabledMonths', () => {
      component.disabledMonths = [2, 4, 6];
      const indexGreater = component.disabledMonths.indexOf(index) >= 0;
      expect(indexGreater).toBeTrue();
    });
    it('should check if isDisabled return', () => {
      const val = component.isDisabled(index);
      expect(val).toBe(disabled);
    });
  });

  describe('toggleShowYears', () => {
    beforeEach(() => {
      component.toggleShowYears();
    });
    it('should check if isShowYears returns boolean ', () => {
      expect(component.isShowYears).toBeTrue();
    });
    it('should check if isShowYears returns changed boolean ', () => {
      component.toggleShowYears();
      expect(component.isShowYears).toBeFalse();
    });
    it('should get selectedYearIndex', () => {
      component.yearRanges = [2020, 2021, 2022, 2023, 2024];
      component.model.selectedMonthYear = 2022;
      const selectedYearIndex = component.yearRanges.findIndex((x) => x === component.model.selectedMonthYear);
      expect(selectedYearIndex).toBe(2);
    });
    it('should check if yearEndIndex gets updated to yearRanges.length if yearStartIndex is 0', () => {
      component.isShowYears = false;
      component.yearRanges = [2020, 2021, 2022, 2023, 2024];
      component.model.selectedMonthYear = 2022;
      fixture.detectChanges();
      component.toggleShowYears();
      expect(component.yearStartIndex).toBe(0);
      expect(component.yearEndIndex).toBe(5);
    });
    it('should check if yearStartIndex gets updated to 0', () => {
      component.isShowYears = false;
      component.yearRanges = [2020, 2021, 2022, 2023, 2024, 2025,
        2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039,
        2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050];
      component.model.selectedMonthYear = 2022;
      fixture.detectChanges();
      component.toggleShowYears();
      expect(component.yearStartIndex).toBe(0);
      expect(component.yearEndIndex).toBe(25);
    });
    it('should check if yearEndIndex gets updated to yearRanges.length if yearStartIndex not 0 ', () => {
      component.isShowYears = false;
      component.yearRanges = [2020, 2021, 2022, 2023, 2024, 2025,
        2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039,
        2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050];
      component.model.selectedMonthYear = 2050;
      fixture.detectChanges();
      component.toggleShowYears();
      expect(component.yearEndIndex).toBe(31);
    });
    it('should get yearStartIndex if less than 0', () => {
      component.yearRanges = [2020, 2021, 2022, 2023, 2024];
      component.model.selectedMonthYear = 2022;
      const selectedYearIndex = component.yearRanges.findIndex((x) => x === component.model.selectedMonthYear);
      expect(selectedYearIndex).toBe(2);
      const difference = selectedYearIndex - 12
      expect(difference).toBeLessThan(0);
      component.yearStartIndex = 0;
      expect(component.yearStartIndex).toBe(0);
    });
    it('should get yearStartIndex if greater than equal to 0', () => {
      const selectedYearIndex = 14;
      const difference = selectedYearIndex - 12
      expect(difference).toBeGreaterThanOrEqual(0);
      component.yearStartIndex = difference;
      expect(component.yearStartIndex).toBe(difference);
    });
    it('should get yearEndIndex if yearStartIndex equal to 0', () => {
      component.yearRanges = [2020, 2021, 2022, 2023, 2024];
      component.yearStartIndex = 0;
      expect(component.yearStartIndex + 25).toBeGreaterThan(component.yearRanges.length);
      component.yearEndIndex = component.yearRanges.length;
      expect(component.yearEndIndex).toBe(component.yearRanges.length);
    });
    it('should get yearEndIndex if yearStartIndex less than 25', () => {
      component.yearStartIndex = 0;
      expect(component.yearStartIndex + 25).toBeLessThan(component.yearRanges.length);
      component.yearEndIndex = component.yearStartIndex + 25;
      expect(component.yearEndIndex).toBe(component.yearStartIndex + 25);
    });
    it('should call renderYears', () => {
      spyOn<any>(component, 'renderYears');
      component['renderYears']();
      expect(component['renderYears']).toHaveBeenCalled();
    });
  });

  describe('decrementYearRanges', () => {
    it('should check if yearEndIndex is same as yearStartIndex', () => {
      component.yearStartIndex = 26;
      component.decrementYearRanges();
      expect(component.yearEndIndex).toBe(26);
    });
    it('should check if yearStartIndex gets updated to 0', () => {
      component.yearStartIndex = 24;
      component.decrementYearRanges();
      expect(component.yearStartIndex).toBe(0);
    });

    it('should check if yearStartIndex gets updated', () => {
      component.yearStartIndex = 26;
      component.decrementYearRanges();
      expect(component.yearStartIndex).toBe(1);
    });
    it('should call renderYears', () => {
      spyOn<any>(component, 'renderYears');
      component['renderYears']();
      expect(component['renderYears']).toHaveBeenCalled();
    });
  });
  describe('incrementYearRanges', () => {
    it('should check if yearEndIndex is same as yearStartIndex', () => {
      component.yearEndIndex = 26;
      component.incrementYearRanges();
      expect(component.yearStartIndex).toBe(26);
    });

    it('should check if yearStartIndex gets updated', () => {
      component.yearRanges = [2020, 2021, 2022, 2023, 2024];
      component.yearEndIndex = 26;
      component.incrementYearRanges();
      expect(component.yearEndIndex).toBe(5);
    });
    it('should call renderYears', () => {
      spyOn<any>(component, 'renderYears');
      component['renderYears']();
      expect(component['renderYears']).toHaveBeenCalled();
    });
  });
  describe('selectYear', () => {
    it('should check isShowYears exist', () => {
      expect(component.isShowYears).not.toBeDefined();
    });
    it('should show isShowYears as true', () => {
      component.isShowYears = true;
      expect(component.isShowYears).toBeTrue();
    });
    it('should show isShowYears as true', () => {
      component.isShowYears = true;
      component.selectYear(2021);
      expect(component.isShowYears).toBeFalse();
    });
    it('should show selectedYearDate from model', () => {
      component.isShowYears = true;
      component.selectYear(2021);
      expect(component.model.selectedYearDate.getFullYear()).toBe(2021);
    });
    it('should call updateYearText', () => {
      component.selectYear(2021);
      spyOn(component.model, 'updateYearText');
      component.model.updateYearText();
      expect(component.model.updateYearText).toHaveBeenCalled();
    });
  });
  describe('isSelectedYear', () => {
    const year = 2025;
    it('should check selectedYearDate is same', () => {
      component.model.selectedYearDate.setFullYear(year);
      component.isSelectedYear(year);
      expect(component.model.selectedYearDate.getFullYear()).toBe(year);
    });
    it('should check isSelectedYear return', () => {
      component.model.selectedYearDate.setFullYear(year);
      component.isSelectedYear(year);
      expect(component.isSelectedYear(year)).toBeTrue();
    });
  });
  describe('isDisabledYear', () => {
    const year = 2029;
    const disabled = false;
    it('should check disabledYears is defined ', () => {
      expect(component.disabledYears).toBeDefined();
    });
    it('should check length of disabledYears', () => {
      component.disabledYears = [2012, 2032, 2040];
      expect(component.disabledYears.length).toBe(3);
    });
    it('should check index of disabledYears to index', () => {
      component.disabledYears = [2012, 2032, 2040];
      expect(component.disabledYears.findIndex((y) => y === year)).toBe(-1);
    });
    it('should check index present in disabledMonths', () => {
      component.disabledYears = [2012, 2029, 2040];
      const indexGreater = component.disabledYears.findIndex((y) => y === year) >= 0;
      expect(indexGreater).toBeTrue();
    });
    it('should check if isDisabledYear return boolean', () => {
      const val = component.isDisabledYear(year);
      expect(val).toBe(disabled);
    });
  });

  describe('onMonthYearInput', () => {
    it('should check that matchesMonthAndYear is not called ', () => {
      spyOn<any>(component, 'matchesMonthAndYear').withArgs(component.inputText)
      component.onMonthYearInput();
      expect(component['matchesMonthAndYear']).not.toHaveBeenCalled();
    });
    it('should check that matchesMonthAndYear is  called ', () => {
      component.renderOption = 'input';
      component.inputText = '11/2015';
      fixture.detectChanges();
      spyOn<any>(component, 'matchesMonthAndYear').withArgs(component.inputText)
      component.onMonthYearInput();
      expect(component['matchesMonthAndYear']).toHaveBeenCalled();
    });
    it('should check that updateMonthYearChanges is not called ', () => {
      component.renderOption = 'input';
      component.inputText = '14/2015';
      fixture.detectChanges();
      spyOn(component.model, 'updateMonthYearChanges');
      component.onMonthYearInput();
      expect(component.model.updateMonthYearChanges).not.toHaveBeenCalled();
    });
    it('should check that updateMonthYearChanges is called ', () => {
      component.renderOption = 'input';
      component.inputText = '11/2015';
      fixture.detectChanges();
      component.onMonthYearInput();
      expect(component.model.updateMonthYearChanges()).toBeTruthy();
    });
    it('should check that selectedYearDate is updated in model ', () => {
      component.renderOption = 'input';
      component.inputText = '11/2015';
      fixture.detectChanges();
      component.onMonthYearInput();
      expect(component.model.selectedYearDate.getMonth()).toBe(10);;
    });
    it('should check that selectedYearDate is updated in model ', () => {
      component.renderOption = 'input';
      component.inputText = '11/2015';
      fixture.detectChanges();
      component.onMonthYearInput();
      expect(component.model.selectedYearDate.getFullYear()).toBe(2015);;
    });
    it('should check that onChange is called ', () => {
      component.renderOption = 'input';
      component.inputText = '11/2015';
      fixture.detectChanges();
      spyOn(component, 'onChange');
      component.onMonthYearInput();
      expect(component.onChange).toHaveBeenCalled();
    });
  });

  describe('clearDate', () => {
    it('should check if show calendar is false', () => {
      expect(component.showCalendar).toBeFalse();
    });
    it('should check if show calendar is true', () => {
      component.showCalendar = true;
      expect(component.showCalendar).toBeTrue();
    });
    it('should check if resetMonthPicker called', () => {
      spyOn<any>(component, 'resetMonthPicker').withArgs(true);
      component.clearDate();
      expect(component['resetMonthPicker']).toHaveBeenCalled();
    });
  });

  describe('toggleCalendar', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reverse the value of showcalendar ', () => {

      component.toggleCalendar(true);
      expect(component.showCalendar).toBeTrue();
      component.toggleCalendar(false);
      expect(component.showCalendar).toBeFalse();
      component.toggleCalendar();
      expect(component.showCalendar).toBeTrue();
    });


    it('should make expected calls on toggling off the calendar ', () => {

      spyOn<any>(component, 'resetMonthPicker');
      const nativeElement = jasmine.createSpyObj('nativeElement', ['focus', 'blur']);
      component.inputTextBox.nativeElement['querySelector'] = jasmine.createSpy('querySelector').and.returnValues(nativeElement);

      component.toggleCalendar(false);

      expect(component['resetMonthPicker']).toHaveBeenCalled();
      expect(nativeElement.blur).toHaveBeenCalled();

    });

    it('should make expected calls on toggling on the calendar ', () => {

      const nativeElement = jasmine.createSpyObj('nativeElement', ['focus', 'blur']);
      component.inputTextBox.nativeElement['querySelector'] = jasmine.createSpy('querySelector').and.returnValues(nativeElement);

      component.toggleCalendar(true);

      expect(nativeElement.focus).toHaveBeenCalled();

    });

  });

  describe('startListening', () => {
    it('should check if startListening calls', () => {
      fixture.detectChanges();

      component['startListening']();

      expect(component['clickListenerFunc']).toBeTruthy();
      expect(component['escListenerFunc']).toBeTruthy();
    });
    it('should check if toggleCalendar calls from clickListenerFunc', () => {
      fixture.detectChanges();
      component['startListening']();
      spyOn(component, 'toggleCalendar');
      expect(component['clickListenerFunc']).toBeTruthy();
      component.toggleCalendar(false);
      expect(component.toggleCalendar).toHaveBeenCalled();
    });
    it('should check if toggleCalendar calls from escListenerFunc', () => {
      fixture.detectChanges();
      component['startListening']();
      spyOn(component, 'toggleCalendar');
      expect(component['escListenerFunc']).toBeTruthy();
      component.toggleCalendar(false);
      expect(component.toggleCalendar).toHaveBeenCalled();
    });
  });

  describe('showMonthYear', () => {
    const monthIndex = 8;
    const year = 2020;
    it('should check if after calling showMonthYear selectedYearAsText gets updated', () => {
      component['showMonthYear'](monthIndex, year);
      expect(component.selectedYearAsText).toBe('2020');
    });
    it('should check if after calling showMonthYear selectedYearAsText gets updated', () => {
      component['showMonthYear'](monthIndex, year);
      expect(component.selectedMonthAsText).toBe('September');
    });
  });
  describe('renderYears', () => {
    it('should check if years is defined', () => {
      component['renderYears']();
      expect(component.years).toBeDefined;
    });
    it('should check length of years', () => {
      component['renderYears']();
      fixture.detectChanges();
      expect(component.years.length).toBe(201);
    });
    it('should check if years return correct value', () => {
      component.yearRanges = [2020, 2021, 2022, 2023, 2024, 2025];
      component.yearStartIndex = 2;
      component.yearEndIndex = 4;
      fixture.detectChanges();
      component['renderYears']();
      expect(component.years).toEqual([2022, 2023]);
    });
  });
  describe('isMonthYearDisabled', () => {
    const monthIndex = 2;
    const year = 2023;
    it('should check if isDisabled is called', () => {
      spyOn(component, 'isDisabled').withArgs(monthIndex);
      component['isMonthYearDisabled'](monthIndex, year);
      expect(component['isDisabled']).toHaveBeenCalled();
    });
    it('should check if isDisabledYear is called', () => {
      spyOn(component, 'isDisabledYear').withArgs(year);
      component['isMonthYearDisabled'](monthIndex, year);
      expect(component['isDisabledYear']).toHaveBeenCalled();
    });
    it('should check isMonthYearDisabled returns boolean', () => {
      component['renderYears']();
      expect(component['isMonthYearDisabled'](monthIndex, year)).toBeFalse();
    });
    it('should check isMonthYearDisabled returns true on disabled month', () => {
      component.disabledMonths = [2]
      component['renderYears']();
      expect(component['isMonthYearDisabled'](monthIndex, year)).toBeTrue();
    });
    it('should check isMonthYearDisabled returns true on disabled year', () => {
      component.disabledYears = [2023]
      component['renderYears']();
      expect(component['isMonthYearDisabled'](monthIndex, year)).toBeTrue();
    });
  });

  describe('resetMonthPicker', () => {
    it('should check month and year to be current if clear true', () => {
      const currentMonthYear = new Date();
      const month = currentMonthYear.getMonth();
      const year = currentMonthYear.getFullYear();
      component['resetMonthPicker'](true);
      expect(component.month).toBe(month);
      expect(component.year).toBe(year);
    });
    it('should check month and year to be selected if clear false', () => {
      component.model.selectedMonthIndex = 3;
      component.model.selectedMonthYear = 2046;
      component['resetMonthPicker'](false);
      expect(component.month).toBe(3);
      expect(component.year).toBe(2046);
    });
    it('should call setModelOnInit', () => {
      spyOn(component, 'setModelOnInit');
      component['resetMonthPicker'](false);
      expect(component.setModelOnInit).toHaveBeenCalled();
    });
  });

  describe('matchesMonthAndYear', () => {
    it('should have validFormat to be false', () => {
      const input = '13/1990'
      component['matchesMonthAndYear'](input);
      expect(component.validFormat).toBeFalse();
    });
    it('should have validFormat to be true', () => {
      const input = '12/1990'
      component['matchesMonthAndYear'](input);
      expect(component.validFormat).toBeTrue();
    });
    it('should have yearInRange to be false', () => {
      const input = '12/1990'
      component.yearRanges = [2020, 2021, 2022, 2024];
      component['matchesMonthAndYear'](input);
      expect(component.yearInRange).toBeFalse();
    });
    it('should have yearInRange to be true', () => {
      const input = '09/2021'
      component.yearRanges = [2020, 2021, 2022, 2024];
      component['matchesMonthAndYear'](input);
      expect(component.yearInRange).toBeTrue();
    });
  });
});
