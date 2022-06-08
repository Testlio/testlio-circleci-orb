import { expect } from 'chai';
import dayjs from 'dayjs';
import allureReporter from '@wdio/allure-reporter';
import { EnumPlatformTypes } from '../types/enum';
import TestPage from '../lib/pages/tests/test-page';
import { config } from '../config';
import LoginPage from '../lib/pages/login/login-page';

/**
 * https://app.testlio.com/tmt/project/testlio-platform/test-cases/TEST-578
 */
describe('When in Testlio Platform and user wants to create regression test', () => {
    before(async () => {
        await LoginPage.open();
        await browser.$('body').waitForExist({
            timeout: 30000,
            timeoutMsg: 'Timed out after 30 seconds'
        });
        await LoginPage.login({ email: config.email, password: config.password }, 10000);
        await browser.pause(3000);
    });

    it('should arrive at home dashboard', async () => {
        const heading: WebdriverIO.Element = await browser.findByElementText('Testlio Home');

        heading.isDisplayed().then((value) => {
            expect(value).to.equal(true);
        });
    });

    it('should open list of tests', async () => {
        const testLink: WebdriverIO.Element = await browser.$('//*[@data-test-id="globalNavigationTestsLink"]');
        await testLink.click();
        await browser.pause(3000);
        const title = await browser.getTitle();
        expect(title).to.equal('All - Tests - Testlio');
    });

    it('and begin test creation', async () => {
        const createTestBtn: WebdriverIO.Element = await browser.$('//*[@data-test-id="testsPageNewTestButton"]');
        createTestBtn.click();
        await browser.pause(3000);

        const regressionElement: WebdriverIO.Element = await browser.$(
            '//*[@data-test-id="newRegressionTestLink"]//*[text()="Regression"]'
        );
        await regressionElement.click();
        await browser.pause(3000);
    });

    it('and fill create test from', async () => {
        const expectedTestText = 'a new expected result is added';

        await allureReporter.startStep('create test');
        await TestPage.create({
            title: `Created by Automation # ${dayjs().format('DDMMYYHHMMss')}`,
            platform: EnumPlatformTypes.ANDROID,
            execution: 10,
            automated: 'Yes',
            step: 'a new step is added',
            expected: expectedTestText
        });
        await allureReporter.endStep();

        await allureReporter.startStep('validate test type');
        const testType = await TestPage.testPageType;
        testType.getText().then((value) => {
            expect(value).to.equal('Regression');
        });
        await allureReporter.endStep();

        await browser.waitTillElementIsLocated(
            "//*[@data-test-id='testPagePassFailExpectedResultInput']",
            10000,
            "Expected result wasn't saved properly"
        );
        const expectedResultElement = await browser.$("//*[@data-test-id='testPagePassFailExpectedResultInput']");
        expect(await expectedResultElement.getText()).eq(expectedTestText);
    });
}).timeout(10000);
