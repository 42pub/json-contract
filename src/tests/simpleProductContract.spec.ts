'use strict';

import {ProductContract} from "..";
import 'should';

const productContract1Data = require('./data/productContract1-data.json');
const productContract1Expected = require('./data/productContract1-expected.json');
const productContract1ExpectedJson = require('./data/productContract1-expected-json.json');

describe('Simple ProductContract usage', () => {

  it('should create correct contract from JSON', () => {
    const contract = ProductContract.build(productContract1Data);

    contract.should.match(productContract1Expected);
  });

  it('should clone product contract', () => {
    const contract = ProductContract.build(productContract1Data);

    const cloneContract = contract.clone();

    JSON.stringify(cloneContract).should.eql(JSON.stringify(contract));
  });

  it('should return JSON from contract', () => {
    const contract = ProductContract.build(productContract1Data);

    const contractJSON = contract.getJSON();

    contractJSON.should.match(productContract1ExpectedJson);
  });

});
