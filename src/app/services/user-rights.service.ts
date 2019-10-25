import { StorageService } from './storage.service';
import { Injectable } from "@angular/core";

export interface rights {
  api_route: string;
  display?: boolean | number;
  display_name: string;
  user_limit: string;
  parent_id: number;
  id: number;
  showChild?: boolean;
  child: Array<rights>;
}

@Injectable({
  providedIn: "root"
})
export class UserRightsService {
  rights: rights[];
  constructor(private storage:StorageService) {
    this.rights = this.storage.get('PERMISSION')
  }
}
