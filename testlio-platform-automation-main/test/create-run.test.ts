import { expect } from 'chai';
import { URL } from 'url';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import RunPage, {
    RUN_ASSIGNABLE_BUTTON_ELEMENTS,
    RUN_DATE_FORMAT,
    RUN_SUBMENU_ELEMENTS,
    RUN_TIME_FORMAT
} from '../lib/pages/runs/run-page';
import { config } from '../config';
import { EnumRunTypes } from '../types/enum';
import LoginPage from '../lib/pages/login/login-page';
import PlanPage from '../lib/pages/plans/plan-page';

dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Tallinn');

/**
 * https://app.testlio.com/tmt/project/testlio-platform/test-cases/TEST-582
 */
describe('When in Testlio Platform and user wants to create manual run from test', () => {
    let runTitle: string;

    before(async () => {
        runTitle = `Automation Run ${dayjs().format('DDMMYYHHMMss')}`;
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

        expect(await heading.isDisplayed()).to.equal(true);
    });

    it('and should open list of runs', async () => {
        await PlanPage.navigateToPlans();

        await browser.waitTillElementIsLocated(
            "//*[@data-test-id='runsPageTitleWrapper']//*[contains(text(),'All runs')]",
            30000,
            "'All runs' title wasn't found"
        );

        const title = await browser.getTitle();
        expect(title).to.equal('Runs - Testlio');

        const moduleTitle: WebdriverIO.Element = await browser.getModuleTitle('Runs');
        expect(await moduleTitle.getText()).to.equal('Runs');
    });

    it('and should have list of all possible run sub-items', async () => {
        const runsSubMenuSelector = "//main//aside//ul[@id='runs$Menu']";
        const runsBlockItems = await browser.$(runsSubMenuSelector).$$('span');

        expect(
            await Promise.all(
                runsBlockItems.map(async (element) => {
                    const text = await element.getText();

                    return text;
                })
            )
        ).deep.equal(RUN_SUBMENU_ELEMENTS);

        const getAllRunsMenuElement = await browser.$(runsSubMenuSelector).$("//*[text()='All']/parent::*");

        expect(await getAllRunsMenuElement.getCSSProperty('backgroundColor')).to.equal('rgba(168, 194, 255, 0.15)');
    });

    it('and should be able to create a manual run', async () => {
        await RunPage.createRun(EnumRunTypes.Manual);

        await browser.waitTillElementIsLocated(
            "//*[@data-test-id='runStatusBadge']//*[text()='Draft']",
            30000,
            "Run status badge wasn't found"
        );

        // assert that Run name which is by default "Test Run {n}",
        // should have 'n' matching the number in the url ".../runs/n"
        const runTitleElement = await RunPage.manualRunTitleElement;
        const pageUrl = await browser.getUrl();
        const url = new URL(pageUrl);
        const runNumber = url.pathname.split('/').pop();

        const runName = await runTitleElement.getText();

        expect(runName.includes(`Test Run ${<string>runNumber}`)).to.equal(true);

        // assert that all assignable button are disabled except 'Add plans'
        expect(
            await Promise.all(
                RUN_ASSIGNABLE_BUTTON_ELEMENTS.map(async (element) => {
                    const button = await browser.findButtonWithText(element);

                    const disabledAttribute = await button.$('./..').getAttribute('disabled');

                    return disabledAttribute;
                })
            )
        ).deep.equal([null, null, 'true']);

        // assert date range is has expected where it starts the following day of creation
        // and following hour of creation hour by default
        const expectedStartDateBase = dayjs().add(1, 'day');
        const expectedEndDateBase = dayjs().add(2, 'day');

        const startDate = await RunPage.runStartDate;
        expect(await startDate.getText()).to.equal(expectedStartDateBase.format(RUN_DATE_FORMAT));

        const startHour = await RunPage.runStartTime;
        expect(await startHour.getText(), "Start time doesn't match").to.equal(
            expectedStartDateBase.startOf('hour').add(1, 'hour').format(RUN_TIME_FORMAT)
        );

        const endDate = await RunPage.runEndDate;
        expect(await endDate.getText()).to.equal(expectedEndDateBase.format(RUN_DATE_FORMAT));

        const endHour = await RunPage.runEndTime;
        expect(await endHour.getText(), "End time doesn't match").to.equal(
            expectedEndDateBase.startOf('hour').add(1, 'hour').format(RUN_TIME_FORMAT)
        );
    });

    it('and should able to rename a run', async () => {
        const runName = await RunPage.manualRunTitleElement;
        await runName.click();
        await runName.clearValue();
        await runName.setValue(runTitle);
        await browser.keys('Enter');
        expect(await runName.getText()).to.equal(runTitle);

        await browser.waitTillElementIsLocated(
            "//*[text()='Run title was successfully updated.']",
            30000,
            "Run title update successful notification wasn't shown"
        );
    });

    it('and should able to add instructions', async () => {
        const addInstructionsButton = await browser.$("//*[@data-test-id='runPageDetailsInstructionsText']");
        await addInstructionsButton.click();

        await browser.waitTillElementIsLocated(
            "//*[@data-test-id='runPageInstructionModalWrapper']",
            10000,
            'Run instructions modal title not found'
        );

        await browser.$('*=Write').click();

        // should see textarea once write is clicked
        const instructionTextareaSelector =
            '//*[@data-test-id="runPageInstructionModalBody"]//textarea[@placeholder="Add instructions..."]';
        await browser.waitTillElementIsLocated(
            instructionTextareaSelector,
            30000,
            'Run instructions textarea not found'
        );
        const instructionTextarea = await browser.$(instructionTextareaSelector);
        await instructionTextarea.setValue('Created by automation');

        await browser.$('*=Preview').click();

        // should see p tag with written text after preview clicked
        await browser.waitTillElementIsLocated(
            `//p[normalize-space()='Created by automation']`,
            30000,
            'Instructions holder text not found'
        );

        const instructionSaveButtonSelector = "//*[@data-test-id='runPageInstructionModalPrimaryAction']";
        await browser.waitTillElementIsLocated(
            instructionSaveButtonSelector,
            30000,
            'Run instructions modal save button not found'
        );
        const instructionSaveButton = await browser.$(instructionSaveButtonSelector);
        expect(await instructionSaveButton.isEnabled()).to.eq(true);

        await instructionSaveButton.click();
        await browser.waitTillElementIsLocated(
            "//*[@data-test-id='runPageDetailsInstructionsText']//*[text()='Created by automation']",
            30000,
            'Run instructions not saved or not visible on the Run page'
        );
    });
}).timeout(10000);
