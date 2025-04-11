import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    Input
} from "@angular/core"
import {DEFAULT_ANGULAR_SURFACE_ID, jsPlumbService} from "@jsplumbtoolkit/browser-ui-angular"
import {Base, Inspector, Edge} from "@jsplumbtoolkit/browser-ui"
import {PROPERTY_LABEL, PROPERTY_NOTES} from "./definitions"

@Component({
    standalone:false,
    template: `<div class="inspector">
        
        <div *ngIf="currentType === ''"></div>
        
        <div *ngIf="currentType !== ''" class="jtk-inspector jtk-node-inspector">
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
        
    </div>`,
    selector: 'app-inspector'
})
export class InspectorComponent implements AfterViewInit {

    currentType = '';

    @Input() surfaceId: string = DEFAULT_ANGULAR_SURFACE_ID

    inspector!: Inspector;

    $jsplumb = inject(jsPlumbService);

    constructor(private el: ElementRef, private changeDetector: ChangeDetectorRef) { }

    ngAfterViewInit(): void {

        this.$jsplumb.getSurface(this.surfaceId, (surface) => {
            this.inspector = new Inspector({
                showCloseButton:true,
                container: this.el.nativeElement,
                surface,
                renderEmptyContainer: () => {
                    this.currentType = '';
                    this.changeDetector.detectChanges()
                },
                refresh: (obj: Base, cb: () => void) => {
                    this.currentType = obj.objectType;
                    window.setTimeout(cb, 0);
                    this.changeDetector.detectChanges();
                }
            });
        });
    }



}
