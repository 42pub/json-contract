import ProductContract from "./ProductContract";
import Reason from "./Reason";
import Property from "./Property";
import OptionSelect from "./OptionSelect";
import {objectToProperties} from "../lib/util";
import * as uuid from "uuid";

/**
 * Основной класс. Документ хранит пары id-зачение для некоторого [[ProductContract]], сам [[ProductContract]] и копию
 * [[ProductContract]], которая может меняться [[Action]]. Эти [[Action]] могут быть активированы [[OptionSelect]] посредством выбора юзера
 * которого из вариантов. Активация [[Action]] происходит в момент записи новой пары OptionSelectId-значение. Документ по
 * сути своей является наполнением для [[ProductContract]]
 */
export default class Document implements DocumentBuild {
  /**
   * [[ProductContract]] шаблон, используется при сбросе для расчёта стоимости, врени доставки и прочих изменений
   */
  productContract: ProductContract;
  /**
   * Хеш документа
   */
  controlHash: string;
  /**
   * Данные ввода. Хранят пары <id опции>:<значение опции>
   */
  values: Value[];
  /**
   * Just uuid
   */
  documentId: string;
  /**
   * [[ProductContact]] который может быть модифицирован с помощью [[Action]]. [[Value]] нём могут меняться почти любые
   * поля, при расчёте именно он хранит в себе результат работы функции процессинга документа
   */
  productContractModified: ProductContract;

  /**
   * Любые другие поля для внешних модулей
   */
  [x: string]: any;

  constructor(productContract: ProductContract)
  constructor(productContract: ProductContract, values?: Value[])
  constructor(productContract: ProductContract, values?: Value[], args?: Property<Document>[])
  /**
   * При создании генерирует [[documentId]] и клонирует [[ProductContract]] в [[productContractModified]]
   *
   * @constructor
   * @param productContract - [[ProductContract]] для которого предназначен документ
   * @param values - Массив, если такие уже есть
   * @param args - Дополнительные поля (для внешних модулей)
   */
  public constructor(productContract: ProductContract, values?: Value[], args?: Property<Document>[]) {
    this.productContract = productContract;
    this.controlHash = '';
    this.values = values || [];
    this.documentId = uuid.v4();
    this.productContractModified = this.productContract.clone();

    if (args)
      for (let i of args)
        this[i.property] = i.value;
  }

  /**
   * Создаёт экземпляр документа из JSON. Поля JSON аналогичны конструктору. Обработка проихсодит рекурсивно, то есть
   * создаются новые [[Value]] и [[ProductContract]]
   *
   * @param productContract - [[ProductContract]], может быть JSON или екземляр класса. Если это JSON, то будет создан новый екземпляр [[ProductContract]] на его основе,
   * если это екземпляр, то он будет скопирован, опять же, рекурсивно
   * @param values - Массив пар id-значение. При создании не проверяется, для проверки используйте метод [[validate]]
   * @param args - Дополнительные поля (для внешних модулей)
   * @return new [[Document]]
   */
  public static build({productContract, values, ...args}: DocumentBuild): Document {
    values = values.map(v => new Value(v.id, v.value));
    productContract = ProductContract.build(productContract);
    return new Document(productContract, values, objectToProperties(<Document>args));
  }

  /**
   * Проверяет, что все [[Value]] валидны для их [[Option]] (проверяет валидность каждой [[Option]])
   */
  public check(): boolean {
    return this.productContract.validate(this);
  }

  /**
   * Возвращает первую причину отказа в успешности проверки или undefined если проверка успешна
   */
  public getRejectReason(): Reason | undefined {
    return this.productContract.getRejectReason(this);
  }

  /**
   * Запись новой пары <id опции>:<значение> или перезапись старой. Если значение не валидно происходит отказ, иначе
   * запись и выполнение действий, если это [[OptionsSelect]]
   *
   * @param id - [[Option]] id
   * @param value - Новое значение ввода
   */
  public addOption(id: string, value: any): boolean {
    const option = this.productContract.options.filter(opt => opt.id === id)[0];

    if (!option)
      return false;

    if (!option.validate(value))
      return false;

    const oldValue = this.values.filter(v => v.id === id)[0];
    if (oldValue)
      oldValue.value = value;
    else
      this.values.push(new Value(id, value));

    if (option instanceof OptionSelect) {
      option.getSelected(value).action.activate(this.productContractModified);
    }

    return true;
  }

  /**
   * Возвращает значение по id
   *
   * @param id - [[Option]] id
   */
  public getValue(id: string): any {
    return this.values.filter(v => v.id === id)[0].value;
  }

  /**
   * Расчитывает цену, время доставки, а так же редактирует [[productContractModified]] поле в соответствии с выбраными [[OptionsSelect]].
   * Иными словами, этот метод активирует все [[Action]] для выбраных [[OptionsSelect]]
   *
   * @param contract - [[ProductContract]] который использовать для сброса. Если не передан, то используется [[productContract]] поле
   * @return Успешность расчёта
   */
  public processing(contract?: ProductContract): boolean {
    if (!this.check())
      return false;

    this.productContract.processing(this, contract);

    return true;
  }

  /**
   * "Осущает" документ. Создаёт объект, который содержит только поля, необходимые для воссоздания его в другом модуле.
   * поле [[productContract]] заменяется на его [[ProductContract.contractId]]
   */
  public dry(): DocumentDry {
    let res = {} as DocumentDry;
    for (let i in this) {
      if (i == 'productContract')
        res.productContract = this.productContract.contractId;
      else if (this.hasOwnProperty(i) && i != 'productContractModified')
        res[i] = this[i];
    }
    return res;
  }
}

/**
 * Интерфейс для создания документа, содержит только необходимые поля для его создания из JSON
 */
export interface DocumentBuild {
  productContract: ProductContract;
  values: Value[];
}

/**
 * Содержит пары id-значение
 */
export class Value {
  /**
   * Option id
   */
  id: string;
  /**
   * Значение [[Option]], id которой указан
   */
  value: any;

  /**
   * @param id - option id
   * @param value - option value
   */
  constructor(id: string, value: any) {
    this.id = id;
    this.value = value;
  }
}

/**
 * Описывает "осушенный" документ, в котором вместо productContract id этого контракта
 */
export interface DocumentDry {
  productContract: string;
  controlHash: string;
  values: Value[];
  documentId: string;

  [x: string]: any;
}

