/**
 * 3D Foundation Project
 * Copyright 2018 Smithsonian Institution
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import System from "@ff/graph/System";
import CSelection from "@ff/graph/components/CSelection";

import List from "@ff/ui/List";
import "@ff/ui/Icon";

import { customElement, html, property, PropertyValues } from "@ff/ui/CustomElement";

import CVDocument_old from "../../explorer/components/CVDocument_old";
import CVDocumentManager from "../../explorer/components/CVDocumentManager";

////////////////////////////////////////////////////////////////////////////////

@customElement("sv-document-list")
class DocumentList extends List<CVDocument_old>
{
    @property({ attribute: false })
    system: System = null;

    protected documentManager: CVDocumentManager = null;
    protected selection: CSelection = null;

    protected firstConnected()
    {
        super.firstConnected();
        this.classList.add("sv-presentation-list");

        this.documentManager = this.system.getMainComponent(CVDocumentManager);
        this.selection = this.system.getMainComponent(CSelection);
    }

    protected connected()
    {
        super.connected();

        this.selection.selectedComponents.on(CVDocument_old, this.onRequestUpdate, this);
        this.documentManager.on("update", this.onRequestUpdate, this);
    }

    protected disconnected()
    {
        this.selection.selectedComponents.off(CVDocument_old, this.onRequestUpdate, this);
        this.documentManager.off("update", this.onRequestUpdate, this);

        super.disconnected();
    }

    protected update(props: PropertyValues)
    {
        this.data = this.documentManager.documents;
        super.update(props);
    }

    protected renderItem(component: CVDocument_old)
    {
        const isActive = component === this.documentManager.activeDocument;
        return html`<div class="ff-flex-row"><ff-icon name=${isActive ? "check" : "empty"}></ff-icon>
            <ff-text class="ff-ellipsis">${component.displayName}</ff-text></div>`;
    }

    protected isItemSelected(component: CVDocument_old)
    {
        return this.selection.selectedComponents.contains(component);
    }

    protected onClickItem(event: MouseEvent, component: CVDocument_old)
    {
        this.documentManager.activeDocument = component;
        this.selection.selectComponent(component);
    }

    protected onRequestUpdate()
    {
        this.requestUpdate();
    }
}