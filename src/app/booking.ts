import { Caravan } from './caravan';

export class Booking {
    id: string;
    caravanId: string;
    caravan: Caravan;
    name: string;
    dateFrom: string;
    dateTo: string;
    deposit: number;
    price: number;
    notes: string;
    createdDate: string;
    // pending, deposit paid, fully paid, cancelled
    status: string;
    public constructor(init?: Partial<Booking>) {
        Object.assign(this, init);
    }
}
