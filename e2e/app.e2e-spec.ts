import { scPage } from './app.po';

describe('abp-zero-template App', function () {
    let page: scPage;

    beforeEach(() => {
        page = new scPage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        page.getCopyright().then(value => {
            expect(value).toEqual(new Date().getFullYear() + ' © sc.');
        });
    });
});
