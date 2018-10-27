export interface Customer {
    companyName: string;
    //typeid: int;
    addresses: Address[];
    contacts: Contact[];
}

export interface Address {
    street: string;
    postcode: string;
}
export interface Contact {
    contactinfo: string;
}