import BasePage from '../base-page';

export interface ILoginCredentials {
    email: string;
    password: string;
}

class LoginPage extends BasePage {
    public get emailInput() {
        return browser.$("//input[@placeholder[contains(translate(., 'email', 'EMAIL'), 'EMAIL')]]");
    }

    public get passwordInput() {
        return browser.$("//input[@placeholder[contains(translate(., 'password', 'PASSWORD'), 'PASSWORD')]]");
    }

    public get loginButton() {
        return browser.$("//button[contains(translate(., 'log in', 'LOG IN'), 'LOG IN')]");
    }

    public async open() {
        await super.open('/');
    }

    public async login(credentials: ILoginCredentials, timeout: number = 1000): Promise<void> {
        await this.emailInput.setValue(credentials.email);
        await this.passwordInput.setValue(credentials.password);
        await this.loginButton.click();
        await browser.pause(timeout);
    }
}

export default new LoginPage();
