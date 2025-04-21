import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core'

import { AppComponent } from './app.component';

import { jsPlumbToolkitModule } from "@jsplumbtoolkit/browser-ui-angular"
import {MainComponent} from "./main.component"
import {SubtopicComponent} from "./subtopic.component"
import {MindmapService} from "./mindmap.service"
import {MindmapInspectorComponent} from './inspector.component'


@NgModule({
    declarations: [
        AppComponent, SubtopicComponent, MainComponent, MindmapInspectorComponent

    ],
    imports: [
        BrowserModule,
        jsPlumbToolkitModule
    ],
    providers: [ MindmapService ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
