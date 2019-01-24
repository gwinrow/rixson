import { Customer } from './customer';

export class Booking {
    id: string;
    caravanId: string;
    customer: Customer;
    dateFrom: string;
    dateTo: string;
    price: number;
    paid: boolean;
    notes: string;
    cancelled: boolean;
    public constructor(init?: Partial<Booking>) {
        Object.assign(this, init);
    }
}
