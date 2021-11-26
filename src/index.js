// index.js

import * as audioAccelerator from './audio-accelerator.js';

var $ = q => document.querySelector(q);

var playState = false;

$('.url-load').onclick = () => {
	audioAccelerator.initAudioContext();

	$('.status').textContent = 'Loading...';
	
	audioAccelerator.loadURL($('.url').value);

	audioAccelerator.promiseLoad
	.then(() => {
		if (playState) {
			audioAccelerator.play();
			$('.status').textContent = 'Playing.';
		} else {
			$('.status').textContent = 'Loaded.';
		}
	})
	.catch(e => {
		$('.status').textContent = 'Error!';
		throw e;
	})
}

$('.file-load').onclick = () => {
	audioAccelerator.initAudioContext();

	$('.status').textContent = 'Loading...';

	audioAccelerator.loadFile($('.file').files[0]);

	audioAccelerator.promiseLoad
	.then(() => {
		if (playState) {
			audioAccelerator.play();
			$('.status').textContent = 'Playing.';
		} else {
			$('.status').textContent = 'Loaded.';
		}
	})
	.catch(e => {
		$('.status').textContent = 'Error!';
		throw e;
	})
}

$('.play-stop').onclick = () => {
	audioAccelerator.initAudioContext();

	if (!playState) {
		// play
		playState = true;
		$('.play-stop').textContent = 'Stop';

		if (audioAccelerator.isLoaded) {
			audioAccelerator.play();
			$('.status').textContent = 'Playing.';
		}
	} else {
		// stop
		playState = false;
		$('.play-stop').textContent = 'Play';

		if (audioAccelerator.isPlaying) {
			audioAccelerator.stop();
			$('.status').textContent = 'Stopped.';
			$('.playback-rate').textContent = '';
		}

	}

}

if ($('.type-linear').checked) {
	audioAccelerator.setAmountType('linear');
}
$('.type-linear').onclick = () => {
	audioAccelerator.setAmountType('linear');
}

if ($('.type-exponential').checked) {
	audioAccelerator.setAmountType('exponential');
}
$('.type-exponential').onclick = () => {
	audioAccelerator.setAmountType('exponential');
}

audioAccelerator.setChangeAmount($('.change-amount').valueAsNumber);
$('.change-amount').oninput = () => {
	if (isFinite($('.change-amount').valueAsNumber))
		audioAccelerator.setChangeAmount($('.change-amount').valueAsNumber);
}

audioAccelerator.setStartAmount($('.start-amount').valueAsNumber);
$('.start-amount').oninput = () => {
	if (isFinite($('.start-amount').valueAsNumber))
		audioAccelerator.setStartAmount($('.start-amount').valueAsNumber);
}

audioAccelerator.setUpdateFunction((playbackRate) => {
	$('.playback-rate').textContent = playbackRate.toFixed(2).toString() + 'x';
});