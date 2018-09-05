/*
This class exists in the hope of speeding up date processing relative to javascript's native date objects. 
*/

export class monthYearDate {

    month:number
    year:number

    constructor(year:number, month:number, uselessday?:number){
        if (year % 1 != 0 || year < 0){
            throw new Error("Invalid year for monthYearDate object")
        }
        if (month % 1 != 0 || month < 0 || month > 11 ){
            throw new Error("Invalid month for monthYearDate object")
        }
        this.year = year
        this.month = month
    }


    getFullYear(){
        return this.year
    }

    getMonth(){
        return this.month
    }

    setFullYear(year:number){
        if (year % 1 != 0 || year < 0){
            throw new Error("Invalid year for monthYearDate object")
        }
        this.year = year
    }

    setMonth(month:number){
        if (month % 1 != 0 || month < 0 ){
            throw new Error("Invalid month for monthYearDate object")
        }
        if (month <= 11){
            this.month = month
        }
        else {
            var addedYears:number = Math.floor(month/12)
            this.year = Number(this.year) + Number(addedYears)
            this.month = month % 12
        }
    }

    //for the sake of using greaterthan/lessthan/equalto comparisons
    valueOf() {
        return this.year * 12 + this.month
    }


}