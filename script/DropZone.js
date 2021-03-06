var OfflineFileHandler = function(file){
		this.file = file === undefined ? {} : file;
		this.initializeFileHandlers();
		return this;
};

OfflineFileHandler.prototype = {
	file:{},
	fileType: ['.jpg','.png','.mp4','.pdf','.docx'],
	fileHandlerStore:{},
	getFileHandlerForType: function getFileHandlerForType(fileType){
		return this.fileHandlerStore[fileType];
	},
	initializeFileHandlers: function generateFileHandlers(){
		var thisObject = this;
		$.each(thisObject.fileType,function(key, value){
			thisObject.fileHandlerStore[value] = {
				fileType:value,
				readFromIndexedDB: function(){},
				addToIndexedDB: function(){},
				renderWithinParent: function(){},
				removeFromDB: function(){},
				dbInterface: function(){},
			};
		});
	},
	createFileHandlerForJPG: function(){
		var jpgHandler = this.getFileHandlerForType('.jpg');
		
		jpgHandler.readFromIndexedDB = function(){
		
		};
		
	},
	createFileHandlerForMP4: function(){
		var mp4Handler = this.getFileHandlerForType('.mp4');
		mp4Handler.readFromIndexDB = function(){
		
		};
	},
	readFromIndexedDB: function(){
	
	},
	addToIndexedDB: function(){
	
	},
	removeFromDB: function(){
	
	},
	indexedDBObject:function(){
		return {
			db:{},
			request:{},
			isBrowserSupporting: true,
			initialize: function(){
				window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
				window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
				window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
				if (!window.indexedDB) {
					window.alert("Your browser doesn't support a stable version of IndexedDB.");
					this.isBrowserSupporting = false;
				}else{
					this.isBrowserSupporting = true;;
				}
			},
			openDatabaseConnection: function(dbName, dbVersion){
				dbVersion = dbVersion === undefined ? 1 : dbVersion;
				this.request = window.indexedDB.open(dbName, dbVersion);
			},
		}
	},
	constructor: OfflineFileHandler
}



$(window).load(function(){
  console.log("Script Loaded");
  var fileReader = new FileReader();
  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
	debugger;
    var files = evt.dataTransfer.files; // FileList object.
	var reader = new FileReader();
		
	reader.onload = (function(theFile){
		return function(e){
					debugger;
			/*Creating blob from array buffer*/
			var fileArray = new Uint8Array(e.target.result);
			var blob = new Blob([fileArray], {type:"video/wmv"});
			
			/*store blob in indexed db*/
			window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
			window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
			if (!window.indexedDB) {
				window.alert("Your browser doesn't support a stable version of IndexedDB.")
			}
			var fileName = theFile.name;
			var fileData = {data: blob, fileName:fileName};
			var db;
			var request = window.indexedDB.open("fileDatabase", 3);
				request.onerror = function(event) {
				console.log("error: ");
			};

			request.onsuccess = function(event) {
			debugger;
				db = request.result;
				console.log("success: "+ db);
				add(fileData,db);
				read();
				
			};

			request.onupgradeneeded = function(event) {
				debugger;
				var db = event.target.result;
				var objectStore = db.createObjectStore("fileStore1", {keyPath: "fileName"});
			}
			
			function read() {
				var transaction = db.transaction(["fileStore1"]);
				var objectStore = transaction.objectStore("fileStore1");
				var request = objectStore.get(fileName);

				request.onerror = function(event) {
				   alert("Unable to retrieve daa from database!");
				};

				request.onsuccess = function(event) {
				   // Do something with the request.result!
				   if(request.result) {
				   debugger;
					 var fileBlob = request.result;
					 var blobReader = new FileReader();
					 blobReader.onload=function(event){
						$("#render-zone").html('<video src="" id="render-item"></video>');
						$("#render-item").attr('src',event.target.result);					 
					 };
					 blobReader.readAsDataURL(fileBlob.data);
					 
					 
				   }
				   
				   else {
					  alert("Kenny couldn't be found in your database!");
				   }
				};
		}
		function add(data,db) {
			var request = db.transaction(["fileStore1"], "readwrite").objectStore("fileStore1").add(data);

			request.onsuccess = function(event) {

			};

			request.onerror = function(event) {

			}
		}
            };
	})(files[0]);
	reader.readAsArrayBuffer(files[0]);
    
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }
  


  // Setup the dnd listeners.
  var dropZone = document.getElementById('drop-zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);

});