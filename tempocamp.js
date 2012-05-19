var count = 0;
var msecsFirst = 0;
var msecsPrevious = 0;
var lastcheck = 0;
var actualBPM = 0;
var lastBPM=0;
var my_media = null;
var wait = false;

$("#tapDiv").live("tap", function(event) {
	TapForBPM();
});

function TapForBPM() {
	timeSeconds = new Date;
    if(!wait) {
        msecs = timeSeconds.getTime();
        console.log('SECONDS: '+msecs);
        if ((msecs - msecsPrevious) < 120)
        {
            console.log("Don't update");
            return true;
        }
        if ((msecs - msecsPrevious) > 1000) {
            count = 0;
        }
        if (count == 0) {
            msecsFirst = msecs;
            count = 1;
            lastcheck = msecs;
        } else {
            bpmAvg = 30000 * count / (msecs - msecsFirst);
            actualBPM = Math.round(bpmAvg);
            $("#BPM").html("<h1>" + actualBPM + "</h1> <span class='small'>BPM</span>");
            if((msecs - lastcheck) > 5000)
            {
                console.log('new Song!');
                getNewSong();
                lastcheck = msecs;
            }
            count++;
		//document.TAP_DISPLAY.T_TAP.value = count;
        }
        msecsPrevious = msecs;
    }
	return true;
}

function getNewSong() {
    wait = true;
    tempo = actualBPM;
    if (tempo > 200)
        tempo = 200;
    else if (tempo < 40)
        tempo = 40; 
	minVal = tempo - 5;
	maxVal = tempo + 5;
    speed = "%20AND%20!sound:speech";
    if (tempo > 120) {
        speed += "%20AND%20speed:fast%20AND%20mood:party";
    } else if (tempo < 80) { 
        speed += "%20AND%20speed:slow%20AND%20mood:relaxed";
    }
	var url = 'http://musictechfest:mtflondon2012_@ella.bmat.ws/collections/bmat/artists/b1f09a29-6b65-4492-9495-ce7469b9b6d3/similar/collections/bmat/tracks?filter=rhythm.bpm:['+minVal+'%20TO%20'+maxVal+']'+speed+'AND%20rhythm.complexity:simple&similarity_type=playlist_bpm&format=json&limit=1&fetch_metadata=location,artist,track';
    console.log(url);
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
	console.log(JSON.stringify(data));
	
	$("#Music").show('fast');
    $("#Tavg").val(data.response.results[0].entity.metadata.track + " by " + data.response.results[0].entity.metadata.artist);
	console.log(JSON.stringify(data.response.results[0].entity.metadata.location));
	playAudio(data.response.results[0].entity.metadata.location);
}

function playAudio(src) {
	// Create Media object from src
	if(my_media != null){
		my_media.stop();
        my_media.release();
	}
	my_media = new Media(src, onSuccess, onError, onStatus);
	// Play audio
    wait = false;
	my_media.play();
}

function onStatus(data) {
}

function onSuccess() {
}

// Funci—n 'callback' onError
//
function onError(error) {
    alert('c—digo: '  + error.code    + '\n' + 
          'mensaje: ' + error.message + '\n');
}