import { Booking } from '../../booking';
import { Calday } from './calday';

export class Calmonth {
    caldays: Calday[] = [];
    monthdays: Calday[] = [];
    month: string;
    year: number;

    getCaldays(offsetMonth: number) {
        const calDate = new Date();
        let firstDay: number;
        let lastDate: number;
        calDate.setHours(0);
        calDate.setMinutes(0, 0, 1);
        calDate.setDate(1);
        calDate.setMonth(calDate.getMonth() + offsetMonth);
        firstDay = calDate.getDay();
        this.month = calDate.toLocaleString('en-GB', {
            month: 'short'
        });
        this.year = calDate.getFullYear();
        calDate.setMonth(calDate.getMonth() + 1);
        calDate.setDate(0);
        lastDate = calDate.getDate();
        let i = 0;
        for (; i < firstDay; i++) {
            this.caldays[i] = new Calday();
        }
        let dayofmonth = 1;
        const front = i;
        for (; i < lastDate + front; i++, dayofmonth++) {
            const calday = new Calday();
            calday.day = '' + dayofmonth;
            this.caldays[i] = calday;
            this.monthdays[dayofmonth - 1] = calday;
        }
        const max = 7 - (i % 7) + i;
        for (; i < max; i++) {
            this.caldays[i] = new Calday();
        }
        if (i <= 35) {
            for (; i < max + 7; i++) {
                this.caldays[i] = new Calday();
            }
        }
    }

    setBookings(offsetMonth: number, bookings: Booking[]) {
        const calDate = new Date();
        calDate.setHours(0);
        calDate.setMinutes(0, 0, 1);
        calDate.setDate(1);
        calDate.setMonth(calDate.getMonth() + offsetMonth);
        for (let j = 0 ; j < bookings.length; j++) {
            let isCheckin = false;
            let isCheckout = false;
            const checkin = new Date(bookings[j].dateFrom);
            const checkout = new Date(bookings[j].dateTo);
            if (checkin.getFullYear() ===  calDate.getFullYear() &&
                checkin.getMonth() === calDate.getMonth()) {
                isCheckin = true;
                const calDay = this.monthdays[checkin.getDate() - 1];
                if (calDay.class !== 'checkout') {
                    calDay.class = 'checkin';
                } else {
                    calDay.class = 'booked';
                }
            }
            if (checkout.getFullYear() ===  calDate.getFullYear() &&
                checkout.getMonth() === calDate.getMonth()) {
                isCheckout = true;
                const calDay = this.monthdays[checkout.getDate() - 1];
                if (calDay.class !== 'checkin') {
                    calDay.class = 'checkout';
                } else {
                    calDay.class = 'booked';
                }
            }
            if (isCheckin && isCheckout) {
                for (let i = checkin.getDate(); i < checkout.getDate() - 1; i++) {
                    const calDay = this.monthdays[i];
                    calDay.class = 'booked';
                }
            } else if (isCheckin && !isCheckout) {
                for (let i = checkin.getDate(); i < this.monthdays.length; i++) {
                    const calDay = this.monthdays[i];
                    calDay.class = 'booked';
                }
            } else if (!isCheckin && isCheckout) {
                for (let i = 0; i < checkout.getDate() - 1; i++) {
                    const calDay = this.monthdays[i];
                    calDay.class = 'booked';
                }
            } else {
                const checkinMonths = checkin.getFullYear() * 12 + checkin.getMonth();
                const checkoutMonths = checkout.getFullYear() * 12 + checkout.getMonth();
                const calMonths = calDate.getFullYear() * 12 + calDate.getMonth();
                if (calMonths > checkinMonths && calMonths < checkoutMonths) {
                    for (let i = 0; i < this.monthdays.length; i++) {
                        const calDay = this.monthdays[i];
                        calDay.class = 'booked';
                    }
                }
            }
        }
    }

    constructor(offsetMonth: number, bookings: Booking[]) {
        this.getCaldays(offsetMonth);
        this.setBookings(offsetMonth, bookings);
    }
}
