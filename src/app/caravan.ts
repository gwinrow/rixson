export class Caravan {
    id: string;
    name: string;
    location: string;
    grade: string;
    summary: string;
    description: string;
    imageRefs = new Array<string>();
    imageUrls = new Array<string>();
    berths: number;
    pets: boolean;
    smoking: boolean;
    hide: boolean;
    createdDate: string;
    order: number;
    public constructor(init?: Partial<Caravan>) {
        Object.assign(this, init);
    }
}
