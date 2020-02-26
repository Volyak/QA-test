const selectors = {
    genderInput: n => `#gender #gender_${n}`,
    ageSelect: `#age #age_input`,
    ageSelectOption: n => `#age #age_input option[value='${n}']`,
    officeVisitedButton: n => `#officesVisited #officesVisited_${n}`,
    lastVisitDateInput: `#lastVisited #lastVisited_input`,
    overallSatisfactionInput: n => `#OSAT #OSAT_${n}`,
    explainWhyInput: `#why #why_input`,
    timesVisitedInput: n => `#noVisited #noVisited_${n}_input`,
    officeCommuteGridInput: (n, i) => `#officeMultiGrid #officeMultiGrid_${n}_${i}`,
    officeCommuteGridLabelOther: `#officeMultiGrid #officeMultiGrid_5_other`,
    officeRateHRSInput: (n, i) => `#officeHRS #officeHRS_${n}_${i}`,
    officeRateGridBarsInput: (n, i) => `#officeGridBars #officeGridBars_${n}_${i}`,
    officeRateStarInput: (n, i) => `#officeStar #officeStar_${n}_${i}`,
    officeRateDropdownSelect: n => `#officeDropdown #officeDropdown_${n}_input`,
    officeRateDropdownOption: (n, i) => `#officeDropdown #officeDropdown_${n}_input option[value='${i}']`,
    officeDescribeCarouselCurrent: `#officeCarousel .cf-carousel__text--current`,
    officeDescribeCarouselInput: (n, i) => `#officeCarousel #officeCarousel_${n}_${i}`,
    officeDescribeCarouselText: n => `#officeCarousel #officeCarousel_${n}_carousel_text`,
    officeDescribeCarouselPaging: n => `#officeCarousel #officeCarousel_${n}_carousel_paging`,
    codeCaptureInput: `#q54 #q54_input`,
    favoriteOfficeItem: n => `#favOffice #favOffice_${n}`,
    favoriteOfficeItemRank: n => `#favOffice #favOffice_${n} .cf-ranking-answer__rank`,
    favoriteOfficePicInput: `#favPicture input#favPicture_input`,
    officesPlannedItem: n => `#officesPlanned #officesPlanned_${n}`,
    visitsPlannedInput: `#noOffices #noOffices_input`
};

const commands = {
    gender: function (index) {
        return this.click(selectors.genderInput(index))
    },
    age: function (value) {
        return this
            .click(selectors.ageSelect)
            .click(selectors.ageSelectOption(value))
    },
    visitedOffices: function (array) {
        array.forEach(n =>
            this.click(selectors.officeVisitedButton(n.id)));
        return this
    },
    lastVisitDate: function (value) {
        return this.setValue(selectors.lastVisitDateInput, value)
    },
    overallSatisfaction: function (value) {
        return this.click(selectors.overallSatisfactionInput(value));
    },
    explainWhyLowSatisfaction: function (value) {
        return this.setValue(selectors.explainWhyInput, value);
    },
    answerFirstPageMainQuestions: function (value) {
        this
            .gender(value.gender)
            .age(value.age)
            .visitedOffices(value.offices)
            .overallSatisfaction(value.OSAT);
        if (value.OSAT <= this.props.needExplainSatisfaction)
            this.explainWhyLowSatisfaction(value.someText);
        return this
    },
    answerFirstPageAllQuestions: function (value) {
        return this
            .answerFirstPageMainQuestions(value)
            .lastVisitDate(value.lastVisit)
    },
    officesVisitedTimes: function (array) {
        array.forEach(n => {
            if (n.visits)
                this.setValue(selectors.timesVisitedInput(n.id), n.visits)
        });
        return this
    },
    commuteOffices: function (array) {
        for (let i = 0; i < array.length; i++) {
            let office = array[i];
            if (office.commute) {
                for (let j = 0; j < office.commute.length; j++) {
                    this.click(selectors.officeCommuteGridInput(office.id, office.commute[j]))
                }
            }
        }
        return this
    },
    otherCommuteType: function (value) {
        return this
            .setValue(selectors.officeCommuteGridLabelOther, value)
    },
    rateInHRS: function (array) {
        array.forEach(n =>
            this.click(selectors.officeRateHRSInput(n.id, n.rate)));
        return this
    },
    rateInBars: function (array) {
        array.forEach(n =>
            this.click(selectors.officeRateGridBarsInput(n.id, n.rate)));
        return this
    },
    rateInStars: function (array) {
        array.forEach(n =>
            this.click(selectors.officeRateStarInput(n.id, n.rate)));
        return this
    },
    rateInDropdowns: function (array) {
        array.forEach(n =>
            this
                .click(selectors.officeRateDropdownSelect(n.id))
                .click(selectors.officeRateDropdownOption(n.id, n.rate))
        );
        return this
    },
    describeOffices: function (array) {
        array.forEach(n => {
            if (n.description)
                this.click(selectors.officeDescribeCarouselInput(n.id, n.description));
            else
                this.click(selectors.officeDescribeCarouselNextButton)
        });
        return this
    },
    scanCode: function (value) {
        return this
            .setValue(selectors.codeCaptureInput, value)
    },
    answerSecondPageMainQuestions: function (value) {
        return this
            .describeOffices(value.offices)
            .scanCode(value.someText)
    },
    answerSecondPageAllQuestions: function (value) {
        const {offices} = value;
        return this
            .officesVisitedTimes(offices)
            .commuteOffices(offices)
            .otherCommuteType(value.someText)
            .rateInHRS(offices)
            .rateInBars(offices)
            .rateInStars(offices)
            .rateInDropdowns(offices)
            .answerSecondPageMainQuestions(value)
    },
    favoriteOffices: function (array) {
        if (!array)
            return this;
        array.forEach(n =>
            this
                .click(selectors.favoriteOfficeItem(n)));
        return this;
    },
    uploadQuickPic: function () {
        return this
            .setValue('input[type="file"]', require('path').resolve(__dirname + '/1.png'))
    },
    officesPlannedVisited: function (array) {
        if (!array)
            return this;
        array.forEach(n =>
            this
                .click(selectors.officesPlannedItem(n)));
        return this;
    },
    plannedVisitsCount: function (value) {
        return this
            .setValue(selectors.visitsPlannedInput, value)
    },
    answerThirdPageAllQuestions: function (value) {
        return this
            .favoriteOffices(value.favoriteOffices)
            .uploadQuickPic(value)
            .officesPlannedVisited(value.plannedOffices)
            .plannedVisitsCount(value.plannedVisits)
    },
    goToSecondPage: function (value) {
        return this
            .answerFirstPageMainQuestions(value)
            .click('@next')
    },
    goToThirdPage: function (value) {
        return this
            .goToSecondPage(value)
            .answerSecondPageMainQuestions(value)
            .click('@next')
    }
};

module.exports = {
    elements: {
        next: `.cf-page__navigation .cf-navigation-next`,
        back: `.cf-page__navigation .cf-navigation-back`,
        genderForm: `#gender`,
        ageForm: `#age`,
        officeVisitedForm: `#officesVisited`,
        lastVisitForm: `#lastVisited`,
        overallSatisfactionForm: `#OSAT`,
        explainWhyForm: `#why`,
        timesVisitedForm: `#noVisited`,
        timesVisitedSum: `#noVisited .cf-numeric-list-auto-sum`,
        officeCommuteGrid: `#officeMultiGrid`,
        officeRateHRS: `#officeHRS`,
        officeRateGridBars: `#officeGridBars`,
        officeRateStar: `#officeStar`,
        officeRateDropdown: `#officeDropdown`,
        officeDescribeCarousel: `#officeCarousel`,
        officeDescribeCarouselBack: `#officeCarousel .cf-carousel__navigation-button--back`,
        officeDescribeCarouselNext: `#officeCarousel .cf-carousel__navigation-button--next`,
        codeCaptureForm: `#q54`,
        favoriteOfficeForm: `#favOffice`,
        favoriteOfficePicForm: `#favPicture`,
        officesPlannedForm: `#officesPlanned`,
        visitsPlannedForm: `#noOffices`
    },
    props: {
        needExplainSatisfaction: 3,
        maxPlannedVisits: 99
    },
    commands: [commands, selectors]
};
/*
const SELECTORS

const commands

module.export = {
    SELECTORS = SELECTORS,

    commands: [commands]

    elements: {
        element : {
            selector: SELECTORS.selectorName
        }
    }
}
 */