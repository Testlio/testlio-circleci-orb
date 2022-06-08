export default class BasePage {
    private readonly timeout: number = 1000;

    open(path: string) {
        browser.url(path);
    }
}
