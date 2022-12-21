import Option from "./Option";
import Reason from "./Reason";
export default class OptionString extends Option {
    minLength?: number;
    maxLength?: number;
    regex?: string;
    handler?: any;
    constructor(id: string, type: string, label: string);
    constructor(id: string, type: string, label: string, isRequired: boolean);
    constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean);
    constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string);
    constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string, minLength?: number, maxLength?: number, regex?: string);
    constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string, minLength?: number, maxLength?: number, regex?: string, handler?: any);
    static buildOption({ anyData, description, id, isRequired, isHidden, label, maxLength, minLength, regex, type, handler }: OptionString): OptionString;
    validate(value: any): void;
    getRejectReason(value: any): Reason | undefined;
}
