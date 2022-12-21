import Option from "./Option";
import Document from "./Document";
import Reason from "./Reason";
export default class Form implements FormBuilder {
    options: Option[];
    constructor(options?: Option[]);
    protected static build({ options }: Form): Form;
    validate(document: Document): void;
    getRejectReason(document: Document): Reason | undefined;
    unfilledFields(document: Document): Option[];
    processing(document: Document, contract?: ProductContract): void;
    clone(): Form;
    getJSON(): any;
    private getModifiers;
}
export interface FormBuilder {
    options: Option[];
}
import ProductContract from "./ProductContract";
