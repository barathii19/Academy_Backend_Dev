

export class HelperController {
    static getRandomColor() {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return "#" + randomColor
    }
    static getStringMonth(monthNumber: number) {
        const m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return m[monthNumber]
    }
    static getWeekDates() {

        let now = new Date();
        let dayOfWeek = now.getDay(); //0-6
        let numDay = now.getDate();

        let start = new Date(now); //copy
        start.setDate(numDay - dayOfWeek);
        start.setHours(0, 0, 0, 0);


        let end = new Date(now); //copy
        end.setDate(numDay + (7 - dayOfWeek));
        end.setHours(0, 0, 0, 0);

        return [start, end];
    }
}
