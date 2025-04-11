import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"
import {Component} from "@angular/core"

import {CLASS_MINDMAP_INFO, CLASS_ADD_CHILD, CLASS_MINDMAP_DELETE} from "./definitions"
import {MindmapService} from "./mindmap.service"

@Component({
  template:`<div class="jtk-mindmap-subtopic jtk-mindmap-vertex">
    {{obj.label}}
    <div class="${CLASS_MINDMAP_INFO}" (click)="this.service.info(this.getNode())"></div>
    <div class="${CLASS_ADD_CHILD}" [attr.data-direction]="obj.direction" (click)="this.service.addChild(this.getNode())"></div>
    <div class="${CLASS_MINDMAP_DELETE}" (click)="this.service.deleteVertex(this.getNode())"></div>
    </div>`,
  standalone:false
})
export class SubtopicComponent extends BaseNodeComponent {

  constructor(public service:MindmapService) {
    super()
  }
}
