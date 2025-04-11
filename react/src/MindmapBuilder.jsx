import React, { useEffect, useRef } from "react"

import './MindmapBuilder.css'

import { registerParser, registerExporter, uuid, EVENT_GRAPH_CLEARED, StraightConnector, AnchorLocations, EVENT_CANVAS_CLICK } from "@jsplumbtoolkit/browser-ui"
import { SurfaceProvider, SurfaceComponent, ControlsComponent, MiniviewComponent } from "@jsplumbtoolkit/browser-ui-react";
import {CLASS_ADD_CHILD, CLASS_MINDMAP_DELETE, CLASS_MINDMAP_INFO, LEFT, RIGHT, SUBTOPIC} from "./definitions";
import {MINDMAP_JSON, mindmapJsonExporter, mindmapJsonParser} from "./parser";
import {MAIN} from "../../es6/definitions";

import Inspector from "./InspectorComponent"
import {MindmapLayout} from "./layout";

function MindmapBuilder() {

    const initialized = useRef(false)
    const toolkit = useRef(null)
    const surface = useRef(null)

    registerParser(MINDMAP_JSON, mindmapJsonParser)
    registerExporter(MINDMAP_JSON, mindmapJsonExporter)

    // assign the Toolkit ref on load
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            toolkit.current = surface.current.getSurface().toolkitInstance

            // bind to graph cleared event and add a new main node, then center it.
            // the Mindmap always has a center node.
            toolkit.current.bind(EVENT_GRAPH_CLEARED, () => {
                toolkit.current.addNode({
                    id:uuid(),
                    type:MAIN,
                    left:[],
                    right:[],
                    label:"Main"
                })
                surface.current.getSurface().zoomToFit()
            })

            toolkit.current.load({
                url:"/mindmap.json",
                type:MINDMAP_JSON
            })

        }
    })

    function addChild(vertex, direction) {
        // for edges from the main node, we attach them to a port on the node, because the main node can
        // have `left` and `right` edges. For subtopic nodes we attach directly to the node. So this code tests
        // for a matching port and uses it as the source if found, otherwise it uses the source node.
        const source = direction != null ? vertex.getPort(direction) : vertex
        const payload = {
            id:uuid(),
            parentId:vertex.id,
            label:"New subtopic",
            children:[],
            type:SUBTOPIC,
            direction
        }

        toolkit.current.transaction(() => {
            const node = toolkit.current.addNode(payload)
            toolkit.current.addEdge({source, target:node})
        })
    }

    function deleteVertex(vertex) {
        // select the node that was clicked and all of its descendants (we get a Selection object back)
        const nodeAndDescendants = toolkit.current.selectDescendants(vertex, true)
        // inside a transaction, remove everything in that selection from the Toolkit (including edges to each of the nodes).
        // we do this inside a transaction so we can undo the whole operation as one unit.
        toolkit.current.transaction(() => {
            toolkit.current.remove(nodeAndDescendants)
        })
    }

    function showInfo(vertex) {
        toolkit.current.setSelection(vertex)
    }

    const view = {
        nodes:{
            main:{
                jsx:(ctx) => <div className="jtk-mindmap-main jtk-mindmap-vertex">
                    {ctx.data.label}
                    <div className={CLASS_MINDMAP_INFO}/>
                    <div className={CLASS_ADD_CHILD} data-direction={LEFT} onClick={() => addChild(ctx.vertex, LEFT)}/>
                    <div className={CLASS_ADD_CHILD} data-direction={RIGHT} onClick={() => addChild(ctx.vertex, RIGHT)}/>
                </div>
            },
            subtopic:{
                jsx:(ctx) => <div className="jtk-mindmap-subtopic jtk-mindmap-vertex">
                    {ctx.data.label}
                    <div className={CLASS_MINDMAP_INFO} onClick={() => showInfo(ctx.vertex)}/>
                    <div className={CLASS_ADD_CHILD} data-direction={ctx.data.direction} onClick={() => addChild(ctx.vertex)}/>
                    <div className={CLASS_MINDMAP_DELETE} onClick={() => deleteVertex(ctx.vertex)}/>
                </div>
            }
        }
    }

    const renderOptions = {
        // in this app, elements are not draggable; they are fixed by the layout.
        elementsDraggable:false,
        // after load, zoom the display so all nodes are visible.
        zoomToFit:true,
        // show connections to ports as being attached to their parent nodes. We use this for the main node: its edges
        // are connected to either a `right` or `left` port on the main node, but these ports are logical ports only - they
        // do not have their own DOM element assigned.
        logicalPorts:true,
        // Run a relayout whenever a new edge is established, which happens programmatically when the user adds a new subtopic.
        refreshLayoutOnEdgeConnect:true,
        // for the purposes of testing. Without this the right mouse button is disabled by default.
        consumeRightClick:false,
        // Use our custom mindmap layout.
        layout:{
            type:MindmapLayout.type,
        },
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
            [EVENT_CANVAS_CLICK]:() => toolkit.current.clearSelection()
        }
    }


    return (<>
        <div className="jtk-demo-main">
            <SurfaceProvider>

            <div className="jtk-demo-canvas">
                <SurfaceComponent viewOptions={view} renderOptions={renderOptions} ref={surface}/>
                <ControlsComponent/>
                <MiniviewComponent/>
            </div>
            <div className="jtk-demo-rhs">

                <div className="description">
                    <h3>Mindmap Builder</h3>
                    <ul>
                        <li>Click the note icon in the upper left to inspect/edit a node.</li>
                        <li>Click the trashcan icon to delete a node</li>
                        <li>Click the + button to add a new subtopic. Subtopics can be added to the left or right of the
                            main node.
                        </li>
                    </ul>
                </div>

                <hr/>

                <Inspector/>

            </div>
            </SurfaceProvider>

        </div>
    </>)
}

export default MindmapBuilder
