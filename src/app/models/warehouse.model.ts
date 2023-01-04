export class Warehouse {
    constructor(
        public code: string,
        public name: string,
        public address: string,
        public state: string,
        public country?: string,
        public zip?: number,
        public uid?: string
    ) {}
}

export interface WarehouseInterface { 
    code: string,
    name: string,
    address: string,
    state: string,
    country?: string,
    zip?: number,
    uid?: string,
    lat?: number,
    long?: number,
    file?: string
}