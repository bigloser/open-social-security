import {Injectable} from '@angular/core'
import {CalculationYear} from './data model classes/calculationyear'
import {Person} from './data model classes/person'
import {BenefitService} from './benefit.service'
import {CalculationScenario} from './data model classes/calculationscenario'
import {MonthYearDate} from "./data model classes/monthyearDate"

@Injectable({
  providedIn: 'root'
})
export class EarningsTestService {

  constructor(private benefitService: BenefitService) { }
  today: MonthYearDate = new MonthYearDate()


  calculateWithholding(currentCalculationDate:MonthYearDate, person:Person){
      //Determine annual earnings subject to earnings test
      let annualEarnings: number = 0
      if (currentCalculationDate.getFullYear() > person.quitWorkDate.getFullYear() || currentCalculationDate.getFullYear() > person.FRA.getFullYear()) {//If current calc year after FRAyear or quitYear, zero earnings to consider
        annualEarnings = 0            
      } else if (currentCalculationDate.getFullYear() < person.quitWorkDate.getFullYear() && currentCalculationDate.getFullYear() < person.FRA.getFullYear()) {//If current calc year before FRAyear AND before quitYear, 12 months of earnings to consider
        annualEarnings = 12 * person.monthlyEarnings
      } else {//Annual earnings is equal to monthlyEarnings, times number of months before earlier of FRAmonth or quitMonth
        if (person.FRA < person.quitWorkDate) {
          annualEarnings = person.monthlyEarnings * person.FRA.getMonth() //e.g,. if FRA is in March, "getMonth" returns 2, which is how many months of earnings we want to consider
        } else {
          annualEarnings = person.monthlyEarnings * person.quitWorkDate.getMonth() //e.g,. if quitWorkDate is in March, "getMonth" returns 2, which is how many months of earnings we want to consider
        }
      }
      //determine withholdingAmount
      let withholdingAmount:number = 0
      if (currentCalculationDate.getFullYear() < person.FRA.getFullYear()) {
        //withhold using $17,040 threshold, $1 per $2 excess
        withholdingAmount = (annualEarnings - 17040) / 2
      } else if (currentCalculationDate.getFullYear() == person.FRA.getFullYear()) {
        //withhold using $45,360 threshold, $1 per $3 excess
        withholdingAmount = (annualEarnings - 45360) / 3
      }
      //Don't let withholdingAmount be negative
      if (withholdingAmount < 0) {
        withholdingAmount = 0
      }
      return Number(withholdingAmount)
  }

  isGraceYear(person:Person, currentCalculationDate: MonthYearDate) {
    //If quitWorkDate has already happened (or happens this year) and at least one benefit has started (or starts this year) it's a grace year
    //Assumption: in the year they quit work, following months are non-service months.
    let graceYear:boolean = false
    if (person.hasHadGraceYear === true) { //if graceyear was true before, set it to false, so it's only true once
      graceYear = false
    }
    else if (person.quitWorkDate.getFullYear() <= currentCalculationDate.getFullYear()) {
      if (person.retirementBenefitDate.getFullYear() <= currentCalculationDate.getFullYear()) {
        graceYear = true
      }
      if (person.spousalBenefitDate && person.spousalBenefitDate.getFullYear() <= currentCalculationDate.getFullYear()) {//i.e., if spousalBenefitDate exists, and it is this year or a prior year
      graceYear = true
      }
    }
    return graceYear
  }

  applyEarningsTestSingle(scenario:CalculationScenario, person:Person, calcYear:CalculationYear){
    //If it's the beginning of a year, calculate earnings test withholding and determine if this is a grace year
    if (calcYear.date.getMonth() == 0){
      calcYear.annualWithholdingDueToPersonAearnings = this.calculateWithholding(calcYear.date, person)
      calcYear.personAgraceYear = this.isGraceYear(person, calcYear.date)
      if (calcYear.personAgraceYear === true) {person.hasHadGraceYear = true}
    }

    if (calcYear.annualWithholdingDueToPersonAearnings > 0){//If more withholding is necessary...
      if (calcYear.date >= person.retirementBenefitDate  //And they've started retirement benefit...
      && !(calcYear.personAgraceYear === true && calcYear.date >= person.quitWorkDate) //And it isn't a nonservice month in grace year...
      && calcYear.date < person.FRA){//And they are younger than FRA...
          //count how much is available for withholding
          let availableForWithholding:number = person.monthlyPayment
          for (let child of scenario.children){
            availableForWithholding = availableForWithholding + child.monthlyPayment
          }
          //Set everybody's monthlyPayment to zero to reflect benefits being withheld this month
          person.monthlyPayment = 0
          for (let child of scenario.children){
            child.monthlyPayment = 0
          }
          //Add to tally of months withheld
          person.monthsWithheld = person.monthsWithheld + 1
          //Reduce necessary withholding by amount that was withheld this month
          calcYear.annualWithholdingDueToPersonAearnings = calcYear.annualWithholdingDueToPersonAearnings - availableForWithholding
      }
    }
  }


  earningsTestCouple(calcYear:CalculationYear, scenario:CalculationScenario, personA:Person, personB:Person){
    let withholdingDueToSpouseAearnings: number = 0
    let withholdingDueToSpouseBearnings: number = 0
    let monthsSpouseAretirementWithheld: number = 0
    let monthsSpouseAspousalWithheld: number = 0
    let monthsSpouseBretirementWithheld: number = 0
    let monthsSpouseBspousalWithheld: number = 0

      if (isNaN(personA.quitWorkDate.valueOf())) {
        personA.quitWorkDate = new MonthYearDate(1,0,1)
      }
      if (isNaN(personB.quitWorkDate.valueOf())) {
        personB.quitWorkDate = new MonthYearDate(1,0,1)
      }
      if (personA.quitWorkDate > this.today || personB.quitWorkDate > this.today){//If quitWorkDates are invalid dates (because there was no input) or in the past for some reason, this whole business below gets skipped
        //Determine if it's a grace year for either spouse. If quitWorkDate has already happened (or happens this year) and at least one type of benefit has started (or starts this year)
          //Assumption: in the year they quit work, following months are non-service months.
        let spouseAgraceYear:boolean = this.isGraceYear(personA, calcYear.date)
        if (spouseAgraceYear === true) {personA.hasHadGraceYear = true}  
        let spouseBgraceYear:boolean = this.isGraceYear(personB, calcYear.date)
        if (spouseBgraceYear === true) {personB.hasHadGraceYear = true}  

          //Calculate necessary withholding based on each spouse's earnings
          withholdingDueToSpouseAearnings = this.calculateWithholding(calcYear.date, personA)
          withholdingDueToSpouseBearnings = this.calculateWithholding(calcYear.date, personB)

          //If divorced, withholding due to spouseB's earnings is zero
          if (scenario.maritalStatus == "divorced"){
            withholdingDueToSpouseBearnings = 0
          }
      
            //Have to loop monthly for earnings test
            let earningsTestMonth:MonthYearDate = new MonthYearDate(calcYear.date) //set earningsTestMonth to beginning of year
            let earningsTestEndDate:MonthYearDate = new MonthYearDate(calcYear.date.getFullYear(), 11, 1) //set earningsTestEndDate to Dec of currentCalculationYear
            let availableForWithholding:number
                
            //Key point with all of the below is that A's earnings first reduce A's retirement benefit and B's spousal benefit. *Then* B's earnings reduce B's spousal benefit. See CFR 404.434
              //So we first use A's earnings to reduce A's retirement and B's spousal. And we use B's earnings to reduce B's retirement and A's spousal.
              //Then if further withholding is necessary we have their own earnings reduce their own spousal.
                
              //Counting A's excess earnings against A's retirement and B's benefit as spouse
              while (withholdingDueToSpouseAearnings > 0 && earningsTestMonth <= earningsTestEndDate) {
                availableForWithholding = 0 //reset availableForWithholding for new month
                //Check what benefits there *are* this month from which we can withhold
                  if (earningsTestMonth >= personA.retirementBenefitDate //Make sure they started their retirement benefit
                    && (spouseAgraceYear === false || earningsTestMonth < personA.quitWorkDate) //Make sure it's not a nonservice month in a grace year
                    && (earningsTestMonth < personA.FRA) //Make sure current month is prior to FRA
                  ) {  
                    availableForWithholding = availableForWithholding + personA.initialRetirementBenefit
                    calcYear.monthsOfPersonAretirementPreARF = calcYear.monthsOfPersonAretirementPreARF - 1
                    monthsSpouseAretirementWithheld  = monthsSpouseAretirementWithheld  + 1
                  }
                  if (scenario.maritalStatus == "married"){//Only make spouse B's benefit as a spouse available for withholding if they're currently married (as opposed to divorced). If divorced, spouseB is automatically "not working," so we don't have any withholding due to their earnings to worry about.
                    if (earningsTestMonth >= personB.spousalBenefitDate && earningsTestMonth >= personB.retirementBenefitDate //i.e., if this is a "spouseBspousalBenefitWithRetirementBenefit" month
                      && (spouseBgraceYear === false || earningsTestMonth < personB.quitWorkDate) //Make sure it isn't a nonservice month in grace year
                    ) {//If it's a "withRetirement" month for personB, figure out which type of "withRetirement" month it is (pre-ARF, post-ARF, etc)
                      if (earningsTestMonth < personB.FRA){
                        availableForWithholding = availableForWithholding + personB.spousalBenefitWithRetirementPreARF
                        calcYear.monthsOfPersonBspousalWithRetirementPreARF = calcYear.monthsOfPersonBspousalWithRetirementPreARF - 1
                        monthsSpouseBspousalWithheld = monthsSpouseBspousalWithheld + 1
                      }
                      else if (earningsTestMonth < personB.endSuspensionDate){
                        availableForWithholding = availableForWithholding + personB.spousalBenefitWithRetirementAfterARF
                        calcYear.monthsOfPersonBspousalWithRetirementPostARF = calcYear.monthsOfPersonBspousalWithRetirementPostARF - 1
                        monthsSpouseBspousalWithheld = monthsSpouseBspousalWithheld + 1
                      }
                      else {
                        availableForWithholding = availableForWithholding + personB.spousalBenefitWithSuspensionDRCRetirement
                        calcYear.monthsOfPersonBspousalWithRetirementwithSuspensionDRCs = calcYear.monthsOfPersonBspousalWithRetirementwithSuspensionDRCs - 1
                        monthsSpouseBspousalWithheld = monthsSpouseBspousalWithheld + 1
                      }
                    }
                    if (earningsTestMonth >= personB.spousalBenefitDate && earningsTestMonth < personB.retirementBenefitDate //i.e., if this is a "spouseBspousalBenefitWithoutRetirementBenefit" month
                      && (spouseBgraceYear === false || earningsTestMonth < personB.quitWorkDate) //Make sure it isn't a nonservice month in grace year
                    ){
                    availableForWithholding = availableForWithholding + personB.spousalBenefitWithoutRetirement
                    calcYear.monthsOfPersonBspousalWithoutRetirement = calcYear.monthsOfPersonBspousalWithoutRetirement - 1
                    monthsSpouseBspousalWithheld = monthsSpouseBspousalWithheld + 1
                    }
                  }

                //Subtracting 1 from the above months will often result in overwithholding (as it does in real life) for a partial month. Gets added back later.
                //Reduce necessary withholding by the amount we withhold this month:
                withholdingDueToSpouseAearnings = withholdingDueToSpouseAearnings - availableForWithholding //(this kicks us out of loop, potentially)
                earningsTestMonth.setMonth(earningsTestMonth.getMonth()+1) //add 1 to earningsTestMonth (kicks us out of loop at end of year)
              }
                
              //Counting B's excess earnings against B's retirement and A's benefit as spouse
              earningsTestMonth = new MonthYearDate(calcYear.date) //reset earningsTestMonth to beginning of year
              while (withholdingDueToSpouseBearnings > 0 && earningsTestMonth <= earningsTestEndDate) {
                availableForWithholding = 0 //reset availableForWithholding for new month
                //Check what benefits there *are* this month from which we can withhold:
                  if (earningsTestMonth >= personB.retirementBenefitDate //Make sure they started their retirement benefit
                    && (spouseBgraceYear === false || earningsTestMonth < personB.quitWorkDate) //Make sure it's not a nonservice month in a grace year
                    && (earningsTestMonth < personB.FRA) //Make sure current month is prior to FRA
                  ) {
                    availableForWithholding = availableForWithholding + personB.initialRetirementBenefit
                    calcYear.monthsOfPersonBretirementPreARF = calcYear.monthsOfPersonBretirementPreARF - 1
                    monthsSpouseBretirementWithheld  = monthsSpouseBretirementWithheld  + 1
                  }
                  if (earningsTestMonth >= personA.spousalBenefitDate && earningsTestMonth >= personA.retirementBenefitDate //i.e., if this is a "spouseAspousalBenefitWithRetirementBenefit" month
                    && (spouseAgraceYear === false || earningsTestMonth < personA.quitWorkDate) //Make sure it's not a nonservice month in a grace year
                  ) {//If it's a "withRetirement" month for personA, figure out which type of "withRetirement" month it is (pre-ARF, post-ARF, etc)
                      if (earningsTestMonth < personA.FRA){
                        availableForWithholding = availableForWithholding + personA.spousalBenefitWithRetirementPreARF
                        calcYear.monthsOfPersonAspousalWithRetirementPreARF = calcYear.monthsOfPersonAspousalWithRetirementPreARF - 1
                        monthsSpouseAspousalWithheld = monthsSpouseAspousalWithheld + 1
                      }
                      else if (earningsTestMonth < personA.endSuspensionDate){
                        availableForWithholding = availableForWithholding + personA.spousalBenefitWithRetirementAfterARF
                        calcYear.monthsOfPersonAspousalWithRetirementPostARF = calcYear.monthsOfPersonAspousalWithRetirementPostARF - 1
                        monthsSpouseAspousalWithheld = monthsSpouseAspousalWithheld + 1
                      }
                      else {
                        availableForWithholding = availableForWithholding + personA.spousalBenefitWithSuspensionDRCRetirement
                        calcYear.monthsOfPersonAspousalWithRetirementwithSuspensionDRCs = calcYear.monthsOfPersonAspousalWithRetirementwithSuspensionDRCs - 1
                        monthsSpouseAspousalWithheld = monthsSpouseAspousalWithheld + 1
                      }
                  }
                  if (earningsTestMonth >= personA.spousalBenefitDate && earningsTestMonth < personA.retirementBenefitDate //i.e., if this is a "spouseAspousalBenefitWithoutRetirementBenefit" month
                    && (spouseAgraceYear === false || earningsTestMonth < personA.quitWorkDate) //Make sure it's not a nonservice month in a grace year
                  ){
                  availableForWithholding = availableForWithholding + personA.spousalBenefitWithoutRetirement
                  calcYear.monthsOfPersonAspousalWithoutRetirement = calcYear.monthsOfPersonAspousalWithoutRetirement - 1
                  monthsSpouseAspousalWithheld = monthsSpouseAspousalWithheld + 1
                  }
                //Subtracting 1 from the above months will often result in overwithholding (as it does in real life) for a partial month. Gets added back later.
                //Reduce necessary withholding by the amount we withhold this month:
                withholdingDueToSpouseBearnings = withholdingDueToSpouseBearnings - availableForWithholding //(this kicks us out of loop, potentially)
                earningsTestMonth.setMonth(earningsTestMonth.getMonth()+1) //add 1 to earningsTestMonth (kicks us out of loop at end of year)
              }
                
              //If A still has excess earnings, count those against A's benefit as a spouse. (Don't have to check for withholding against benefit as survivor, because we assume no survivor application until survivorFRA.)
              if (withholdingDueToSpouseAearnings > 0) {
                earningsTestMonth = new MonthYearDate(calcYear.date) //reset earningsTestMonth to beginning of year
                while (withholdingDueToSpouseAearnings > 0 && earningsTestMonth <= earningsTestEndDate) {
                  availableForWithholding = 0
                  //Check if there is a spouseAspousal benefit this month (Always "spousalBenefitWithRetirement" because without retirement requires a restricted app. And spouseA is by definition younger than FRA here, otherwise there are no excess earnings.)
                  if (earningsTestMonth >= personA.spousalBenefitDate && earningsTestMonth >= personA.retirementBenefitDate
                    && (spouseAgraceYear === false || earningsTestMonth < personA.quitWorkDate) //Make sure it's not a nonservice month in a grace year
                    && (earningsTestMonth < personA.FRA) //Make sure current month is prior to FRA
                  ) {
                  availableForWithholding = availableForWithholding + personA.spousalBenefitWithRetirementPreARF
                  calcYear.monthsOfPersonAspousalWithRetirementPreARF = calcYear.monthsOfPersonAspousalWithRetirementPreARF - 1 //<-- This is going to result in overwithholding for the partial months.
                  monthsSpouseAspousalWithheld = monthsSpouseAspousalWithheld + 1
                  }
                  withholdingDueToSpouseAearnings = withholdingDueToSpouseAearnings - availableForWithholding //(this kicks us out of loop, potentially)
                  earningsTestMonth.setMonth(earningsTestMonth.getMonth()+1) //add 1 to earningsTestMonth (kicks us out of loop at end of year)
                }
              }
                
              //If B still has excess earnings, count those against B's benefit as a spouse. (Don't have to check for withholding against benefit as survivor, because we assume no survivor application until survivorFRA.)
              if (withholdingDueToSpouseBearnings > 0) {
                earningsTestMonth = new MonthYearDate(calcYear.date) //reset earningsTestMonth to beginning of year
                while (withholdingDueToSpouseBearnings > 0 && earningsTestMonth <= earningsTestEndDate) {
                  availableForWithholding = 0
                  //Check if there is a spouseBspousal benefit this month (Always "spousalBenefitWithRetirement" because without retirement requires a restricted app. And spouseB is by definition younger than FRA here, otherwise there are no excess earnings.)
                  if (earningsTestMonth >= personB.spousalBenefitDate && earningsTestMonth >= personB.retirementBenefitDate
                    && (spouseBgraceYear === false || personB.quitWorkDate > earningsTestMonth) //Make sure it's not a nonservice month in a grace year
                    && (earningsTestMonth < personB.FRA) //Make sure current month is prior to FRA
                  ) {
                    availableForWithholding = availableForWithholding + personB.spousalBenefitWithRetirementPreARF
                    calcYear.monthsOfPersonBspousalWithRetirementPreARF = calcYear.monthsOfPersonBspousalWithRetirementPreARF - 1 //<-- This is going to result in overwithholding for the partial months.
                    monthsSpouseBspousalWithheld = monthsSpouseBspousalWithheld + 1
                    }
                  withholdingDueToSpouseBearnings = withholdingDueToSpouseBearnings - availableForWithholding //(this kicks us out of loop, potentially)
                  earningsTestMonth.setMonth(earningsTestMonth.getMonth()+1) //add 1 to earningsTestMonth (kicks us out of loop at end of year)
                }
              }
                

          //Find post-ARF ("AdjustmentReductionFactor") monthly benefit amounts, for use at/after FRA
            //Find adjusted dates
            personA.adjustedRetirementBenefitDate.setMonth(personA.adjustedRetirementBenefitDate.getMonth() + monthsSpouseAretirementWithheld)
            personA.adjustedSpousalBenefitDate.setMonth(personA.adjustedSpousalBenefitDate.getMonth() + monthsSpouseAspousalWithheld)
            personB.adjustedRetirementBenefitDate.setMonth(personB.adjustedRetirementBenefitDate.getMonth() + monthsSpouseBretirementWithheld)
            personB.adjustedSpousalBenefitDate.setMonth(personB.adjustedSpousalBenefitDate.getMonth() + monthsSpouseBspousalWithheld)
            //Find adjusted retirement benefits
            personA.retirementBenefitAfterARF = this.benefitService.calculateRetirementBenefit(personA, personA.adjustedRetirementBenefitDate)
            personB.retirementBenefitAfterARF = this.benefitService.calculateRetirementBenefit(personB, personB.adjustedRetirementBenefitDate)
            //Find adjusted spousal benefits
            personA.spousalBenefitWithRetirementAfterARF = this.benefitService.calculateSpousalBenefit(personA, personB, personA.retirementBenefitAfterARF, personA.adjustedSpousalBenefitDate)
            personA.spousalBenefitWithoutRetirement = this.benefitService.calculateSpousalBenefit(personA, personB, 0, personA.adjustedSpousalBenefitDate)
            personB.spousalBenefitWithRetirementAfterARF = this.benefitService.calculateSpousalBenefit(personB, personA, personB.retirementBenefitAfterARF, personB.spousalBenefitDate)
            personB.spousalBenefitWithoutRetirement = this.benefitService.calculateSpousalBenefit(personB, personA, 0, personB.adjustedSpousalBenefitDate)
            //Find adjusted survivor benefits
            personA.survivorBenefitWithRetirementAfterARF = this.benefitService.calculateSurvivorBenefit(personA, personA.retirementBenefitAfterARF, personA.survivorFRA, personB, personB.retirementBenefitDate, personB.retirementBenefitDate)
            personA.survivorBenefitWithoutRetirement = this.benefitService.calculateSurvivorBenefit(personA, 0, personA.survivorFRA, personB, personB.retirementBenefitDate, personB.retirementBenefitDate)
            personB.survivorBenefitWithRetirementAfterARF = this.benefitService.calculateSurvivorBenefit(personB, personB.retirementBenefitAfterARF, personB.survivorFRA, personA, personA.retirementBenefitDate, personA.retirementBenefitDate)
            personB.survivorBenefitWithoutRetirement = this.benefitService.calculateSurvivorBenefit(personB, 0, personB.survivorFRA, personA, personA.retirementBenefitDate, personA.retirementBenefitDate)
        }

        //Ignore earnings test if users aren't working
        else {
          withholdingDueToSpouseAearnings = 0
          withholdingDueToSpouseBearnings = 0
          personA.retirementBenefitAfterARF = personA.initialRetirementBenefit
          personB.retirementBenefitAfterARF = personB.initialRetirementBenefit
          personA.spousalBenefitWithoutRetirement = personA.spousalBenefitWithoutRetirement
          personA.spousalBenefitWithRetirementAfterARF = personA.spousalBenefitWithRetirementPreARF
          personB.spousalBenefitWithoutRetirement = personB.spousalBenefitWithoutRetirement
          personB.spousalBenefitWithRetirementAfterARF = personB.spousalBenefitWithRetirementPreARF
          personA.survivorBenefitWithoutRetirement = personA.survivorBenefitWithoutRetirement
          personA.survivorBenefitWithRetirementAfterARF = personA.survivorBenefitWithRetirementPreARF
          personB.survivorBenefitWithoutRetirement = personB.survivorBenefitWithoutRetirement
          personB.survivorBenefitWithRetirementAfterARF = personB.survivorBenefitWithRetirementPreARF
        }

        //WithholdingDueToSpouseAearnings and withholdingDueToSpouseBearnings are negative at this point if we overwithheld. Have to add those negative amounts back to annual benefit amounts
          //We add them back to annual retirement benefit later.
          calcYear.personAoverWithholding = 0
          calcYear.personBoverWithholding = 0
          if (withholdingDueToSpouseAearnings < 0) {
            calcYear.personAoverWithholding = calcYear.personAoverWithholding - withholdingDueToSpouseAearnings
          }
          if (withholdingDueToSpouseBearnings < 0) {
            calcYear.personBoverWithholding = calcYear.personBoverWithholding - withholdingDueToSpouseBearnings
          }

          let earningsTestResult:any[] = [calcYear, personA, personB]
          
          return earningsTestResult
  }
}
