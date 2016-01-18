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
			/*Creating blob from array buffer*/
			var fileArray = new Uint8Array(e.target.result);
			var blob = new Blob([fileArray], {type:"image/jpeg"});
			
			/*store blob in indexed db*/
			
			
			var span = document.createElement('span');
            span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('render-zone').insertBefore(span, null);
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