'use strict';

import {Document} from "..";
import should = require("should");
import Reason from '../core/Reason';

const document1Data = require('./data/document1-data.json');
const document1Expected = require('./data/document1-expected.json');
const simpleProductContractData = require('./data/productContract-data.json');
const simpleProductContract2Data = require('./data/productContract-data2.json');
const pizzaProductContractData = require('./data/productContract-pizza.json');
const simpleProductContractExpected = require('./data/productContract-expected.json');
const numberProductContract = require('./data/productContract-with-number-option.json');
const stringProductContract = require('./data/productContract-with-string-option.json');
const selectProductContractSimple = require('./data/productContract-with-simple-select-option.json');
const selectProductContractComplex = require('./data/productContract-with-complex-select-option.json');

describe('Document', () => {

  it('should correct create document from JSON', () => {
    document1Data.productContract = simpleProductContractData;
    const document = Document.build(document1Data);

    document1Expected.productContract = simpleProductContractExpected;
    document1Expected.productContractModified = simpleProductContractExpected;
    document.should.match(document1Expected);
  });


  describe('validation and rejection errors', () => {

    let document: Document;

    beforeEach(() => {
      document1Data.productContract = simpleProductContractData;
      document = Document.build(document1Data);
    });

    it('should return ok if string options is required, but hidden and not set', () => {
      const stringValue = document.values.find(v => v.id === 'stringOption');
      if (!stringValue) {
        throw new Error('There is not string option');
      }

      stringValue.value = undefined;
      console.log(document.productContract.options,document.getRejectReason())
      document.check().should.be.true();
      should(document.getRejectReason()).be.undefined();
    });

    it('should return reject if select options is required but not set', () => {
      const selectValue = document.values.find(v => v.id === 'selectOption');
      if (!selectValue) {
        throw new Error('There is not select option');
      }

      selectValue.value = undefined;

      document.check().should.be.false();
      const reason = new Reason('IR', 'is required');
      reason.rejectOption = 'selectOption';
      should(document.getRejectReason()).be.eql(reason);
    });

    it('should return not ok if number options is required and is not set', () => {
      const numberValue = document.values.find(v => v.id === 'numberOption');
      if (!numberValue) {
        throw new Error('There is not number option');
      }

      numberValue.value = undefined;

      document.check().should.be.false();
      should(document.getRejectReason()).be.not.undefined();
    });

    describe('for number options', () => {

      beforeEach(() => {
        document = Document.build({
          values: [
            {
              id: 'numberOption',
              value: 50
            }
          ],
          productContract: numberProductContract
        });
      });

      it('should return ok', () => {
        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });

      it('should reject if number options is larger than maximum', () => {
        const numberValue = document.values.find(v => v.id === 'numberOption');
        if (!numberValue) {
          throw new Error('There is not number option');
        }

        numberValue.value = 200;

        document.check().should.be.false();
        const reason = new Reason('LTM', 'larger than max');
        reason.rejectOption = 'numberOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if number options is less than minimal', () => {
        const numberValue = document.values.find(v => v.id === 'numberOption');
        if (!numberValue) {
          throw new Error('There is not number option');
        }

        numberValue.value = 5;

        document.check().should.be.false();
        const reason = new Reason('STM', 'smaller than min');
        reason.rejectOption = 'numberOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if number options has type string', () => {
        const numberValue = document.values.find(v => v.id === 'numberOption');
        if (!numberValue) {
          throw new Error('There is not number option');
        }

        numberValue.value = '50';

        document.check().should.be.false();
        const reason = new Reason('IT', 'incorrect type');
        reason.rejectOption = 'numberOption';
        should(document.getRejectReason()).be.eql(reason);
      });

    });

    describe('for string options', () => {

      beforeEach(() => {
        document = Document.build({
          values: [
            {
              id: 'stringOption',
              value: 'test'
            }
          ],
          productContract: stringProductContract
        });
      });

      it('should return ok', () => {
        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });

      it('should reject if string options is not match regex', () => {
        const stringValue = document.values.find(v => v.id === 'stringOption');
        if (!stringValue) {
          throw new Error('There is not string option');
        }

        stringValue.value = '$#!?*';

        document.check().should.be.false();
        const reason = new Reason('RME', 'regex matching error');
        reason.rejectOption = 'stringOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if string option length is larger than maximum length', () => {
        const stringValue = document.values.find(v => v.id === 'stringOption');
        if (!stringValue) {
          throw new Error('There is not string option');
        }

        stringValue.value = 'qwertyuiopasd';

        document.check().should.be.false();
        const reason = new Reason('LTML', 'larger than max length');
        reason.rejectOption = 'stringOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if string option length is less than minimal length', () => {
        const stringValue = document.values.find(v => v.id === 'stringOption');
        if (!stringValue) {
          throw new Error('There is not string option');
        }

        stringValue.value = '12';

        document.check().should.be.false();
        const reason = new Reason('STML', 'smaller than min length');
        reason.rejectOption = 'stringOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if string options has type string', () => {
        const stringValue = document.values.find(v => v.id === 'stringOption');
        if (!stringValue) {
          throw new Error('There is not string option');
        }

        stringValue.value = 50;

        document.check().should.be.false();
        const reason = new Reason('IT', 'incorrect type');
        reason.rejectOption = 'stringOption';
        should(document.getRejectReason()).be.eql(reason);
      });

    });

    describe('for simple select options', () => {

      beforeEach(() => {
        document = Document.build({
          values: [
            {
              id: 'selectOption',
              value: 's-1'
            }
          ],
          productContract: selectProductContractSimple
        });
      });

      it('should return ok', () => {
        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });

      it('should reject if option not selected', () => {
        const selectValue = document.values.find(v => v.id === 'selectOption');
        if (!selectValue) {
          throw new Error('There is not select option');
        }

        selectValue.value = 'broken';

        document.check().should.be.false();
        const reason = new Reason('NC', 'not checked');
        reason.rejectOption = 'selectOption';
        should(document.getRejectReason()).be.eql(reason);
      });

    });

    describe('for complex select option', () => {

      beforeEach(() => {
        document = Document.build({
          values: [
            {
              id: 'selectOption',
              value: 'selectWithNumberString'
            },
            {
              id: 'numberOptionRequired',
              value: 5
            }
          ],
          productContract: selectProductContractComplex
        });
      });

      it('should return ok', () => {
        document.check().should.be.false();
        should(document.getRejectReason()).be.not.undefined();
      });

      it('should reject if number option is larger than max', () => {
        const numberValue = document.values.find(v => v.id === 'numberOptionRequired');
        if (!numberValue) {
          throw new Error('There is not number option');
        }

        numberValue.value = 15;

        document.check().should.be.false();
        const reason = new Reason('LTM', 'larger than max');
        reason.rejectOption = 'selectOption:numberOptionRequired';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if selected radio with required value and value not set', async () => {
        const selectValue = document.values.find(v => v.id === 'selectOption');
        if (!selectValue) {
          throw new Error('There is not select option');
        }

        selectValue.value = 'selectWithSelect';

        document.check().should.be.false();
        const reason = new Reason('IR', 'is required');
        reason.rejectOption = 'selectOption:selectOptionInner';
        should(document.getRejectReason()).be.eql(reason);
      });


      it('should return ok if selected radio with required value and value set', async () => {
        const selectValue = document.values.find(v => v.id === 'selectOption');
        if (!selectValue) {
          throw new Error('There is not select option');
        }

        selectValue.value = 'selectWithSelect';

        document.values.push({
          id: 'selectOptionInner',
          value: 's-1'
        });

        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });


    });

  });


  it('should show unfilled', () => {
    const document = Document.build({
      values: [],
      productContract: simpleProductContractData
    });

    document.getNextUnfilled().id.should.be.equal("stringOption");
  });

  it('should add option', () => {
    const document = Document.build({
      values: [],
      productContract: simpleProductContractData
    });

    document.addOption('selectOption', 's-1');

    document.values.should.match([{
      id: 'selectOption',
      value: 's-1'
    }]);
  });

  describe('addOption', () => {

    it('should add option in select options', () => {
      const document = Document.build({
        values: [],
        productContract: simpleProductContractData
      });

      document.addOption('selectOption', 's-1');
      document.addOption('numberOption', 1);

      document.values.should.match([{
        id: 'selectOption',
        value: 's-1'
      }, {
        id: 'numberOption',
        value: 1
      }]);
    });

    /** Maded for fixing bug: addOption not work for options after select */
    it('should add option in last and not select options', () => {
      const document = Document.build({
        values: [],
        productContract: simpleProductContractData
      });
      document.addOption('oneMoreString', "just string");
    });

    it('should reject if option not found', () => {
      const document = Document.build({
        values: [],
        productContract: selectProductContractComplex
      });

      let catchError = false;
      try {
        document.addOption('brokenOption', 'value');
      } catch {
        catchError = true
      }
      catchError.should.be.true();
      
      document.values.should.match([]);
    });

    it('should reject if option not valid', () => {
      const document = Document.build({
        values: [],
        productContract: selectProductContractComplex
      });

      let catchError = false;
      try {
        document.addOption('selectOption', 'brokenSelect');
      } catch {
        catchError = true
      }
      catchError.should.be.true();

      document.values.should.match([]);
    });

    it('should update value if it has been set previously', () => {
      const document = Document.build({
        values: [],
        productContract: simpleProductContractData
      });

      document.addOption('selectOption', 's-1');
      document.addOption('numberOption', 5);
      document.addOption('numberOption', 7);

      document.values.should.match([{
        id: 'selectOption',
        value: 's-1'
      }, {
        id: 'numberOption',
        value: 7
      }]);
    });

    it('should remove unselected options', () => {
      const document = Document.build({
        values: [],
        productContract: simpleProductContractData
      });

      document.addOption('selectOption', 's-1');
      document.addOption('numberOption', 5);

      document.values.should.match([{
        id: 'selectOption',
        value: 's-1'
      }, {
        id: 'numberOption',
        value: 5
      }]);

      document.addOption('selectOption', 's-2');

      document.values.should.match([{
        id: 'selectOption',
        value: 's-2'
      }, {
        id: 'numberOption',
        value: 5
      }]);
    });

    describe('and activate action', () => {

      it('should modify price', () => {

      });

      it('should change hidden state', () => {
        const document = Document.build({
          values: [],
          productContract: simpleProductContract2Data
        });

        // hideOptionsById
        document.addOption('selectOption', 's-1');

        let option = document.productContractModified.options.find(opt => opt.id === 'numberOption');
        should(option).not.be.undefined();

        if (option) {
          option.isHidden.should.be.true();
        }

        console.log(document)
        // showOptionsById
        document.addOption('selectOption', 's-2');

        option = document.productContractModified.options.find(opt => opt.id === 'numberOption');
        should(option).not.be.undefined();

        if (option) {
          option.isHidden.should.be.false();
        }
      });
    });

  });

});
