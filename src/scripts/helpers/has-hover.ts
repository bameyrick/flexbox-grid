let touchDevice = false;

function initialiseHasHover(): void {
	window.addEventListener('touchstart', handleTouch);
	window.addEventListener('mouseover', handleMouseMove);
}

function handleMouseMove(): void {
	if (!touchDevice) {
		document.body.classList.add('has-hover');
	}
	window.removeEventListener('mouseover', handleMouseMove);
}

function handleTouch(): void {
	touchDevice = true;
	window.removeEventListener('touchstart', handleTouch);
}

initialiseHasHover();
