import { Person } from "./person"
import {MonthYearDate} from "./monthyearDate"

  export class ClaimingSolution {
    maritalStatus: string
    benefitType: string //retirementAlone, retirementReplacingSpousal, spousalAlone, spousalWithRetirement, survivor
    date: MonthYearDate
    benefitAmount: number
    ageYears: number
    ageMonths: number
    message: string //build one of messages below

    constructor(maritalStatus: string, typeOfBenefit:string, person:Person, date:MonthYearDate, benefitAmount: number, ageYears:number, ageMonths:number){
        this.maritalStatus = maritalStatus
        this.benefitType = typeOfBenefit
        this.date = date
        this.benefitAmount = benefitAmount
        this.ageYears = ageYears
        this.ageMonths = ageMonths
        if (person.id == "A") {
          if (this.benefitType == "retirementAlone"){
            this.message = "You file for your retirement benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months."
          }
          if (this.benefitType == "retirementReplacingSpousal") {
            this.message = "You file for your retirement benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months."
          }
          if (this.benefitType == "spousalAlone") {
            this.message = "You file for your spousal benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months."
          }
          if (this.benefitType == "spousalWithRetirement") {
            this.message = "You file for your spousal benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months."
          }
          if (this.benefitType == "suspendToday") {
            this.message = "You suspend your retirement benefit today."
          }
          if (this.benefitType == "suspendAtFRA") {
            this.message = "You suspend your retirement benefit at your full retirement age (" + (person.FRA.getMonth()+1) + "/" + person.FRA.getFullYear() + ")."
          }
          if (this.benefitType == "unsuspend") {
            this.message = "You unsuspend your retirement benefit " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months."
          }
          if (this.benefitType == "disabilityConversion"){
            this.message = "At your full retirement age (" + (person.FRA.getMonth()+1) + "/" + person.FRA.getFullYear() + "), your disability benefit will automatically convert to a retirement benefit of the same amount."
          }
        }
        if (person.id == "B") {
          if (this.benefitType == "retirementAlone"){
            this.message = "Your spouse files for his/her retirement benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months."
          }
          if (this.benefitType == "retirementReplacingSpousal") {
            this.message = "Your spouse files for his/her retirement benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months."
          }
          if (this.benefitType == "spousalAlone") {
            this.message = "Your spouse files for his/her spousal benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months."
          }
          if (this.benefitType == "spousalWithRetirement") {
            this.message = "Your spouse files for his/her spousal benefit to begin " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months."
          }
          if (this.benefitType == "suspendToday") {
            this.message = "Your spouse suspends his/her retirement benefit today."
          }
          if (this.benefitType == "suspendAtFRA") {
            this.message = "Your spouse suspends his/her retirement benefit at full retirement age (" + (person.FRA.getMonth()+1) + "/" + person.FRA.getFullYear() + ")."
          }
          if (this.benefitType == "unsuspend") {
            this.message = "Your spouse unsuspends his/her retirement benefit " + (this.date.getMonth()+1) + "/" + this.date.getFullYear() + ", at age " + this.ageYears + " and " + this.ageMonths + " months."
          }
          if (this.benefitType == "disabilityConversion"){
            this.message = "At your spouse's full retirement age (" + (person.FRA.getMonth()+1) + "/" + person.FRA.getFullYear() + "), his/her disability benefit will automatically convert to a retirement benefit of the same amount."
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

"You should suspend your benefit today, then unsuspend 4/2030, at age x and y months. (Monthly benefit: $800)"
"You should suspend your benefit at your full retirement age (4/2027), then unsuspend 4/2030, at age x and y months. (Monthly benefit: $800)"
"Your spouse should suspend his/her benefit today, then unsuspend 4/2030, at age x and y months. (Monthly benefit: $800)"
"Your spouse should suspend his/her benefit at full retirement age (4/2027), then unsuspend 4/2030, at age x and y months. (Monthly benefit: $800)"

Build an array of these objects, then just access the message field in the HTML?
*/
