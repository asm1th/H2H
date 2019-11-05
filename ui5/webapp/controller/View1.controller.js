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

			//var url = '/xsodata';
			//var oModel = new sap.ui.model.odata.ODataModel(url);
			var userModel = this.getOwnerComponent().getModel();
			this.getView().setModel(userModel);

			var oModel = this.getView().getModel();
			var dataPage = {
				selectedKey: "page1"
			};
			oModel.setProperty("/dataPage", dataPage);
		},

		onPress: function (evt) {
			MessageToast.show(evt.getSource().getId() + " Pressed");
		},

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");
			// GW export
			if (mExcelSettings.url) {
				return;
			}
			// For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel
			// Disable Worker as Mockserver is used in Demokit sample --> Do not use this for real applications!
			mExcelSettings.worker = false;
		},

		OnFileSelected: function (e) {
			//sap.ui.getCore()._file = e.getParameter("files") && e.getParameter("files")[0];
		},

		// file upload
		OnUpload: function (oEvent) {
			var oFileUpload = this.getView().byId("fileUploader");
			var domRef = oFileUpload.getFocusDomRef();
			//var file = jQuery.sap.domById("__xmlview0--fileUploader-fu").files[0];
			var file = domRef.files[0];
			var fileName = file.name;
			var fileType = file.type;

			if (fileName === "") {
				MessageToast.show("Please choose File.");
			} else {
				var oModel = this.getOwnerComponent().getModel();
				var reader = new FileReader();
				var that = this;
				reader.onload = function (e) {
					var vContent = e.currentTarget.result.replace("data:" + file.type + ";base64,", "");
					//that.postFileToBackend(workorderId, that.fileName, that.fileType, vContent);

					var oEntry = {};
					oEntry.requestId = "0000000000";
					oEntry.file = btoa(vContent);
					//oEntry.fileName = fileName;
					//oEntry.fileType = fileType;

					oModel.setHeaders({
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/json",
						"X-CSRF-Token": "Fetch"
					});
					var mParams = {};
					mParams.success = function () {
						MessageToast.show("Create successful");
					};
					mParams.error = that.onErrorCall;
					oModel.create("/Request", oEntry, mParams);

				};
				reader.readAsDataURL(file);

				// $.ajax({
				// 	url: "/",
				// 	type: "GET",
				// 	headers: {
				// 		"X-Requested-With": "XMLHttpRequest",
				// 		"Content-Type": "application/json",
				// 		"X-CSRF-Token": "Fetch"
				// 	},
				// 	dataType: "json",
				// 	async: false,
				// 	complete: function (data) {
				// 		$.ajax({
				// 			//"url": "/sample.svc/v1/ImageStorages",
				// 			"url": url + "/PayDocRu",
				// 			"data": JSON.stringify(test),
				// 			"processData": false,
				// 			"headers": {
				// 				"X-Csrf-Token": data.getResponseHeader('X-Csrf-Token'),
				// 				"Content-Type": "application/json"
				// 			},
				// 			"method": "post"
				// 		});
				// 	}
				// });

				///=======================
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

		onErrorCall: function (oError) {
			if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400") {
				var errorRes = JSON.parse(oError.responseText);
				if (!errorRes.error.innererror) {
					sap.m.MessageBox.alert(errorRes.error.message.value);
				} else {
					if (!errorRes.error.innererror.message) {
						sap.m.MessageBox.alert(errorRes.error.innererror.toString());
					} else {
						sap.m.MessageBox.alert(errorRes.error.innererror.message);
					}
				}
				return;
			} else {
				sap.m.MessageBox.alert(oError.response.statusText);
				return;
			}
		},

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
		},

		SignCreate: function (certSubjectName, dataToSign) {
			var CADESCOM_CADES_BES = 1;
			var CAPICOM_CURRENT_USER_STORE = 2;
			var CAPICOM_MY_STORE = "My";
			var CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
			var CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;

			return new Promise(function (resolve, reject) {
				window.cadesplugin.async_spawn(function* (args) {
					try {
						var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store");
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
						var oSigner = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
						yield oSigner.propset_Certificate(oCertificate);

						var oSignedData = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
						yield oSignedData.propset_Content(dataToSign);

						var sSignedMessage = yield oSignedData.SignCades(oSigner, CADESCOM_CADES_BES);

						yield oStore.Close();

						args[2](sSignedMessage);
					} catch (e) {
						args[3]("Failed to create signature. Error: " + window.cadesplugin.getLastError(e));
					}
				}, certSubjectName, dataToSign, resolve, reject);
			});
		},

		/* https://github.com/anpur/line-navigator Anton Purin MIT 2016 */
	});
});