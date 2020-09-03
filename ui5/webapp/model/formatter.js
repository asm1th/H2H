sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";
	var oFloatNumberFormat = NumberFormat.getFloatInstance({
		maxFractionDigits: 2,
		minFractionDigits: 0,
		groupingEnabled: true
	}, sap.ui.getCore().getConfiguration().getLocale());

	var oCurrencyFormat = NumberFormat.getCurrencyInstance();

	return {
		/*
		 * float to 1
		 */
		floatFormat: function (value) {
			return oFloatNumberFormat.format(value);
		},

		toCurrency: function (value) {
			return oCurrencyFormat.format(value, "руб");
		},

		stmtTypeIdToTextStatus: function (value) {
			switch (value) {
			case 1:
				return "Success";
			case 2:
				return "Warning";
			default:
				return "None";
			}
		},
		
		 // форматтер для подсветки строки в таблице
		formatRowHighlight: function (oValue) {
			// Your logic for rowHighlight goes here
			// 1;Импортирован;
			// 2;Подписан;
			// 3;Подписан I;
			// 4;Подписан II;
			// 5;Отправлен;
			// 6;Доставлен;
			// 7;Принят АБС;
			// 8;Исполнен;
			// 9;Отказан АБС;
			// <core:Item id="CustomPriceFilterItem10" key="ЭП/АСП неверна" text="ЭП/АСП неверна"/>
			// <core:Item id="CustomPriceFilterItem11" key="Ошибка реквизитов" text="Ошибка реквизитов"/>
			// <core:Item id="CustomPriceFilterItem12" key="Удален" text="Удален"/>
												
			if (oValue === "Импортирован") {
				return "Information";
			} else if (oValue === "Подписан" || oValue === "Подписан I" || oValue === "Подписан II") {
				return sap.ui.core.IndicationColor.Indication03;
			} else if (oValue === "Удален") {
				return sap.ui.core.IndicationColor.Indication06;
			} else if (oValue === "Отправлен") {
				return "Warning";
			} else if (oValue === "Доставлен" ) {
				return sap.ui.core.IndicationColor.Indication03;
			} else if ( oValue === "Принят АБС") {
				return "Success";
			} else if (oValue === "Исполнен") {
				return "Success";
			} else if (oValue === "Отказан АБС" || oValue === "ЭП/АСП неверна" || oValue === "Ошибка реквизитов" ) {
				return "Error";
			}
			return "None";
		},

		/**
		 * Change input ststus to avable from bad row status
		 **/
		statusText: function (value) {
			switch (value) {
			case "Information":
				return "None";
			default:
				return value;
			}
		},

		toStringFormat: function (value) {
			var sValue;
			if (value) {
				sValue = value.toString();
			} else {
				sValue = "";
			}
			return sValue;
		},

		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		/*
		currencyValue: function(sValue) {
		  if (!sValue) {
		    return "";
		  }

		  return parseFloat(sValue.toString()).toFixed(2).replace(/./g, function(c, i, a) {
		    return i && c !== '.' && ((a.length - i) % 3 === 0) ? ' ' + c : c;
		  });
		  // return parseFloat(sValue).toFixed(2);
		},

		itskSum: function(sValue) {
		  if (!sValue) {
		    return "";
		  }
		  return parseFloat(sValue.toString()).toFixed(2).replace(/./g, function(c, i, a) {
		    return i && c !== '.' && ((a.length - i) % 3 === 0) ? ' ' + c : c;
		  });
		}
		*/

	};

});