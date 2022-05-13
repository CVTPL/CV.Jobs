import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { JobApplicationFormComponent } from './job-application-form/job-application-form.component';
import { OnlyNumberDirective } from './only-number.directive';
import { NgxCurrencyInputModule } from 'ngx-currency-input';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent, 
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    JobApplicationFormComponent, 
    OnlyNumberDirective, 
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCurrencyInputModule,//For Currency
    NgMultiSelectDropDownModule.forRoot(),//for Dropdown Checkbox
    RouterModule.forRoot([
      { path: '', component: JobApplicationFormComponent , pathMatch: 'full' },
    //  { path: 'counter', component: CounterComponent },
    //   { path: 'fetch-data', component: FetchDataComponent },
      { path: 'jobApplicationForm', component: JobApplicationFormComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
