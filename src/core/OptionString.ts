import Option from "./Option";
import Reason from "./Reason";

/**
 * Класс, описывающий строковое значение для ввода.
 */
export default class OptionString extends Option {
  /**
   * Минимальная длина строки
   */
  minLength?: number;
  
  /**
   * Максимальная длина строки
   */
  maxLength?: number;

  /**
   * RegExp для проверки значения
   */
  regex?: string;

  /**
   * External handler
   */
  handler?: any;

  constructor(id: string, type: string, label: string);
  constructor(id: string, type: string, label: string, isRequired: boolean);
  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean);
  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string);
  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string, minLength?: number, maxLength?: number, regex?: string);
  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string, minLength?: number, maxLength?: number, regex?: string, handler?: any);
  /**
   * @param id - id
   * @param type - тип
   * @param label - подпись
   * @param isRequired - обязательно ли
   * @param isHidden - скрывать ли опцию
   * @param description - описание
   * @param anyData - любые данные
   * @param minLength - минимальная длина
   * @param maxLength - максимальная длина
   * @param regex - RegExp для проверки
   * @param handler - внешний обработчик
   */
  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string, minLength?: number, maxLength?: number, regex?: string, handler?: any) {
    super(id, type, label, isRequired, isHidden, description, anyData, handler);
    this.minLength = minLength || 0;
    this.maxLength = maxLength || 100000;
    this.regex = regex;
    this.anyData = anyData;
    this.handler = handler;
    this.isRequired = isRequired !== undefined ? isRequired : true;
  }

  /**
   * Создаёт экземпляр OptionString из JSON. Если передать объект, то будет создана его копия.
   * @param id - id
   * @param type - тип
   * @param label - подпись
   * @param isRequired - обязательно ли
   * @param isHidden - скрывать ли опцию
   * @param description - описание
   * @param anyData - любые данные
   * @param minLength - минимальная длина
   * @param maxLength - максимальная длина
   * @param regex - RegExp для проверки
   * @param handler - внешний обработчик
   */
  public static buildOption({anyData, description, id, isRequired, isHidden, label, maxLength, minLength, regex, type, handler}: OptionString): OptionString {
    return new OptionString(id, type, label, isRequired, isHidden, description, anyData, minLength, maxLength, regex, handler);
  }

  /**
   * Проверяет валидность переданного значения. А именно, переменная должна быть строкой, не меньше минимальной длины,
   * не больше максимальной и соответствовать regex. Так же производится проверка, поставляемая родительским классом.
   * @param value - значение для проверки
   */
  public validate(value: any): void {
    if (value) {
      if (typeof value !== 'string')
        throw `Value is not string`
      const len = value.length;
      if (this.minLength)
        if (len < this.minLength)
          throw `Value length less than minLength`
      if (this.maxLength)
        if (len > this.maxLength)
          throw `Value length more than maxLength`
        if (this.regex)
        if (!value.match(this.regex))
          throw `Value not match regex`
      }
    super.validate(value);
  }

  /**
   * Возвращает причину не валидности значения или undefined если значение валидное
   * @param value - значение
   * @return Возможные значения
   * - [[Reason]] {
   *   code: 'IT',
   *   label: 'incorrect type'
   * }
   * - [[Reason]] {
   *   code: 'STML',
   *   label: 'smaller than min length'
   * }
   * - [[Reason]] {
   *   code: 'LTML',
   *   label: 'larger than max length'
   * }
   * - [[Reason]] {
   *   code: 'RME',
   *   label: 'regex matching error'
   * }
   * - причины отказа родительского класса
   */
  public getRejectReason(value: any): Reason | undefined {
    if (value) {
      if (typeof value !== 'string')
        return new Reason('IT', 'incorrect type');
      const len = value.length;
      if (this.minLength)
        if (len < this.minLength)
          return new Reason('STML', 'smaller than min length');
      if (this.maxLength)
        if (len > this.maxLength)
          return new Reason('LTML', 'larger than max length');
      if (this.regex)
        if (!value.match(this.regex))
          return new Reason('RME', 'regex matching error');
    }
    return super.getRejectReason(value);
  }
}
