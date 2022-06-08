import type { IRegressionTest, PlatformType } from 'tests';
import { ChainablePromiseElement } from 'webdriverio';
import BasePage from '../base-page';

class TestPage extends BasePage {
    public get testPageType(): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//*[@data-test-id="testPageDetailsTestType"]`);
    }

    public get testTitle(): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$("//*[@data-test-id='testPageTitleTextarea'][@placeholder='What should the tester test?']");
    }

    public async create(data: IRegressionTest, timeout: number = 1000): Promise<void> {
        await this.setTestTitle(data.title);

        // set platform type
        await this.setPlatformType(data.platform);

        // set execution time
        await this.setExecutionTime(data.execution);

        // set automated option
        await this.setAutomatedOption(data.automated);

        // add steps
        if (data.step && data.expected) {
            await this.addSteps(data.step, data.expected);
        }

        await browser.pause(timeout);
    }

    protected async setTestTitle(title: string) {
        return this.testTitle.setValue(title);
    }

    protected async setPlatformType(type: PlatformType) {
        const platformTypeButton = await browser.findByElementText('No platforms selected');
        await platformTypeButton.click();
        await browser.pause();

        return browser
            .$(
                `//*[@data-test-id='testPageDetailsPlatformSelectWrapper']//td[text()='${type}']//preceding-sibling::td//input[contains(@type, 'checkbox')]`
            )
            .click();
    }

    protected async setExecutionTime(time: number) {
        await browser
            .$(
                `//*[@data-test-id="testPageDetailsTestExecutionTime"]//label[text()='Execution time']//following-sibling::div`
            )
            .click();
        await browser.pause(300);

        return browser
            .$(
                `//*[@data-test-id="testPageDetailsTestExecutionTime"]//label[text()='Execution time']//following-sibling::div//input`
            )
            .setValue(time);
    }

    protected async setAutomatedOption(value: string) {
        const automatedLabel: WebdriverIO.Element = await browser.$(
            `//*[@data-test-id="testPageDetailsTestAutomated"]//label[text()='Automated']`
        );
        const automatedButton: WebdriverIO.Element = await browser.$(
            `//*[@data-test-id="testPageDetailsTestAutomated"]//label[text()='Automated']//following-sibling::button`
        );

        await automatedLabel.moveTo(); // moving to the label should give time for surrounding tooltip to disappear
        await automatedLabel.click();
        await browser.pause(1000);
        await automatedButton.click();
        await browser.pause(1000);
        // value here could be 'Yes' or 'No'
        return browser.$(`//*[@data-test-id="testPageDetailsTestAutomationTypeDropdown${value}"]`).click();
    }

    protected async addSteps(description: string, expectation: string) {
        const automatedLabel: WebdriverIO.Element = await browser.$(
            `//*[@data-test-id="testPageDetailsTestAutomated"]//label[text()='Automated']`
        );
        await browser.$('Add step').click();
        await browser.pause(500);
        await browser.$(`//*[@placeholder='Describe new step...']`).setValue(description);
        // describe step expected result
        await browser.pause(600);
        // somewhere on the screen so the step get saved
        await automatedLabel.moveTo();
        await automatedLabel.click();

        await browser.pause(1500);
        await browser.$(`//*[@data-test-id="testPagePassFailExpectedResultInput"]//textarea`).setValue(expectation);
        await browser.pause(300);

        await automatedLabel.moveTo();
        return automatedLabel.click();
    }
}

export default new TestPage();
