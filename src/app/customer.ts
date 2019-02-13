export class Customer {
    id: string;
    firstName: string;
    secondName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    postcode: string;
    createdDate: string;
    public constructor(init?: Partial<Customer>) {
        Object.assign(this, init);
    }
}
