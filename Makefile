test:
	yarn jest --verbose

publish:
	npx tsc || true

lint:
	npx tslint src/*.ts -t verbose

snapshot:
	yarn jest --verbose -u

coverage:
	npx jest --coverage
