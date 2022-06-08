require('dotenv').config();

interface IConfig {
    seleniumBrowser: string;
    seleniumBrowserVersion: string;
    sessionUrl: string;
    envUrl: string;
    email: string;
    password: string;
    allureResultsDir: string;
}

const config: IConfig = {
    allureResultsDir: (process.env.ALLURE_RESULTS_DIR as string) || './allure-results',
    seleniumBrowser: process.env.BROWSER as string,
    seleniumBrowserVersion: process.env.BROWSER_VERSION as string,
    sessionUrl: (process.env.SESSION_URL as string) || 'http://selenium-hub:4444/wd/hub',
    envUrl: process.env.ENV_URL as string,
    email: process.env.EMAIL as string,
    password: process.env.PASSWORD as string
};

export { config, IConfig };
