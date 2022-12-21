import ProductContract from "./ProductContract";
import Reason from "./Reason";
import Property from "./Property";
import Option from "./Option";
export default class Document implements DocumentBuild {
    productContract: ProductContract;
    controlHash: string;
    values: Value[];
    documentId: string;
    productContractModified: ProductContract;
    [x: string]: any;
    constructor(productContract: ProductContract);
    constructor(productContract: ProductContract, values?: Value[]);
    constructor(productContract: ProductContract, values?: Value[], args?: Property<Document>[]);
    static build({ productContract, values, ...args }: DocumentBuild): Document;
    check(): boolean;
    getRejectReason(): Reason | undefined;
    getNextUnfilled(): Option;
    addOption(id: string, value: any): void;
    getValue(id: string): any;
    processing(contract?: ProductContract): boolean;
    dry(): DocumentDry;
    private findOptionById;
    private getOptionsOfSelectItem;
}
export interface DocumentBuild {
    productContract: ProductContract;
    values: Value[];
}
export declare class Value {
    id: string;
    value: any;
    constructor(id: string, value: any);
}
export interface DocumentDry {
    productContract: string;
    controlHash: string;
    values: Value[];
    documentId: string;
    [x: string]: any;
}
