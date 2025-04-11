import { LayoutParameters } from "@jsplumbtoolkit/browser-ui"

export const CLASS_MINDMAP_DELETE = "jtk-mindmap-delete"
export const CLASS_ADD_CHILD = "jtk-add-mindmap-child"
export const CLASS_MINDMAP_INFO = "jtk-mindmap-info"

/**
 * @internal
 */
export const MAIN = "main"

export const SUBTOPIC = "subtopic"
/**
 * @internal
 */
export const LEFT = "left"
/**
 * @internal
 */
export const RIGHT = "right"

export type DIRECTION = typeof LEFT | typeof RIGHT

/**
 * Type of edges that link subtopics.
 * @internal
 */
export const LINK = "link"


export const PROPERTY_LABEL = "label"
export const PROPERTY_NOTES = "notes"

export interface MindmapLayoutOptions extends LayoutParameters {

}

export const MINDMAP_LAYOUT = "mindmap"
