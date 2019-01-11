export class Caravan {
    id: number;
    name: string;
    location: string;
    grade: string;
    summary: string;
    description: string;
    imageRefs: string[];
    berths: number;
    pets: boolean;
    smoking: boolean;
    public constructor(init?: Partial<Caravan>) {
        Object.assign(this, init);
    }
}
