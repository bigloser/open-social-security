  export class claimingSolution {
    maritalStatus: string
    benefitType: string //retirementAlone, retirementReplacingSpousal, spousalAlone, spousalWithRetirement, survivor
    person: string //spouseA or spouseB
    date: Date
    benefitAmount: number
    ageYears: number
    ageMonths: number
    message: string //build one of messages below

    constructor(maritalStatus: string, typeOfBenefit:string, person:string, date:Date, benefitAmount: number, ageYears:number, ageMonths:number){
        this.maritalStatus = maritalStatus
        this.benefitType = typeOfBenefit
        this.person = person
        this.date = date
        this.benefitAmount = benefitAmount
        this.ageYears = ageYears
        this.ageMonths = ageMonths
        if (this.person == "spouseA") {
          if (this.benefitType == "retirementAlone"){
            this.message = "You file for your retirement benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months. (Monthly benefit: " +
            this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) + ")"
          }
          if (this.benefitType == "retirementReplacingSpousal") {
            this.message = "You file for your retirement benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months. (Monthly benefit: " +
            this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) + ", replacing your spousal benefit)"
          }
          if (this.benefitType == "spousalAlone") {
            this.message = "You file for your spousal benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months. (Monthly benefit: " +
            this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) + ")"
          }
          if (this.benefitType == "spousalWithRetirement") {
            this.message = "You file for your spousal benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months. (Monthly benefit: " +
            this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) + ", in addition to your monthly retirement benefit)"
          }
          if (this.benefitType == "survivor" && this.maritalStatus == "married") {
            this. message = "If you outlive your spouse, your total benefit (including survivor benefit) would be " +
            this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) +
           " per month -- assuming you wait at least until your full retirement age to file for that survivor benefit."
          }
          if (this.benefitType == "survivor" && this.maritalStatus == "divorced") {
            this. message = "If you outlive your ex-spouse, your total benefit (including survivor benefit) would be " +
            this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) +
           " per month -- assuming you wait at least until your full retirement age to file for that survivor benefit."
          }
        }
        if (this.person == "spouseB") {
          if (this.benefitType == "retirementAlone"){
            this.message = "Your spouse files for his/her retirement benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months. (Monthly benefit: " +
            this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) + ")"
          }
          if (this.benefitType == "retirementReplacingSpousal") {
            this.message = "Your spouse files for his/her retirement benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months. (Monthly benefit: " +
            this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) + ", replacing his/her spousal benefit)"
          }
          if (this.benefitType == "spousalAlone") {
            this.message = "Your spouse files for his/her spousal benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months. (Monthly benefit: " +
            this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) + ")"
          }
          if (this.benefitType == "spousalWithRetirement") {
            this.message = "Your spouse files for his/her spousal benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months. (Monthly benefit: " +
            this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) + ", in addition to his/her monthly retirement benefit)"
          }
          if (this.benefitType == "survivor" && this.maritalStatus == "married") {
           this.message = "If your spouse outlives you, his/her total benefit (including survivor benefit) would be " +
           this.benefitAmount.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits:0, maximumFractionDigits:0}) +
           " per month -- assuming he/she waits at least until full retirement age to file for that survivor benefit."
          }
        }
    }
  }

/*
"You should file for your retirement benefit to begin 4/2023, at age 63 and 6 months. (Monthly benefit: $800)"
"You should file for your spousal benefit to begin 4/2023, at age 63 and 6 months. (Monthly benefit: $800, in addition to your monthly retirement benefit)"
"You should file for your spousal benefit to begin 4/2023, at age 66. (Monthly benefit: $800)" <--- restricted app
"You should file for your retirement benefit to begin 4/2023, at age 70. (Monthly benefit: $800, replacing your spousal benefit)"

"Your spouse should file for his/her retirement benefit to begin 4/2023, at age 63 and 6 months. (Monthly benefit: $800)"
"Your spouse should file for his/her spousal benefit to begin 4/2023, at age 63 and 6 months. (Monthly benefit: $800, in addition to his/her monthly retirement benefit)"
"Your spouse should file for his/her spousal benefit to begin 4/2023, at age 66. (Monthly benefit: $800)" <--- restricted app
"Your spouse should file for his/her retirement benefit to begin 4/2023, at age 70. (Monthly benefit: $800, replacing his/her spousal benefit)"

"In the event that you predecease your spouse, he/she will be able to file for a survivor benefit. In combination with his/her retirement benefit, your surviving spouse would then receive a total of $800 per month -- assuming he/she waits at least until full retirement age to file for that survivor benefit."
"In the event that your spouse predeceases you, you will be able to file for a survivor benefit. In combination with your retirement benefit, you would then receive a total of $800 per month -- assuming you wait at least until your full retirement age to file for that survivor benefit."

Build an array of these objects, then just access the message field in the HTML?
*/