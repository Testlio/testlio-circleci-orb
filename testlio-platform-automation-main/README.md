# testlio-platform-automation

This repository allows running Selenium UI tests against specified environment.  

Example `docker-compose.example` has been created based on [Docker Selenium repository](https://github.com/SeleniumHQ/docker-selenium).

## Install dependencies

Installing via compose:

* `docker-compose run --rm --no-deps testlio-platform-automation install`
* Having `docker-compose.yml` file here
`docker-compose run --rm --no-deps tests install`

## Additional Steps required for Apple Silicon Chip

If you are using Macbook which has Apple Silicon Chips, selenium hub doesn't work properly, and it gives bellow error:
```log
tests_1     |  1) When navigating to Testlio Platform and user is not logged in
tests_1     |    “before all” hook for “responds with login page and with correct page title”:
tests_1     |   Error: ECONNREFUSED connect ECONNREFUSED 172.20.0.2:4444
tests_1     |    at ClientRequest.<anonymous> (node_modules/selenium-webdriver/http/index.js:295:15)
tests_1     |    at ClientRequest.emit (domain.js:470:12)
tests_1     |    at Socket.socketErrorListener (_http_client.js:475:9)
tests_1     |    at Socket.emit (domain.js:470:12)
tests_1     |    at emitErrorNT (internal/streams/destroy.js:106:8)
tests_1     |    at emitErrorCloseNT (internal/streams/destroy.js:74:3)
tests_1     |    at processTicksAndRejections (internal/process/task_queues.js:82:21)
```
In order to fix this issue, you need to follow these additional steps
- Create a new `docker-compose.override.yml file` and add following snippet
```yaml
version: '3.4'
services:
  chrome:
    image: seleniarm/node-chromium:4.1.2-20220227
  selenium-hub:
    image: seleniarm/hub:4.1.2-20220227
```
>Explanation: As of now selenium doesn't support arm based architecture, alternative way is to use community driven repository which has experimental mult-arc images

> Follow the link for more updates
> https://github.com/SeleniumHQ/docker-selenium#experimental-mult-arch-aarch64armhfamd64-images

## Running tests

* Create `docker-compose.yml` file (`docker-compose.example` file can be used as reference)
* Add `ENV_URL` as base url against which environment tests are made (e.g.: <https://app.testlio.net>)
* Add `SELENIUM_BROWSER` to use specified browser for tests
* Run `docker-compose up tests`

## Structure

* Different pages used within testing are located in `lib/pages` directory (`login-page.ts` as an example)
  * New pages can extend existing base page functionality
  * Add reusable items to base page if needed
  * Utils can be added to `utils` directory
* Tests are located in `test` directory
  * Create test files as `file-name.test.ts`
  * Mocha is used for tests execution (`login-page.test.ts`) can be used as an example

#### Packaging
Package test script in format compatible with Testlio platform:

* `docker-compose run --rm --no-deps testlio-platform-automation run package`
* Having `docker-compose.yml` file here
`docker-compose run --rm --no-deps tests run package`

It will produce a .zip archive to be uploaded on a platform as test package.

Note! At that moment platform does not provide any possibilities to pass custom env variables to the script execution
container. As follows, you should add .env file with necessary values to package:
```shell
ENV_URL=<base url>
EMAIL=<test user email>
PASSWORD=<test user password>

BROWSER=<chrome or firefox>
BROWSER_VERSION=<99>
ALLURE_RESULTS_DIR=allure-results
```
