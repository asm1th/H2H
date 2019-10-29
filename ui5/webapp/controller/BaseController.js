sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("h2h.ui5.controller.BaseController", {

		//@@ base navigation start
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("RouteView1", {}, true /*no history*/ );
			}
		},

		onHomePress: function () {
			this.getRouter().navTo("RouteView1", {}, true /*no history*/ );
		},

		// onBalans: function () {
		//   this.getRouter().navTo("onBalans", {
		//       sPath: JSON.stringify({
		//           sPath:'sPathtobalans'
		//              /*sPath:oCtx.getPath().substr(1),
		//              slPlanning:this.getSelect("slPlanning").getSelectedItem().getKey(),*/
		//           })
		//   }, true /*no history*/);
		// }

		onSideNavButtonPress: function () {
			var toolPage = this.byId("toolPage");
			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		}

		//@@ base navigation end

	});

});