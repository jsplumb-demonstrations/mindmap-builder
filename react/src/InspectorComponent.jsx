import React, {useRef, useState} from "react";

import {InspectorComponent} from "@jsplumbtoolkit/browser-ui-react";
import {PROPERTY_LABEL, PROPERTY_NOTES} from "../../es6/definitions";

export default function MindmapInspectorComponent() {

    const [currentType, setCurrentType] = useState('')
    const inspector = useRef(null)

    const renderEmptyContainer = () => setCurrentType('')
    const refresh= (obj, cb) => {
        setCurrentType(obj.objectType)
    }

    return <InspectorComponent refresh={refresh} renderEmptyContainer={renderEmptyContainer} ref={inspector}>

        {currentType !== '' && <>
        <div className="jtk-inspector jtk-node-inspector">
            <div className="jtk-inspector-section">
                <div>Label</div>
                <input type="text" jtk-att={PROPERTY_LABEL} jtk-focus/>
            </div>

            <div className="jtk-inspector-section">
                <div>Notes</div>
                <textarea rows="10" jtk-att={PROPERTY_NOTES}/>
            </div>

        </div>
        </>}

    </InspectorComponent>
}
