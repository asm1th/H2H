sap.ui.define([
	"h2h/ui5/controller/BaseController",
	"jquery.sap.global",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"h2h/ui5/js/cadesplugin_api",
	"sap/ui/codeeditor/CodeEditor"
], function (BaseController, jQuery, Filter, JSONModel, MessageToast, MessageBox, cadesplugin, CodeEditor) {
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

		// test event for dev
		onPress: function (evt) {
			MessageToast.show(evt.getSource().getId() + " Pressed");
		},
        
        //////////////////
		// фикс размер колонок по заголовкам table
		onDataReceived: function () {
			var oTable = this.byId("LineItemsSmartTable");
			var i = 0;
			oTable.getTable().getColumns().forEach(function (oLine) {
				oLine.setWidth("100%");
				oLine.getParent().autoResizeColumn(i);
				i++;
			});
		},
        
        //////////////////
        // экспорт таблицы
		onBeforeExport: function (oEvent) {
			var mExcelSettings = oEvent.getParameter("exportSettings");
			// GW export
			if (mExcelSettings.url) {
				return;
			}
			// For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel
			// Disable Worker as Mockserver is used in Demokit sample --> Do not use this for real applications!
			mExcelSettings.worker = false;
		},
        
        ///////////////////////
        // окно подробностей
		onDetailDialog: function (oEvent) {
			var oView = this.getView();
			if (!this.detailDialog) {
				this.detailDialog = sap.ui.xmlfragment("detailDialog", "h2h.ui5.view.detailDialog", this).addStyleClass("sapUiSizeCompact");
				oView.addDependent(this.detailDialog);
			}
			
			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			//var path = ctx.getPath();
			this.detailDialog.setBindingContext(ctx);
			
			this.detailDialog.open();
		},
		
		detailDialogSave: function (oEvent) {
			this.detailDialog.close();
		},
		
		detailDialogClose: function (oEvent) {
			this.detailDialog.close();
		},
		///// окно подробностей
		///////////////////////

		// скачать загруженное ПП в том же формате
		onDownload: function (oEvent) {
			console.log('скачать загруженное ПП в том же формате');
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

					// не работает так как oData не возвращает скрытые колонки
					//var obj = oTable.getModel().getProperty(sPath);
					//var obj1 = Context.getObject();
					//requestId = obj.requestId;
				});
			} else {
				// exit
				return MessageBox.alert("Выберите 1 ПП");
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
					var url = window.URL.createObjectURL(blob);
					a.href = url;
					a.download = file.fileName;
					a.click();
					window.URL.revokeObjectURL(url);
				},
				error: function (oError) {
					MessageBox.alert(oError.responseText);
					console.log("error: " + oError);
				}
			});
		},
        
        //////////////////
        // просмотр платежки загружаемой в банк
		onShowXml: function (oEvent) {
			var oSmartTable = this.byId("LineItemsSmartTable");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var docExtId = []; // если сделаем мультиселект

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var sPath = Context.sPath;
					//"/PaymentOrder(requestId='dbcfa37f-5c47-beef-88ff-6e3cb3fed730',docExtId='dc8506e9-8fab-7a73-a787-21e71a941f1c')"
					var nov_reg = "docExtId='(.*)'";
					var myAttr = sPath.match(nov_reg);
					docExtId.push(myAttr[1]);
				});
			} else {
				// exit
				return MessageBox.alert("Выберите 1 ПП");
			}

			//Get file download.xsjs?docExtId=%275a5d2b38-6c01-fcf2-5361-67681e0e043f%27
// 			var oModel = this.getView().getModel();
// 			var that = this;
// 			var oView = this.getView();

			var url = "/xsjs/download.xsjs";
			//var url = "https://kl3zn4m1rmf4sssx-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/download.xsjs?docExtId=%275a5d2b38-6c01-fcf2-5361-67681e0e043f%27";
			$.ajax({
				type: "GET",
				url: url,
				data: "docExtId=%27" + docExtId[0] + "%27",
				dataType: "xml",
				success: function (data) {

					//var xmlText = new XMLSerializer().serializeToString(data);

					var box = new sap.m.VBox({
						items: [
							new CodeEditor({
								value: data,
								type: "xml",
								editable: false, // read-only
								width: "40rem",
								height: "20rem"
							})
						]
					});

					MessageBox.show(
						box, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Платежное поручение для загрузки в банк",
							styleClass: 'MessageBoxLarge',
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								// if (oAction === sap.m.MessageBox.Action.YES) {
								// 	sap.m.MessageToast.show(box.getModel().getProperty('/message'));
								// }
							}
						}
					);
					//MessageBox.alert(XMLeditor);
					console.log("XML: ", data);
				},
				error: function (oError) {
					MessageBox.alert(oError.responseText);
					console.warn(oError);
				}
			});
		},
        
        //////////////////
		// select input
// 		OnFileSelected: function (oEvent) {
// 			console.log("OnFileSelected");
// 		},

		// кнопка отправить
		onSend: function (oEvent) {
			//var oView = this.getView();
			MessageBox.alert("onSend");
			//code here
		},

		//  кнопка загрузки пп
		OnUploadDialog: function (oEvent) {
			var oView = this.getView();
			if (!this.addDialog) {
				this.addDialog = sap.ui.xmlfragment("addDialog", "h2h.ui5.view.addDialog", this).addStyleClass("sapUiSizeCompact");
				oView.addDependent(this.addDialog);
			}
			this.addDialog.open();
		},

		addDialogClose: function (oEvent) {
			this.addDialog.close();
		},

		// загрузка пп - file upload
		OnUpload: function () {
			var oFileUpload = this.getView().byId("fileUploader");
			//var oFileUpload = sap.ui.core.Fragment.byId("addDialog", "fileUploader");
			var domRef = oFileUpload.getFocusDomRef();
			var file = domRef.files[0];
			var fileName = file.name;
			var fileType = file.type;

			if (fileName === "") {
				return MessageToast.show("Please choose File.");
			} else {
				var oModel = this.getOwnerComponent().getModel();
				var reader = new FileReader();
				var that = this;
				reader.onload = function (oEvent) {
					var vContent = oEvent.currentTarget.result.replace("data:" + fileType + ";base64,", "");

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
					mParams.error = that._onErrorCall;
					oModel.create("/Files", oEntry, mParams);

				};
				reader.readAsDataURL(file);
			}
		},

		// обработка ошибки и вывод при загрузке
		_onErrorCall: function (oError) {
			if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400") {
				var errorRes = JSON.parse(oError.responseText);
				if (!errorRes.error.innererror) {
					MessageBox.alert(errorRes.error.message.value);
				} else {
					if (!errorRes.error.innererror.message) {
						MessageBox.alert(errorRes.error.innererror.toString());
					} else {
						MessageBox.alert(errorRes.error.innererror.message);
					}
				}
				return;
			} else {
				MessageBox.alert(oError.response.statusText);
				return;
			}
		},

		// кнопка подписать - открыли окно
		onSignDialog: function () {
			//var oView = this.getView();
			if (!this.signDialog) {
				this.signDialog = sap.ui.xmlfragment("signDialog", "h2h.ui5.view.signDialog", this);
				//oView.addDependent(this.signDialog);

				var mySerts;
				// вызов промиса - получаем сертификаты в окно
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
			} else {
				this.signDialog.open();
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

			/*
						return new Promise(function (resolve, reject) {
							window.cadesplugin.async_spawn(function* (args) {
								try {
									var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store");
									yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);
									var CertificatesObj = yield oStore.Certificates;

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
			*/
		},

		// выбрали подпись в окне выбора
		onUseSign: function (oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			var obj = src.getModel().getProperty(ctx.getPath());
			var Thumbprint = obj.Thumbprint; // берем отпечаток = SHA1
			///////////////////
			// get Digest
			var oModel = this.getView().getModel();
			//var that = this;
			var DigestToSign = "Digest";

			oModel.read("/PaymentOrder(requestId='dbcfa37f-5c47-beef-88ff-6e3cb3fed730',docExtId='dc8506e9-8fab-7a73-a787-21e71a941f1c')", {
				success: function (data) {
					DigestToSign = data;
				},
				error: function (oError) {
					MessageBox.alert(oError.responseText);
					console.warn(oError);
				}
			});

			///////////////////
			this.onSignCreate(Thumbprint, DigestToSign);
			this.signDialog.close();
		},

		//закрыли
		signDialogClose: function (oEvent) {
			this.signDialog.close();
		},

		//sign Подпись
		onSignCreate: function (Thumbprint, dataToSign) {
			//var sCertName = "Алексей";
			var thenable = this._SignCreate(Thumbprint, dataToSign);
			// бработка ошибки
			thenable.then(
				function (result) {
					MessageBox.alert(result);
					console.log(result);
				},
				function (result) {
					MessageBox.alert(result);
					console.warn(result);
				});
		},

		// получение сертификата иподписание
		//https://cpdn.cryptopro.ru/content/cades/plugin-samples-fileapi.html
		//https://cpdn.cryptopro.ru/content/cades/plugin-samples-sign-cades-bes-async.html
		_SignCreate: function (Thumbprint, dataToSign) {
			var CADESCOM_CADES_BES = 1;
			var CAPICOM_CURRENT_USER_STORE = 2;
			var CAPICOM_MY_STORE = "My";
			var CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
			var CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
			var CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0; //	Возвращает сертификаты соответствующие указанному хэшу SHA1.

			// 			return new Promise(function (resolve, reject) {
			// 				window.cadesplugin.async_spawn(function* (args) {
			// 					try {
			// 						var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store");
			// 						yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);
			// 						debugger;
			// 						var CertificatesObj = yield oStore.Certificates;

			// 						// ============== поиск по имени
			// 						//var certSubjectName = 'Алексей';
			// 						//var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, certSubjectName);
			// 						// ============== поиск по Thumbprint
			// 						var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, Thumbprint);

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
			// 				}, Thumbprint, dataToSign, resolve, reject);
			// 			});

		}

		/////////////////////////////////// end BaseController
	});
});