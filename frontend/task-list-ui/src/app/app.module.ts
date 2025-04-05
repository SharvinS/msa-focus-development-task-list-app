import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';
import { MaterialModule } from './shared/material/material.module';
import { TaskFormComponent } from './components/task-form/task-form.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppComponent,
    MaterialModule,
    TaskFormComponent
  ],
  providers: [TaskService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [],
})
export class AppModule {}
