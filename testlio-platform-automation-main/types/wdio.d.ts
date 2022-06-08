declare namespace WebdriverIO {
    interface Browser {
        waitTillElementIsLocated: (path: string, timeout: number, timeoutMsg: string) => Promise<void>;
        findButtonWithText: (text: string) => Promise<WebdriverIO.Element>;
        getModuleTitle: (title: string) => Promise<WebdriverIO.Element>;
        findByElementText: (text: string) => Promise<WebdriverIO.Element>;
    }
}
