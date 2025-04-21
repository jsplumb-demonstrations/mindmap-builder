import {
    Component
} from "@angular/core"
import {InspectorComponent} from "@jsplumbtoolkit/browser-ui-angular"
import {PROPERTY_LABEL, PROPERTY_NOTES} from "./definitions"

@Component({
    standalone:false,
    template: `<div class="inspector">
        
        @if(currentObj !== null) {               
          <div class="jtk-inspector jtk-node-inspector">
            <div class="jtk-inspector jtk-node-inspector">
              <div class="jtk-inspector-section">
                <div>Label</div>
                <input type="text" jtk-att="${PROPERTY_LABEL}" jtk-focus/>
              </div>
  
              <div class="jtk-inspector-section">
                <div>Notes</div>
                <textarea rows="10" jtk-att="${PROPERTY_NOTES}"></textarea>
              </div>
  
            </div>
          </div>
        }
        
    </div>`,
    selector: 'app-inspector'
})
export class MindmapInspectorComponent extends InspectorComponent { }
