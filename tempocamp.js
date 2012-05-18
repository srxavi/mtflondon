var count = 0;
var msecsFirst = 0;
var msecsPrevious = 0;
var actualBPM=0;
$("#tapDiv").live("tap", function(event) {
                  TapForBPM();
                  });

var timerID = setTimeout("getNewSong()", 5000);

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
        actualBPM=Math.round(bpmAvg);
        count++;
        //document.TAP_DISPLAY.T_TAP.value = count;
    }
    msecsPrevious = msecs;
    return true;
}



function getNewSong() {
    minVal=actualBPM-5;
    maxVal=actualBPM+5;
    var url = 'http://musictechfest:mtflondon2012_@ella.bmat.ws/collections/tags/tags/electronic/similar/collections/bmat/tracks?filter=rhythm.bpm:['+minVal+'%20TO%20'+maxVal+']&format=json&similarity_type=playlist';
    $.ajax({
           url: url,
           dataType: 'jsonp',
           jsonp: 'callback',
           jsonpCallback: 'playMusic'
           });
}

var playMusic = function(data) {
    var myObject = eval('(' + data + ')');
    playAudio(myObject.result[0].entity.metada.location);
    alert(JSON.stringify(data));
}
function playAudio(src) {
    // Create Media object from src
    my_media = new Media(src, onSuccess, onError);
    
    // Play audio
    my_media.play();
}