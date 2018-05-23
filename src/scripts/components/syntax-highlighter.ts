require.ensure([], () => {
	const { initHighlightingOnLoad } = require('highlight.js');

	initHighlightingOnLoad();
});
