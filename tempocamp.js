var count = 0;
var msecsFirst = 0;
var msecsPrevious = 0;
var actualBPM = 0;
var lastBPM=0;
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
		if (((Math.abs(Math.round(bpmAvg) - lastBPM)) > 15)&&(noDoing)) {
			now=Math.round(bpmAvg);
			if(now>200){
				now=200;
			}
			if(now<40){
				now=40;
			}
			lastBPM=now;
			actualBPM = now;
			getNewSong();
		} else {now=Math.round(bpmAvg);
		if(now>200){
			now=200;
		}
		if(now<40){
			now=40;
		}
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
	var url = 'http://musictechfest:mtflondon2012_@ella.bmat.ws/collections/tags/tags/electronic/similar/collections/bmat/tracks?filter=rhythm.bpm:['+minVal+'%20TO%20'+maxVal+']&similarity_type=playlist&format=json&limit=1&fetch_metadata=location,artist,track';
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
	noDoing=true;
	
	alert(JSON.stringify(data));
	console.log(JSON.stringify(data));
	
	
	console.log(JSON.stringify(data.response.results[0].entity.metadata.location));
	playAudio(data.response.results[0].entity.metadata.location);

}
var my_media = null;

function playAudio(src) {
	// Create Media object from src
	alert(src);
	
	if(my_media != null){
		my_media.stop();
	}else{
	
	my_media = new Media(src, onSuccess, onError);

	// Play audio
	my_media.play();
	}
}

function onSuccess() {
    console.log("playAudio():Audio correcto");
}

// Funci—n 'callback' onError
//
function onError(error) {
    alert('c—digo: '  + error.code    + '\n' + 
          'mensaje: ' + error.message + '\n');
}