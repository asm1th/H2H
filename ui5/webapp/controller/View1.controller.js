sap.ui.define([
	"h2h/ui5/controller/BaseController",
	"jquery.sap.global",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"h2h/ui5/js/cadesplugin_api"
], function (BaseController, jQuery, Filter, JSONModel, MessageToast, cadesplugin) {
	"use strict";

	return BaseController.extend("h2h.ui5.controller.View1", {
		//return Controller.extend("h2h.ui5.controller.View1", {
		onInit: function () {

			//var oModel = new sap.ui.model.odata.ODataModel("/xsodata/h2h.xsodata", true);
			//this.getView().setModel(oModel);
			//debugger;
			//this.csrfToken = this.getView().getModel().oHeaders['x-csrf-token'];
			//var oModel = new sap.ui.model.odata.ODataModel("https://kl3zn4m1rmf4sssx-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/xsodata/h2h.xsodata");
			//this.getView().setModel(oModel);
			//console.log(oModel);

			//var oModel = new JSONModel();
			//this.oModel.loadData(jQuery.sap.getModulePath("host2host", "/localService/tablemodel.json"), null, false);
			//oModel.loadData("/localService/tablemodel.json");
			//this.getView().setModel(oModel);
			//console.log(oModel);
			//dev
			/*var oModel = this.getOwnerComponent().getModel();
			console.info("Full App Model: ");
			console.log(oModel);*/
			//.dev

			var oModel = new JSONModel();
			/*
			var dateFrom = new Date();
			dateFrom.setUTCDate(2);
			dateFrom.setUTCMonth(1);
			dateFrom.setUTCFullYear(2014);

			var dateTo = new Date();
			dateTo.setUTCDate(17);
			dateTo.setUTCMonth(1);
			dateTo.setUTCFullYear(2014);

			
			oModel.setData({
				delimiterDRS1: "@",
				dateValueDRS1: dateFrom,
				secondDateValueDRS1: dateTo,
				dateFormatDRS1: "yyyy/MM/dd",
				dateValueDRS2: new Date(2016, 1, 16),
				secondDateValueDRS2: new Date(2016, 1, 18),
				dateMinDRS2: new Date(2016, 0, 1),
				dateMaxDRS2: new Date(2016, 11, 31)
			});
			this.getView().setModel(oModel);
            */
			this._iEvent = 0;

			var dataPage = {
				selectedKey: "page1"
			};
			//var oModel = new sap.ui.model.json.JSONModel(dataPage);
			oModel.setProperty("/dataPage", dataPage);
			var table = [{
				"docDate": "2019-10-18",
				"docNum": "2946",
				"docSum": "33700000.00",
				"paytKind": "0",
				"priority": "5",
				"purpose": "Предоплата по дог. ГПН-18/39000/03564/Р/64537-2018-174 от 29.12.2018 по сч 19-685 от 14.10.2019 по отгр. по РФ в 3 декаде октября 2019г. В т.ч.НДС(20%) 5.616.666,67=",
				"transKind": "01",
				"vatSum": "0.00",
				"vatRate": "0.00",
				"vat": "VatManualAll",
				"nodocs": "1"
			}, {
				"docDate": "2019-10-18",
				"docNum": "2946",
				"docSum": "33700000.00",
				"paytKind": "0",
				"priority": "5",
				"purpose": "Предоплата по дог. ГПН-18/39000/03564/Р/64537-2018-174 от 29.12.2018 по сч 19-685 от 14.10.2019 по отгр. по РФ в 3 декаде октября 2019г. В т.ч.НДС(20%) 5.616.666,67=",
				"transKind": "01",
				"vatSum": "0.00",
				"vatRate": "0.00",
				"vat": "VatManualAll",
				"nodocs": "1"
			}];
			oModel.setProperty("/table", table);
			this.getView().setModel(oModel);

			//cripto
			//this.run();

			$(function () {
				$.ajax({
					type: 'GET',
					url: '/',
					headers: {
						'X-Csrf-Token': 'Fetch'
					},
					success: function (res, status, xhr) {
						var sHeaderCsrfToken = 'X-Csrf-Token';
						var sCsrfToken = xhr.getResponseHeader(sHeaderCsrfToken);
						$(document).ajaxSend(function (event, jqxhr, settings) {
							if (settings.type === 'POST' || settings.type === 'PUT' || settings.type === 'DELETE') {
								jqxhr.setRequestHeader(sHeaderCsrfToken, sCsrfToken);
							}
						});
					}
				});
			});

		},

		onPress: function (evt) {
			MessageToast.show(evt.getSource().getId() + " Pressed");
		},

		onUpload: function (evt) {
			MessageToast.show(evt.getSource().getId() + " Pressed");

		},

		OnFileSelected: function (e) {
			MessageToast.show(e.getSource().getId() + " OnFileSelected");

			sap.ui.getCore()._file = e.getParameter("files") && e.getParameter("files")[0];
		},

		// file upload
		OnUpload: function (oEvent) {
			var fileLoader = this.getView().byId("fileUploader");
			var fileName = fileLoader.getValue();
			jQuery.sap.require("sap.ui.commons.MessageBox");
			if (fileName === "") {
				sap.ui.commons.MessageBox.show("Please choose File.", sap.ui.commons.MessageBox.Icon.INFORMATION, "Information");
			} else {
				// var file = jQuery.sap.domById(fileLoader.getId() + "-fu").files[0];
				// var oEntry = {
				// 	"d": {
				// 		bank: "RAIF",
				// 		xmlns: "http://bssys.com/upg/request",
				// 		requestId: "ae059298-e102-1ee9-a8ae-7595552d079a",
				// 		version: "0.1",
				// 		filename: fileName,
				// 		file: file
				// 	}
				// };
				// console.log("Отправляем file:");
				// console.log(oEntry);

				// VAR3
				// var insertdata = JSON.stringify(oEntry);
				// $.ajax({
				// 	type: "POST",
				// 	url: "https://kl3zn4m1rmf4sssx-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/insert.xsjs",
				// 	contentType: "application/json",
				// 	data: insertdata,
				// 	dataType: "json",
				// 	crossDomain: true,
				// 	success: function (data) {
				// 		alert("Data inserted successfully");
				// 	},
				// 	error: function (data) {
				// 		var message = JSON.stringify(data);
				// 		alert(message);
				// 	}
				// });

				/// VAR2
				//var oModel = new sap.ui.model.odata.ODataModel("https://kl3zn4m1rmf4sssx-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/xsodata/h2h.xsodata", true);
				const url =
					'https://cors-anywhere.herokuapp.com/https://kl3zn4m1rmf4sssx-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/xsodata/h2h.xsodata';
				const oModel = new sap.ui.model.odata.v2.ODataModel(url);

				//var file = jQuery.sap.domById("__loader0-fu").files[0];

				var ref = this;
				ref.textId = Math.floor(Math.random() * 1000);

				var test = {
					d: {
						requestId: "123213",
						docExtId: "213213"
					}
				};

				$.ajax({
					url: "/",
					type: "GET",
					headers: {
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/json",
						"X-CSRF-Token": "Fetch"
					},
					dataType: "json",
					async: false,
					complete: function (data) {
						$.ajax({
							//"url": "/sample.svc/v1/ImageStorages",
							"url": url + "/PayDoc",
							"data": JSON.stringify({
								test
							}),
							"processData": false,
							"headers": {
								"X-Csrf-Token": data.getResponseHeader('X-Csrf-Token'),
								"Content-Type": "application/json"
							},
							"method": "post"
						})
					}
				})

				// $.ajax({
				//                 url: "/",
				//                 type: "GET",
				//                 headers: {
				//                     "X-Requested-With": "XMLHttpRequest",
				//                     "Content-Type": "application/json",
				//                     "X-CSRF-Token": "Fetch"
				//                 },
				//                 dataType: "json",
				//                 async: false,
				//                 complete: function(data) {
				//                     $.ajax({
				//                         //"url": "/sample.svc/v1/ImageStorages",
				//                         "url": url+ "/Request",
				//                         "data": JSON.stringify({
				//                             "ImageId": ref.textId+"",
				//                             "ImageMimeType": "text/plaing",
				//                             "ImageBinary": btoa(ref.fileData)
				//                         }),
				//                         "processData": false,
				//                         "headers": {
				//                             "X-Csrf-Token": data.getResponseHeader('X-Csrf-Token'),
				//                             "Content-Type": "application/json"
				//                         },
				//                         "method": "post"
				//                     })
				//                 }
				//             })

				// oModel.setHeaders({
				// 		"X-Requested-With": "XMLHttpRequest",
				// 		"Content-Type": "application/atom+xml",
				// 		"DataServiceVersion": "2.0",
				// 		"X-CSRF-Token": "Fetch"
				// });
				// oModel.create("/Request", oEntry, null,
				// 	function (oData, oResponse) {
				// 		var msg = "Файл загружен";
				// 		MessageToast.show(msg);
				// 		console.log(oResponse);
				// 	},
				// 	function (oError, oResponse) {
				// 		var msg = "Данные не сохранены. Проблема в данных, либо в серввере";
				// 		// 		if (oResponse.error.message.value) {
				// 		// 			txt = oResponse.error.message.value;
				// 		// 		}
				// 		MessageToast.show(msg);
				// 		console.log(oError);
				// 		console.log(oResponse);
				// });

				/// VAR1
				/*var oModel= new sap.ui.model.odata.ODataModel('/xsodata/tsPlans.xsodataa', false);
    			var inputData={};
    				inputData.ID= '';
    			oModel.create('/Items',inputData,null, function(odata,oResponse){
    			  alert("Creation successful");
    			});*/
				/*
				//var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
				var uploadUrl = "https://kl3zn4m1rmf4sssx-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/insert.xsjs?filename=" + fileName;
				$.ajax({
					url: uploadUrl,
					type: "POST",
					processData: false,
					contentType: false,
					data: file,
				// 	beforeSend: function (xhr) {
				// 		xhr.setRequestHeader("X-CSRF-Token", token);
				// 	},
					success: function (data, textStatus, XMLHttpRequest) {
						var resptext = XMLHttpRequest.responseText;
						jQuery.sap.require("sap.ui.commons.MessageBox");
						MessageToast.show(resptext);

					},
					error: function (data, textStatus, XMLHttpRequest) {
					    MessageToast.show("File could not be uploaded.");
					}
				});
				*/
			}
		},

		/*OnUpload: function (e) {
			var file = sap.ui.getCore()._file;
			if (file && window.FileReader) {
				var reader = new FileReader();
				reader.onload = function (evn) {
					var strCSV = evn.target.result; //string in CSV 
					//alert(strCSV);
					//console.log(strCSV);

					var orders = strCSV.split("СекцияДокумент=Платежное поручение");
					var JSON = [];
					console.log("Строк: " + orders.length);
					orders.forEach(function (order, i) {

						var lines = order.split("\n");
						console.log("Строк: " + lines.length);
						var arORDER = [];
						var obj = new Object();
						lines.forEach(function (line, i) {
							var row = line.split("=");
							var prop = row[0];
							if (prop) {
								if (row[1]) {
									var val = row[1];
									val = val.replace(/\"/g, '\\"');
								} else {
									var val = null;
								}
								
								obj[prop] = val;
							}
						});
						JSON.push(obj);
					});
					console.log(JSON);
				};
				reader.readAsText(file);
			}
		}
        */

		//sign

		onSignCreate: function () {
			//var oCertName = document.getElementById("CertName");
			//var sCertName = oCertName.value;
			// if ("" == sCertName) {
			//     alert("Введите имя сертификата (CN).");
			//     return;
			// }

			var sCertName = "Test Certificate";

			var thenable = this.SignCreate(sCertName, "Message");

			thenable.then(
				function (result) {
					//document.getElementById("signature").innerHTML = result;
					console.log(result);
				},
				function (result) {
					//document.getElementById("signature").innerHTML = result;
					console.log(result);
				});
		}

		// 		SignCreate: function (certSubjectName, dataToSign) {
		// 			var CADESCOM_CADES_BES = 1;
		// 			var CAPICOM_CURRENT_USER_STORE = 2;
		// 			var CAPICOM_MY_STORE = "My";
		// 			var CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
		// 			var CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;

		// 			return new Promise(function (resolve, reject) {
		// 				window.cadesplugin.async_spawn(function* (args) {
		// 					try {
		// 						var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store");
		// 						yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE,
		// 							CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);

		// 						var CertificatesObj = yield oStore.Certificates;
		// 						var oCertificates = yield CertificatesObj.Find(
		// 							CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, certSubjectName);

		// 						var Count = yield oCertificates.Count;
		// 						if (Count == 0) {
		// 							throw ("Certificate not found: " + args[0]);
		// 						}
		// 						var oCertificate = yield oCertificates.Item(1);
		// 						var oSigner = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
		// 						yield oSigner.propset_Certificate(oCertificate);

		// 						var oSignedData = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
		// 						yield oSignedData.propset_Content(dataToSign);

		// 						var sSignedMessage = yield oSignedData.SignCades(oSigner, CADESCOM_CADES_BES);

		// 						yield oStore.Close();

		// 						args[2](sSignedMessage);
		// 					} catch (e) {
		// 						args[3]("Failed to create signature. Error: " + window.cadesplugin.getLastError(e));
		// 					}
		// 				}, certSubjectName, dataToSign, resolve, reject);
		// 			});
		// 		},

		/*
		onSignCreate: function (certSubjectName, dataToSign) {
			return new Promise(function (resolve, reject) {
				cadesplugin.async_spawn(function* (args) {
					try {
						var oStore = yield cadesplugin.CreateObjectAsync("CAdESCOM.Store");
						yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE,
							CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);

						var CertificatesObj = yield oStore.Certificates;
						var oCertificates = yield CertificatesObj.Find(
							CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, certSubjectName);

						var Count = yield oCertificates.Count;
						if (Count == 0) {
							throw ("Certificate not found: " + args[0]);
						}
						var oCertificate = yield oCertificates.Item(1);
						var oSigner = yield cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
						yield oSigner.propset_Certificate(oCertificate);

						var oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
						yield oSignedData.propset_Content(dataToSign);

						var sSignedMessage = yield oSignedData.SignCades(oSigner, CADESCOM_CADES_BES);

						yield oStore.Close();

						args[2](sSignedMessage);
					} catch (e) {
						args[3]("Failed to create signature. Error: " + cadesplugin.getLastError(err));
					}
				}, certSubjectName, dataToSign, resolve, reject);
			});
		},

		run: function() {
			//var oCertName = document.getElementById("CertName");
			//var sCertName = oCertName.value;
			var sCertName = ""
			if ("" == sCertName) {
				alert("Введите имя сертификата (CN).");
				return;
			}
			var thenable = SignCreate(sCertName, "Message");

			thenable.then(
				function (result) {
					document.getElementById("signature").innerHTML = result;
				},
				function (result) {
					document.getElementById("signature").innerHTML = result;
				});
		},
        */

		/* https://github.com/anpur/line-navigator Anton Purin MIT 2016 */
	});
});