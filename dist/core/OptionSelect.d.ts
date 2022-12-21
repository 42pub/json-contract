import Option from "./Option";
import SelectItem, { SelectItemBuilder } from "./SelectItem";
import Reason from "./Reason";
import Document from "./Document";
export default class OptionSelect extends Option {
    options: SelectItem[];
    constructor(id: string, type: string, label: string, options: SelectItem[], isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string, handler?: any);
    static buildOption({ anyData, description, id, isRequired, isHidden, label, options, type, handler }: OptionSelectBuilder): OptionSelect;
    validate(value: any, document?: Document): void;
    getRejectReason(value: any, document?: Document): Reason | undefined;
    getSelected(id: any): SelectItem | undefined;
    getJSON(): Option;
}
export interface OptionSelectBuilder extends Option {
    options: SelectItemBuilder[];
}
