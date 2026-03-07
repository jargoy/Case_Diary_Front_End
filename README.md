# User

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# ⚖️ Advocate Case Management System

A modern **Angular 21 + Spring Boot** application for managing advocate
cases, hearings, client types, case types, and finance records.

This frontend connects with a **Spring Boot backend API** running on
`http://localhost:8080`.

------------------------------------------------------------------------

## 🚀 Features

-   Dashboard for case listing
-   New Case Registration form
-   Client Type dropdown from backend API
-   Case Type dropdown from backend API
-   Event Calendar for hearing dates
-   Finance Dashboard for income and expense tracking
-   Case filters
-   Edit and delete case support
-   Responsive UI

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   Angular 21
-   TypeScript
-   HTML
-   CSS
-   Angular HttpClient

### Backend

-   Spring Boot
-   REST API
-   MySQL

------------------------------------------------------------------------

## 📁 Project Structure

src/ └── app/ ├── app.ts ├── app.html ├── app.css main.ts

------------------------------------------------------------------------

## 🔗 Spring Boot API Integration

### Client Type API

GET http://localhost:8080/api/case_diary/v1/client_type

Example Response:

\[ { "id": 1, "typeName": "Individual" }, { "id": 2, "typeName":
"Corporate" }\]

------------------------------------------------------------------------

### Case Type API

GET http://localhost:8080/api/case_diary/v1/case_type

Example Response:

\[ { "id": 10, "name": "Cheque Bounce" }, { "id": 1, "name": "Civil
Case" }, { "id": 6, "name": "Consumer Case" }, { "id": 5, "name":
"Corporate Case" }, { "id": 2, "name": "Criminal Case" }\]

------------------------------------------------------------------------

## 🔌 Angular API Connection Code

### Import HttpClient

import { HttpClient } from '@angular/common/http';

### Constructor Injection

constructor(private http: HttpClient) {}

### Load Client Types

loadClientTypes() { this.http
.get\<ClientType\[\]\>('http://localhost:8080/api/case_diary/v1/client_type')
.subscribe({ next: (data) =\> { this.clientTypes = data \|\| \[\];
this.filteredClientTypes = \[...this.clientTypes\]; }, error: (err) =\>
{ console.error('Client type API error', err); } }); }

### Load Case Types

loadCaseTypes() 
{ 
    this.http
.get\<any\[\]\>('http://localhost:8080/api/case_diary/v1/case_type')
.subscribe({ next: (data) =\> { console.log('Case type API response:',
data); 
this.caseTypes = data \|\| \[\]; this.filteredCaseTypes =
\[...this.caseTypes\];
 }, error: (err) =\> { console.error('Case type
API error:', err); } }); }

### Call APIs on Init

ngOnInit(): void { this.loadClientTypes(); this.loadCaseTypes(); }

------------------------------------------------------------------------

## 🧠 Dropdown Search Methods

### Client Type Search

filterClientTypes() { const value = (this.caseModel.clientType \|\|
'').toLowerCase().trim();

this.filteredClientTypes = this.clientTypes.filter(item =\>
item.typeName.toLowerCase().includes(value) );

this.showClientTypeDropdown = true; }

### Case Type Search

filterCaseTypes() { const value = (this.caseModel.caseType \|\|
'').toLowerCase().trim();

this.filteredCaseTypes = this.caseTypes.filter(item =\>
item.name.toLowerCase().includes(value) );

this.showCaseTypeDropdown = true; }

### Select Dropdown Values

selectClientType(item: ClientType) { this.caseModel.clientType =
item.typeName; this.showClientTypeDropdown = false; }

selectCaseType(item: CaseType) { this.caseModel.caseType = item.name;
this.showCaseTypeDropdown = false; }

------------------------------------------------------------------------

## ⚙️ Angular HttpClient Setup

main.ts

import { bootstrapApplication } from '@angular/platform-browser'; import
{ provideHttpClient } from '@angular/common/http'; import { AppComponent
} from './app/app';

bootstrapApplication(AppComponent, { providers: \[provideHttpClient()\]
}).catch(err =\> console.error(err));

------------------------------------------------------------------------

## ▶️ Run the Angular Project

Install dependencies:

npm install

Run Angular:

ng serve

Open browser:

http://localhost:4200

------------------------------------------------------------------------

## ▶️ Run Spring Boot Backend

Ensure backend runs on:

http://localhost:8080

APIs used:

/api/case_diary/v1/client_type /api/case_diary/v1/case_type

------------------------------------------------------------------------

## 🌐 CORS Configuration (Spring Boot)

@Configuration public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("*");
            }
        };
    }

}

------------------------------------------------------------------------

## 👨‍💻 Author

Yograj Singh Rajput
Java Developer | Angular Developer
