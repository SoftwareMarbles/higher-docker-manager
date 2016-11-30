
PACKAGE_VERSION=$(shell node -pe 'require('./package.json').version')

test:
	docker run --rm -t \
		-v `pwd`:/package \
		-v '/var/run/docker.sock:/var/run/docker.sock' \
		--workdir /package \
		-l 'test-label=test-value' \
		ierceg/node-dev:6.9.1 \
		mocha

test-cont:
	docker run --rm -t \
		-v `pwd`:/package \
		-v '/var/run/docker.sock:/var/run/docker.sock' \
		--workdir /package \
		-l 'test-label=test-value' \
		ierceg/node-dev:6.9.1 \
		nodemon -V -L -w /package --exec mocha

coverage:
	docker run --rm -t \
		-v `pwd`:/package \
		-v '/var/run/docker.sock:/var/run/docker.sock' \
		--workdir /package \
		-l 'test-label=test-value' \
		ierceg/node-dev:6.9.1 \
		istanbul cover _mocha -- --recursive && istanbul report text

bash:
	docker run --rm -it \
		-v `pwd`:/package \
		-v '/var/run/docker.sock:/var/run/docker.sock' \
		--workdir /package \
		-l 'test-label=test-value' \
		ierceg/node-dev:6.9.1 \
		sh

.PHONY: *
