export interface HomeForSale {
    Id: number;
    Broker: string;
    PriceInDollars: number;
    PriceDisplay: string;
    BedCount: number;
    BathCount: number;
    AddressFull: string;
    StreetName: string;
    City: string;
    State: string;
    ZipCode: string;
    CoverImageURL: string;
    NewConstruction: boolean;
    DetailPageURL: string;
    Status: number;
}