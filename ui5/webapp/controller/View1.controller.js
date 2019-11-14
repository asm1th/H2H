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
			var requestId = [];

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var sPath = Context.sPath; //"/PaymentOrder(requestId='dbcfa37f-5c47-beef-88ff-6e3cb3fed730',docExtId='dc8506e9-8fab-7a73-a787-21e71a941f1c')"

					var nov_reg = "requestId='(.*)',";
					var myAttr = sPath.match(nov_reg);
					requestId.push(myAttr[1]);

					// не работает так как Олата не возвращает скрытые колонки
					//var obj = oTable.getModel().getProperty(sPath);
					//var obj1 = Context.getObject();
					//requestId = obj.requestId;
				});
			}

			//Get file
			//var url = '/xsodata';
			//var oModel = new sap.ui.model.odata.ODataModel(url);
			var oModel = this.getView().getModel();
			var that = this;

			oModel.read("/Files('" + requestId[0] + "')", {
				success: function (file) {
					var decodedString = file.fileBody;
					var decodedString1 = window.atob(decodedString);
					var decodedString2 = window.atob(decodedString1);

					var binaryLen = decodedString2.length;
					var bytes = new Uint8Array(binaryLen);
					for (var i = 0; i < binaryLen; i++) {
						var ascii = decodedString2.charCodeAt(i);
						bytes[i] = ascii;
					}

					// saveByteArray
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.style = "display: none";
					var blob = new Blob([bytes], {
						type: file.fileType
					});
					a.href = window.URL.createObjectURL(blob);
					a.download = file.fileName;
					a.click();
					window.URL.revokeObjectURL(url);
				},
				error: function (oError) {
					console.log("error: " + oError);
				}
			});

		},

		// 		_base64ToArrayBuffer: function (base64) {
		// 			var binaryString = window.atob(base64);
		// 			var binaryLen = binaryString.length;
		// 			var bytes = new Uint8Array(binaryLen);
		// 			for (var i = 0; i < binaryLen; i++) {
		// 				var ascii = binaryString.charCodeAt(i);
		// 				bytes[i] = ascii;
		// 			}
		// 			return bytes;
		// 		},

		//=======
		OnFileSelected: function (e) {
			//sap.ui.getCore()._file = e.getParameter("files") && e.getParameter("files")[0];
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
					//oEntry.requestId = "";
					oEntry.fileBody = vContent;
					oEntry.fileName = file.name;
					oEntry.fileType = file.type;
					oEntry.fileSize = file.size;

					oModel.setHeaders({
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/json",
						"X-CSRF-Token": "Fetch"
					});
					var mParams = {};
					mParams.success = function () {
						MessageToast.show("Create successful");
						this.add_oDialog.close();
					};
					mParams.error = that.onErrorCall;
					oModel.create("/Files", oEntry, mParams);

				};
				reader.readAsDataURL(file);

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

		// кнопка подписать - открыли окно
		onSignDialog: function (oEvent) {
			var oView = this.getView();
			if (!this.signDialog) {
				this.signDialog = sap.ui.xmlfragment("signDialog", "h2h.ui5.view.signDialog", this);
				//oView.addDependent(this.signDialog);

				// var oModel = new JSONModel();
				// var mySerts = [{
				// 	id: "123123",
				// 	cert: "Сертификат такой-то"
				// }];

				var mySerts;
				// вызов промиса
				var thenable = this._getUserCertificates();
				var that = this;
				thenable.then(
					function (result) {
						mySerts = result;
						console.log(result);
						
						var oModel = new JSONModel();
						oModel.setProperty("/mySerts", mySerts);
						that.signDialog.setModel(oModel);
						that.signDialog.open();
					},
					function (result) {
						mySerts = result;
					    console.log(result);
					});
				console.log(mySerts);

			}
			
		},

		// Получаем сертификаты пользователя
		// return mySerts=[{}]
		_getUserCertificates: function (oEvent) {
			var mySerts = []; // сюда сложим все найденные сертификаты юзера
			var CADESCOM_CADES_BES = 1;
			var CAPICOM_CURRENT_USER_STORE = 2;
			var CAPICOM_MY_STORE = "My";
			var CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
			var CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
			// опция поиска по издателю
			var CAPICOM_CERTIFICATE_FIND_ISSUER_NAME = 2;

			var dateObj = new Date();

			return new Promise(function (resolve, reject) {
				window.cadesplugin.async_spawn(function* (args) {
					try {
						var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store");
						yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);
						var CertificatesObj = yield oStore.Certificates;
						// поиск по имени certSubjectName
						//var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, certSubjectName);
						// поиск по издателю 
						//var certIssuertName = 'NAME HERE';
						//var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_ISSUER_NAME, certIssuertName);

						// все действующие
						var CAPICOM_CERTIFICATE_FIND_TIME_VALID = 9;
						var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_TIME_VALID);

						var Count = yield oCertificates.Count;
						if (Count == 0) {
							throw ("Certificate not found");
						} else {
							try {
								for (var i = 1; i <= Count; i++) {
									var cert = yield CertificatesObj.Item(i);
									if (dateObj < cert.ValidToDate && cert.HasPrivateKey() && cert.IsValid().Result) {
										//return cert
									}
									var mysert = {
										//HasPrivateKey: yield cert.HasPrivateKey(),
										ValidToDate: yield cert.ValidToDate,
										SerialNumber: yield cert.SerialNumber,
										IssuerName: yield cert.IssuerName,
										SubjectName: yield cert.SubjectName,
										PrivateKey: yield cert.PrivateKey,
										Thumbprint: yield cert.Thumbprint
									}
									mySerts.push(mysert); // массив сертификатов
								}
							} catch (ex) {
								alert("Ошибка при перечислении сертификатов: " + window.cadesplugin.getLastError(ex));
							}
						}
						yield oStore.Close();
					} catch (e) {
						args[1]("Failed to create signature. Error: " + window.cadesplugin.getLastError(e));
						alert(window.cadesplugin.getLastError(e));
					}
					// то что выплевывает в resolve
					args[0](mySerts);
				}, resolve, reject);
			});
		},

		//выбрали подпись
		onUseSign: function (oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			var obj = src.getModel().getProperty(ctx.getPath());
			var certSN = obj.SerialNumber;
			///////////////////
            var data = "Digest";
			///////////////////
			this.onSignCreate(certSN, Digest);
			this.signDialog.close();
		},

		//закрыли
		signDialogClose: function (oEvent) {
			this.signDialog.close();
		},

		//sign Подпись
		onSignCreate: function (SerialNumber, Digest) {
			//var sCertName = "Алексей";
			var thenable = this._SignCreate(sCertName, Digest);
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
		_SignCreate: function (SerialNumber, dataToSign) {
			var CADESCOM_CADES_BES = 1;
			var CAPICOM_CURRENT_USER_STORE = 2;
			var CAPICOM_MY_STORE = "My";
			var CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
			var CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
			var CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0;//	Возвращает сертификаты соответствующие указанному хэшу SHA1.

			return new Promise(function (resolve, reject) {
				window.cadesplugin.async_spawn(function* (args) {
					try {
						var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store");
						yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE,
							CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);

						var CertificatesObj = yield oStore.Certificates;
						// поиск по имени
						//var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, certSubjectName);
						// поиск по SerialNumber
						var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, SerialNumber);
						debugger;

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