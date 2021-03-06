import { Injectable } from '@angular/core';
import {MonthYearDate} from "./data model classes/monthyearDate"

@Injectable()
export class BirthdayService {

  constructor() { }




findSSbirthdate(inputMonth, inputDay, inputYear) {
let SSbirthDate: MonthYearDate = new MonthYearDate(inputYear, inputMonth-1, 1)
  //If born on 1st of a month, birth month is prior month.
  if (inputDay == 1)
    {
    SSbirthDate.setMonth(SSbirthDate.getMonth()-1)
    }
    return SSbirthDate
  }


findFRA(SSbirthDate:MonthYearDate){
  let FRAdate: MonthYearDate
  let beginDate: MonthYearDate
  let endDate: MonthYearDate
  FRAdate = new MonthYearDate(SSbirthDate)

  endDate = new MonthYearDate (1937, 11, 31)
  if (SSbirthDate <= endDate)
    {FRAdate.setMonth(FRAdate.getMonth() + 65*12)}

  beginDate = new MonthYearDate (1938, 0, 1)
  endDate = new MonthYearDate (1938, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
    {FRAdate.setMonth(FRAdate.getMonth() + 65*12 + 2)}

  beginDate = new MonthYearDate (1939, 0, 1)
  endDate = new MonthYearDate (1939, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
    {FRAdate.setMonth(FRAdate.getMonth() + 65*12 + 4)}

  beginDate = new MonthYearDate (1940, 0, 1)
  endDate = new MonthYearDate (1940, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
    {FRAdate.setMonth(FRAdate.getMonth() + 65*12 + 6)}

  beginDate = new MonthYearDate (1941, 0, 1)
  endDate = new MonthYearDate (1941, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
    {FRAdate.setMonth(FRAdate.getMonth() + 65*12 + 8)}

  beginDate = new MonthYearDate (1942, 0, 1)
  endDate = new MonthYearDate (1942, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
    {FRAdate.setMonth(FRAdate.getMonth() + 65*12 + 10)}

  beginDate = new MonthYearDate (1943, 0, 1)
  endDate = new MonthYearDate (1954, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
    {FRAdate.setMonth(FRAdate.getMonth() + 66*12)}

  beginDate = new MonthYearDate (1955, 0, 1)
  endDate = new MonthYearDate (1955, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
      {FRAdate.setMonth(FRAdate.getMonth() + 66*12 + 2)}

  beginDate = new MonthYearDate (1956, 0, 1)
  endDate = new MonthYearDate (1956, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
      {FRAdate.setMonth(FRAdate.getMonth() + 66*12 + 4)}

  beginDate = new MonthYearDate (1957, 0, 1)
  endDate = new MonthYearDate (1957, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
      {FRAdate.setMonth(FRAdate.getMonth() + 66*12 + 6)}

  beginDate = new MonthYearDate (1958, 0, 1)
  endDate = new MonthYearDate (1958, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
      {FRAdate.setMonth(FRAdate.getMonth() + 66*12 + 8)}

  beginDate = new MonthYearDate (1959, 0, 1)
  endDate = new MonthYearDate (1959, 11, 31)
  if (SSbirthDate >= beginDate && SSbirthDate <= endDate)
      {FRAdate.setMonth(FRAdate.getMonth() + 66*12 + 10)}

  beginDate = new MonthYearDate (1960, 0, 1)
  if (SSbirthDate >= beginDate)
      {FRAdate.setMonth(FRAdate.getMonth() + 67*12)}

  return FRAdate
   }

   findSurvivorFRA (SSbirthDate:MonthYearDate){
    let madeUpDate: MonthYearDate = new MonthYearDate(SSbirthDate.getFullYear()-2, SSbirthDate.getMonth(), 1)
    let survivorFRA: MonthYearDate = new MonthYearDate(this.findFRA(madeUpDate))
    survivorFRA.setFullYear(survivorFRA.getFullYear()+2)
    return survivorFRA
   }
}
