import {Injectable} from "@angular/core"
import {DEFAULT_ANGULAR_TOOLKIT_ID, jsPlumbService} from "@jsplumbtoolkit/browser-ui-angular"
import {Node, uuid} from "@jsplumbtoolkit/browser-ui"
import {DIRECTION, SUBTOPIC} from "./definitions"

@Injectable()
export class MindmapService {

  constructor(private jsplumb:jsPlumbService) { }

  info(v:Node) {
    const toolkit = this.jsplumb.getToolkit(DEFAULT_ANGULAR_TOOLKIT_ID)
    toolkit.setSelection(v)
  }

  deleteVertex(v:Node) {
    const toolkit = this.jsplumb.getToolkit(DEFAULT_ANGULAR_TOOLKIT_ID)
    // select the node that was clicked and all of its descendants (we get a Selection object back)
    const nodeAndDescendants = toolkit.selectDescendants(v, true)
    // inside a transaction, remove everything in that selection from the Toolkit (including edges to each of the nodes).
    // we do this inside a transaction so we can undo the whole operation as one unit.
    toolkit.transaction(() => {
      toolkit.remove(nodeAndDescendants)
    })
  }

  addChild(v:Node, direction?:DIRECTION) {

    const toolkit = this.jsplumb.getToolkit(DEFAULT_ANGULAR_TOOLKIT_ID)

    // for edges from the main node, we attach them to a port on the node, because the main node can
    // have `left` and `right` edges. For subtopic nodes we attach directly to the node. So this code tests
    // for a matching port and uses it as the source if found, otherwise it uses the source node.
    const source = direction != null ? v.getPort(direction) : v
    const payload = {
      id:uuid(),
      parentId:v.id,
      label:"New subtopic",
      children:[],
      type:SUBTOPIC,
      direction
    }

    toolkit.transaction(() => {
      const node = toolkit.addNode(payload)
      toolkit.addEdge({source, target:node})
    })

  }
}
