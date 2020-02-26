module.exports = {
    '@tags': ['secondPage'],

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

    'Second page questions represented': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .assert.visible('@timesVisitedForm')
            .assert.visible('@officeCommuteGrid')
            .assert.visible('@officeRateHRS')
            .assert.visible('@officeRateGridBars')
            .assert.visible('@officeRateStar')
            .assert.visible('@officeRateDropdown')
            .assert.visible('@officeDescribeCarousel')
            .assert.visible('@codeCaptureForm')
    },

    '[TimesVisited] auto sum works OK': function (browser) {
        const page = browser.page.surveyPage();
        let sum = 0;

        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .assert.containsText('@timesVisitedSum', sum.toString())
            .officesVisitedTimes(this.answers.offices);
        this.answers.offices.forEach(n =>
            sum += n.visits
        );
        page
            .assert.containsText('@timesVisitedSum', sum.toString())
    },

    '[TimesVisited] auto sum doesnt work with negative numbers': function (browser) {
        const page = browser.page.surveyPage();
        let negative = this.answers.offices[0];
        negative.visits = -1;
        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .assert.containsText('@timesVisitedSum', '0')
            .officesVisitedTimes([negative])
            .assert.containsText('@timesVisitedSum', '0')
    },

    '[CommuteGrid] NA exclude other answers': function (browser) {
        const page = browser.page.surveyPage();
        const office = {id: 1, commute: [1, 2, 3, 4, 5]};

        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .commuteOffices([office])
            .assert.cssClassPresent(page.officeCommuteGridInput(1, 1), 'cf-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeCommuteGridInput(1, 2), 'cf-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeCommuteGridInput(1, 3), 'cf-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeCommuteGridInput(1, 4), 'cf-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeCommuteGridInput(1, 5), 'cf-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeCommuteGridInput(1, 6), 'cf-grid-answer__scale-item--selected')
            .click(page.officeCommuteGridInput(1, 6))
            .assert.not.cssClassPresent(page.officeCommuteGridInput(1, 1), 'cf-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeCommuteGridInput(1, 2), 'cf-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeCommuteGridInput(1, 3), 'cf-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeCommuteGridInput(1, 4), 'cf-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeCommuteGridInput(1, 5), 'cf-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeCommuteGridInput(1, 6), 'cf-grid-answer__scale-item--selected')
    },

    '[CommuteGrid] if other selected then description is necessary': function (browser) {
        const page = browser.page.surveyPage();

        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .answerSecondPageMainQuestions(this.answers)
            .commuteOffices([
                {id: 1, commute: [5]}
            ])
            .assert.cssClassPresent(page.officeCommuteGridInput(1, 5), 'cf-grid-answer__scale-item--selected')
            .assert.not.elementPresent('#officeMultiGrid #officeMultiGrid_5_other_error_list')
            .click('@next')
            .assert.visible('@officeCommuteGrid')
            .assert.cssClassPresent(page.officeCommuteGridInput(1, 5), 'cf-grid-answer__scale-item--selected')
            .assert.elementPresent('#officeMultiGrid #officeMultiGrid_5_other_error_list')
    },

    '[RateBars] NA exclude answer': function (browser) {
        const page = browser.page.surveyPage();

        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 1), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 2), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 3), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 4), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 5), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 6), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 7), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 8), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 9), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 10), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 11), 'cf-gb-grid-answer__na-item--selected')
            .rateInBars([
                {id: 1, rate: 10}
            ])
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 1), 'cf-gb-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 2), 'cf-gb-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 3), 'cf-gb-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 4), 'cf-gb-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 5), 'cf-gb-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 6), 'cf-gb-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 7), 'cf-gb-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 8), 'cf-gb-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 9), 'cf-gb-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 10), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 11), 'cf-gb-grid-answer__na-item--selected')
            .rateInBars([
                {id: 1, rate: 11}
            ])
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 1), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 2), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 3), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 4), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 5), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 6), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 7), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 8), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 9), 'cf-gb-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateGridBarsInput(1, 10), 'cf-gb-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateGridBarsInput(1, 11), 'cf-gb-grid-answer__na-item--selected')
    },

    '[RateStars] NA exclude answer': function (browser) {
        const page = browser.page.surveyPage();

        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 1), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 2), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 3), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 4), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 5), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 6), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 7), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 8), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 9), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 10), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 11), 'cf-sr-grid-answer__na-item--selected')
            .rateInStars([
                {id: 1, rate: 10}
            ])
            .assert.cssClassPresent(page.officeRateStarInput(1, 1), 'cf-sr-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateStarInput(1, 2), 'cf-sr-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateStarInput(1, 3), 'cf-sr-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateStarInput(1, 4), 'cf-sr-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateStarInput(1, 5), 'cf-sr-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateStarInput(1, 6), 'cf-sr-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateStarInput(1, 7), 'cf-sr-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateStarInput(1, 8), 'cf-sr-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateStarInput(1, 9), 'cf-sr-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateStarInput(1, 10), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 11), 'cf-sr-grid-answer__na-item--selected')
            .rateInStars([
                {id: 1, rate: 11}
            ])
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 1), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 2), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 3), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 4), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 5), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 6), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 7), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 8), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 9), 'cf-sr-grid-answer__scale-item--selected')
            .assert.not.cssClassPresent(page.officeRateStarInput(1, 10), 'cf-sr-grid-answer__scale-item--selected')
            .assert.cssClassPresent(page.officeRateStarInput(1, 11), 'cf-sr-grid-answer__na-item--selected')
    },

    '[DescribeOffices] carusel works OK': function (browser) {
        const page = browser.page.surveyPage();

        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .assert.cssClassPresent('@officeDescribeCarouselBack', 'cf-carousel__navigation-button--disabled')
            .assert.not.cssClassPresent('@officeDescribeCarouselNext', 'cf-carousel__navigation-button--disabled')
            .assert.cssClassPresent(page.officeDescribeCarouselText(1), 'cf-carousel__text--current')
            .assert.not.cssClassPresent(page.officeDescribeCarouselText(2), 'cf-carousel__text--current')
            .assert.cssClassPresent(page.officeDescribeCarouselPaging(1), 'cf-carousel__paging-item--current')
            .assert.not.cssClassPresent(page.officeDescribeCarouselPaging(1), 'cf-carousel__paging-item--complete')
            .assert.not.cssClassPresent(page.officeDescribeCarouselPaging(1), 'cf-carousel__paging-item--error')
            .assert.not.cssClassPresent(page.officeDescribeCarouselPaging(2), 'cf-carousel__paging-item--current')
            .assert.not.cssClassPresent(page.officeDescribeCarouselInput(1, 1), 'cf-answer-button--selected')
            .assert.not.elementPresent(`#officeCarousel_1_error_list li.cf-error-list__item`)
            .assert.not.elementPresent(`#officeCarousel_2_error_list li.cf-error-list__item`)
            .describeOffices([
                {id:1, description: 1}
            ])
            .assert.not.cssClassPresent('@officeDescribeCarouselBack', 'cf-carousel__navigation-button--disabled')
            .assert.not.cssClassPresent('@officeDescribeCarouselNext', 'cf-carousel__navigation-button--disabled')
            .assert.not.cssClassPresent(page.officeDescribeCarouselText(1), 'cf-carousel__text--current')
            .assert.cssClassPresent(page.officeDescribeCarouselText(2), 'cf-carousel__text--current')
            .assert.not.cssClassPresent(page.officeDescribeCarouselPaging(1), 'cf-carousel__paging-item--current')
            .assert.cssClassPresent(page.officeDescribeCarouselPaging(1), 'cf-carousel__paging-item--complete')
            .assert.not.cssClassPresent(page.officeDescribeCarouselPaging(1), 'cf-carousel__paging-item--error')
            .assert.cssClassPresent(page.officeDescribeCarouselPaging(2), 'cf-carousel__paging-item--current')
            .assert.cssClassPresent(page.officeDescribeCarouselInput(1, 1), 'cf-answer-button--selected')
            .assert.not.elementPresent(`#officeCarousel_1_error_list li.cf-error-list__item`)
            .assert.not.elementPresent(`#officeCarousel_2_error_list li.cf-error-list__item`)
            .click('@next')
            .assert.not.cssClassPresent('@officeDescribeCarouselBack', 'cf-carousel__navigation-button--disabled')
            .assert.not.cssClassPresent('@officeDescribeCarouselNext', 'cf-carousel__navigation-button--disabled')
            .assert.not.cssClassPresent(page.officeDescribeCarouselText(1), 'cf-carousel__text--current')
            .assert.cssClassPresent(page.officeDescribeCarouselText(2), 'cf-carousel__text--current')
            .assert.not.cssClassPresent(page.officeDescribeCarouselPaging(1), 'cf-carousel__paging-item--current')
            .assert.cssClassPresent(page.officeDescribeCarouselPaging(1), 'cf-carousel__paging-item--complete')
            .assert.not.cssClassPresent(page.officeDescribeCarouselPaging(1), 'cf-carousel__paging-item--error')
            .assert.cssClassPresent(page.officeDescribeCarouselPaging(2), 'cf-carousel__paging-item--current')
            .assert.not.cssClassPresent(page.officeDescribeCarouselPaging(2), 'cf-carousel__paging-item--complete')
            .assert.cssClassPresent(page.officeDescribeCarouselPaging(2), 'cf-carousel__paging-item--error')
            .assert.cssClassPresent(page.officeDescribeCarouselInput(1, 1), 'cf-answer-button--selected')
            .assert.not.elementPresent(`#officeCarousel_1_error_list li.cf-error-list__item`)
            .assert.elementPresent(`#officeCarousel_2_error_list li.cf-error-list__item`)
    },

    '[CodeScan] has limit 100 symbols': function (browser) {
        const page = browser.page.surveyPage(),
            code = '11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';

        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .expect.element(page.codeCaptureInput).value.equals("");
        page
            .scanCode(code)
            .expect.element(page.codeCaptureInput).value.not.equals(code);
    },


    'Second page shows error messages for empty main questions': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .assert.not.visible(`#noVisited_error`)
            .assert.not.visible(`#officeMultiGrid_error`)
            .assert.not.visible(`#officeHRS_error`)
            .assert.not.visible(`#officeGridBars_error`)
            .assert.not.visible(`#officeStar_error`)
            .assert.not.visible(`#officeDropdown_error`)
            .assert.not.elementPresent(`#officeCarousel li.cf-error-list__item`)
            .assert.not.visible(`#q54_error`)
            .click('@next')
            .assert.not.visible(`#noVisited_error`)
            .assert.not.visible(`#officeMultiGrid_error`)
            .assert.not.visible(`#officeHRS_error`)
            .assert.not.visible(`#officeGridBars_error`)
            .assert.not.visible(`#officeStar_error`)
            .assert.not.visible(`#officeDropdown_error`)
            .assert.elementPresent(`#officeCarousel li.cf-error-list__item`)
            .assert.visible(`#q54_error`)
    },

    'Second page hides error messages after answer': function (browser) {
        const page = browser.page.surveyPage();
        page
            .waitForElementVisible('body')
            .goToSecondPage(this.answers)
            .click('@next')
            .assert.not.visible(`#noVisited_error`)
            .assert.not.visible(`#officeMultiGrid_error`)
            .assert.not.visible(`#officeHRS_error`)
            .assert.not.visible(`#officeGridBars_error`)
            .assert.not.visible(`#officeStar_error`)
            .assert.not.visible(`#officeDropdown_error`)
            .assert.elementPresent(`#officeCarousel li.cf-error-list__item`)
            .assert.visible(`#q54_error`)
            .answerSecondPageMainQuestions(this.answers)
            .assert.not.elementPresent(`#officeCarousel li.cf-error-list__item`)
            .assert.not.visible(`#q54_error`)
    }
};