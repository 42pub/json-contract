"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProductContract_1 = require("../core/ProductContract");
var Option_1 = require("../core/Option");
var util_1 = require("../lib/util");
var ProductContractD = (function (_super) {
    __extends(ProductContractD, _super);
    function ProductContractD(options, name, locale, description, specificationMinVersion, prefix, badge, price, currency, start, finish, discountAllowed, discountCumulativeAllowed, revision, deliveryTime, discounts, args) {
        var _this = _super.call(this, options, name, locale, description, specificationMinVersion, prefix, badge, price, currency, start, finish, revision, deliveryTime, args) || this;
        _this.discounts = discounts || [];
        _this.discountAllowed = discountAllowed || true;
        _this.discountCumulativeAllowed = discountCumulativeAllowed || true;
        return _this;
    }
    ProductContractD.build = function (_a) {
        var locale = _a.locale, name = _a.name, options = _a.options, discountCumulativeAllowed = _a.discountCumulativeAllowed, badge = _a.badge, deliveryTime = _a.deliveryTime, currency = _a.currency, description = _a.description, discountAllowed = _a.discountAllowed, prefix = _a.prefix, finish = _a.finish, price = _a.price, revision = _a.revision, specificationMinVersion = _a.specificationMinVersion, start = _a.start, discounts = _a.discounts, args = __rest(_a, ["locale", "name", "options", "discountCumulativeAllowed", "badge", "deliveryTime", "currency", "description", "discountAllowed", "prefix", "finish", "price", "revision", "specificationMinVersion", "start", "discounts"]);
        options = options.map(function (opt) { return Option_1.default.getOption(opt); });
        return new ProductContractD(options, name, locale, description, specificationMinVersion, prefix, badge, price, currency, start, finish, discountAllowed, discountCumulativeAllowed, revision, deliveryTime, discounts, util_1.objectToProperties(args));
    };
    ProductContractD.prototype.clone = function () {
        return ProductContractD.build(this.getJSON());
    };
    ProductContractD.prototype.getJSON = function () {
        return Object.assign({}, this, _super.prototype.getJSON.call(this));
    };
    return ProductContractD;
}(ProductContract_1.default));
exports.default = ProductContractD;
