function AudioHelper() {
	this.javascriptNode;
	this.audioContext;
	this.sourceBuffer;
	this.analyser;
}

AudioHelper.prototype.setupAudioProcessing = function () {
	// Get audio context
	this.audioContext = new AudioContext();

	// Create JS node
	this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);
	this.javascriptNode.connect(this.audioContext.destination);

	// Create Source buffer
	this.sourceBuffer = this.audioContext.createBufferSource();

	// Create analyser node
	this.analyser = this.audioContext.createAnalyser();
	this.analyser.smoothingTimeConstant = 0.3;
	this.analyser.fftSize = 512;

	// Connect source to analyser
	this.sourceBuffer.connect(this.analyser);

	// Analyser to speakers
	this.analyser.connect(this.javascriptNode);

	// Connect source to analyser
	this.sourceBuffer.connect(this.audioContext.destination);
};

// Start audio processing
AudioHelper.prototype.start = function (buffer) {
	this.audioContext.decodeAudioData(buffer, decodeAudioDataSuccess, decodeAudioDataFailed);
	var that = this;

	function decodeAudioDataSuccess(decodedBuffer) {
		that.sourceBuffer.buffer = decodedBuffer
		that.sourceBuffer.start(0);
	}

	function decodeAudioDataFailed() {
		debugger
	}
};

AudioHelper.prototype.onAudioProcess = function(callback) {
	this.javascriptNode.onaudioprocess = callback;
}

AudioHelper.prototype.loadFile = function (filePath) {
	var url = filePath;
	return fetch(url)
	.then(response => response.arrayBuffer())
	.then(buffer => visualizer.start(buffer));
};

AudioHelper.prototype.getFrequencyData = function() {
	// size of binCount ~ = 256
	var binCount = new Uint8Array(this.analyser.frequencyBinCount);
	// fill the binCount with data returned from getByteFrequencyData from analyser
	this.analyser.getByteFrequencyData(binCount);
	return binCount;
};

AudioHelper.prototype.getAverage = function(data) {
	var sum = 0;
	data.forEach(function(item) {
		sum += item;
	});
	return (sum / data.length);
}
