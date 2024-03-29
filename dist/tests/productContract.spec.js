'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
require("should");
var productContract1Data = require('./data/productContract-data.json');
var productContract1Expected = require('./data/productContract-expected.json');
var productContract1ExpectedJson = require('./data/productContract-expected-json.json');
describe('ProductContract', function () {
    it('should create correct contract from JSON', function () {
        var contract = __1.ProductContract.build(productContract1Data);
        contract.should.match(productContract1Expected);
    });
    it('should clone product contract', function () {
        var contract = __1.ProductContract.build(productContract1Data);
        var cloneContract = contract.clone();
        JSON.stringify(cloneContract).should.eql(JSON.stringify(contract));
    });
    it('should return JSON from contract', function () {
        var contract = __1.ProductContract.build(productContract1Data);
        var contractJSON = contract.getJSON();
        contractJSON.should.match(productContract1ExpectedJson);
    });
});
