import type { RunType } from 'tests';
import { ChainablePromiseArray, ChainablePromiseElement } from 'webdriverio';
import BasePage from '../base-page';

export const RUN_SUBMENU_ELEMENTS = ['All', 'Manual', 'Automated', 'Drafts', 'In progress', 'Finished'];

export const RUN_ASSIGNABLE_BUTTON_ELEMENTS = ['Add plans', 'Assign builds', 'Assign people or devices'];

export const RUN_TITLE_REGEXP = /Test Run (\d+)$/i;

export const RUN_DATE_FORMAT = 'ddd, D MMM';

export const RUN_TIME_FORMAT = 'h:mma';

class RunPage extends BasePage {
    public get manualRunTitleElement(): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//*[@data-test-id="runPageTitleInput"]`);
    }

    public get runSubMenuItems(): ChainablePromiseArray<WebdriverIO.ElementArray> {
        return browser.$$(`//*[@data-test-id="runsPageSubmenuWrapper"]//ul[contains(@id,'runs$Menu')]/li/span/.`);
    }

    public get runStartDate(): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//*[@data-test-id="rangePickerComponentStartDate"]`);
    }

    public get runStartTime(): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//*[@data-test-id="rangePickerComponentStartTime"]`);
    }

    public get runEndDate(): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//*[@data-test-id="rangePickerComponentEndDate"]`);
    }

    public get runEndTime(): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//*[@data-test-id="rangePickerComponentEndTime"]`);
    }

    public get globalNavigationRunsLink(): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//*[@data-test-id="globalNavigationRunsLink"]`);
    }

    public get runsPageNewRunButton(): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//*[@data-test-id='runsPageNewRunButton'][normalize-space()='New run']`);
    }

    public async navigateToRuns(): Promise<void> {
        return this.globalNavigationRunsLink.click();
    }

    public async createRun(type: RunType): Promise<void> {
        await this.runsPageNewRunButton.click();

        await browser.waitTillElementIsLocated(
            `//*[@data-test-id="runsPageNewRunDropdownWrapper"]//div/span[text()='${type}']`,
            30000,
            "New run dropdown doesn't have any element"
        );

        await browser.$(`//*[@data-test-id="runsPageNewRunDropdownWrapper"]//div/span[text()='${type}']`).click();

        await browser.waitTillElementIsLocated(
            "//*[text()='Run successfully created']",
            15000,
            "Run create successful notification wasn't shown"
        );
    }
}

export default new RunPage();
