sap.ui.define([
	"h2h/ui5/controller/BaseController",
	"jquery.sap.global",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	'sap/m/MessagePopover',
	'sap/m/MessageItem',
	"h2h/ui5/js/cadesplugin_api",
	"sap/ui/codeeditor/CodeEditor",
	"h2h/ui5/model/formatter"
], function (BaseController, jQuery, Filter, JSONModel, MessageToast, MessageBox, MessagePopover, MessageItem, cadesplugin, CodeEditor,
	formatter) {
	"use strict";

	var oMessageTemplate = new MessageItem({
		type: '{type}',
		title: '{title}',
		activeTitle: "{active}",
		description: '{description}',
		subtitle: '{subtitle}',
		counter: '{counter}'
	});

	var oMessagePopover = new MessagePopover({
		items: {
			path: '/',
			template: oMessageTemplate
		},
		activeTitlePress: function () {
			MessageToast.show('Нажали на title');
		}
	});

	return BaseController.extend("h2h.ui5.controller.View1", {
		formatter: formatter,
		onInit: function () {
			//var url = '/xsodata';
			//var oModel = new sap.ui.model.odata.ODataModel(url);
			var oModel = this.getOwnerComponent().getModel();
			//userModel.setUseBatch(true);
			this.getView().setModel(oModel);

			var UIData = {
				PaymentOrderTotal: 0
			};
			var uiModel = new JSONModel(UIData)
			this.getView().setModel(uiModel, "UIData");
			//console.log(userModel);

			//messages
			var sErrorDescription = 'Полный текст длинного сообщения. \n' +
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod' +
				'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,' +
				'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo' +
				'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse' +
				'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non' +
				'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

			var aMockMessages = [{
				type: 'Error',
				title: 'Сообщение об ошибке',
				active: true,
				description: sErrorDescription,
				subtitle: 'Заголовок сообщения',
				counter: 1
			}, {
				type: 'Warning',
				title: 'Сообщение о проблеме',
				description: ''
			}, {
				type: 'Success',
				title: 'Сообщение об успехе',
				description: 'Описание сообщения',
				subtitle: 'Заголовок сообщения',
				counter: 1
			}, {
				type: 'Error',
				title: 'Сообщение об ошибке',
				description: 'Описание сообщения',
				subtitle: 'Заголовок сообщения',
				counter: 2
			}, {
				type: 'Information',
				title: 'Информация',
				description: 'Описание сообщения',
				subtitle: 'Заголовок сообщения',
				counter: 1
			}];

			var messageModel = new JSONModel(aMockMessages);
			var messagePopupModel = new JSONModel({
				messagesLength: aMockMessages.length + ''
			});
			this.byId("messagePopup").setModel(messagePopupModel);
			oMessagePopover.setModel(messageModel);

			// Активация кнопок
			this.byId("onSend").setEnabled(false);
			this.byId("onUndoSign").setEnabled(false);
			this.byId("onSignDialog").setEnabled(false);
		},

		// remove test after
		testButton: function (oEvent) {
			var oModel = this.getOwnerComponent().getModel();
			MessageToast.show("Подписано или изменено другим пользователем");
		},

		onAfterRendering: function (oEvent) {
			// 			$(".Table_D").on('scroll', function () {
			//                   $(".Table_C").scrollTop($(this).scrollTop());
			//             });
			//             $(".Table_C").on('scroll', function () {
			//                   $(".Table_D").scrollTop($(this).scrollTop());
			//             });
		},

		handleMessagePopoverPress: function (oEvent) {
			oMessagePopover.toggle(oEvent.getSource());
		},

		onDeleteStatement: function (oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			var sPath = ctx.getPath();
			var oSmartTable = this.byId("SmartTableStatements");
			var oTable = oSmartTable.getTable();
			var data = oTable.getModel().getProperty(sPath);
			this._delStmnt(data);
		},

		_delStmnt: function (data) {
			var oModel = this.getOwnerComponent().getModel();
			var mParams = {};
			var that = this;
			mParams.success = function () {
				MessageToast.show("Выписка удалена");
			};
			mParams.error = function (oError) {
				that._onErrorCall(oError);
			};
			var Path = "/Statements(responseId='" + data.responseId + "')";
			oModel.remove(Path, mParams);
		},

		onDeleteAllStatement: function (oEvent) {
			var oSmartTable = this.byId("SmartTableStatements");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var sPath;
			var that = this;

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					sPath = Context.sPath;
					var data = oTable.getModel().getProperty(sPath);
					that._delStmnt(data);
				});
			}
		},

		onDeletePP: function (oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			var sPath = ctx.getPath();
			var oSmartTable = this.byId("SmartTableStatements");
			var oTable = oSmartTable.getTable();
			var data = oTable.getModel().getProperty(sPath);
			if (data.status != "Подписан") {
				this._delPP(data);
			}
		},

		formatEnableDelPP: function (oValue) {
			if (oValue === "Исполнен") {
				return false;
			} else if (oValue === "Подписан") {
				return false;
			} else if (oValue === "Импортирован") {
				return true;
			} else if (oValue === "Отправлен") {
				return true;
			}
			return true;
		},

		onDeleteAllPP: function (oEvent) {
			var oSmartTable = this.byId("LineItemsSmartTable");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var sPath;
			var that = this;
			var nodeletePP = false;

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					sPath = Context.sPath;
					var data = oTable.getModel().getProperty(sPath);
					if (data.status != "Подписан") {
						that._delPP(data);
					} else {
						nodeletePP = true;
					}
				});
			}
			if (nodeletePP) {
				MessageBox.show("Одно или более ПП невозможно удалить, так как имеет статус Исполнено или Подписано.");
			}
		},

		_delPP: function (data) {
			var oModel = this.getOwnerComponent().getModel();
			var mParams = {};
			var that = this;

			//var Path = "/PaymentOrder(requestId='" + data.requestId + "',docExtId='" + data.docExtId + "')";
			//var Path = "/PaymentOrder(ID='" + data.ID + "')";
			//var Path = "/AccDoc(docExtId='" + data.docExtId + "')";

			var Path = "/PayDocRu(requestId='" + data.requestId + "',docExtId='" + data.docExtId + "')";

			// не костыль
			// 			oModel.remove(Path, mParams);
			// 				mParams.success = function () {
			// 				MessageToast.show("ПП удалено");
			// 			};
			// 			mParams.error = function (oError) {
			// 				that._onErrorCall(oError);
			// 			};

			// костыль из-за generatedID
			mParams.success = function () {
				oModel.remove(Path, {
					success: function (data) {
						var oSmartTable = that.byId("LineItemsSmartTable");
						oSmartTable.rebindTable();
						MessageToast.show("Запись удалена");
					},
					error: function (oError) {
						MessageBox.show(oError);
					}
				});
			};
			mParams.error = function (oError) {
				that._onErrorCall(oError);
			};
			oModel.read(Path, mParams); // КОстыль
		},

		onItemSelect: function (oEvent) {
			var item = oEvent.getParameter('item');
			this.byId("pageContainer").to(this.getView().createId(item.getKey()));
		},

		onUploadToSap: function (oEvent) {
			MessageToast.show(oEvent.getSource().getId() + " Pressed");
		},

		onCheckSign: function (oEvent) {
			MessageToast.show("В разработке");
		},

		onAttachment: function (oEvent) {
			MessageToast.show("В разработке");
		},

		onRefresh: function (oEvent) {
			var oSmartTable = this.byId("LineItemsSmartTable");
			oSmartTable.rebindTable();
		},

		onRefresh_Stmnt: function (oEvent) {
			var oSmartTable = this.byId("SmartTableStatements");
			oSmartTable.rebindTable();

			var oSmartTable = this.byId("SmartTable_D");
			oSmartTable.rebindTable();
			var oSmartTable = this.byId("SmartTable_C");
			oSmartTable.rebindTable();
		},

		onJournal_Stmnt: function (oEvent) {
			var that = this;
			if (!this.journalDialog) {
				this.journalDialog = sap.ui.xmlfragment("journalDialog", "h2h.ui5.view.journalDialog", this);
			}
			var oSmartTable = this.byId("SmartTableStatements");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var sPath;
			var that = this;
			var oFilter = [];
			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					sPath = Context.sPath;
					var data = oTable.getModel().getProperty(sPath);
					oFilter.push(new sap.ui.model.Filter("docExtId", sap.ui.model.FilterOperator.EQ, data.responseId)); // История для Statements: из History где docExtId = Statement.RESPONSEID
				});
			} else {
				return MessageBox.alert("Выберите хотя бы одну строку в таблице");
			}

			var oModel = this.getOwnerComponent().getModel();

			oModel.read("/History", {
				filters: oFilter,
				success: function (data) {
					console.log("History", data);
					var oModel = new JSONModel(data.results);
					that.journalDialog.setModel(oModel);
					that.journalDialog.open();
				},
				error: function (oError) {
					//MessageBox.error(oError.responseText);
					console.log("error: " + oError);
					that.journalDialog.open();
				}
			});
		},

		onSelStatement: function () {
			var oSmartTable = this.byId("SmartTableStatements");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var sPath;
			//var that = this;
			var oFilter = [];
			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					sPath = Context.sPath;
					var data = oTable.getModel().getProperty(sPath);
					oFilter.push(new sap.ui.model.Filter("responseId", sap.ui.model.FilterOperator.EQ, data.responseId));
				});
			}

			this.byId("SmartTable_D").getTable().bindRows("/StatementItemsDeb", null, null, oFilter);
			this.byId("SmartTable_C").getTable().bindRows("/StatementItemsCred", null, null, oFilter);

			//this.byId("Table_D").bindRows("/StatementItemsDeb", null, null, oFilter);
			//this.byId("Table_C").bindRows("/StatementItemsCred", null, null, oFilter);
		},

		onChoseStatement: function (oEvent) {
			//debugger;
			// 			var src = oEvent.getSource();
			// 			var ctx = src.getBindingContext();
			// 			var path = ctx.getPath();
			// 			var obj = src.getModel().getProperty(path);
			// 			var oFilter = new sap.ui.model.Filter("responseId", sap.ui.model.FilterOperator.EQ, obj.responseId);
			// 			var oSmartTable_D = this.byId("SmartTable_D");
			// 			oSmartTable_D.getTable().bindRows("/StatementItemsDeb", null, null, oFilter);
			// 			var oSmartTable_С = this.byId("SmartTable_C");
			// 			oSmartTable_С.getTable().bindRows("/StatementItemsCred", null, null, oFilter);

			var oView = this.getView();
			if (!this.detailDialog_Stmnt) {
				this.detailDialog_Stmnt = sap.ui.xmlfragment("detailDialog_Stmnt", "h2h.ui5.view.detailDialog_Stmnt", this).addStyleClass(
					"sapUiSizeCompact");
				oView.addDependent(this.detailDialog_Stmnt);
			}

			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			//var path = ctx.getPath();
			this.detailDialog_Stmnt.setBindingContext(ctx);
			this.detailDialog_Stmnt.open();
		},

		detailDialog_StmntClose: function () {
			this.detailDialog_Stmnt.close();
		},

		onChoseCreditDebit: function (oEvent) {
			var oView = this.getView();
			if (!this.detailDialog_CD) {
				this.detailDialog_CD = sap.ui.xmlfragment("detailDialog_CD", "h2h.ui5.view.detailDialog_CD", this).addStyleClass(
					"sapUiSizeCompact");
				oView.addDependent(this.detailDialog_CD);
			}

			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			//var path = ctx.getPath();
			this.detailDialog_CD.setBindingContext(ctx);
			this.detailDialog_CD.open();
		},

		detailDialog_CDClose: function () {
			this.detailDialog_CD.close();
		},

		// test event for dev
		onPress: function (oEvent) {
			MessageToast.show(evt.getSource().getId() + " Pressed");
		},

		//////////////////
		// фикс размер колонок по заголовкам table
		onDataReceived: function () {
			// var oSmartTable = this.byId("LineItemsSmartTable");
			// var oTable = oSmartTable.getTable();
			// var oTpc = new sap.ui.table.TablePointerExtension(oTable);
			// var aColumns = oTable.getColumns();
			// for (var i = 0; i < aColumns.length; i++) {
			//   oTpc.doAutoResizeColumn(i);
			// }
			// 			var oSmartTable = this.byId("LineItemsSmartTable");
			// 			var i = 0;
			// 			oSmartTable.getTable().getColumns().forEach(function (oLine) {
			// 				oLine.setWidth("100%");
			// 				oLine.getParent().autoResizeColumn(i);
			// 				i++;
			// 			});
			//oSmartTable.getTable().rerender();
			//oSmartTable.getTable().scrollLeft();
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
			var path = ctx.getPath();
			this.detailDialog.setBindingContext(ctx);

			// =================
			this.detailDialog.open();
		},
		
		onDetailDialogCell: function (oEvent) {
			var oView = this.getView();
			if (!this.detailDialog) {
				this.detailDialog = sap.ui.xmlfragment("detailDialog", "h2h.ui5.view.detailDialog", this).addStyleClass("sapUiSizeCompact");
				oView.addDependent(this.detailDialog);
			}

			var rowBindingContext = oEvent.getParameters().rowBindingContext;
			var oRow = rowBindingContext.getObject();

			var nalogFields = [{
				cbc: oRow.cbc,
				okato: oRow.okato,
				paytReason: oRow.paytReason,
				taxPeriod: oRow.taxPeriod,
				depDocNo: oRow.depDocNo,
				depDocDate: oRow.depDocDate,
				taxPaytKind: oRow.taxPaytKind,
				payeeUip: oRow.payeeUip
			}];

            this.getView().getModel("UIData").setProperty("/nalogFields", nalogFields);

			this.detailDialog.setBindingContext(rowBindingContext);
			// =================
			this.detailDialog.open();
		},

		detailDialogSave: function (oEvent) {
			//MessageToast.show("Сохраняем очередность платежа");
			var src = oEvent.getSource().getParent();
			var ctx = this.detailDialog.getBindingContext();

			//debugger;
			var oModel = this.getOwnerComponent().getModel();
			var path = ctx.getPath();
			var obj = oModel.getProperty(path);

			// костыль из-за generatedID

			var that = this;
			var accPath = "/AccDoc(docExtId='" + obj.docExtId + "')";

			oModel.read(accPath, {
				success: function (data) {
					console.log(data);
					var oEntity = {
						// new
						priority: parseInt(obj.priority),
						// copy
						docExtId: data.docExtId,
						purpose: data.purpose,
						docDate: data.docDate,
						docNum: data.docNum,
						docSum: data.docSum,
						vatSum: data.vatSum,
						vatRate: data.vatRate,
						vat: data.vat,
						transKind: data.transKind,
						paytKind: data.paytKind,
						paytCode: data.paytCode,
						codeVO: data.codeVO,
						nodocs: data.nodocs
					};
					//oModel.update(accPath + "/priority", obj.priority, {
					oModel.update(accPath, oEntity, {
						success: function (data) {
							console.log(data);
							MessageToast.show("Изменения сохранены");
							that.detailDialog.close();
						},
						error: function (oError) {
							MessageBox.show(oError);
							that.detailDialog.close();
						}
					});
				},
				error: function (oError) {
					MessageBox.error(JSON.stringify(oError));
					console.log("error: " + oError);
				}
			});
		},

		detailDialogClose: function (oEvent) {
			this.detailDialog.close();
		},
		///// окно подробностей
		///////////////////////

		//////////////////
		// просмотр платежки загружаемой в банк
		onShowXml: function (oEvent) {
			var oSmartTable = this.byId("LineItemsSmartTable");
			//var oTable = oSmartTable.getTable();
			//var iIndex = oTable.getSelectedIndices();
			var docExtId = this._getDocExtId();
			var oModel = this.getOwnerComponent().getModel();

			// Get file
			// var url = "/xsjs/download.xsjs";
			var url = "/download.xsjs";
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
							styleClass: "MessageBoxLarge",
							actions: [sap.m.MessageBox.Action.YES], //[sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO]
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {
									var oEntity = {
										docExtId: docExtId[0],
										status: '',
										description: ''
									};
									oModel.create("/Response", oEntity, {
										success: function (data) {
											oSmartTable.rebindTable();
											MessageToast.show("Отправлено в банк");
										},
										error: function (oError) {
											MessageBox.error(JSON.stringify(oError));
											MessageToast.show("Ошибка отправки в банк");
										}
									});
								}
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

		// выделение ПП и проверка на статус
		onSelPaymentOrder: function (oEvent) {
			var oSmartTable = this.byId("LineItemsSmartTable");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var sPath;
			if (iIndex.length > 0) {
				var StatusEnableButton = true; //все ПП подписаны
				var StatusSignEnableButton = true; //все ПП подписаны
				var PaymentOrderTotal = 0;

				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					sPath = Context.sPath;
					var obj = Context.getObject();
					PaymentOrderTotal = PaymentOrderTotal + parseFloat(obj.docSum);
					var data = oTable.getModel().getProperty(sPath);
					if (data.status === "Подписан") {} else {
						StatusEnableButton = false; // хоть одна ПП не подписана
					}
					if (data.status === "Удален") {
						StatusSignEnableButton = false; // хоть одна ПП не подписана
					}
				});
				this.getView().getModel("UIData").setProperty("/PaymentOrderTotal", PaymentOrderTotal);
				this.byId("onSend").setEnabled(StatusEnableButton);
				this.byId("onUndoSign").setEnabled(StatusEnableButton);
				this.byId("onSignDialog").setEnabled(StatusSignEnableButton);
			} else {
				this.byId("onSend").setEnabled(false);
				this.byId("onUndoSign").setEnabled(false);
				this.byId("onSignDialog").setEnabled(false);
				this.getView().getModel("UIData").setProperty("/PaymentOrderTotal", 0);
			}
		},

		// кнопка отправить
		onSend: function (oEvent) {
			this.onShowXml(oEvent);
			// MessageToast.show("Пример отправленного XML файла");
		},

		//  кнопка загрузки пп
		OnUploadDialog: function (oEvent) {
			var oView = this.getView();
			if (!this.addDialog) {
				this.addDialog = sap.ui.xmlfragment("addDialog", "h2h.ui5.view.addDialog", this).addStyleClass("sapUiSizeCompact");
				oView.addDependent(this.addDialog);
			}
			var oFileUpload = sap.ui.core.Fragment.byId("addDialog", "fileUploader");
			//oFileUpload.clear(); // - не загрузить 2 раз после clear
			oFileUpload.setValue("");
			this.addDialog.open();
		},

		addDialogClose: function (oEvent) {
			this.addDialog.close();
		},

		// загрузка пп - file upload
		OnUpload: function () {
			this.addDialog.setBusy(true);
			var oFileUpload = sap.ui.core.Fragment.byId("addDialog", "fileUploader");
			var domRef = oFileUpload.getFocusDomRef();
			var file = domRef.files[0];
			var fileName = file.name;
			var fileType = file.type;
			var fileSize = file.size;

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
					oEntry.fileName = fileType;
					oEntry.fileType = fileType;
					oEntry.fileSize = fileSize;
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
						that.addDialog.setBusy(false);
					};
					mParams.error = function (oError) {
						that.addDialog.setBusy(false);
						that._onErrorCall(oError);
					};
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

			} else {
				//var oFileUpload = sap.ui.core.Fragment.byId("addDialogStmnt", "fileUploader_2");
				//oFileUpload.clear();
			}
			this.addDialogStmnt.open();
		},

		addDialogStmntClose: function (oEvent) {
			this.addDialogStmnt.close();
		},

		addStmntUpload: function () {
			//var oFileUpload = this.getView().byId("fileUploader");
			this.addDialogStmnt.setBusy(true);
			var oFileUpload = sap.ui.core.Fragment.byId("addDialogStmnt", "fileUploader_2");
			var domRef = oFileUpload.getFocusDomRef();
			var file = domRef.files[0];
			var fileName = file.name;
			var fileType = file.type;
			var fileSize = file.size;

			if (fileName === "") {
				return MessageToast.show("Please choose File.");
			} else {
				var oModel = this.getOwnerComponent().getModel();
				var reader = new FileReader();
				var that = this;
				reader.onload = function (oEvent) {
					var vContent = oEvent.currentTarget.result.replace("data:" + fileType + ";base64,", "");
					/*var yourXmlString = window.atob(vContent);
					var binaryLen = yourXmlString.length;
					var bytes = new Uint8Array(binaryLen);
					for (var i = 0; i < binaryLen; i++) {
						var ascii = yourXmlString.charCodeAt(i);
						bytes[i] = ascii;
					}

					// convert bytes to string // encoding can be specfied, defaults to utf-8 which is ascii.
					
					var str = new TextDecoder().decode(bytes);
					var XmlNode = new DOMParser().parseFromString(str, 'text/xml');
					var ContentJson = that._xmlToJson(XmlNode);
					var sContentJson = JSON.stringify(ContentJson);
					//var bContentJson = window.btoa(sContentJson);
					var bContentJson = window.btoa(unescape(encodeURIComponent(sContentJson)));
                    */

					var oEntry = {};
					//oEntry.requestId = "";
					//oEntry.fileBody = bContentJson;
					//oEntry.fileBody = XmlNode;
					oEntry.fileBody = vContent;
					oEntry.fileName = fileName;
					oEntry.fileType = file.type;
					oEntry.fileSize = fileSize;
					oEntry.docType = 2; // для бека - определять тип файла

					oModel.setHeaders({
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/json",
						"X-CSRF-Token": "Fetch"
					});
					var mParams = {};
					mParams.success = function () {
						var oSmartTable = that.byId("SmartTableStatements");
						oSmartTable.rebindTable();
						that.addDialogStmnt.close();
						that.addDialogStmnt.setBusy(false);
					};
					mParams.error = function (oError) {
						that.addDialogStmnt.setBusy(false);
						that._onErrorCall(oError);
					};
					oModel.create("/Files", oEntry, mParams);
				};
				reader.readAsDataURL(file);
			}
		},
		//. upload выписка в json

		// используем при загрузке XML - парсим в JSON и отправляем на сервер
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
		_xmlToJson: function (xml) {
			// Create the return object
			var obj = {};

			if (xml.nodeType === 1) {
				// element
				// do attributes
				if (xml.attributes.length > 0) {
					obj["$"] = {};
					for (var j = 0; j < xml.attributes.length; j++) {
						var attribute = xml.attributes.item(j);
						obj["$"][attribute.nodeName] = attribute.nodeValue;
					}
				}
			} else if (xml.nodeType === 3) {
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
					if (typeof obj[nodeName] === "undefined") {
						obj[nodeName] = this._xmlToJson(item);
					} else {
						if (typeof obj[nodeName].push === "undefined") {
							var old = obj[nodeName];
							obj[nodeName] = [];
							obj[nodeName].push(old);
						}
						obj[nodeName].push(this._xmlToJson(item));
					}
				}
			}
			return obj;
		},

		handleUploadComplete: function (oEvent) {
			MessageToast.show("Файл загружен");
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
				if (oError.response.statusText) {
					MessageBox.alert(oError.response.statusText);
				} else {
					MessageBox.alert(JSON.stringify(oError.response));
				}

				return;
			}
		},

		////////////
		// кнопка отмена подписи - открыли окно
		onUndoSign: function () {
			if (!this.undoSignDialog) {
				this.undoSignDialog = sap.ui.xmlfragment("undoSignDialog", "h2h.ui5.view.undoSignDialog", this);
			} else {
				this.undoSignDialog.open();
			}
			var mySerts;
			// вызов промиса - получаем сертификаты в окно
			var thenable = this._getUserCertificates();
			var that = this;
			thenable.then(
				function (result) {
					mySerts = result;
					console.log(result);

					result.forEach(function (item, i) {
						var SubjectName = item.SubjectName.split('=');
						item.SubjectName = SubjectName[1];
						var IssuerName = item.IssuerName.split(', ');
						var IssuerName1 = IssuerName[0].split('=');
						item.IssuerName = IssuerName1[1];
						var ValidToDate = item.ValidToDate.split('T');
						item.ValidToDate = ValidToDate[0];
					});

					var oModel = new JSONModel();
					oModel.setProperty("/mySerts", mySerts);
					that.undoSignDialog.setModel(oModel);
					that.undoSignDialog.open();
				},
				function (result) {
					console.log(result);
				});
		},

		// выбрали подпись в окне выбора
		onUndoThisSign: function (oEvent) {
			var docExtId = this._getDocExtId();
			var oObject = oEvent.getSource().getBindingContext().getObject();

			var oModel = this.getOwnerComponent().getModel();
			var mParams = {};
			var that = this;
			mParams.success = function () {
				var oSmartTable = that.byId("LineItemsSmartTable");
				oSmartTable.rebindTable();
				MessageToast.show("Подпись снята");
				that.undoSignDialog.close();
			};
			mParams.error = this._onErrorCall;
			docExtId.forEach(function (item, i) {
				var Path = "/Sign(docExtId='" + item + "',SN='" + oObject.SerialNumber + "')";
				oModel.remove(Path, mParams);
			});

			this.undoSignDialog.close();
		},

		//закрыли signDialog
		undoSignDialogClose: function (oEvent) {
			this.undoSignDialog.close();
		},

		// журнал
		onJournal: function (oEvent) {
			var that = this;
			if (!this.journalDialog) {
				this.journalDialog = sap.ui.xmlfragment("journalDialog", "h2h.ui5.view.journalDialog", this);
			}

			var docExtId = that._getDocExtId();
			var oFilter = [];
			if (docExtId.length > 0) {
				docExtId.forEach(function (item, i) {
					oFilter.push(new sap.ui.model.Filter("docExtId", sap.ui.model.FilterOperator.EQ, item));
				});
			}

			var oModel = this.getOwnerComponent().getModel();
			oModel.read("/History", {
				filters: oFilter,
				success: function (data) {
					console.log(data);
					var oModel = new JSONModel(data.results);
					that.journalDialog.setModel(oModel);
					that.journalDialog.open();
				},
				error: function (oError) {
					MessageBox.error(JSON.stringify(oError));
					console.log("error: " + oError);
					that.journalDialog.open();
				}
			});
		},

		journalDialogClose: function (oEvent) {
			if (this.journalDialog) {
				this.journalDialog.close();
			}
		},

		//////
		// кнопка подписать - открыли окно
		onSignDialog: function () {
			if (!this.signDialog) {
				this.signDialog = sap.ui.xmlfragment("signDialog", "h2h.ui5.view.signDialog", this);
			}
			// } else {
			// 	this.signDialog.open();
			// }

			var mySerts;
			// вызов промиса - получаем сертификаты в окно
			var thenable = this._getUserCertificates();
			var that = this;
			thenable.then(
				function (result) {
					mySerts = result;
					console.log(result);

					result.forEach(function (item, i) {
						var SubjectName = item.SubjectName.split('=');
						item.SubjectName = SubjectName[1];
						var IssuerName = item.IssuerName.split(', ');
						var IssuerName1 = IssuerName[0].split('=');
						item.IssuerName = IssuerName1[1];
						var ValidToDate = item.ValidToDate.split('T');
						item.ValidToDate = ValidToDate[0];
					});

					var oModel = new JSONModel();
					oModel.setProperty("/mySerts", mySerts);
					that.signDialog.setModel(oModel);
					that.signDialog.open();
				},
				function (result) {
					console.log(result);
				});
		},

		// Получаем сертификаты пользователя
		// return mySerts=[{}]
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

		// выбрали подпись в окне выбора
		onUseSign: function (oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext();
			var objSign = src.getModel().getProperty(ctx.getPath());
			var Thumbprint = objSign.Thumbprint; // берем отпечаток = SHA1

			var dataToSign = "";
			var docExtId = this._getDocExtId();

			// get Digest HERE 
			//var url = "/xsjs/digest.xsjs";
			var url = "/digest.xsjs";
			var that = this;
			docExtId.forEach(function (item, i) {
				$.ajax({
					type: "GET",
					url: url,
					data: "docExtId=%27" + item + "%27",
					//dataType: "text/plain",
					success: function (data) {
						dataToSign = data;
						console.log("digest: ", data);

						///////////////////////// save digest file for test 
						// alert("Сохраняем файл digest после подписи");
						// var filename = "digest";
						// var blob = new Blob([data], { type: "text/plain" });

						// if (typeof window.navigator.msSaveBlob !== 'undefined') {
						// 	window.navigator.msSaveBlob(blob, filename);
						// } else {
						// 	var URL = window.URL || window.webkitURL;
						// 	var downloadUrl = URL.createObjectURL(blob);

						// 	if (filename) {
						// 		var a = document.createElement("a");
						// 		if (typeof a.download === 'undefined') {
						// 			window.location.href = downloadUrl;
						// 		} else {
						// 			a.href = downloadUrl;
						// 			a.download = filename;
						// 			document.body.appendChild(a);
						// 			a.click();
						// 		}
						// 	} else {
						// 		window.location.href = downloadUrl;
						// 	}
						// 	setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
						// }
						
						/// base64
						var thenable = that._SignCreate(Thumbprint, dataToSign);
						
						// обработка ошибки
						thenable.then(
							function (result) {
								//MessageBox.success("Платежное поручение подписано");
								console.log("Sign",result);
								that._sendSign(result, objSign);
							},
							function (result) {
								MessageBox.error(result);
								console.warn(result);
							});
					},
					error: function (oError) {
						MessageBox.error(oError.responseText);
						console.warn(oError);
					}
				});
			});
		},

		// функция получения DocExtId из таблицы LineItemsSmartTable - скорее всего не нужна так как нашел в аннотациях возможность указать RequestAtLeast обязательно загружаемые строки = docExtId
		_getDocExtId: function () {
			var oSmartTable = this.byId("LineItemsSmartTable");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var docExtId = [];

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var obj = Context.getObject();
					docExtId.push(obj.docExtId);
				});
				return docExtId;
			} else {
				return MessageBox.alert("Выберите хотя бы одно ПП в таблице");
			}
		},

		// отправка подписи
		_sendSign: function (Sign, objSign) {
			var docExtId = this._getDocExtId();
			var that = this;

			docExtId.forEach(function (item, i) {
				var oEntry = {};
				oEntry.docExtId = item;

				oEntry.Value = Sign;
				oEntry.SN = objSign.SerialNumber;
				oEntry.Issuer = "CN=" + objSign.IssuerName;
				oEntry.Fio = objSign.SubjectName;
				// oEntry.ValidToDate = objSign.ValidToDate;
				// oEntry.Thumbprint = objSign.Thumbprint;

				var oModel = that.getOwnerComponent().getModel();
				var mParams = {};
				mParams.success = function () {
					var oSmartTable = that.byId("LineItemsSmartTable");
					oSmartTable.rebindTable();
					that.signDialog.close();
					MessageToast.show("ПП подписана");
				};
				mParams.error = that._onErrorCall;
				oModel.create("/Sign", oEntry, mParams);
			});
		},

		//закрыли signDialog
		signDialogClose: function (oEvent) {
			this.signDialog.close();
		},

		// получение сертификата и подписание
		_SignCreate: function (Thumbprint, dataToSign) {
			var CAPICOM_CURRENT_USER_STORE = 2;
			var CAPICOM_MY_STORE = "My";
			var CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
			var CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
			var CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0; 	// Возвращает сертификаты соответствующие указанному хэшу SHA1.
			/// для подписания 
			var CADESCOM_PKCS7_TYPE = 0xffff;				// требуемый тип подписи
			var CADESCOM_BASE64_TO_BINARY = 1;
			//var CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256 = 101; // Хеш Алгоритм ГОСТ Р 34.11-2012.

			return new Promise(function (resolve, reject) {
				window.cadesplugin.async_spawn(function* (args) {
					try {
						var oStore = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.Store");
						yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);
						//debugger;
						var CertificatesObj = yield oStore.Certificates;

						// ============== поиск по Thumbprint
						var oCertificates = yield CertificatesObj.Find(CAPICOM_CERTIFICATE_FIND_SHA1_HASH, Thumbprint);
						var Count = yield oCertificates.Count;
						if (Count == 0) {
							throw ("Certificate not found: " + args[0]);
						}
						var oCertificate = yield oCertificates.Item(1);
						// подписант
						var oSigner = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.CPSigner");
						yield oSigner.propset_Certificate(oCertificate);
						
						// обязательная подготовка в бинари 
						var binaryDataToSign = btoa(unescape(encodeURIComponent(dataToSign)));
						// подпись
						var oSignedData = yield window.cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
						yield oSignedData.propset_ContentEncoding(CADESCOM_BASE64_TO_BINARY);
						yield oSignedData.propset_Content(binaryDataToSign);
						var sSignedMessage = yield oSignedData.SignCades(oSigner, CADESCOM_PKCS7_TYPE, true);

						yield oStore.Close();
						args[2](sSignedMessage);
					} catch (e) {
						args[3]("Failed to create signature. Error: " + window.cadesplugin.getLastError(e));
					}
				}, Thumbprint, dataToSign, resolve, reject);
			});

		},

		// скачать загруженное ПП в том же формате
		onDownload_1C: function (oEvent) {
			var oSmartTable = this.byId("LineItemsSmartTable");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var requestId = [];

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var obj = Context.getObject();
					requestId.push(obj.requestId);
				});
			} else {
				// exit
				return MessageBox.alert("Выберите одно платежное поручение в таблице");
			}

			//Get file
			//var url = '/xsodata';
			//var oModel = new sap.ui.model.odata.ODataModel(url);
			var oModel = this.getView().getModel();
			//var that = this;

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

		// скачать ПП для печати DOC
		onDownload_DOC: function (oEvent) {
			var oSmartTable = this.byId("LineItemsSmartTable");
			var docExtIdsAr = this._getDocExtId();

			//post
			// var docExtIds = {
			// 	"docExtId": docExtIdsAr.join()
			// };

			//var dataSend = 'docExtIds=' + docExtIdsAr.join() + '&type=DOC';
			//window.location = '/node/pp_exportbytemplate?' + dataSend;
			var uri = '/node/pp_exportbytemplate?docExtIds=' + docExtIdsAr.join() + '&type=DOC&debcred=0';
			var link = document.createElement("a");
			link.download = "PaymentOrder.docx";
			link.href = uri;
			link.click();

			// post if (docExtIdsAr.docExtId[0]) {
			// if (docExtIdsAr[0]) {
			// 	//this._getPrint(data);
			// 	$.ajax({
			// 		type: "GET",
			// 		url: "/node/pp_exportbytemplate",
			// 		data: dataSend,
			// 		//dataType: "xml",
			// 		success: function (data) {
			// 			window.location = '/node/pp_exportbytemplate?' + dataSend;
			// 		},
			// 		error: function (oError) {
			// 			MessageBox.error(oError.responseText);
			// 			console.warn(oError);
			// 		}
			// 	});
			// } else {
			// 	MessageToast.show("ошибка: docExtId строки пуст");
			// }
		},

		// скачать ПП для печати PDF
		onDownload_PDF: function (oEvent) {
			var oSmartTable = this.byId("LineItemsSmartTable");
			var docExtIdsAr = this._getDocExtId();

			var data = 'docExtIds=' + docExtIdsAr.join() + '&type=PDF';
			// post if (docExtIdsAr.docExtId[0]) {
			if (docExtIdsAr[0]) {
				this._getPrint(data);
			} else {
				MessageToast.show("ошибка: docExtId строки пуст");
			}
		},

		//Get PDF file frome node
		// _getPrint: function (data) {
		// 	$.ajax({
		// 			type: "GET",
		// 			url: "/node/exportbytemplate",
		// 			data: data,
		// 			//dataType: "xml",
		// 			success: function (data) {
		// 				window.location = '/node/exportbytemplate?' + data;
		// 			},
		// 			error: function (oError) {
		// 				MessageBox.error(oError.responseText);
		// 				console.warn(oError);
		// 			}
		// 		});
		// },

		onDownload_V_1C: function (oEvent) {
			MessageToast.show("В разработке");
		},
		onDownload_V_XML: function (oEvent) {
			MessageToast.show("Обратиться к FILE по RESPONSE ID");
		},

		onDownload_V_DOC: function (oEvent) {
			var oSmartTable = this.byId("SmartTableStatements");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var responseIdsAr = [];

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var obj = Context.getObject();
					responseIdsAr.push(obj.responseId);
				});

				var url = '/node/v_exportbytemplate';
				this.byId("toolPage").setBusy(true);
				var that = this;
				$.ajax({
					type: "GET",
					url: url,
					data: 'responseIds=' + responseIdsAr.join() + '&type=DOC',
					//dataType: "text/plain",
					success: function (data) {
						window.location = '/node/v_exportbytemplate?responseIds=' + responseIdsAr.join() + '&type=DOC';
						that.byId("toolPage").setBusy(false);
					},
					error: function (oError) {
						MessageBox.error(oError.responseText);
						console.warn(oError);
					}
				});
			}
		},

		onDownload_V_PP: function (oEvent) {
			var oSmartTable = this.byId("SmartTableStatements");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var responseIdsAr = [];

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var obj = Context.getObject();
					responseIdsAr.push(obj.responseId);
				});

				var url = '/node/vpp_exportbytemplate';
				this.byId("toolPage").setBusy(true);
				var that = this;
				$.ajax({
					type: "GET",
					url: url,
					data: 'responseIds=' + responseIdsAr.join() + '&type=DOC',
					//dataType: "text/plain",
					success: function (data) {
						window.location = '/node/vpp_exportbytemplate?responseIds=' + responseIdsAr.join() + '&type=DOC';
						that.byId("toolPage").setBusy(false);
					},
					error: function (oError) {
						MessageBox.error(oError.responseText);
						console.warn(oError);
					}
				});
			}
		},

		onDownload_V_PDF: function (oEvent) {
			var oSmartTable = this.byId("SmartTableStatements");
			var oTable = oSmartTable.getTable();
			var iIndex = oTable.getSelectedIndices();
			var responseIdsAr = [];

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var obj = Context.getObject();
					responseIdsAr.push(obj.responseId);
				});

				var url = '/node/v_export_pdf';
				this.byId("toolPage").setBusy(true);
				var that = this;
				$.ajax({
					type: "GET",
					url: url,
					data: 'responseIds=' + responseIdsAr.join() + '',
					//dataType: "text/plain",
					success: function (data) {
						window.location = '/node/v_export_pdf?responseIds=' + responseIdsAr.join() + '';
						that.byId("toolPage").setBusy(false);
					},
					error: function (oError) {
						MessageBox.error(oError.responseText);
						console.warn(oError);
					}
				});
			}
		},

		onDownload_V_MO: function (oEvent) {
			MessageToast.show("В разработке");
		},

		onPrint_C: function (oEvent) {
			var oTable = this.byId("Table_C");
			var iIndex = oTable.getSelectedIndices();
			var docExtIdAr = [];

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var obj = Context.getObject();
					docExtIdAr.push(obj.extId);
				});
				var uri = '/node/pp_exportbytemplate?docExtIds=' + docExtIdAr.join() + '&type=DOC&debcred=Cred';
				var link = document.createElement("a");
				link.download = 'PaymentOrder_credit.docx';
				link.href = uri;
				link.click();
			} else {
				MessageToast.show("Выделите хотя бы одну ПП в таблице дебета");
			}
		},

		onPrint_D: function (oEvent) {
			var oTable = this.byId("Table_D");
			var iIndex = oTable.getSelectedIndices();
			var docExtIdAr = [];

			if (iIndex.length > 0) {
				iIndex.forEach(function (item, i) {
					var Context = oTable.getContextByIndex(item);
					var obj = Context.getObject();
					docExtIdAr.push(obj.extId);
				});
				var uri = '/node/pp_exportbytemplate?docExtIds=' + docExtIdAr.join() + '&type=DOC&debcred=Deb';
				var link = document.createElement("a");
				link.download = 'PaymentOrder_credit.docx';
				link.href = uri;
				link.click();
			} else {
				MessageToast.show("Выделите хотя бы одну ПП в таблице дебета");
			}
		}
		
	});
});