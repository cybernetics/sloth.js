docs: sloth.js
	node_modules/.bin/docco sloth.js
	cp docs/docco.css .
	sed 's|</head> <body>|<script type="text/javascript" src="sloth.js"></script></head> <body><a href="https://github.com/rfw/sloth.js"><img style="position: absolute; top: 0; right: 0; border: 0; z-index: 1000" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>|' docs/sloth.html > index.html

all: docs

clean:
	rm -rf docs
	rm -f docco.css
	rm -f index.html

tests:
	node_modules/.bin/nodeunit tests/tests.js

.PHONY: all clean tests

