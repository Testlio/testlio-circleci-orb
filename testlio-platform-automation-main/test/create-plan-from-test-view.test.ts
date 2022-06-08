import { expect } from 'chai';
import dayjs from 'dayjs';
import PlanPage from '../lib/pages/plans/plan-page';
import LoginPage from '../lib/pages/login/login-page';
import { config } from '../config';

/**
 * https://app.testlio.com/tmt/project/testlio-platform/test-cases/TEST-582
 */
describe('When in Testlio Platform and user wants to create plan from test', () => {
    let numberOfTestToSelect: number;
    let planTitle: string;

    before(async () => {
        numberOfTestToSelect = 2;
        planTitle = `Automation Plan ${dayjs().format('DDMMYYHHMMss')}`;
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
        const title = browser.getTitle();
        expect(title).to.equal('All - Tests - Testlio');
    });

    it('and select tests', async () => {
        const checkboxesToSelect: WebdriverIO.ElementArray = await PlanPage.tableRowCheckboxes;

        for (let i = 0; i < numberOfTestToSelect; i += 1) {
            const checkbox = checkboxesToSelect[i];
            const parentRow = await checkbox.$('./../../../../../..');
            await parentRow.moveTo();
            await browser.pause(1000);
            const label = await checkbox.$('./../..');
            await label.moveTo();
            await browser.pause(1000);
            await label.click();
            await browser.pause(1500);
        }
        await browser.pause(1000);
        const source: String = await browser.getPageSource();
        expect(source).contains(`${numberOfTestToSelect} tests selected`);
    });

    it('then should create new plan', async () => {
        await browser.$('//*[@data-test-id="testsPageAddToPlanButton"]//span[text()="Plan"]').click();
        await browser.pause(2000);

        const selectedTestsAmountElementSelector = '//*[@data-test-id="addToPlansModalTitle"]';

        await browser.waitTillElementIsLocated(
            selectedTestsAmountElementSelector,
            30000,
            'Add tests to plan modal is not visible'
        );

        const selectedTestsAmountElement = await browser.$(selectedTestsAmountElementSelector);

        expect(await selectedTestsAmountElement.getText()).contains(`Add these ${numberOfTestToSelect} tests to plan`);

        await browser.$("//input[@placeholder='Type to search or create a new plan...']").setValue(planTitle);
        await browser
            .$(
                `//*[@data-test-id="addToPlansModalCreateNewPlanButton"]//span[text()='Create new plan: "${planTitle}"']`
            )
            .click();

        await browser.pause(2000);

        const newPlan = await browser.$(`//*[normalize-space()='${planTitle}']`);
        newPlan.isDisplayed().then((value) => {
            expect(value).to.equal(true);
        });

        await browser.$("//*[@data-test-id='addToPlanModalPrimaryAction'][normalize-space()='Add to 1 plan']").click();

        await browser.pause(3500);
    });

    it('and plan should exist', async () => {
        await PlanPage.navigateToPlans();
        await browser.pause(3000);
        const title = await browser.getTitle();
        expect(title).to.contain(`${planTitle} - Plans - Testlio`);
    });

    it('and plan details should be filled', async () => {
        await browser
            .$('//*[@data-test-id="planPageDescriptionHeader"][normalize-space()="Plan description (empty)"]')
            .click();
        await browser
            .$('//*[@data-test-id="planPageDescriptionInputWrapper"]//textarea[@placeholder="Plan description"]')
            .setValue('created for testing purposes by automation.');

        const executionTimeLabel = await browser.$(
            '//*[@data-test-id="planPageDetailsSidebar"]//*[normalize-space()="Execution time"]'
        );
        await executionTimeLabel.moveTo();
        await executionTimeLabel.click();
        await browser.pause(2000);

        const source: String = await browser.getPageSource();
        expect(source).contains(`Plan description (6 words)`);

        const timeInput = await browser.$(
            '//*[@data-test-id="planPageDetailsSidebar"]//input[@placeholder="Select time"]'
        );
        await timeInput.click();

        const hourToSelect = await browser.$(
            "//div[@class='ant-time-picker-panel-select'][1]//li[@role='button'][normalize-space()='01']"
        );
        await hourToSelect.click();
        await browser.pause(500);
        const timeToSelect = (await browser.$$("//li[@role='button'][normalize-space()='20']"))[1];
        await browser.execute((elem) => elem.scrollIntoView(true), timeToSelect);

        await timeToSelect.click();
        await browser.pause(500);

        await executionTimeLabel.moveTo();
        await executionTimeLabel.click();
        await browser.pause(3000);
    });
}).timeout(10000);
