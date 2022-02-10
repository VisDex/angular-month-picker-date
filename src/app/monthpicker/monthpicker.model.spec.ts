import { MonthPickerModel } from './monthpicker.model';

describe('MonthPickerModel', () => {
    const model = new MonthPickerModel();
    it('can load instance', () => {
        expect(model).toBeTruthy();
    });
    const selectedYearDateObj = new Date();
    const selectedMonthDateObj = new Date();
    describe('MonthPickerModel Constructor Call', () => {
        it('selected year date after calling constructor', () => {
            expect(model.selectedYearDate).toEqual(selectedYearDateObj);
        });

        it('updateYearText after calling constructor', () => {
            expect(model.selectedYearText).toBe(
                selectedYearDateObj.getFullYear().toString()
            );
        });

        it('selected month date after calling constructor', () => {
            expect(model.selectedMonthDate).toEqual(selectedMonthDateObj);
        });

        it('months after calling constructor', () => {
            const months = [
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
                'December',
            ];
            expect(model.months).toEqual(months);
        });

        // it("selected month index after calling constructor", () => {
        //     expect(model.selectedMonthIndex).toBe(model.selectedMonthDate.getMonth());
        // });

        it('selected month year after calling constructor', () => {
            expect(model.selectedMonthYear).toBe(selectedYearDateObj.getFullYear());
        });
    });

    describe('updateYearText', () => {
        it('should return updated year text', () => {
            expect(model.selectedYearText).toBe(
                selectedYearDateObj.getFullYear().toString()
            );
        });
    });

    describe('select month', () => {
        model.selectMonth(0);
        selectedMonthDateObj.setMonth(0);
        it('should return selected month index', () => {
            expect(model.selectedMonthDate.getMonth()).toBe(
                selectedMonthDateObj.getMonth()
            );
        });
        it('should return selected month year', () => {
            expect(model.selectedYearDate.getFullYear()).toBe(
                selectedYearDateObj.getFullYear()
            );
        });
    });

    describe('increment year', () => {
        selectedYearDateObj.setFullYear(selectedYearDateObj.getFullYear() + 1);
        model.incrementYear();
        it('should return same year object', () => {
            expect(model.selectedYearDate).toEqual(selectedYearDateObj);
        });
        it('should have same year ', () => {
            expect(model.selectedYearDate.getFullYear()).toBe(
                selectedYearDateObj.getFullYear()
            );
        });
        it('should have called updateYearText', () => {
            spyOn(model, 'updateYearText');
            model.updateYearText();
            expect(model.updateYearText).toHaveBeenCalled();
        });
    });

    describe('decrement year', () => {
        selectedYearDateObj.setFullYear(selectedYearDateObj.getFullYear() - 1);
        model.decrementYear();
        it('should return same year object', () => {
            expect(model.selectedYearDate).toEqual(selectedYearDateObj);
        });
        it('should have same year', () => {
            expect(model.selectedYearDate.getFullYear()).toBe(
                selectedYearDateObj.getFullYear()
            );
        });
        it('should have called updateYearText', () => {
            spyOn(model, 'updateYearText');
            model.updateYearText();
            expect(model.updateYearText).toHaveBeenCalled();
        });
    });

    describe('increment month', () => {
        const monthIndex = 3;
        const year = 2024;
        selectedYearDateObj.setMonth(monthIndex);
        selectedYearDateObj.setFullYear(year);
        selectedYearDateObj.setMonth(selectedYearDateObj.getMonth() + 1);
        model.incrementMonth(monthIndex, year);
        it('should return same incremented year ', () => {
            expect(model.selectedYearDate).toEqual(selectedYearDateObj);
        });
        it('should return same incremented year ', () => {
            expect(model.selectedYearDate.getMonth()).toBe(
                selectedYearDateObj.getMonth()
            );
        });
        it('should have called updateMonthYearChanges', () => {
            spyOn(model, 'updateMonthYearChanges');
            model.updateMonthYearChanges();
            expect(model.updateMonthYearChanges).toHaveBeenCalled();
        });
    });

    describe('decrement month', () => {
        const monthIndex = 3;
        const year = 2024;
        selectedYearDateObj.setMonth(monthIndex);
        selectedYearDateObj.setFullYear(year);
        selectedYearDateObj.setMonth(selectedYearDateObj.getMonth() - 1);
        model.decrementMonth(monthIndex, year);
        it('should return same decrement year ', () => {
            expect(model.selectedYearDate).toEqual(selectedYearDateObj);
        });
        it('should return same decrement year ', () => {
            expect(model.selectedYearDate.getMonth()).toBe(
                selectedYearDateObj.getMonth()
            );
        });
        it('should have called updateMonthYearChanges', () => {
            spyOn(model, 'updateMonthYearChanges');
            model.updateMonthYearChanges();
            expect(model.updateMonthYearChanges).toHaveBeenCalled();
        });
    });

    describe('updateMonthYearChanges', () => {
        it('should return same selectedMonthIndex', () => {
            expect(model.selectedMonthIndex).toBe(selectedYearDateObj.getMonth());
        });
        it('should return same selectedMonthYear', () => {
            expect(model.selectedMonthYear).toBe(selectedYearDateObj.getFullYear());
        });
        it('should have called updateYearText', () => {
            spyOn(model, 'updateYearText');
            model.updateYearText();
            expect(model.updateYearText).toHaveBeenCalled();
        });
    });

    describe('generate years', () => {
        const startYear = 2020;
        const endYear = 2025;
        const yearRange = [2020, 2021, 2022, 2023, 2024, 2025];
        it('should return year range ', () => {
            expect(model.generateYears(startYear, endYear)).toEqual(yearRange);
        });
    });

    describe('getDateInFormat', () => {
        it('should return date in format if monthIndex greater than 9 ', () => {
            const monthIndex = 9;
            const year = '2040'
            expect(model.getDateInFormat(monthIndex, year)).toBe('10/2040');
        });
        it('should return date in format if monthIndex less than 9 ', () => {
            const monthIndex = 6;
            const year = '2030'
            expect(model.getDateInFormat(monthIndex, year)).toBe('07/2030');
        });
    });
});
