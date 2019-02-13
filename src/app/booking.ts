import { Customer } from './customer';
import { Caravan } from './caravan';

export class Booking {
    id: string;
    caravanId: string;
    caravan: Caravan;
    customerId: string;
    customer: Customer;
    dateFrom: string;
    dateTo: string;
    price: number;
    paid: boolean;
    notes: string;
    cancelled: boolean;
    createdDate: string;
    public constructor(init?: Partial<Booking>) {
        Object.assign(this, init);
    }
}
