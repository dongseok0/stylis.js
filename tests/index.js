/**
 * tester runner
 *
 * excutes tests given an object describing the tests
 * based on sample input vs expected output
 * if output === expected output, test passed
 * else test failed
 *
 * log format
 *
 * ------
 * 
 * Tests Passed #
 *
 * ...
 *
 * [Finnished In] #ms
 * 
 * Tests Failed #
 *
 * ...
 *
 * [Finnished In] #ms
 */


/**
 * define tests
 * @type {Object}
 */
var tests = {
	'flat': {
		name: 'flat',
		sample: `
			color: 20px;
			font-size: 20px;
			transition: all;
		`,
		expected: `.user {color: 20px;font-size: 20px;-webkit-transition: all;transition: all;}`
	},
	'namespace': {
		name: 'namespace',
		sample: `
			{
				color: blue;
			}
		`,
		expected: `.user {color: blue;}`
	},
	'globals': {
		name: '@global/:global',
		sample: `
			@global {
				body {
					background: yellow;
				}
			}
			:global(body) {
				background: yellow;
			}

			html & {
				color: red;
			}
		`,
		expected: 'body {background: yellow;}body {background: yellow;}html .user {color: red;}'
	},
	'comment': {
		name: 'comments',
		sample: `
			// line comment

			// color: red;

			/**
			 * removes block comments and line comments, 
			 * there's a fire in the house // there is
			 */

			button /*
			 	// what's

			 	xxx
			  */
			{color: blue;}

			 
			// hello

			button /* 1 */
			{
				color: red; /* 2 */
			}
		`,
		expected: '.user button {color: blue;}.user button {color: red;}'
	},
	'&': {
		name: '&',
		sample: `
			& {
				color: blue;
			}

			&&& {
				color: red;
			}

			& + & {
				color: red;
			}
		`,
		expected: '.user {color: blue;}.user.user.user {color: red;}.user + .user {color: red;}'
	},
	'&:before': {
		name: '&:before',
		sample: `
			&:before{
				color: blue;
			}
		`,
		expected: '.user:before{color: blue;}'
	},
	'@media': {
		name: '@media',
		sample: `
			@media (max-width: 600px) {
				color: red;	
				h1 {
					color: red; 

					h2 {
						color: blue;
					}
				}
				display: none;
			}

			@media (min-width: 576px) {
				&.card-deck {
					.card {
				 		&:not(:first-child) { 
				   			margin-left: 15px; 
				 		}
						&:not(:last-child) { 
				   			margin-right: 15px; 
						}
					}
				}
			}
		`,
		expected: `@media (max-width: 600px) {`+
		`.user {color: red;}`+
		`.user h1 {color: red;}`+
		`.user h1 h2 {color: blue;}`+
		`.user {display: none;}`+`}`+

		`@media (min-width: 576px) {`+
		`.user.card-deck .card:not(:first-child) {margin-left: 15px;}`+
		`.user.card-deck .card:not(:last-child) {margin-right: 15px;}`+
		`}`
	},
	'@font-face': {
		name: '@font-face',
		sample: `
			@font-face { 
				font-family: Pangolin; 
				src: url('Pangolin-Regular.ttf') format('truetype');
			}
		`,
		expected: `@font-face {font-family: Pangolin;src: url('Pangolin-Regular.ttf') format('truetype');}`
	},
	'multiple selectors': {
		name: 'multiple selectors',
		sample: `
			span, h1 {
				color:red;
			}
			h1, &:after, &:before {
				color:red;
			}
		`,
		expected: `.user span,.user h1 {color:red;}.user h1,.user:after,.user:before {color:red;}`
	},
	'prefixer': {
		name: 'prefixer',
		sample: `
			& {
				display: flex;
			    transform: rotate(30deg);
			    cursor: grab;
			}
		`,
		expected: `.user {`+
			`display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;`+
			`-webkit-transform: rotate(30deg);-ms-transform: rotate(30deg);transform: rotate(30deg);`+
			`cursor: -webkit-grab;cursor: -moz-grab;cursor: grab;`+
			`}`
	},
	'animations': {
		name: 'animations',
		sample: `
			div {
				animation-name: bounce
			}

			h1 {
				animation:` +
				`
				0.6s
				.6ms
				200ms
				infinite
				something-ease
				infinite-fire
				slidein
				cubic-bezier()
				cubic-bezier(1, 2, 4)
				ease-in-out
				ease
				ease-inOuter
				linear
				alternate
				normal
				forwards
				both
				none
				ease-in
				ease-out
				backwards
				running
				paused
				reversed
				alternate-reverse
				step-start
				step-end
				step-end-something
				steps(4, end)
				`.replace(/\n|\r| +/g, ' ') +
				`;
			}
			span {
      			animation-duration: 0.6s;
      			animation-name: slidein;
      			animation-iteration-count: infinite;
      			animation-timing-function: cubic-bezier(0.1,0.7,1.0,0.1);
		    }
		`,
		expected: 
		/* 
			this also tests the parses ability to find and namespace 
			the animation-name in a grouped animation: property 
		*/

		`.user div {-webkit-animation-name:userbounce;animation-name:userbounce;}`+
		`.user h1 {`+
		`-webkit-animation:0.6s .6ms 200ms infinite usersomething-ease userinfinite-fire userslidein `+
		`cubic-bezier() cubic-bezier(1,2,4) ease-in-out ease userease-inOuter linear alternate normal forwards `+
		`both none ease-in ease-out backwards running paused reversed alternate-reverse `+
		`step-start step-end userstep-end-something steps(4,end);`+

		`animation:0.6s .6ms 200ms infinite usersomething-ease userinfinite-fire userslidein `+
		`cubic-bezier() cubic-bezier(1,2,4) ease-in-out ease userease-inOuter linear alternate normal forwards `+
		`both none ease-in ease-out backwards running paused reversed alternate-reverse `+
		`step-start step-end userstep-end-something steps(4,end);`+

		`}`+

		`.user span {`+
			`-webkit-animation-duration:0.6s;animation-duration:0.6s;-webkit-animation-name:userslidein;`+
			`animation-name:userslidein;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;`+
			`-webkit-animation-timing-function:cubic-bezier(0.1,0.7,1.0,0.1);animation-timing-function:cubic-bezier(0.1,0.7,1.0,0.1);`+
		`}`
	},
	'animations disabled prefix': {
		options: {
			animations: false
		},
		name: 'animations disable namespace',
		sample: `
			span {
      			animation-duration: 0.6s;
      			animation-name: slidein;
      			animation-iteration-count: infinite;
		    }
		`,
		expected: `.user span {-webkit-animation-duration:0.6s;animation-duration:0.6s;-webkit-animation-name:slidein;`+
			`animation-name:slidein;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;}`
	},
	'keyframes': {
		name: 'keyframes',
		sample: `
			&{
				animation: slidein 3s ease infinite;
			}
			@keyframes slidein {
				to { transform: translate(20px); }
			}
		`,
		expected: `.user{-webkit-animation:userslidein 3s ease infinite;animation:userslidein 3s ease infinite;}`+

			`@-webkit-keyframes userslidein `+
			`{to {-webkit-transform: translate(20px);-ms-transform: translate(20px);transform: translate(20px);}}`+

			`@keyframes userslidein `+
			`{to {-webkit-transform: translate(20px);-ms-transform: translate(20px);transform: translate(20px);}}`
	},
	'keyframes disable namespace': {
		options: {
			animations: false
		},
		name: 'keyframes disable namespace',
		sample: `
			&{
				animation: slidein 3s ease infinite;
			}
			@keyframes slidein {
				to { transform: translate(20px); }
			}
		`,
		expected: `.user{-webkit-animation:slidein 3s ease infinite;animation:slidein 3s ease infinite;}`+

			`@-webkit-keyframes slidein `+
			`{to {-webkit-transform: translate(20px);-ms-transform: translate(20px);transform: translate(20px);}}`+

			`@keyframes slidein `+
			`{to {-webkit-transform: translate(20px);-ms-transform: translate(20px);transform: translate(20px);}}`
	},
	':host, :host(), :host-context': {
		name: ':host, :host(), :host-context',
		sample: `
			color: red;
			& { color: red; }
			:host { color: red; }
			:hover { color: red; }

			:host(.fancy) { color: red; }
			:host-context(body) { color: red; }
			:root { color: red; }
		`,
		expected: '.user {color: red;}.user {color: red;}.user {color: red;}.user:hover {color: red;}.user.fancy {color: red;}'+
			'body .user {color: red;}.user:root {color: red;}'
	},
	'[title="a,b"] and :matches(a,b)': {
		name: '[title="a,b"] and :matches(a,b)',
		sample: `
			.test:matches(a, b, c), .test {
				color: blue;
			}

			.test[title=","] {
				color: red;
			}

			[title="a,b,c, something"], h1, [title="a,b,c"] {
		  		color: red
			}

			[title="a"],
			[title="b"] {
				color: red;
			}
		`,
		expected: `.user .test:matches(a, b, c),.user .test {color: blue;}`+
		`.user .test[title=","] {color: red;}`+
		`.user [title="a,b,c, something"],.user h1,.user [title="a,b,c"] {color: red}`+
		`.user [title="a"],.user [title="b"] {color: red;}`
	},
	'nested': {
		name: 'nested',
		sample: `
			:global(div) {
				h2 {
					color: red;

					h3 {
						color: blue;
					}
				}
			}

			.foo & {
			    width: 1px;

			    &:hover {
			        color: black;
			    }

			    li {
			  		color: white;
			    }
			}

			h1, div {
				color: red;

				h2, 
				&:before {
					color: red;
				}

				color: blue;

				header {
					font-size: 12px;
				}

				@media {
					color: red;
				}

				@media {
					color: blue;
				}
			}

			&.foo { 
				&.bar {
					color: yesplease
				}
			}

			&.foo { 
				&.bar { 
					&.barbar {
						color: yesplease
					}
				}
			}
		`,
		expected: `div h2 {color: red;}div h2 h3 {color: blue;}`+
		`.foo .user {width: 1px;}.foo .user:hover {color: black;}.foo .user li {color: white;}`+
		'.user h1,.user div {color: red;color: blue;}'+
		'@media {.user h1 {color: red;}.user div {color: red;}}'+
		`@media {.user h1 {color: blue;}.user div {color: blue;}}`+
		'.user h1 h2,.user h1:before,.user div h2,'+
		'.user div:before {color: red;}.user h1 header,.user div header {font-size: 12px;}'+
		'.user.foo.bar {color: yesplease}'+
		'.user.foo.bar.barbar {color: yesplease}'
	},
	'variables': {
		name: 'variables',
		sample: `
			~~foo: 20px;

			width: var(~~foo);

			& {
				margin: var(~~foo);
			}
		`,
		expected: '.user {width: 20px;}.user {margin: 20px;}'
	},
	'strings': {
		name: 'strings',
		sample: `
			.foo:before {
		  		content: ".hello {world}";
		  		content: ".hello {world} ' ";
		  		content: '.hello {world} " ';
			}
		`,
		expected: `.user .foo:before {content: ".hello {world}";content: ".hello {world} ' ";content: '.hello {world} " ';}`
	},
	'mixins': {
		name: 'mixins',
		sample: `
			@mixin large-text {
		    	font-size: 20px;
			}

			@mixin linx (link, visit, hover, active) {
				a {
				    color: var(~~link);
				    &:hover {
				      color: var(~~hover);   
				    }
			  	}
			}

			& {
				@include large-text;
			}

			@include linx(white, blue, green, red);
		`,
		expected: `.user {font-size: 20px;}.user a {color: white;}.user a:hover {color: green;}`
	},
	'remove empty css': {
		name: 'remove empty css',
		sample: `
			& {

			}
		`,
		expected: ``
	},
	'disable compact': {
		name: 'disable compact',
		options: {
			compact: false
		},
		sample: `
			~~foo: 20px;

			width: var(~~foo);

			@mixin large-text {
		    	font-size: 20px;
			}

			@mixin linx (link, visit, hover, active) {
				a {
				    color: var(~~link);
			  	}
			}

			& {
				@include large-text;
			}
		`,
		expected: '.user {~~foo: 20px;width: var(~~foo);}@mixin large-text {font-size: 20px;}'+
		'@mixin linx (link, visit, hover, active) {a {color: var(~~link);}}'+
		'.user {@include large-text;}'
	},
	'middleware imports': {
		name: 'middleware imports',
		options: {
			middleware: function (ctx, str, line, col) {
				if (ctx === 5) {
					return `.imported { color: orange; }`;
				}
			}
		},
		sample: `
			@import "foo.scss";
		`,
		expected: `.user .imported {color: orange;}`
	},
	'middleware contexts': {
		name: 'middleware contexts',
		options: {
			middleware: function (ctx, str, line, col) {
				switch (ctx) {
					case 1: return str+'/* selector */';
					case 2: return str+'/* property */';
					case 3: return str+'/* block */';
					case 4: return str+'/* flat */';
					case 5: return '.imported { color: orange; }';
					case 6: return str+'/* output */';
				}
			}
		},
		sample: `
			color: blue;
			
			@import "bar.scss";

			h1 { color: red; }
		`,
		expected: '.user {color: blue;/* property */}/* flat */'+
		'.user .imported/* selector */ {color: orange;/* property */}/* block */'+
		'.user h1/* selector */ {color: red;/* property */}/* block *//* output */'
	},
	'urls': {
		name: 'urls',
		sample: `
			background: url(http://url.com/});

			background: url(http://url.com//1234) '('; // sdsd

			background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAABCAIAAADsEU8HAAAACXBIW`+
			`XMAAAsTAAALEwEAmpwYAAAAIklEQVQI12P8//8/Aw4wbdq0rKysAZG1trbGJXv06FH8sgDIJBbBfp+hFAAAAABJRU5ErkJggg==");`,
		expected: `.user {background: url(http://url.com/});`+
		`background: url(http://url.com//1234) '(';`+
		`background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAABCAIAAADsEU8HAAAACXBIW`+
		`XMAAAsTAAALEwEAmpwYAAAAIklEQVQI12P8//8/Aw4wbdq0rKysAZG1trbGJXv06FH8sgDIJBbBfp+hFAAAAABJRU5ErkJggg==");}`
	},
	'semicolon omission': {
		name: 'semicolon omission',
		sample: `
			.content {
				display: none
			}
			
			.content {
				display: flex
			}
		`,
		expected: `.user .content {display: none}`+
		`.user .content {display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex}`
	},
	':matches(:not())': {
		name: ':matches()',
		sample: `
			h1:matches(.a, .b, :not(.c)) {
				display: none
			}
		`,
		expected: `.user h1:matches(.a, .b, :not(.c)) {display: none}`
	}
};


var browser = this && !!this.window;
var stylis = browser ? this.stylis : require('../stylis.js');

/**
 * run tests
 * @return {Object} tests
 */
function run (tests) {
	var start = Date.now();

	var passed = [];
	var failed = [];

	var format = {
		reset:     browser ? '' : '\x1b[0m',
		green:     browser ? '' : '\x1b[32m',
		red:       browser ? '' : '\x1b[31m',
		yellow:    browser ? '' : '\x1b[33m',
		underline: browser ? '' : '\x1b[4m',
		dim:       browser ? '' : '\x1b[2m',
		bold:      browser ? '' : '\x1b[1m',
		clear:     browser ? '' : '\x1Bc\n'
	};

	for (var name in tests) {
		var test = tests[name];

		var name = test.name.trim();
		var sample = test.sample.trim();
		var expected = test.expected.trim();
		var options = test.options || {};

		stylis.plugins.length = 0;

		var result = stylis(
			'.user', 
			sample, 
			options.animations, 
			options.compact === void 0 ? true : options.compact,
			options.middleware
		);

		(result === expected ? passed : failed).push(name);

		if (result !== expected) {
			// log why it failed
			console.log('failed: \n'+name+'\n'+ result);
			console.log('expected: '+'\n'+ expected);
		}
	}

	var end = '\n\n'+format.reset+'[Finnished In] '+(Date.now()-start)+'ms\n';

	// start test logger
	console.log('\n------');

	// passed
	console.log(
		format.bold+'\nTests Passed '+passed.length+format.reset+format.green + '\n\n'+passed.join('\n')+end
	);

	// failed
	console.log(
		format.bold+'Tests Failed '+failed.length+format.reset+format.red + 
		'\n\n'+(failed.join('\n') || 'no failed tests')+end
	);

	// if failed trigger exit
	if (failed.length) {
		if (browser) {
			console.error(new Error('^^^'));
		} else {
			process.exit(1);
		}
	}
}


/**
 * execute tests
 */
if (typeof disableTests !== 'boolean') {
	run(tests);
}