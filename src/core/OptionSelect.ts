import Option from "./Option";
import SelectItem, {SelectItemBuilder} from "./SelectItem";
import Reason from "./Reason";
import Document from "./Document";

/**
 * Класс, описывающий поле выбора из нескольких вариантов
 */
export default class OptionSelect extends Option {
  /**
   * Массив экземпляров, содержащие строки, из которых можно выбрать одну как значение. Тут же хранятся и действия ([[Action]]),
   * которые будут выполнены при выборе конкретного значения и новые [[Option]][], которые будут показаны при выборе конкретного
   * значения
   */
  options: SelectItem[];

  /**
   * @param id - id
   * @param type - тип
   * @param label - подпись
   * @param options - массив [[SelectItem]] которые содержат варианты выбора.
   * @param isRequired - обязательно ли
   * @param isHidden - скрывать ли опцию
   * @param description - описание
   * @param anyData - любые данные
   * @param handler - внешний обработчик
   */
  constructor(id: string, type: string, label: string, options: SelectItem[], isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string, handler?: any) {
    super(id, type, label, isRequired, isHidden, description, anyData, handler);
    this.options = options;
    this.anyData = anyData;
    this.handler = handler;
    this.isRequired = true;

  }

  /**
   * Создаёт экземпляр OptionSelect из JSON. Если передать объект, то будет произведена попытка создать копию.
   * @param id - id
   * @param type - тип
   * @param label - подпись
   * @param options - массив SelectItem которые содержат варианты выбора.
   * @param isRequired - обязательно ли
   * @param isHidden - скрывать ли опцию
   * @param description - описание
   * @param anyData - любые данные
   * @param handler - внешний обработчик
   */
  public static buildOption({anyData, description, id, isRequired, isHidden, label, options, type, handler}: OptionSelectBuilder): OptionSelect {
    const optionsObj = options.map(opt => SelectItem.buildItem(opt));
    return new OptionSelect(id, type, label, optionsObj, isRequired, isHidden, description, anyData, handler);
    
  }

  /**
   * Проверка валидности значения. Проверяет, что выбранное значение есть в массиве допустимых значений, а так же
   * проверяет вложенные значения этого выбора, если был передан документ. У некоторых [[SelectItem]] могут быть вложены
   * свои [[Option]][], которые следует проверить. Тут происходит проверка того, что для опций выбранного значения документ
   * так же является валидным
   * @param value - значение для проверки
   * @param document - документ, в котором хранятся вложенные значения
   */
  public validate(value: any, document?: Document): void {
    if (value) {
      const checked = this.options.filter(opt => opt.id === value)[0];
      if (this.isRequired)
        if (!checked)
          throw `Select option not found`;
      if (checked)
        if (checked.form.options.length)
          if (document)
            checked.form.validate(document)
    }
    super.validate(value);
  }

  /**
   * Возвращает причину не валидности значения или undefined если значение валидное
   * @param value - значение
   * @param document
   * @return Возможные значения
   * - [[Reason]] {
   *   code: 'NC',
   *   label: 'not checked'
   * }
   * - причины отказа дочерних Option
   * - причины отказа родительского класса
   */
  public getRejectReason(value: any, document?: Document): Reason | undefined {
    if (value) {
      const checked = this.options.filter(opt => opt.id === value)[0];
      if (this.isRequired)
        if (!checked)
          return new Reason('NC', 'not checked');

      if (checked.form.options.length) {
        if (document) {
          const reason = checked.form.getRejectReason(document);
          if (reason)
            return reason;
        }

      }
    }
    return super.getRejectReason(value);
  }

  /**
   * Возвращает [[SelectItem]] для заданного значения
   * @param id - ID
   */
  public getSelected(id: any): SelectItem | undefined {
    return this.options.find(opt => opt.id === id);
  }

  /**
   * Создаёт JSON из текущего экземпляра. Метод противоположный [[build]].
   */
  getJSON(): Option {
    const clone = <OptionSelectBuilder>super.getJSON();
    clone.options = this.options.map(opt => opt.getJSON());
    return clone;
  }
}

/**
 * Интерфейс для создания [[OptionSelect]]
 */
export interface OptionSelectBuilder extends Option {
  options: SelectItemBuilder[];
}
