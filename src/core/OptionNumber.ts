import Option from "./Option";
import Reason from "./Reason";

/**
 * Класс, описывающий численное значение для ввода.
 */
export default class OptionNumber extends Option {
  /**
   * Минимальное значение
   */
  min?: number;
  /**
   * Максимальное значение
   */
  max?: number;
  /**
   * RegExp для проверки значения
   */
  regex?: string;

  /**
   * @param id - id
   * @param type - тип
   * @param label - подпись
   * @param isRequired - обязательно ли
   * @param isHidden - скрывать ли опцию
   * @param description - описание
   * @param anyData - любые данные
   * @param min - минимальное значение
   * @param max - максимальное значение
   * @param regex - RegExp для проверки
   * @param handler - Внешний обработчик
   */
  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string, min?: number, max?: number, regex?: string, handler?: any) {
    super(id, type, label, isRequired, isHidden, description, anyData, handler);
    this.min = min;
    this.max = max;
    this.regex = regex;
    this.anyData = anyData;
    this.handler = handler;
    this.isRequired = isRequired !== undefined ? isRequired : true;
  }

  /**
   * Создаёт экземпляр OptionNumber из JSON. Если передать объект, то будет создана его копия.
   * @param id - id
   * @param type - тип
   * @param label - подпись
   * @param isRequired - обязательно ли
   * @param isHidden - скрывать ли опцию
   * @param description - описание
   * @param anyData - любые данные
   * @param min - минимальное значение
   * @param max - максимальное значение
   * @param regex - RegExp для проверки
   * @param handler - внешний обработчик
   */
  public static buildOption({anyData, description, id, isRequired, isHidden, label, max, min, regex, type, handler}: OptionNumber): OptionNumber {
    return new OptionNumber(id, type, label, isRequired, isHidden, description, anyData, min, max, regex, handler);
  }

  /**
   * Проверяет валидность переданного значения. А именно, переменная должна быть числом, не меньше минимального значения,
   * не больше максимального и соответствовать regex. Так же производится проверка, поставляемая родительским классом.
   * @param value - значение для проверки
   */
  public validate(value: any): void {
    if (value) {
      if (typeof value !== 'number')
        throw `Value is not number`
      if (this.min)
        if (value < this.min)
          throw `Less than min`
      if (this.max)
        if (value > this.max)
          throw `More than max`
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
   *   code: 'STM',
   *   label: 'smaller than min'
   * }
   * - [[Reason]] {
   *   code: 'LTM',
   *   label: 'larger than max'
   * }
   * - [[Reason]] {
   *   code: 'RME',
   *   label: 'regex matching error'
   * }
   * - причины отказа родительского класса
   */
  public getRejectReason(value: any): Reason | undefined {
    if (value) {
      if (typeof value !== 'number')
        return new Reason('IT', 'incorrect type');
      if (this.min)
        if (value < this.min)
          return new Reason('STM', 'smaller than min');
      if (this.max)
        if (value > this.max)
          return new Reason('LTM', 'larger than max');
      if (this.regex)
        if (!value.toString().match(this.regex))
          return new Reason('RME', 'regex matching error');
    }
    return super.getRejectReason(value);
  }
}
