// export

export var promiseLoad;
export var isLoaded = false;
export var isPlaying = false;

export var initAudioContext = () => {
	if (!audioCtx) audioCtx = new AudioContext();
}

export var setUpdateFunction = (_updateFunction) => {updateFunction = _updateFunction}

export var loadURL = (url) => {
	isLoaded = false;

	promiseLoad = fetch(url)
	.then(logPromise)
	.then(checkFetchError)
	.then(response => response.arrayBuffer())
	.then(toAudioBuffer)
	.then(_audioBuffer => {
		isLoaded = true;
		audioBuffer = _audioBuffer;
	})
}

export var loadFile = (file) => {
	isLoaded = false;
	
	promiseLoad = readFileAsArrayBuffer(file)
	.then(logPromise)
	.then(toAudioBuffer)
	.then(_audioBuffer => {
		isLoaded = true;
		audioBuffer = _audioBuffer;
	})
}

export var setAmountType = (_amountType) => {amountType = _amountType;}
export var setStartAmount = (_startAmount) => {startAmount = _startAmount;}
export var setChangeAmount = (_changeAmount) => {changeAmount = _changeAmount;}

export var play = () => {
	stop();

	if (isLoaded) {
		if (audioBuffer) {
			source = audioCtx.createBufferSource();
			source.buffer = audioBuffer;
			source.loop = true;
			source.connect(audioCtx.destination);
			source.start();

			isPlaying = true;

			startUpdates();
		}
	}
}

export var stop = () => {
	if (isPlaying) {
		if (source) {
			source.disconnect(audioCtx.destination)
			source.stop();
			source = null;

			isPlaying = false;

			endUpdates();
		}
	}
}

//

var amountType;
var startAmount;
var changeAmount;

var updateFunction;

var audioCtx;
var source;
var audioBuffer;

var timeout;
var timeStart;
var updateRate = 0;

var logPromise = (result, ...after) => {
	console.log(result, ...after);
	return result;
}

var checkFetchError = (response) => {
	if (!response.ok) {
		console.log(response);
		throw new ArbitraryError('NotOkFetchError', {response: response});
	}
	return response;
}

var toAudioBuffer = arrayBuffer => {
	return audioCtx.decodeAudioData(arrayBuffer);
}

var readFileAsArrayBuffer = file => {
	return new Promise((resolve, reject) => {
		if (!file) {
			reject(new ArbitraryError('No file', {}));
			return;
		}

		const fileReader = new FileReader();

		fileReader.addEventListener('load', () => {
			resolve(fileReader.result);
		});

		fileReader.addEventListener('error', e => {
			console.log(e);
			reject(new ArbitraryError('Error reading file', {e: e}));
		});

		fileReader.readAsArrayBuffer(file);
	})
}

var startUpdates = () => {
	timeStart = performance.now();
	update();
}

var endUpdates = () => {
	clearTimeout(timeout);
}

var update = () => {
	var timeCurrent = performance.now();
	var timeSinceStart = timeCurrent - timeStart;

	if (amountType == 'linear') {
		source.playbackRate.value = startAmount + (changeAmount * (timeSinceStart / 1000));
	} else if (amountType == 'exponential') {
		source.playbackRate.value = startAmount * (changeAmount ** (timeSinceStart / 1000));
	}

	updateFunction(source.playbackRate.value);

	timeout = setTimeout(update, updateRate);
}

class ArbitraryError extends Error {
	constructor(name, data={}) {
		super(JSON.stringify(data));
		this.name = name;
		Object.assign(this, data);
	}
}
