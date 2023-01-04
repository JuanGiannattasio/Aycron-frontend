import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


import { DashboardComponent } from "./dashboard/dashboard.component";
import { MapComponent } from "./map/map.component";
import { NewWarehouseComponent } from "./new-warehouse/new-warehouse.component";


const childRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: 'new',
        component: NewWarehouseComponent,
    },
    {
        path: 'map/:place',
        component: MapComponent,
    },
    
];


@NgModule({
    imports: [ RouterModule.forChild( childRoutes ) ],
    exports: [RouterModule]
  })
  export class ChildRoutesModule { }