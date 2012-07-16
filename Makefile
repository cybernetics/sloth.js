docs: sloth.js
	node_modules/.bin/owldoc README.md > index.html

all: docs

clean:
	rm -f index.html

tests:
	node_modules/.bin/nodeunit tests/tests.js

.PHONY: all clean tests

