module.exports = {
    '@tags': ['firstPage'],
    beforeEach: function(browser){
        browser.url('https://survey.testlab.firmglobal.net/wix/56789/p8637169.aspx')
    },
    after: function(browser) {
        browser.end()
    },
    answers : {
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

    'First page questions represented': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .assert.visible('@genderForm')
            .assert.visible('@ageForm')
            .assert.visible('@officeVisitedForm')
            .assert.visible('@lastVisitForm')
            .assert.visible('@overallSatisfactionForm')
            .assert.visible('@explainWhyForm')
            .assert.not.elementPresent(page.explainWhyInput)
    },

    'Last visit date is limited': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .lastVisitDate('01.01.2021')
            .assert.visible('#lastVisited_error')
    },

    'If OSAT < 4 present why input ': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .assert.not.elementPresent(page.explainWhyInput)
            .overallSatisfaction(3)
            .assert.elementPresent(page.explainWhyInput)
    },

    'If OSAT > 3 dont present why input': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .assert.not.elementPresent(page.explainWhyInput)
            .overallSatisfaction(4)
            .assert.not.elementPresent(page.explainWhyInput)
    },

    'First page shows error messages for empty main questions': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .assert.not.visible(`#gender_error`)
            .assert.not.visible(`#age_error`)
            .assert.not.visible(`#officesVisited_error`)
            .assert.not.visible(`#lastVisited_error`)
            .assert.not.visible(`#OSAT_error`)
            .assert.not.elementPresent(`#why_error`)
            .click('@next')
            .assert.visible(`#gender_error`)
            .assert.visible(`#age_error`)
            .assert.visible(`#officesVisited_error`)
            .assert.not.visible(`#lastVisited_error`)
            .assert.visible(`#OSAT_error`)
            .assert.not.elementPresent(`#why_error`)
            .overallSatisfaction(3)
            .pause(500)
            .click('@next')
            .assert.not.visible(`#lastVisited_error`)
            .assert.visible(`#why_error`)
    },

    'First page hides error messages after answer': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .click('@next')
            .assert.visible(`#gender_error`)
            .assert.visible(`#age_error`)
            .assert.visible(`#officesVisited_error`)
            .assert.not.visible(`#lastVisited_error`)
            .assert.visible(`#OSAT_error`)
            .pause(500)
            .answerFirstPageMainQuestions(this.answers)
            .assert.not.visible(`#gender_error`)
            .assert.not.visible(`#age_error`)
            .assert.not.visible(`#officesVisited_error`)
            .assert.not.visible(`#lastVisited_error`)
            .assert.not.visible(`#OSAT_error`)
            .assert.not.visible(`#why_error`);
    }
};