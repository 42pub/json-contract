import Reason from "./Reason";
export default class Option {
    id: string;
    type: string;
    label: string;
    isRequired: boolean;
    isHidden: boolean;
    description?: string;
    anyData?: string;
    handler?: any;
    constructor(id: string, type: string, label: string);
    constructor(id: string, type: string, label: string, isRequired: boolean);
    constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean);
    constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string);
    constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string);
    constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string, handler?: any);
    static buildOption({ id, type, label, isRequired, isHidden, description, anyData, handler }: Option): Option;
    static getOption<T extends Option>(data: T): Option;
    validate(value: any): void;
    getRejectReason(value: any): Reason | undefined;
    getJSON(): Option;
}
export declare enum OptionTypes {
    STRING = "string",
    NUMBER = "number",
    SELECT = "select"
}
