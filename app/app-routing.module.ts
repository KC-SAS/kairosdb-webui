    import { NgModule }             from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { QueryComponent }  from './query.component';

    const routes: Routes = [
      { path: '', redirectTo: '/query', pathMatch: 'full' },
      { path: 'query',  component: QueryComponent }
    ];

    @NgModule({
      imports: [ RouterModule.forRoot(routes) ],
      exports: [ RouterModule ]
    })
    export class AppRoutingModule {}