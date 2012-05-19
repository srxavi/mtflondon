var count = 0;
var msecsFirst = 0;
var msecsPrevious = 0;
var lastcheck = 0;
var actualBPM = 0;
var lastBPM=0;
var my_media = null;
var wait = false;
var watchID = null;
var musicID = null;
var lastacc = 0;
var beat = 0;
var time = 0;

$("#tapDiv").live("tap", function(event) {
	TapForBPM();
});

function ShakeForBPM() {
	console.log("Entering shake for BPM");
	watchID = navigator.accelerometer.watchAcceleration(accelerometerSuccess,
            	accelerometerError,
            	{frequency: 50});
	musicID = setInterval(function (){
		getNewSongforShake();
	}, 3500);
}

function StopShake() {
	if (musicID)
		clearInterval(musicID);
	if (my_media) {
		my_media.stop();
		my_media = null;
	}
	$("#BPM2").html("<h1>Beat!</h1>");
	beat = 0;
	time = 0;
	$('#Music2').hide();
}

function ResetShake() {
	StopShake();
	ShakeForBPM();
}

function accelerometerSuccess(acceleration) {
	if (((acceleration.x < 0) && (lastacc > 0)) || ((acceleration.x > 0 ) && (lastacc < 0))){
		beat++;
	}
	time++
	if (time >= 20) {
		time = 0;
		if (beat > 2) {
			actualBPM += beat;
		}
		console.log('BEATS: ' + beat);
		beat = 0;
	}
	lastacc = acceleration.x;
}

function accelerometerError() 
{
}

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
        if ((msecs - msecsPrevious) > 2000) {
            count = 0;
        }
        if (count == 0) {
            msecsFirst = msecs;
            count = 1;
            lastcheck = msecs;
        } else {
            bpmAvg = 60000 * count / (msecs - msecsFirst);
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

function getNewSongforShake() {
    wait = true;
    clearInterval(musicID);
	navigator.accelerometer.clearWatch(watchID);
    tempo = actualBPM*4;
    console.log('TEMPO '+ tempo);
    if (tempo > 200)
        tempo = 200;
    else if (tempo < 40) {
    	tempo = 40;
    } 
    $("#BPM2").html("<h1>" + tempo + "</h1> <span class='small'>BPM</span>");
    speed = "genre:electronic";
    if (tempo > 100) {
        speed += "%20AND%20speed:fast%20AND%20mood:party";
    } else if (tempo < 80) { 
        speed += "%20AND%20speed:slow%20AND%20mood:relaxed";
    }
    rnd = randomnumber=Math.floor(Math.random()*20);
	var url = 'http://musictechfest:mtflondon2012_@ella.bmat.ws/collections/bmat/tracks/search?q='+speed+'&offset='+ rnd +'&limit=1&fetch_metadata=location,artist,track';
    console.log(url);
	$.ajax({
		url : url,
		dataType : 'json',
		type : 'GET',
		success : function(data) {
			$("#Music2").show('fast');
		    $("#Tavg2").val(data.response.results[0].entity.metadata.track + " by " + data.response.results[0].entity.metadata.artist);
			playMusic(data);
		}
	});
	actualBPM=0;
	
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
			$("#Music").show('fast');
		    $("#Tavg").val(data.response.results[0].entity.metadata.track + " by " + data.response.results[0].entity.metadata.artist);
			playMusic(data);
		}
	});

}

function playMusic(data) {
	console.log(JSON.stringify(data));
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
	my_media = null;
}

// Funci—n 'callback' onError
//
function onError(error) {
    alert('c—digo: '  + error.code    + '\n' + 
          'mensaje: ' + error.message + '\n');
}