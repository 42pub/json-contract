"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("./Option");
var Form = (function () {
    function Form(options) {
        this.options = options || [];
    }
    Form.build = function (_a) {
        var options = _a.options;
        options = options.map(function (opt) { return Option_1.default.getOption(opt); });
        return new Form(options);
    };
    Form.prototype.validate = function (document) {
        var _loop_1 = function (option) {
            var value = document.values.filter(function (v) { return v.id === option.id; })[0] || {};
            if (option.type === Option_1.OptionTypes.SELECT) {
                option.validate(value.value, document);
            }
            else {
                option.validate(value.value);
            }
        };
        for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
            var option = _a[_i];
            _loop_1(option);
        }
    };
    Form.prototype.getRejectReason = function (document) {
        var _loop_2 = function (option) {
            var value = document.values.filter(function (v) { return v.id === option.id; })[0] || {};
            if (option.type === Option_1.OptionTypes.SELECT) {
                var reason = option.getRejectReason(value.value, document);
                if (reason) {
                    reason.rejectOption = "".concat(option.id).concat(reason.rejectOption ? ':' + reason.rejectOption : '');
                    return { value: reason };
                }
            }
            else {
                var reason = option.getRejectReason(value.value);
                if (reason) {
                    reason.rejectOption = option.id;
                    return { value: reason };
                }
            }
        };
        for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
            var option = _a[_i];
            var state_1 = _loop_2(option);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return undefined;
    };
    Form.prototype.unfilledFields = function (document) {
        var unfilledFields = [];
        var _loop_3 = function (option) {
            var value = document.values.filter(function (v) { return v.id === option.id; })[0];
            if (!value)
                unfilledFields.push(option);
        };
        for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
            var option = _a[_i];
            _loop_3(option);
        }
        return unfilledFields;
    };
    Form.prototype.processing = function (document, contract) {
        document.productContractModified = (contract || document.productContract).clone();
        var modifiers = this.getModifiers(document);
        modifiers.forEach(function (modifier) { return modifier.action.activate(document.productContractModified); });
    };
    Form.prototype.clone = function () {
        return Form.build(this.getJSON());
    };
    Form.prototype.getJSON = function () {
        var clone = Object.assign({}, this);
        clone.options = this.options.map(function (opt) { return opt.getJSON(); });
        return clone;
    };
    Form.prototype.getModifiers = function (document) {
        var optionsSelect = this.options.filter(function (opt) { return opt instanceof OptionSelect_1.default; });
        var selectedOptions = optionsSelect.map(function (m) { return m.getSelected(document.getValue(m.id)); });
        selectedOptions = selectedOptions.filter(function (sm) { return !!sm; });
        return selectedOptions;
    };
    return Form;
}());
exports.default = Form;
var OptionSelect_1 = require("./OptionSelect");
