module.exports = {
    '@tags': ['thirdPage'],

    beforeEach: function (browser) {
        browser.url('https://survey.testlab.firmglobal.net/wix/56789/p8637169.aspx')
    },
    after: function (browser) {
        browser.end()
    },
    answers: {
        gender: 1,
        age: 1,
        offices: [
            {id: 1, text: 'Grimstad', visits: 1, commute: [1, 2], description: 1, rate: 1},
            {id: 2, text: 'London', visits: 2, commute: [2, 3,], description: 2, rate: 2},
            {id: 3, text: 'Moscow', visits: 3, commute: [3, 4], description: 3, rate: 3},
            {id: 4, text: 'Yaroslavl', visits: 4, commute: [4, 5], description: 4, rate: 4},
            {id: 5, text: 'Oslo', visits: 5, commute: [6], description: 5, rate: 5},
            {id: 6, text: 'New York', visits: 6, commute: [1, 3, 4], description: 6, rate: 6},
            {id: 7, text: 'Emeryville', visits: 7, commute: [2, 3, 4], description: 5, rate: 7},
            {id: 8, text: 'Vancouver', visits: 8, commute: [2, 4], description: 4, rate: 8},
            {id: 9, text: 'Sydney', visits: 9, commute: [4], description: 3, rate: 9}
        ],
        lastVisit: '02.03.2020',
        OSAT: 3,
        someText: 'some Text',
        favoriteOffices: [4, 1, 2, 3, 5, 6, 7, 8, 9],
        plannedOffices: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        plannedVisits: 99
    },

    'Third page questions represented': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .goToThirdPage(this.answers)
            .assert.visible('@favoriteOfficeForm')
            .assert.visible('@favoriteOfficePicForm')
            .assert.visible('@officesPlannedForm')
            .assert.visible('@visitsPlannedForm')
    },
    '[FavoriteOffices] ranking works OK': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .goToThirdPage(this.answers)
            .assert.not.cssClassPresent(page.favoriteOfficeItem(1), 'cf-ranking-answer--selected')
            .assert.not.cssClassPresent(page.favoriteOfficeItem(2), 'cf-ranking-answer--selected')
            .assert.not.cssClassPresent(page.favoriteOfficeItem(3), 'cf-ranking-answer--selected')
            .assert.not.cssClassPresent(page.favoriteOfficeItem(4), 'cf-ranking-answer--selected')
            .assert.not.cssClassPresent(page.favoriteOfficeItem(5), 'cf-ranking-answer--selected')
            .assert.not.cssClassPresent(page.favoriteOfficeItem(6), 'cf-ranking-answer--selected')
            .assert.not.cssClassPresent(page.favoriteOfficeItem(7), 'cf-ranking-answer--selected')
            .assert.not.cssClassPresent(page.favoriteOfficeItem(8), 'cf-ranking-answer--selected')
            .assert.not.cssClassPresent(page.favoriteOfficeItem(9), 'cf-ranking-answer--selected');
        page.expect.element(page.favoriteOfficeItemRank(1)).text.equal('-');
        page.expect.element(page.favoriteOfficeItemRank(2)).text.equal('-');
        page.expect.element(page.favoriteOfficeItemRank(3)).text.equal('-');
        page.expect.element(page.favoriteOfficeItemRank(4)).text.equal('-');
        page.expect.element(page.favoriteOfficeItemRank(5)).text.equal('-');
        page.expect.element(page.favoriteOfficeItemRank(6)).text.equal('-');
        page.expect.element(page.favoriteOfficeItemRank(7)).text.equal('-');
        page.expect.element(page.favoriteOfficeItemRank(8)).text.equal('-');
        page.expect.element(page.favoriteOfficeItemRank(9)).text.equal('-');

        page
            .favoriteOffices(this.answers.favoriteOffices)
            .assert.cssClassPresent(page.favoriteOfficeItem(1), 'cf-ranking-answer--selected')
            .assert.cssClassPresent(page.favoriteOfficeItem(2), 'cf-ranking-answer--selected')
            .assert.cssClassPresent(page.favoriteOfficeItem(3), 'cf-ranking-answer--selected')
            .assert.cssClassPresent(page.favoriteOfficeItem(4), 'cf-ranking-answer--selected')
            .assert.cssClassPresent(page.favoriteOfficeItem(5), 'cf-ranking-answer--selected')
            .assert.cssClassPresent(page.favoriteOfficeItem(6), 'cf-ranking-answer--selected')
            .assert.cssClassPresent(page.favoriteOfficeItem(7), 'cf-ranking-answer--selected')
            .assert.cssClassPresent(page.favoriteOfficeItem(8), 'cf-ranking-answer--selected')
            .assert.cssClassPresent(page.favoriteOfficeItem(9), 'cf-ranking-answer--selected');
        page.expect.element(page.favoriteOfficeItemRank(1)).text.equal('2');
        page.expect.element(page.favoriteOfficeItemRank(2)).text.equal('3');
        page.expect.element(page.favoriteOfficeItemRank(3)).text.equal('4');
        page.expect.element(page.favoriteOfficeItemRank(4)).text.equal('1');
        page.expect.element(page.favoriteOfficeItemRank(5)).text.equal('5');
        page.expect.element(page.favoriteOfficeItemRank(6)).text.equal('6');
        page.expect.element(page.favoriteOfficeItemRank(7)).text.equal('7');
        page.expect.element(page.favoriteOfficeItemRank(8)).text.equal('8');
        page.expect.element(page.favoriteOfficeItemRank(9)).text.equal('9');
    },

    '[QuickPic] image upload works OK': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .goToThirdPage(this.answers)
            .assert.not.elementPresent(`#favPicture .cf-image-upload-answer__preview-image`)
            .uploadQuickPic()
            .assert.elementPresent(`#favPicture .cf-image-upload-answer__preview-image`)
    },

    '[PlannedVisits] numeric has limit 100': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .goToThirdPage(this.answers)
            .assert.not.elementPresent(`#noOffices_error_list .cf-error-list__item`)
            .plannedVisitsCount(100)
            .click('@next')
            .assert.elementPresent(`#noOffices_error_list .cf-error-list__item`)
            .clearValue(page.visitsPlannedInput)
            .plannedVisitsCount(99)
            .click('@next')
            .assert.visible('#Internal_Finished')
    }
};