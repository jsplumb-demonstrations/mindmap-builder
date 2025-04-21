import {Component, AfterViewInit, OnInit, ViewChild} from '@angular/core'

import {
  SurfaceComponent
} from "@jsplumbtoolkit/browser-ui-angular"

import { Surface, JsPlumbToolkit,registerParser, registerExporter,
  Layouts, StraightConnector, AnchorLocations, EVENT_CANVAS_CLICK } from "@jsplumbtoolkit/browser-ui"

import { mindmapJsonParser, mindmapJsonExporter } from "./parser"

import {MINDMAP_LAYOUT} from "./definitions"
import {SubtopicComponent} from "./subtopic.component"
import {MainComponent} from "./main.component"
import {MINDMAP_JSON} from "./parser"
import {MindmapLayout} from "./layout"

@Component({
  selector: 'app-root',
  standalone:false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit {

  @ViewChild(SurfaceComponent) surfaceComponent!: SurfaceComponent;

  surface!:Surface
  toolkit!:JsPlumbToolkit

  renderOptions = {
    zoomToFit:true,
    layout:{
      type:MINDMAP_LAYOUT
    },
    // show connections to ports as being attached to their parent nodes. We use this for the main node: its edges
    // are connected to either a `right` or `left` port on the main node, but these ports are logical ports only - they
    // do not have their own DOM element assigned.
    logicalPorts:true,

    // in this app, elements are not draggable; they are fixed by the layout.
    elementsDraggable:false,
    // Run a relayout whenever a new edge is established, which happens programmatically when the user adds a new subtopic.
    refreshLayoutOnEdgeConnect:true,
    // for the purposes of testing. Without this the right mouse button is disabled by default.
    consumeRightClick:false,
    defaults:{
      connector:{
        type:StraightConnector.type,
        options:{
          stub:20
        }
      },
      anchor:[ AnchorLocations.Left, AnchorLocations.Right ]
    },
    events:{
      [EVENT_CANVAS_CLICK]:() => this.toolkit.clearSelection()
    }
  }

  view = {
    nodes:{
      subtopic:{
        component:SubtopicComponent
      },
      main:{
        component:MainComponent
      }
    }
  }

  ngOnInit() {
    Layouts.register(MINDMAP_LAYOUT, MindmapLayout)
    registerParser(MINDMAP_JSON, mindmapJsonParser)
    registerExporter(MINDMAP_JSON, mindmapJsonExporter)
  }

  ngAfterViewInit() {

    this.surface = this.surfaceComponent.surface
    this.toolkit = this.surfaceComponent.toolkit
    this.toolkit.load({
      url:"/mindmap.json",
      type:MINDMAP_JSON
    })
  }
}
