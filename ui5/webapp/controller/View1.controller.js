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
		onInit: function () {

			//var url = '/xsodata';
			//var oModel = new sap.ui.model.odata.ODataModel(url);
			var userModel = this.getOwnerComponent().getModel();
			this.getView().setModel(userModel);

			var dataPage = {
				selectedKey: "page1"
			};
			var oModel = new JSONModel(dataPage);
			this.getView().setModel("PageModel", oModel);

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

		onDownload: function (e) {
			var oSmartTable = this.byId("LineItemsSmartTable");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var fileDownload;

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var sPath = Context.sPath;
					var obj = oTable.getModel().getProperty(sPath);
					var file = obj.file;

					fileDownload = file;
				});
			}
			//var sampleBytes = new Int8Array(4096);

//             var contentType = "text/plain"
//             var byteCharacters = atob(fileDownload);
//             var byteNumbers = new Array(byteCharacters.length);
//             for (var i = 0; i < byteCharacters.length; i++) {
//                 byteNumbers[i] = byteCharacters.charCodeAt(i);
//             }
//             var byteArray = new Uint8Array(byteNumbers);
//             var blob = new Blob([byteArray], {type: contentType});
// 			var blobUrl = URL.createObjectURL(blob);
//             window.location = blobUrl;

			//var array = new Uint8Array(btoa(fileDownload));
			var decodedString2 =  window.atob(fileDownload);
			var decodedString3 =  window.atob(decodedString2);
			var decodedString = base64ToArrayBuffer(decodedString2);
			
            var saveByteArray = (function () {
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				return function (data, name) {
					var blob = new Blob(data, {
							type: "text/plain"
						}),
						url = window.URL.createObjectURL(blob);
					a.href = url;
					a.download = name;
					a.click();
					window.URL.revokeObjectURL(url);
				};
			}());

			saveByteArray([decodedString], 'filePP2.txt');
			
			function base64ToArrayBuffer(base64) {
                var binaryString =  window.atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                for (var i = 0; i < binaryLen; i++)        {
                    var ascii = binaryString.charCodeAt(i);
                    bytes[i] = ascii;
                }
                return bytes;
            }
		},

		OnFileSelected: function (e) {
			//sap.ui.getCore()._file = e.getParameter("files") && e.getParameter("files")[0];
		},

		// кнопка подписать
		onSignDialog: function (oEvent) {
			var oView = this.getView();
			if (!this.signDialog) {
				this.signDialog = sap.ui.xmlfragment("signDialog", "h2h.ui5.view.signDialog", this);
				//oView.addDependent(this.signDialog);
				var oModel = new JSONModel();
				var Signs = [{
					id: "123123",
					cert: "Сертификат такой-то"
				}];
				oModel.setProperty("/signs", Signs);
				this.signDialog.setModel(oModel);
			}
			this.signDialog.open();
		},

		useSign: function (oEvent) {
			this.onSignCreate();
			this.signDialog.close();
		},

		signDialogClose: function (oEvent) {
			this.signDialog.close();
		},

		// кнопка отправить
		onSend: function (oEvent) {
			var oView = this.getView();
			// 			var oTable = oView.byId("LineItemsSmartTable");
			// 			var aIndices = oTable.getSelectedIndices();
			// 			if (aIndices.length) {
			// 				var dataZsbnreqn = [];
			// 				for (var i = 0; i < aIndices.length; i++) {
			// 					var sPath = oTable.getContextByIndex(aIndices[i]).sPath;
			// 					var obj = oTable.getModel().getProperty(sPath);
			// 					dataZsbnreqn[i] = obj.ZsbnReqn;
			// 				}
			// 			}
			// 			alert(aIndices);

			// считываем ЭЦП
			//var oStore = window.cadesplugin.CreateObject("CAdESCOM.Store");
			var CADESCOM_CADES_BES = 1;
			var CAPICOM_CURRENT_USER_STORE = 2;
			var CAPICOM_MY_STORE = "My";
			var CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
			var CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
			var dateObj = new Date();

			var sertList = new Promise(function (resolve, reject) {
				window.cadesplugin.async_spawn(function* (args) {
					//https://cpdn.cryptopro.ru/content/cades/plugin-methods.html
					try {
						var Info = yield window.cadesplugin.CreateObjectAsync("CAdESCOM");
						var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store");
						yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);
						//yield oStore.Open();
						debugger;
						var CertificatesObj = yield oStore.Certificates;

						//var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, certSubjectName);

						var Count = yield CertificatesObj.Count;
						//var Count = yield oStore.Certificates.Count;
						if (Count == 0) {
							throw ("Certificate not found");
						} else {
							try {
								for (var i = 1; i <= Count; i++) {
									var cert = yield CertificatesObj.Item(i);
									if (dateObj < cert.ValidToDate && cert.HasPrivateKey() && cert.IsValid().Result) {
										//return cert

									}
									console.log(cert.ValidToDate);
									console.log(yield cert.HasPrivateKey());
									console.log(yield cert.IsValid().Result);
									console.log(yield cert.GetInfo());
									console.log(yield cert.BasicConstraints());
									console.log(yield cert.SubjectName());
									return cert;
								}
							} catch (ex) {
								alert("Ошибка при перечислении сертификатов: " + window.cadesplugin.getLastError(ex));
							}
						}

						var oCertificate = yield oCertificates.Item(1);
						yield alert(oCertificate);

						yield oStore.Close();
					} catch (e) {
						args[1]("Failed to create signature. Error: " + window.cadesplugin.getLastError(e));
					}
				}, resolve, reject);
			});
		},

		//  кнопка загрузки пп
		OnUploadDialog: function (oEvent) {
			var oView = this.getView();
			if (!this.addDialog) {
				this.addDialog = sap.ui.xmlfragment("addDialog", "h2h.ui5.view.addDialog", this).addStyleClass(
					"sapUiSizeCompact");
				oView.addDependent(this.addDialog);
			}
			this.addDialog.open();
		},

		addDialogClose: function (oEvent) {
			this.addDialog.close();
		},

		// загрузка пп - file upload
		OnUpload: function (oEvent) {
			var oFileUpload = this.getView().byId("fileUploader");
			//var oFileUpload = sap.ui.core.Fragment.byId("addDialog", "fileUploader");
			var domRef = oFileUpload.getFocusDomRef();
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
					var sdfds = e;

					var vContent = e.currentTarget.result.replace("data:" + file.type + ";base64,", "");
					//that.postFileToBackend(workorderId, that.fileName, that.fileType, vContent);

					var oEntry = {};
					oEntry.requestId = "0000000000";
					oEntry.file = vContent;
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
						//this.add_oDialog.close();
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

		// обработка ошибки и вывод при загрузке
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

		//sign Подпись
		onSignCreate: function (e) {
			//var oCertName = document.getElementById("CertName");
			//var sCertName = oCertName.value;
			// if ("" == sCertName) {
			//     alert("Введите имя сертификата (CN).");
			//     return;
			// }

			var sCertName = "Алексей";

			var thenable = this.SignCreate(sCertName, "Message");
			// бработка ошибки
			thenable.then(
				function (result) {
					sap.m.MessageBox.alert(result);
					console.log(result);
				},
				function (result) {
					sap.m.MessageBox.alert(result);
					console.log(result);
				});
		},

		// получение сертификата иподписание
		//https://cpdn.cryptopro.ru/content/cades/plugin-samples-fileapi.html
		//https://cpdn.cryptopro.ru/content/cades/plugin-samples-sign-cades-bes-async.html
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
						debugger;

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