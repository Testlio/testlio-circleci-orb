import BasePage from '../base-page';

class PlanPage extends BasePage {
    public get planLink() {
        return browser.$('//*[@data-test-id="globalNavigationPlansLink"]');
    }

    public get tableRowCheckboxes() {
        return browser.$$(
            "//*[contains(@class,'ant-table-row')]//*[contains(@class,'Table_selectionColumn')]//*[@type='checkbox']"
        );
    }

    public async navigateToPlans(): Promise<void> {
        return this.planLink.click();
    }
}

export default new PlanPage();
