var TRACK_URL;
const CLIENT_ID = '69054bf89e340d3b5b2f5678d5b6650b';
var streamUrl;
var source;

function SoundCloudHelper(trackUrl) {
	this.TRACK_URL = trackUrl;
}

SoundCloudHelper.prototype.setupAudio = function(callback) {
  SC.initialize({
    client_id: CLIENT_ID
  });
  SC.resolve(this.TRACK_URL).then(function(track) {
    streamUrl = track.stream_url + '?client_id=' + CLIENT_ID;
		source = this.loadSound(streamUrl, callback, soundError);

	}).catch(function(error) {
    // Network request error
    console.log("Error getting track JSON: " + error + '\n');
  });
}

function soundError(e) {
  console.log('New error:');
  console.log('- name: ' + e.name);
  console.log('- message: ' + e.message);
  console.log('- stack: ' + e.stack);
  console.log('- failed path: ' + e.failedPath);
}
