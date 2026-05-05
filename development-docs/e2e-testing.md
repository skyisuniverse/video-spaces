# E2E Testing

Runs the end-to-end tests:
```shell
npx playwright test
```

To open last HTML report run:

```shell
npx playwright show-report
```

Starts the interactive UI mode.
```shell
npx playwright test --ui
```

Runs the tests only on Desktop Chrome.
```shell
npx playwright test --project=chromium
```

Runs the tests in a specific file.
```shell
npx playwright test example
```

Runs the tests in debug mode.
```shell
npx playwright test --debug
```

Auto generate tests with Codegen.
```shell
npx playwright codegen
```

We suggest that you begin by typing:
```shell
npx playwright test
```
