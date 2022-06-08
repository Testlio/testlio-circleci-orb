import { ChainablePromiseElement } from 'webdriverio';

class Utils {
    public async waitTillElementIsLocated(
        path: string,
        timeout: number = 30000,
        timeoutMsg: string = 'Element node was not found'
    ) {
        await browser.waitUntil(() => browser.$(path).isDisplayed(), { timeout, timeoutMsg });
    }

    public findButtonWithText(text: string): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//button/span[normalize-space()='${text}']`);
    }

    public getModuleTitle(title: string): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//*[@data-test-id="pageModuleName"]//span[contains(text(),'${title}')]`);
    }

    public findByElementText(text: string): ChainablePromiseElement<WebdriverIO.Element> {
        return browser.$(`//*[text()='${text}']`);
    }
}

export default new Utils();
