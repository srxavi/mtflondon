var count = 0;
var msecsFirst = 0;
var msecsPrevious = 0;
var actualBPM = 0;
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
		if ((Math.abs(Math.round(bpmAvg) - actualBPM)) > 15) {

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

	minVal = actualBPM - 5;
	maxVal = actualBPM + 5;
	var url = 'http://musictechfest:mtflondon2012_@ella.bmat.ws/collections/tags/tags/electronic/similar/collections/bmat/tracks?filter=rhythm.bpm:['
			+ minVal + '%20TO%20' + maxVal + ']&format=json';
	$.ajax({
		url : url,
		dataType : 'json',
		type : 'GET',
		success : function(data) {
		
			playMusic(data);
		}
	});

}

function playMusic(data) {
	
	alert(data.result[0].entity.metada.location);
	playAudio(myObject.result[0].entity.metada.location);

}
var my_media = null;
function playAudio(src) {
	// Create Media object from src
	alert(src);
	my_media = new Media(src, onSuccess, onError);

	// Play audio
	my_media.play();
}