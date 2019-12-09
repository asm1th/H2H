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

			//this.byId("pageContainer").to(this.getView().createId("page2"));
		},

		onItemSelect: function (oEvent) {
			var item = oEvent.getParameter('item');
			this.byId("pageContainer").to(this.getView().createId(item.getKey()));
		},

		onUploadToSap: function (oEvent) {
			MessageToast.show(oEvent.getSource().getId() + " Pressed");
		},

		onCheckSign: function (oEvent) {
			MessageToast.show(oEvent.getSource().getId() + " Pressed");
		},

		onAttachment: function (oEvent) {
			MessageToast.show(oEvent.getSource().getId() + " Pressed");
		},

		onPrint_1: function (oEvent) {
			MessageToast.show(oEvent.getSource().getId() + " Pressed");
		},
		onPrint_D: function (oEvent) {
			MessageToast.show(oEvent.getSource().getId() + " Pressed");
		},
		onPrint_C: function (oEvent) {
			MessageToast.show(oEvent.getSource().getId() + " Pressed");
		},

		onJournal_1: function (oEvent) {
			MessageToast.show(oEvent.getSource().getId() + " Pressed");
		},

		onPDF: function (oEvent) {
			MessageToast.show(oEvent.getSource().getId() + " Pressed");
		},

		onChoseStatement: function (oEvent) {
			//debugger;
			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			var path = ctx.getPath();
			var obj = src.getModel().getProperty(path);
			var oFilter = new sap.ui.model.Filter("responseId", sap.ui.model.FilterOperator.EQ, obj.responseId);

			var oSmartTable_D = this.byId("SmartTable_D");
			//oSmartTable_D.setEntitySet("StatementItemsDeb");
			//oSmartTable_D.setTableBindingPath("ItemsDeb");
			//oSmartTable_D.rebindTable();
			oSmartTable_D.getTable().bindRows("/StatementItemsDeb", null, null, oFilter);

			var oSmartTable_С = this.byId("SmartTable_C");
			//oSmartTable_С.setEntitySet("StatementItemsCred");
			//oSmartTable_С.setTableBindingPath("ItemsCred");
			//oSmartTable_С.rebindTable();
			oSmartTable_D.getTable().bindRows("/StatementItemsCred", null, null, oFilter);
		},

		// test event for dev
		onPress: function (oEvent) {
			MessageToast.show(evt.getSource().getId() + " Pressed");
		},

		//////////////////
		// фикс размер колонок по заголовкам table
		onDataReceived: function () {
			//			var oSmartTable = this.byId("LineItemsSmartTable");
			// 			var i = 0;
			// 			oSmartTable.getTable().getColumns().forEach(function (oLine) {
			// 				oLine.setWidth("100%");
			// 				oLine.getParent().autoResizeColumn(i);
			// 				i++;
			// 			});
			//oSmartTable.getTable().rerender();
			//oSmartTable.getTable().setFirstVisibleRow(1)
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
			//MessageToast.show("Сохраняем очередность платежа");

			var src = oEvent.getSource().getParent();
			var ctx = this.detailDialog.getBindingContext();

			debugger;
			var oModel = this.getOwnerComponent().getModel();
			var path = ctx.getPath();
			var obj = oModel.getProperty(path);

			// 			var oEntry = {};
			// 			oEntry.docExtId = obj.docExtId;
			// 			oEntry.priority = obj.priority;
			// 			oModel.setHeaders({
			// 				"X-Requested-With": "XMLHttpRequest",
			// 				"Content-Type": "application/json",
			// 				"X-CSRF-Token": "Fetch"
			// 			});
			// 			var mParams = {};
			// 			mParams.success = function () {
			// 				MessageToast.show("Сохранено");
			// 				this.detailDialog.close();
			// 			};
			// 			mParams.error = this._onErrorCall;
			//          oModel.update("/PaymentOrder", oEntry, mParams);

			oModel.setProperty(path + "/priority", obj.priority);
			oModel.submitChanges({
				success: function () {
					MessageToast.show("Сохранено");
					this.detailDialog.close();
				},
				error: this._onErrorCall
			});
		},

		detailDialogClose: function (oEvent) {
			this.detailDialog.close();
		},
		///// окно подробностей
		///////////////////////

		// скачать загруженное ПП в том же формате
		onDownload: function (oEvent) {
			var oSmartTable = this.byId("LineItemsSmartTable");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var requestId = [];

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var sPath = Context.sPath;
					// sPath = "/PaymentOrder(requestId='dbcfa37f-5c47-beef-88ff-6e3cb3fed730',docExtId='dc8506e9-8fab-7a73-a787-21e71a941f1c')"
					var nov_reg = "requestId='(.*)',";
					var myAttr = sPath.match(nov_reg);
					requestId.push(myAttr[1]);
				});
			} else {
				// exit
				return MessageBox.alert("Выберите одно платежное поручение в таблице");
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
					MessageBox.error(oError.responseText);
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
			var docExtId = this._getDocExtId();

			// Get file
			// var url = "https://kl3zn4m1rmf4sssx-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/download.xsjs?docExtId=%275a5d2b38-6c01-fcf2-5361-67681e0e043f%27";
			var url = "/xsjs/download.xsjs";
			$.ajax({
				type: "GET",
				url: url,
				data: "docExtId=%27" + docExtId[0] + "%27",
				dataType: "xml",
				success: function (data) {
					var xmlText = new XMLSerializer().serializeToString(data);
					var box = new sap.m.VBox({
						items: [
							new CodeEditor({
								value: xmlText,
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
							actions: [sap.m.MessageBox.Action.YES], //[sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO]
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
					MessageBox.error(oError.responseText);
					console.warn(oError);
				}
			});
		},

		// кнопка отправить
		onSend: function (oEvent) {
			this.onShowXml(oEvent);
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
			//var oFileUpload = this.getView().byId("fileUploader");
			var oFileUpload = sap.ui.core.Fragment.byId("addDialog", "fileUploader");
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
					oEntry.docType = 1; // для бека - определять тип файла

					oModel.setHeaders({
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/json",
						"X-CSRF-Token": "Fetch"
					});
					var mParams = {};
					mParams.success = function () {
						var oSmartTable = that.byId("LineItemsSmartTable");
						oSmartTable.rebindTable();
						that.addDialog.close();
					};
					mParams.error = that._onErrorCall;
					oModel.create("/Files", oEntry, mParams);
				};
				reader.readAsDataURL(file);
			}
		},

		// upload выписка в json
		OnUploadSttmntDialog: function (oEvent) {
			var oView = this.getView();
			if (!this.addDialogStmnt) {
				this.addDialogStmnt = sap.ui.xmlfragment("addDialogStmnt", "h2h.ui5.view.addDialogStmnt", this).addStyleClass("sapUiSizeCompact");
				oView.addDependent(this.addDialogStmnt);
			}
			this.addDialogStmnt.open();
		},
		addDialogStmntClose: function (oEvent) {
			this.addDialogStmnt.close();
		},
		addStmntUpload: function () {
			//var oFileUpload = this.getView().byId("fileUploader");
			var oFileUpload = sap.ui.core.Fragment.byId("addDialogStmnt", "fileUploader_2");
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
					debugger;
					var yourXmlString = window.atob(vContent);

					var binaryLen = yourXmlString.length;
					var bytes = new Uint8Array(binaryLen);
					for (var i = 0; i < binaryLen; i++) {
						var ascii = yourXmlString.charCodeAt(i);
						bytes[i] = ascii;
					}

					// convert bytes to string // encoding can be specfied, defaults to utf-8 which is ascii.
					var str = new TextDecoder().decode(bytes);

					var XmlNode = new DOMParser().parseFromString(str, 'text/xml');
					var ContentJson = that.xmlToJson(XmlNode);

					var sContentJson = JSON.stringify(ContentJson);
					//var bContentJson = window.btoa(sContentJson);
					var bContentJson = window.btoa(unescape(encodeURIComponent(sContentJson)));

					var oEntry = {};
					//oEntry.requestId = "";
					oEntry.fileBody = bContentJson;
					oEntry.fileName = file.name;
					oEntry.fileType = "text/json"; //file.type;
					oEntry.fileSize = file.size;
					oEntry.docType = 2; // для бека - определять тип файла

					// 	oModel.setHeaders({
					// 		"X-Requested-With": "XMLHttpRequest",
					// 		"Content-Type": "application/json",
					// 		"X-CSRF-Token": "Fetch"
					// 	});
					var mParams = {};
					mParams.success = function () {
						//var oSmartTable = that.byId("LineItemsSmartTable");
						//oSmartTable.rebindTable();
						that.addDialogStmnt.close();
					};
					mParams.error = that._onErrorCall;
					oModel.create("/Files", oEntry, mParams);

					// 	oModel.request({
					// 			headers: {
					// 				"accept": "application/json"
					// 			},
					// 			requestUri: "../services/service.xsodata/myTable",
					// 			method: "POST",
					// 			data: data
					// 		},

					// 		function (data, response) {
					// 			console.log(data);
					// 		},
					// 		function (err) {
					// 			console.log(err);
					// 		}
					// 	);

				};
				reader.readAsDataURL(file);
			}
		},
		//. upload выписка в json

		xmlToJson: function (xml) {
			// Create the return object
			var obj = {};

			if (xml.nodeType == 1) {
				// element
				// do attributes
				if (xml.attributes.length > 0) {
					obj["$"] = {};
					for (var j = 0; j < xml.attributes.length; j++) {
						var attribute = xml.attributes.item(j);
						obj["$"][attribute.nodeName] = attribute.nodeValue;
					}
				}
			} else if (xml.nodeType == 3) {
				// text
				obj = xml.nodeValue;
			}

			// do children
			// If all text nodes inside, get concatenated text from them.
			var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
				return node.nodeType === 3;
			});
			if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
				obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
					return text + node.nodeValue;
				}, "");
			} else if (xml.hasChildNodes()) {
				for (var i = 0; i < xml.childNodes.length; i++) {
					var item = xml.childNodes.item(i);
					var nodeName = item.nodeName;
					if (typeof obj[nodeName] == "undefined") {
						obj[nodeName] = this.xmlToJson(item);
					} else {
						if (typeof obj[nodeName].push == "undefined") {
							var old = obj[nodeName];
							obj[nodeName] = [];
							obj[nodeName].push(old);
						}
						obj[nodeName].push(this.xmlToJson(item));
					}
				}
			}
			return obj;
		},

		/*
		Usage:
		1. If you have an XML file URL:
		const response = await fetch('file_url');
		const xmlString = await response.text();
		var XmlNode = new DOMParser().parseFromString(xmlString, 'text/xml');
		xmlToJson(XmlNode);
		2. If you have an XML as string:
		var XmlNode = new DOMParser().parseFromString(yourXmlString, 'text/xml');
		xmlToJson(XmlNode);
		*/

		handleUploadComplete: function (oEvent) {
			MessageToast.show("ПП загружены ");
		},

		// обработка ошибки и вывод при загрузке
		_onErrorCall: function (oError) {
			if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400") {
				var errorRes = JSON.parse(oError.responseText);
				if (!errorRes.error.innererror) {
					MessageBox.alert(errorRes.error.message.value);
				} else {
					// 	if (!errorRes.error.innererror.message) {
					// 		MessageBox.alert(JSON.stringify(errorRes.error.innererror));
					// 	} else {
					// 		MessageBox.alert(JSON.stringify(errorRes.error.innererror.message));
					// 	}
					if (!errorRes.error.message) {
						MessageBox.alert(errorRes.error.toString());
					} else {
						MessageBox.alert(JSON.stringify(errorRes.error.message));
					}
				}
				return;
			} else {
				MessageBox.alert(oError.response.statusText);
				return;
			}
		},

		////////////
		// кнопка отмена подписи - открыли окно
		onUndoSign: function () {
			if (!this.undoSignDialog) {
				this.undoSignDialog = sap.ui.xmlfragment("undoSignDialog", "h2h.ui5.view.undoSignDialog", this);
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
						that.undoSignDialog.setModel(oModel);
						that.undoSignDialog.open();
					},
					function (result) {
						console.log(result);
					});
			} else {
				this.undoSignDialog.open();
			}
		},

		// выбрали подпись в окне выбора
		onUndoThisSign: function (oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			var objSign = src.getModel().getProperty(ctx.getPath());
			var Thumbprint = objSign.Thumbprint; // берем отпечаток = SHA1
			var docExtId = this._getDocExtId();

			var oEntry = {};
			oEntry.docExtId = docExtId[0];
			// 			oEntry.Value = Sign;
			// 			oEntry.SN = objSign.SerialNumber;
			// 			oEntry.Issuer = objSign.IssuerName;
			// 			oEntry.Fio = objSign.SubjectName;

			debugger;
			var oModel = this.getOwnerComponent().getModel();
			oModel.setHeaders({
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
				"X-CSRF-Token": "Fetch"
			});
			var mParams = {};
			mParams.success = function () {
				MessageToast.show("Подпись снята");
				this.undoSignDialog.close();
			};
			mParams.error = this._onErrorCall;
			oModel.remove("/Sign", oEntry, mParams);

			this.undoSignDialog.close();
		},

		//закрыли signDialog
		undoSignDialogClose: function (oEvent) {
			this.undoSignDialog.close();
		},

		// журнал
		onJournal: function (oEvent) {
			// тест
			var objSign = {
				IssuerName: "CN=CRYPTO-PRO Test Center 2, O=CRYPTO-PRO LLC, L=Moscow, C=RU, E=support@cryptopro.ru",
				SerialNumber: "12003CCD07A5CDE4B983DE43910001003CCD07",
				SubjectName: "CN=Алексей, E=kleale@kleale.ru",
				Thumbprint: "F15B11449945DFE37FD743F38E4F925E00BB5FBF",
				ValidToDate: "2020-02-06T11:56:17.000Z",
			};
			var result =
				"MIIFzAYJKoZIhvcNAQcCoIIFvTCCBbkCAQExDDAKBgYqhQMCAgkFADAbBgkqhkiG9w0BBwGgDgQMRABpAGcAZQBzAHQAoIIDNTCCAzEwggLgoAMCAQICExIAPM0Hpc3kuYPeQ5EAAQA8zQcwCAYGKoUDAgIDMH8xIzAhBgkqhkiG9w0BCQEWFHN1cHBvcnRAY3J5cHRvcHJvLnJ1MQswCQYDVQQGEwJSVTEPMA0GA1UEBxMGTW9zY293MRcwFQYDVQQKEw5DUllQVE8tUFJPIExMQzEhMB8GA1UEAxMYQ1JZUFRPLVBSTyBUZXN0IENlbnRlciAyMB4XDTE5MTEwNjExNDYxN1oXDTIwMDIwNjExNTYxN1owOjEfMB0GCSqGSIb3DQEJARYQa2xlYWxlQGtsZWFsZS5ydTEXMBUGA1UEAwwO0JDQu9C10LrRgdC10LkwYzAcBgYqhQMCAhMwEgYHKoUDAgIkAAYHKoUDAgIeAQNDAARACf1L8MMFFWEhjGGhE9uEMZvI3v8/ihbxGvSkR2DERznqd9NEBA83qdfQF5n95SGUb9PWqx7wZzoLfUIO4ljzKKOCAXYwggFyMA4GA1UdDwEB/wQEAwIE8DATBgNVHSUEDDAKBggrBgEFBQcDAjAdBgNVHQ4EFgQUfq57iywIx05913enla7zwSycM88wHwYDVR0jBBgwFoAUToM+FGnv7F16lStfEf43MhZJVSswXAYDVR0fBFUwUzBRoE+gTYZLaHR0cDovL3Rlc3RjYS5jcnlwdG9wcm8ucnUvQ2VydEVucm9sbC9DUllQVE8tUFJPJTIwVGVzdCUyMENlbnRlciUyMDIoMSkuY3JsMIGsBggrBgEFBQcBAQSBnzCBnDBkBggrBgEFBQcwAoZYaHR0cDovL3Rlc3RjYS5jcnlwdG9wcm8ucnUvQ2VydEVucm9sbC90ZXN0LWNhLTIwMTRfQ1JZUFRPLVBSTyUyMFRlc3QlMjBDZW50ZXIlMjAyKDEpLmNydDA0BggrBgEFBQcwAYYoaHR0cDovL3Rlc3RjYS5jcnlwdG9wcm8ucnUvb2NzcC9vY3NwLnNyZjAIBgYqhQMCAgMDQQDoGvcedRo7bW6sEtR0XdckaJOmJE3lI5SpQz6P3uLqh08eH2nUQTisc5emGW+8dvmr7g0ken1s207oStI+49aKMYICTjCCAkoCAQEwgZYwfzEjMCEGCSqGSIb3DQEJARYUc3VwcG9ydEBjcnlwdG9wcm8ucnUxCzAJBgNVBAYTAlJVMQ8wDQYDVQQHEwZNb3Njb3cxFzAVBgNVBAoTDkNSWVBUTy1QUk8gTExDMSEwHwYDVQQDExhDUllQVE8tUFJPIFRlc3QgQ2VudGVyIDICExIAPM0Hpc3kuYPeQ5EAAQA8zQcwCgYGKoUDAgIJBQCgggFQMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE5MTEyMDA5MDExNlowLwYJKoZIhvcNAQkEMSIEILlvLxbprLjgB8/hZZO1XiSwNO8vIAGa7lXs44SWGaB9MIHkBgsqhkiG9w0BCRACLzGB1DCB0TCBzjCByzAIBgYqhQMCAgkEIGunFwOjKwcpzb8kuiIBzOUV3LOF6sAJBVtRbCgmsShiMIGcMIGEpIGBMH8xIzAhBgkqhkiG9w0BCQEWFHN1cHBvcnRAY3J5cHRvcHJvLnJ1MQswCQYDVQQGEwJSVTEPMA0GA1UEBxMGTW9zY293MRcwFQYDVQQKEw5DUllQVE8tUFJPIExMQzEhMB8GA1UEAxMYQ1JZUFRPLVBSTyBUZXN0IENlbnRlciAyAhMSADzNB6XN5LmD3kORAAEAPM0HMAoGBiqFAwICEwUABEAwlfyWU9TYw+CDNgxnZBrMSVrhsu5pSFwRx+KXZ9oSUq9qhU/u0+JYMkeXcu8IgphHhHPDhsNJTlygDXfmH+/g";
			this._sendSign(result, objSign);
		},

		//////
		// кнопка подписать - открыли окно
		onSignDialog: function () {
			if (!this.signDialog) {
				this.signDialog = sap.ui.xmlfragment("signDialog", "h2h.ui5.view.signDialog", this);
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
						console.log(result);
					});
			} else {
				this.signDialog.open();
			}
		},

		// Получаем сертификаты пользователя
		// return mySerts=[{}]
		/*
		_getUserCertificates: function (oEvent) {
			var mySerts = []; // сюда сложим все найденные сертификаты юзера
			var CADESCOM_CADES_BES = 1;
			var CAPICOM_CURRENT_USER_STORE = 2;
			var CAPICOM_MY_STORE = "My";
			var CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;

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
		},
        */
		// выбрали подпись в окне выбора
		onUseSign: function (oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			var objSign = src.getModel().getProperty(ctx.getPath());
			var Thumbprint = objSign.Thumbprint; // берем отпечаток = SHA1

			//var oModel = this.getView().getModel();
			var oModel = this.getOwnerComponent().getModel();
			//var that = this;
			var dataToSign = "Digest";
			var docExtId = this._getDocExtId();

			// get Digest HERE 
			var url = "/xsjs/digest.xsjs";
			$.ajax({
				type: "GET",
				url: url,
				data: "docExtId=%27" + docExtId[0] + "%27",
				//dataType: "text/plain",
				success: function (data) {
					dataToSign = data;
					console.log("digest: ", data);
				},
				error: function (oError) {
					MessageBox.error(oError.responseText);
					console.warn(oError);
				}
			});

			///////////////////
			var thenable = this._SignCreate(Thumbprint, dataToSign);
			var that = this;
			// обработка ошибки
			thenable.then(
				function (result) {
					//MessageBox.success("Платежное поручение подписано");
					console.log(result);
					that._sendSign(result, objSign);
				},
				function (result) {
					MessageBox.error(result);
					console.warn(result);
				});
		},

		_getDocExtId: function () {
			var oSmartTable = this.byId("LineItemsSmartTable");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var docExtId = [];

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					// не работает так как oData не возвращает скрытые колонки 2==================
					//var obj = oTable.getModel().getProperty(sPath);
					//var obj1 = Context.getObject();
					//requestId = obj.requestId;
					//===========================

					var Context = oTable.getContextByIndex(item);
					var sPath = Context.sPath; //"/PaymentOrder(requestId='dbcfa37f-5c47-beef-88ff-6e3cb3fed730',docExtId='dc8506e9-8fab-7a73-a787-21e71a941f1c')"
					var nov_reg = "docExtId='(.*)'";
					var myAttr = sPath.match(nov_reg);
					docExtId.push(myAttr[1]);
				});
				return docExtId;
			} else {
				return MessageBox.alert("Выберите хотя бы одно ПП в таблице");
			}
		},

		// отправка подписи
		_sendSign: function (Sign, objSign) {
			var docExtId = this._getDocExtId();

			var oEntry = {};
			oEntry.docExtId = docExtId[0];
			// убираем переносы строк /r/ в SIgn
			//var Sign2 = Sign.replace("/r/", "");
			//oEntry.Value = Sign2.replace(" ", "");
			oEntry.Value = Sign;
			//debugger;
			oEntry.SN = objSign.SerialNumber;
			oEntry.Issuer = objSign.IssuerName;
			oEntry.Fio = objSign.SubjectName;
			// oEntry.ValidToDate = objSign.ValidToDate;
			// oEntry.Thumbprint = objSign.Thumbprint;

			var oModel = this.getOwnerComponent().getModel();
			oModel.setHeaders({
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
				"X-CSRF-Token": "Fetch"
			});
			var mParams = {};
			mParams.success = function () {
				MessageToast.show("ПП подписана");
				this.signDialog.close();
			};
			mParams.error = this._onErrorCall;
			oModel.create("/Sign", oEntry, mParams);

			//this.signDialog.close();
		},

		//закрыли signDialog
		signDialogClose: function (oEvent) {
			this.signDialog.close();
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
            /*
			return new Promise(function (resolve, reject) {
				window.cadesplugin.async_spawn(function* (args) {
					try {
						var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store");
						yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);
						//debugger;
						var CertificatesObj = yield oStore.Certificates;

						// ============== поиск по имени
						//var certSubjectName = 'Алексей';
						//var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, certSubjectName);
						// ============== поиск по Thumbprint
						var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, Thumbprint);

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
				}, Thumbprint, dataToSign, resolve, reject);
			});
			*/
		},

		// форматтер для подсветки строки в таблице
		formatRowHighlight: function (oValue) {
			// Your logic for rowHighlight goes here
			if (oValue < 6) {
				return "Success";
			} else if (oValue < 3) {
				return "Warning";
			} else if (oValue < 5) {
				return "None";
			}
			return "Error";
		},

		// печать выбранной ПП
		onPrint: function (oEvent) {
			var docExtId = this._getDocExtId();

			// ================
			// печать из таблицы
			// ================
			// 			var oTarget = this.getView(),
			// 				sTargetId = oEvent.getSource().data("LineItemsSmartTable");
			// 			if (sTargetId) {
			// 				oTarget = oTarget.byId(sTargetId);
			// 			}
			// 			if (oTarget) {
			// 				var $domTarget = oTarget.$()[0],
			// 					sTargetContent = $domTarget.innerHTML,
			// 					sOriginalContent = document.body.innerHTML;

			// 				document.body.innerHTML = sTargetContent;
			// 				window.print();
			// 				document.body.innerHTML = sOriginalContent;
			// 			} else {
			// 				jQuery.sap.log.error("onPrint needs a valid target container [view|data:targetId=\"SID\"]");
			// 			}

			// ================
			// вызов внешней печатной формы
			// ================
			//bwd bwq - чтоб не зависило от системы
			// 			var href = window.location.href;
			// 			var matches = href.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i); // порт
			// 			//var matches = href.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);  // без порта
			// 			var domain = matches && matches[1];

			// 			var oTable = this.byId("tableHeaders");
			// 			var iIndex = oTable.getSelectedIndices();
			// 			var data = [];
			// 			if (iIndex.length > 0 & iIndex.length < 2) {
			// 				for (var i = 0; i < iIndex.length; i++) {
			// 					var sPath = oTable.getContextByIndex(iIndex[i]).sPath;
			// 					data.push(oTable.getModel().getProperty(sPath));
			// 				}
			// 				console.log(data);
			// 				var ZsbnReqn = [];
			// 				for (var i = 0; i < data.length; i++) {
			// 					ZsbnReqn.push(data[i].ZsbnReqn);
			// 				}
			// 				// https://sapbwq.gazprom-neft.local:8143
			// 				var url = "https://" + domain + "/sap/bw/analysis?APPLICATION=EXCEL&OBJECT_TYPE=DOCUMENT&OBJECT_ID=ZSBNCP017_WBR002" +
			// 					"&VARZCOMP_CODE_VAR_CMP002=1000&VARZSBNNUMZK_VAR_CMP001=" + ZsbnReqn;
			// 				sap.m.URLHelper.redirect(url, true);
			// 			} else {
			// 				MessageToast.show("Выделите одну заявку в первой таблице заявок для печати");
			// 			}
		}

		/////////////////////////////////// end BaseController
	});
});