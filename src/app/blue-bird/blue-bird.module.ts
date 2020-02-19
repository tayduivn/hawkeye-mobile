import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileChunkService } from "./service/file-chunk.service";
import { FileHashService } from "./service/file-hash.service";
import { RequestService } from "./service/request.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    FileChunkService,
    FileHashService,
    RequestService
  ]
})
export class BlueBirdModule {}
