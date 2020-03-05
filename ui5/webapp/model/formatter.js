sap.ui.define([
  "sap/ui/core/format/NumberFormat"
], function(NumberFormat) {
  "use strict";
    var oFloatNumberFormat = NumberFormat.getFloatInstance({
        maxFractionDigits: 2,
        minFractionDigits : 0,
        groupingEnabled: true
    } , sap.ui.getCore().getConfiguration().getLocale());
    
    var oCurrencyFormat = NumberFormat.getCurrencyInstance();

  return {
    /*
    * float to 1
    */
    floatFormat: function(value){
        return oFloatNumberFormat.format(value);
    },
	
	toCurrency: function(value){
        return oCurrencyFormat.format(value, "руб");
    },
	
	
    /**
    * Change input ststus to avable from bad row status
    **/
    statusText: function (sStatus) {
      switch (sStatus) {
        case "Information":
          return "None";
        default:
          return sStatus;
      }
    },

    toStringFormat: function(Value) {
      var sValue;
      if (Value) {
        sValue = Value.toString();
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