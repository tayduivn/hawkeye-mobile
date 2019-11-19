import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TaskService, contracts } from '../services/task.service';

@Injectable({
    providedIn: 'root',
})
export class InspectionReslove implements Resolve<contracts> {
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): contracts | Observable<contracts> | Promise<contracts> {
        let sid: any = route.params['sid'],
            sku: string = route.params['sku'],
            cid: number = route.params['cid'];
        return this.taskService.toInspection({ id: sid, sku: sku, contract_id: cid });
    }
    constructor(public Router: Router, public taskService: TaskService) {}
}
