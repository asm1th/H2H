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

			var dateFrom = new Date();
			dateFrom.setUTCDate(2);
			dateFrom.setUTCMonth(1);
			dateFrom.setUTCFullYear(2014);

			var dateTo = new Date();
			dateTo.setUTCDate(17);
			dateTo.setUTCMonth(1);
			dateTo.setUTCFullYear(2014);

			var oModel = new JSONModel();
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

		// file upload
		OnUpload: function (oEvent) {
			var fileLoader = this.getView().byId("fileUploader");
			var fileName = fileLoader.getValue();
			jQuery.sap.require("sap.ui.commons.MessageBox");
			if (fileName === "") {
				sap.ui.commons.MessageBox.show("Please choose File.", sap.ui.commons.MessageBox.Icon.INFORMATION, "Information");
			} else {
				var file = jQuery.sap.domById(fileLoader.getId() + "-fu").files[0];
				var oEntry = {
					"d": {
						bank: "RAIF",
						xmlns: "http://bssys.com/upg/request",
						requestId: "ae059298-e102-1ee9-a8ae-7595552d079a",
						version: "0.1",
						file: file
					}
				};
				console.log("Отправляем file:");
				console.log(oEntry);

				/// VAR2
				//var oModel = new sap.ui.model.odata.ODataModel("/xsodata/h2h.xsodata", true);
				var oModel = new sap.ui.model.odata.ODataModel(
					"https://kl3zn4m1rmf4sssx-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/xsodata/h2h.xsodata", {
						headers: {
							"X-Requested-With": "XMLHttpRequest",
							"Content-Type": "application/atom+xml",
							"DataServiceVersion": "2.0",
							"X-CSRF-Token": "Fetch"
						}
					});
				// oModel.setHeaders({
				// 		"X-Requested-With": "XMLHttpRequest",
				// 		"Content-Type": "application/atom+xml",
				// 		"DataServiceVersion": "2.0",
				// 		"X-CSRF-Token": "Fetch"
				// });

				oModel.create("/REQUEST_SET", oEntry, null,
					function (oData, oResponse) {
						var msg = "Файл загружен";
						MessageToast.show(msg);
						console.log(oResponse);
					},
					function (oError, oResponse) {
						var msg = "Данные не сохранены. Проблема в данных, либо в серввере";
						// 		if (oResponse.error.message.value) {
						// 			txt = oResponse.error.message.value;
						// 		}
						MessageToast.show(msg);
						console.log(oError);
						console.log(oResponse);
					});

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
		}

		// 		OnUpload: function (oEvent) {
		// 			var fileLoader = this.getView().byId("fileUploader");
		// 			var fileName = fileLoader.getValue();
		// 			jQuery.sap.require("sap.ui.commons.MessageBox");
		// 			if (fileName === "") {
		// 				sap.ui.commons.MessageBox.show("Please choose File.", sap.ui.commons.MessageBox.Icon.INFORMATION, "Information");
		// 			} else {
		// 				var uploadUrl = "https://kl3zn4m1rmf4sssx-h2h-core-xsjs.cfapps.eu10.hana.ondemand.com/insert.xsjs?filename=" + fileName;
		// 				var file = jQuery.sap.domById(fileLoader.getId() + "-fu").files[0];
		// 				$.ajax({
		// 					url: uploadUrl,
		// 					type: "GET",
		// 					async: false,
		// 					beforeSend: function (xhr) {
		// 						xhr.setRequestHeader("X-CSRF-Token", "Fetch");
		// 					},
		// 					success: function (data, textStatus, XMLHttpRequest) {
		// 					    console.warn("GET OK");
		// 				// 		var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
		// 				// 		$.ajax({
		// 				// 			url: uploadUrl,
		// 				// 			type: "POST",
		// 				// 			processData: false,
		// 				// 			contentType: false,
		// 				// 			data: file,
		// 				// 			beforeSend: function (xhr) {
		// 				// 				xhr.setRequestHeader("X-CSRF-Token", token);
		// 				// 			},
		// 				// 			success: function (data, textStatus, XMLHttpRequest) {
		// 				// 				var resptext = XMLHttpRequest.responseText;
		// 				// 				jQuery.sap.require("sap.ui.commons.MessageBox");
		// 				// 				sap.ui.commons.MessageBox.show(resptext, sap.ui.commons.MessageBox.Icon.INFORMATION, "Information");

		// 				// 			},
		// 				// 			error: function (data, textStatus, XMLHttpRequest) {
		// 				// 				sap.ui.commons.MessageBox.show("File could not be uploaded.", sap.ui.commons.MessageBox.Icon.ERROR, "Error");
		// 				// 			}
		// 				// 		});
		// 					},
		// 					error: function (data) {
		// 						console.warn("GET ERROR");
		// 						console.warn("GET ERROR data", data);
		// 					}
		// 				});
		// 			}
		// 		},

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

		/* https://github.com/anpur/line-navigator Anton Purin MIT 2016 */
		/*
		getLineNavigatorClass: function () {
			function LineNavigator(file, options) {
				var self = this;

				// options init 
				options = options ? options : {};
				var encoding = options.encoding ? options.encoding : 'utf8';
				var chunkSize = options.chunkSize ? options.chunkSize : 1024 * 4;
				var throwOnLongLines = options.throwOnLongLines !== undefined ? options.throwOnLongLines : false;
				var milestones = [];

				var wrapper = new FileWrapper(file, encoding);
				var oldFileSize = wrapper.getSize();

				var getFileSize = function (position) {
					return oldFileSize = oldFileSize > position ? oldFileSize : wrapper.getSize(file);
				};

				var getProgressSimple = function (position) {
					var size = getFileSize(position);
					return Math.round(100 * position / size);
				};

				self.readSomeLines = function (index, callback) {
					var place = self.getPlaceToStart(index, milestones);

					wrapper.readChunk(place.offset, chunkSize, function readChunkCallback(err, buffer, bytesRead) {
						if (err) return callback(err, index);

						var isEof = bytesRead < chunkSize;

						var chunkContent = self.examineChunk(buffer, bytesRead, isEof);
						if (chunkContent === undefined) {
							// Line is longer than a chunkSize
							if (bytesRead > 0) {
								if (throwOnLongLines) {
									return callback('Line ' + index + ' is longer than chunk size (' + chunkSize + ')', index);
								} else {
									chunkContent = {
										lines: 1,
										length: bytesRead - 1,
										noLineEnding: true
									};
								}
							} else {
								return callback('Line ' + index + ' is out of index, last available: ' + (milestones.length > 0 ? milestones[milestones.length -
									1].lastLine : "none"), index);
							}
						}

						var inChunk = {
							firstLine: place.firstLine,
							lastLine: place.firstLine + chunkContent.lines - 1,
							offset: place.offset,
							length: chunkContent.length + 1
						};

						if (place.isNew)
							milestones.push(inChunk);

						var targetInChunk = inChunk.firstLine <= index && index <= inChunk.lastLine;

						if (targetInChunk) {
							var bomOffset = place.offset !== 0 ? 0 : self.getBomOffset(buffer, encoding);

							wrapper.decode(buffer.slice(bomOffset, inChunk.length), function (text) {
								var expectedLinesCount = inChunk.lastLine - inChunk.firstLine + (isEof ? 2 : 1);

								var lines = text.split(self.splitLinesPattern);
								if (!isEof && !chunkContent.noLineEnding)
									lines = lines.slice(0, lines.length - 1);
								if (index != inChunk.firstLine)
									lines = lines.splice(index - inChunk.firstLine);

								callback(undefined, index, lines, isEof, getProgressSimple(inChunk.offset + inChunk.length), inChunk);
							});
						} else {
							if (!isEof) {
								place = self.getPlaceToStart(index, milestones);
								wrapper.readChunk(place.offset, chunkSize, readChunkCallback);
							} else {
								return callback('Line ' + index + ' is out of index, last available: ' + inChunk.lastLine, index);
							}
						}
					});
				};

				self.readLines = function (index, count, callback) {
					if (count === 0)
						return callback(undefined, index, [], false, 0);

					var result = [];
					self.readSomeLines(index, function readLinesCallback(err, partIndex, lines, isEof, progress, inChunk) {
						if (err) return callback(err, index);

						var resultEof = !isEof ? false : partIndex + lines.length <= index + count;

						result = result.concat(lines);

						if (result.length >= count || isEof) {
							result = result.splice(0, count);
							var progress = self.getProgress(inChunk, index + result.length - 1, getFileSize(inChunk.offset + inChunk.length));
							return callback(undefined, index, result, resultEof, progress);
						}

						self.readSomeLines(partIndex + lines.length, readLinesCallback);
					});
				};

				self.find = function (regex, index, callback) {
					self.readSomeLines(index, function readSomeLinesHandler(err, firstLine, lines, isEof, progress) {
						if (err) return callback(err);

						for (var i = 0; i < lines.length; i++) {
							var match = self.searchInLine(regex, lines[i]);
							if (match)
								return callback(undefined, firstLine + i, match);
						}

						if (isEof)
							return callback();

						self.readSomeLines(firstLine + lines.length + 1, readSomeLinesHandler);
					});
				};

				self.findAll = function (regex, index, limit, callback) {
					var results = [];

					self.readSomeLines(index, function readSomeLinesHandler(err, firstLine, lines, isEof) {
						if (err) return callback(err, index);

						for (var i = 0; i < lines.length; i++) {
							var match = self.searchInLine(regex, lines[i]);
							if (match) {
								match.index = firstLine + i;
								results.push(match);
								if (results.length >= limit)
									return callback(undefined, index, true, results);
							}
						}
						if (isEof)
							return callback(undefined, index, false, results);

						self.readSomeLines(firstLine + lines.length, readSomeLinesHandler);
					});
				};
			}

			LineNavigator.prototype.splitLinesPattern = /\r\n|\n|\r/;

			LineNavigator.prototype.getProgress = function (milestone, index, fileSize) {
				var linesInMilestone = milestone.lastLine - milestone.firstLine + 1;
				var indexNumberInMilestone = index - milestone.firstLine;
				var indexLineAssumablePosition = index !== milestone.lastLine ? milestone.offset + milestone.length / linesInMilestone *
					indexNumberInMilestone : milestone.offset + milestone.length;

				return Math.floor(100 * (indexLineAssumablePosition / fileSize));
			};

			LineNavigator.prototype.searchInLine = function (regex, line) {
				var match = regex.exec(line);
				return !match ? null : {
					offset: line.indexOf(match[0]),
					length: match[0].length,
					line: line
				};
			};

			LineNavigator.prototype.getPlaceToStart = function (index, milestones) {
				for (var i = milestones.length - 1; i >= 0; i--) {
					if (milestones[i].lastLine < index)
						return {
							firstLine: milestones[i].lastLine + 1,
							offset: milestones[i].offset + milestones[i].length,
							isNew: i === milestones.length - 1
						};
				}
				return {
					firstLine: 0,
					offset: 0,
					isNew: milestones.length === 0
				};
			};

			// searches for line end, which can be \r\n (Windows) or \n (Unix)
			// returns line end postion including all line ending
			LineNavigator.prototype.getLineEnd = function (buffer, start, end, isEof) {
				var newLineCode = '\n'.charCodeAt(0);
				var caretReturnCode = '\r'.charCodeAt(0);

				for (var i = start; i < end; i++) {
					if (buffer[i] === newLineCode) {
						if (i !== end && buffer[i + 1] === 0) {
							return i + 1; // it is UTF16LE and trailing zero belongs to \n
						} else {
							return i;
						}
					}
				}
			};

			LineNavigator.prototype.examineChunk = function (buffer, bytesRead, isEof) {
				var lines = 0;
				var length = 0;

				do {
					var position = LineNavigator.prototype.getLineEnd(buffer, length, bytesRead, isEof);
					if (position !== undefined) {
						lines++;
						length = position + 1;
					}
				} while (position !== undefined);

				if (isEof) {
					lines++;
					length = bytesRead;
				}

				return length > 0 ? {
					lines: lines,
					length: length - 1
				} : undefined;
			};

			var bomUtf8 = [239, 187, 191];
			var bomUtf16le = [255, 254];

			var arrayStartsWith = function (array, startsWith) {
				for (var i = 0; i < array.length && i < startsWith.length; i++) {
					if (array[i] !== startsWith[i])
						return false;
					if (i == startsWith.length - 1)
						return true;
				}
				return false;
			};

			LineNavigator.prototype.getBomOffset = function (buffer, encoding) {
				switch (encoding.toLowerCase()) {
				case 'utf8':
					return arrayStartsWith(buffer, bomUtf8) ? bomUtf8.length : 0;
				case 'utf16le':
					return arrayStartsWith(buffer, bomUtf16le) ? bomUtf16le.length : 0;
				default:
					return 0;
				}
			};

			return LineNavigator;
		}
        */
	});
});