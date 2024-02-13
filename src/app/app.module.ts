import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlercordComponent } from './flercord/flercord.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from '@coreui/angular';
import { RouterModule, Routes } from '@angular/router';
import { CommandUiComponent } from './command-ui/command-ui.component';
import { EventLoggerComponent } from './event-logger/event-logger.component';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
  { path: "", component: FlercordComponent },
  { path: "command-ui", component: CommandUiComponent },
  { path: "event-logger", component: EventLoggerComponent },
  { path: "login", component: LoginComponent }
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    FormsModule,
    AlertModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
