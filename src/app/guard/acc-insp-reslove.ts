import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TaskService } from '../services/task.service';

@Injectable({
    providedIn: 'root',
})
export class AccInspReslove implements Resolve<Observable<Array<any>>> {
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<Array<any>> | Observable<any> | Promise<any> {
        let taskId: number = route.params['sid'],
            contract_id: number = route.params['cid'];
        return this.taskService.getAccessbyTaskAndFac({ task_id: taskId, contract_id: contract_id });
    }
    constructor(public taskService: TaskService, public Router: Router) {}
}
