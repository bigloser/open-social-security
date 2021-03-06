import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CollapseModule, BsDropdownModule } from 'ngx-bootstrap';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BenefitService } from './benefit.service';
import { AppRoutingModule } from './app-routing.module';
import { BirthdayService } from './birthday.service';
import { AboutComponent } from './about/about.component';
import { PresentValueService } from './presentvalue.service';
import { ContactComponent } from './contact/contact.component';
import { HttpClientModule } from '@angular/common/http';
import { LegalComponent } from './legal/legal.component';
import { EarningsTestService } from './earningstest.service';
import { MortalityService } from './mortality.service';
import { SolutionSetService } from './solutionset.service';
import { DebugTableComponent } from './debugtable/debugtable.component';
import { OutputTableComponent } from './output-table/output-table.component';
import { CsvModule } from '@ctrl/ngx-csv';
import { ChildinputsComponent } from './childinputs/childinputs.component';
import { ArticlesComponent } from './articles/articles.component'



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    LegalComponent,
    DebugTableComponent,
    OutputTableComponent,
    ChildinputsComponent,
    ArticlesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    CsvModule
  ],
  providers: [BenefitService, BirthdayService, PresentValueService, EarningsTestService, MortalityService, SolutionSetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
