build:
	npm install

test:
	jest --detectOpenHandles

run:
	ts-node index.ts