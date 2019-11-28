export class Settings {
    title: string;
    phone: string;
    mobile: string;
    email: string;
    welcomeTitle: string;
    welcomeMessage: string;
    welcomeCaravans: string;
    caravanCTA: string;
    bizAddress1: string;
    bizAddress2: string;
    bizAddress3: string;
    bizAddress4: string;
    bizPostcode: string;
    parkAddress1: string;
    parkAddress2: string;
    parkAddress3: string;
    parkAddress4: string;
    parkPostcode: string;
    parkGoogleMaps: string;
    public constructor(init?: Partial<Settings>) {
        Object.assign(this, init);
    }
}
