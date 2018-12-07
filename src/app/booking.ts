import { Caravan } from './caravan';
import { Customer } from './customer';

export class Booking {
    id: number;
    caravan: Caravan;
    customer: Customer;
    dateFrom: string;
    dateTo: string;
    price: number;
    paid: boolean;
}
