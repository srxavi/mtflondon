var count = 0;
var msecsFirst = 0;
var msecsPrevious = 0;
var actualBPM = 0;
var noDoing= true;
$("#tapDiv").live("tap", function(event) {
	TapForBPM();
});

function ResetCount() {
	count = 0;
	$("#Tavg").val("");
	//document.TAP_DISPLAY.T_TAP.value = "";
	$("#T_RESET").blur();
}

function TapForBPM() {

	$("#t_wait").blur();
	timeSeconds = new Date;
	msecs = timeSeconds.getTime();
	if ((msecs - msecsPrevious) > 1000 * $("#t_wait").value) {
		count = 0;
	}

	if (count == 0) {
		$("#Tavg").val("First Beat");
		//document.TAP_DISPLAY.T_TAP.value = "First Beat";
		msecsFirst = msecs;
		count = 1;
	} else {
		bpmAvg = 60000 * count / (msecs - msecsFirst);
		$("#Tavg").val(Math.round(bpmAvg));
		if (((Math.abs(Math.round(bpmAvg) - actualBPM)) > 15)&&(noDoing)) {
			
			actualBPM = Math.round(bpmAvg);
			getNewSong();
		} else {
			actualBPM = Math.round(bpmAvg);
		}
		count++;
		//document.TAP_DISPLAY.T_TAP.value = count;
	}
	msecsPrevious = msecs;
	return true;
}

function getNewSong() {
noDoing=false;
	minVal = actualBPM - 5;
	maxVal = actualBPM + 5;
	var url = 'http://musictechfest:mtflondon2012_@ella.bmat.ws/collections/tags/tags/electronic/similar/collections/bmat/tracks?filter=rhythm.bpm:['+minVal+'%20TO%20'+maxVal+']&similarity_type=playlist&format=json&limit=1';
	$.ajax({
		url : url,
		dataType : 'json',
		type : 'GET',
		success : function(data) {
		alert("Hola");
			playMusic(data);
		}
	});

}

function playMusic(data) {
	noDoing=true;
	
	alert(JSON.stringify(data));
	
	
	playAudio(myObject.results[0].entity.metada.location);

}
var my_media = null;
function playAudio(src) {
	// Create Media object from src
	alert(src);
	my_media = new Media(src, onSuccess, onError);

	// Play audio
	my_media.play();
}