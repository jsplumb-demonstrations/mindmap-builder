import {
    AbstractLayout, isNode, Layouts,
  ParentRelativePlacementStrategy,
  Vertex, PointXY, InternalLayoutOptions
} from "@jsplumbtoolkit/browser-ui"

import {LEFT, MAIN, MindmapLayoutOptions, RIGHT, MINDMAP_LAYOUT} from "./definitions"
import {BrowserUIAngular} from '@jsplumbtoolkit/browser-ui-angular'


/**
 * Places the focus vertex in the center of the canvas and then branches out to the left and right with children of the focus.
 *
 */
export class MindmapLayout extends AbstractLayout<MindmapLayoutOptions> {

    focusVertex!:Vertex|null;
    defaultMagnetized: boolean = false

    type = MINDMAP_LAYOUT

  constructor(params: InternalLayoutOptions<MindmapLayoutOptions>) {
    super(params)
  }

  begin(toolkit:BrowserUIAngular, parameters:any) {
        const focusCandidates = toolkit.filter(o => isNode(o) && o.data.type === MAIN)
        if (focusCandidates.getNodeCount() > 0) {
            this.focusVertex = focusCandidates.getNodeAt(0)
        } else {
            this.focusVertex = null
        }
    }

    end(toolkit:BrowserUIAngular, parameters:any, wasMagnetized:boolean) { }

    getDefaultParameters() {
        return {
            padding:{x:100, y:100}
        };
    }

    reset() { }

    step(toolkit:BrowserUIAngular, parameters:any) {

        if (this.focusVertex != null) {

            //
            // We use a helper class here to draw out the left/right trees - ParentRelativePlacementStrategy.
            //
            const _preparePlacementStrategy = (dir:string) => {
                return new ParentRelativePlacementStrategy(toolkit, {
                    rootNode:this.focusVertex,
                    idFunction:(d) => d.id,
                    sizeFunction:(id) => {
                        return this._getSize(id)
                    },
                    childVerticesFunction:(d:Vertex) => {
                        if (d.data.type === MAIN) {
                            return d.getAllEdges().filter(e => e.target.data.direction === dir).map(e => e.target)
                        } else {
                            return d.getAllEdges().map(e => e.target)
                        }
                    },
                    padding:{x:150, y:80},
                    absolutePositionFunction:(v) => null as any,
                    axisIndex:1
                })
            }

            const rightPositions = _preparePlacementStrategy(RIGHT).execute()
            rightPositions.forEach((info:{position:PointXY}, id:string) => {
                this.setPosition(id, info.position.x, info.position.y)
            })

            const leftPositions = _preparePlacementStrategy(LEFT).execute()
            leftPositions.forEach((info:{position:PointXY}, id:string) => {
                this.setPosition(id, info.position.x * -1, info.position.y)
            })
        }


        this.done = true

    }

    canMagnetize(id:string) {
        return false;
    }
}

