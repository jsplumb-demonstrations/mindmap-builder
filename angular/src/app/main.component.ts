import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-angular"
import {Component} from "@angular/core"

import {CLASS_MINDMAP_INFO, CLASS_ADD_CHILD, LEFT, RIGHT} from "./definitions"

import {MindmapService} from "./mindmap.service"

@Component({
  template:`<div class="jtk-mindmap-main jtk-mindmap-vertex">
    {{obj.label}}
    <div class="${CLASS_MINDMAP_INFO}" (click)="this.service.info(this.getNode())"></div>
      <div class="${CLASS_ADD_CHILD}" data-direction="${LEFT}" (click)="this.service.addChild(this.getNode(), 'left')"></div>
      <div class="${CLASS_ADD_CHILD}" data-direction="${RIGHT}" (click)="this.service.addChild(this.getNode(), 'right')"></div>
    </div>`,
  standalone:false
})
export class MainComponent extends BaseNodeComponent {

  constructor(public service:MindmapService) {
    super()
  }
}


