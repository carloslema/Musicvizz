var visualizer;

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
			visualizer = new AudioVisualizer();
			visualizer.setupAudioProcessing();
			visualizer.loadFile();
    }
}

function AudioVisualizer() {
	this.javascriptNode;
	this.audioContext;
	this.sourceBuffer;
	this.analyzer;
}

AudioVisualizer.prototype.setupAudioProcessing = function () {
    // Get audio context
    this.audioContext = new AudioContext();

    // Create javascript node
    this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);
    this.javascriptNode.connect(this.audioContext.destination);

    // Create Source buffer
    this.sourceBuffer = this.audioContext.createBufferSource();

    // Create analyzer node
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 512;

    // Connect source to analyzer
    this.sourceBuffer.connect(this.analyser);

    // Analyzer to speakers
    this.analyser.connect(this.javascriptNode);

    // Connect source to analyzer
    this.sourceBuffer.connect(this.audioContext.destination);
};

// Start audio processing
AudioVisualizer.prototype.start = function (buffer) {
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

AudioVisualizer.prototype.loadFile = function () {
		var file = "../../audio/magic_coldplay.mp3";
		var fileReader = new FileReader();

		fileReader.onload = function (e) {
				var fileResult = e.target.result;
				visualizer.start(fileResult);
		};
		fileReader.onerror = function (e) {
			debugger
		};
		fetch(file).then(r=>r.blob()).then(blob=>fileReader.readAsArrayBuffer(blob));
}
