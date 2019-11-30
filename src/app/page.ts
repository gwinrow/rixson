export class Page {
    id: string;
    name: string;
    headline: string;
    imageRefs = new Array<string>();
    imageUrls = new Array<string>();
    content: string;
    hide: boolean;
    order: number;
    createdDate: string;
    public constructor(init?: Partial<Page>) {
        Object.assign(this, init);
    }
}
