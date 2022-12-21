"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("./Option");
var Reason_1 = require("./Reason");
var OptionString = (function (_super) {
    __extends(OptionString, _super);
    function OptionString(id, type, label, isRequired, isHidden, description, anyData, minLength, maxLength, regex, handler) {
        var _this = _super.call(this, id, type, label, isRequired, isHidden, description, anyData, handler) || this;
        _this.minLength = minLength || 0;
        _this.maxLength = maxLength || 100000;
        _this.regex = regex;
        _this.anyData = anyData;
        _this.handler = handler;
        _this.isRequired = isRequired !== undefined ? isRequired : true;
        return _this;
    }
    OptionString.buildOption = function (_a) {
        var anyData = _a.anyData, description = _a.description, id = _a.id, isRequired = _a.isRequired, isHidden = _a.isHidden, label = _a.label, maxLength = _a.maxLength, minLength = _a.minLength, regex = _a.regex, type = _a.type, handler = _a.handler;
        return new OptionString(id, type, label, isRequired, isHidden, description, anyData, minLength, maxLength, regex, handler);
    };
    OptionString.prototype.validate = function (value) {
        if (value) {
            if (typeof value !== 'string')
                throw "Value is not string";
            var len = value.length;
            if (this.minLength)
                if (len < this.minLength)
                    throw "Value length less than minLength";
            if (this.maxLength)
                if (len > this.maxLength)
                    throw "Value length more than maxLength";
            if (this.regex)
                if (!value.match(this.regex))
                    throw "Value not match regex";
        }
        _super.prototype.validate.call(this, value);
    };
    OptionString.prototype.getRejectReason = function (value) {
        if (value) {
            if (typeof value !== 'string')
                return new Reason_1.default('IT', 'incorrect type');
            var len = value.length;
            if (this.minLength)
                if (len < this.minLength)
                    return new Reason_1.default('STML', 'smaller than min length');
            if (this.maxLength)
                if (len > this.maxLength)
                    return new Reason_1.default('LTML', 'larger than max length');
            if (this.regex)
                if (!value.match(this.regex))
                    return new Reason_1.default('RME', 'regex matching error');
        }
        return _super.prototype.getRejectReason.call(this, value);
    };
    return OptionString;
}(Option_1.default));
exports.default = OptionString;
