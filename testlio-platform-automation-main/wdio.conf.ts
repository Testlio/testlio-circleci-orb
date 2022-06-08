import type { Options } from '@wdio/types';
import { config as EnvConfig } from './config';
import Utils from './lib/utils';

const { hostname, pathname: path, protocol: urlProtocol, port: urlPort } = new URL(EnvConfig.sessionUrl);
const protocol = urlProtocol ? urlProtocol.replace(':', '') : 'http';
let port = urlPort ? parseInt(urlPort, 10) : null;
if (!port) port = protocol === 'http' ? 80 : 443;

const capabilities = [
    {
        browserName: EnvConfig.seleniumBrowser,
        browserVersion: EnvConfig.seleniumBrowserVersion,
        acceptInsecureCerts: true,
        ...(EnvConfig.seleniumBrowser === 'MicrosoftEdge'
            ? {
                  'ms:edgeChromium': true
              }
            : {})
    }
] as Options.Testrunner['capabilities'];

export const config: Options.Testrunner = {
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: 'tsconfig.json'
        }
    },
    specs: ['./test/*.ts'],
    exclude: [
        // 'path/to/excluded/files'
    ],
    maxInstances: 1,
    hostname,
    port,
    path,
    protocol,
    capabilities,
    logLevel: 'info',
    bail: 0,
    baseUrl: EnvConfig.envUrl,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: [],
    framework: 'mocha',
    reporters: [
        [
            'allure',
            {
                disableWebdriverStepsReporting: true,
                outputDir: EnvConfig.allureResultsDir
            }
        ]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    async before() {
        await browser.setWindowSize(1920, 1080);
        browser.addCommand('waitTillElementIsLocated', Utils.waitTillElementIsLocated);
        browser.addCommand('findButtonWithText', Utils.findButtonWithText);
        browser.addCommand('findByElementText', Utils.findByElementText);
        browser.addCommand('getModuleTitle', Utils.getModuleTitle);
    },
    async afterTest(test, context, { passed }) {
        if (!passed) {
            await browser.takeScreenshot();
        }
    }
};
