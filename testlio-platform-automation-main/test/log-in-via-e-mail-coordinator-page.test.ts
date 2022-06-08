import { expect } from 'chai';
import allureReporter from '@wdio/allure-reporter';
import LoginPage from '../lib/pages/login/login-page';
import { config } from '../config';

/**
 * https://app.testlio.com/tmt/project/testlio-platform/test-cases/TEST-577
 */
describe('When navigating to Testlio Platform and user is not logged in', () => {
    let RESET_PASSWORD_LINK: string;
    let RESET_PASSWORD_TEXT: string;

    before(async () => {
        RESET_PASSWORD_LINK = `${config.envUrl}/forgot-password`;
        RESET_PASSWORD_TEXT = 'Reset password';
        await LoginPage.open();
    });

    it('responds with login page and with correct page title', async () => {
        const title = await browser.getTitle();
        expect(title).to.equal('Log in to Testlio');
    });

    it('and page should ahave correct heading', async () => {
        const source: String = await browser.getPageSource();
        expect(source).contains('Log in to your account.');
    });

    it('should have link to reset password', async () => {
        const links: WebdriverIO.ElementArray = await browser.$$('a');
        const button: WebdriverIO.Element = await browser.findByElementText('Get started');
        const resetLink: WebdriverIO.Element = await browser.$(`*=${RESET_PASSWORD_TEXT}`);

        expect(links.length).to.equal(1);
        button.isDisplayed().then((value) => {
            expect(value).to.equal(true);
        });

        resetLink.getAttribute('href').then((value) => {
            expect(value).to.equal(RESET_PASSWORD_LINK);
        });
    });

    it('should have password field set to invisible', async () => {
        const passwordEl: WebdriverIO.Element = await browser.$("//input[@placeholder='Password']");

        passwordEl.getAttribute('type').then((value) => {
            expect(value).to.equal('password');
        });
    });

    it('and login to Testlio Platform is successful', async () => {
        await allureReporter.startStep('Login');
        allureReporter.addArgument('email', config.email);
        allureReporter.addArgument('password', config.password);
        await LoginPage.login(
            {
                email: config.email,
                password: config.password
            },
            10000
        );
        await allureReporter.endStep();

        await allureReporter.startStep('Validate title');
        const title = await browser.getTitle();
        expect(title).to.equal('Testlio');
    });
}).timeout(10000);
