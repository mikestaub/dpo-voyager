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

import Controller, { Actions } from "@ff/core/Controller";
import Commander from "@ff/core/Commander";
import RenderSystem from "@ff/scene/RenderSystem";

import Task from "../tasks/Task";
import taskSets from "../tasks/taskSets";

////////////////////////////////////////////////////////////////////////////////

export type TaskSet = "prep" | "author";
export type TaskActions = Actions<TaskController>;


export default class TaskController extends Controller<TaskController>
{
    static readonly changeEvent = "change";

    readonly system: RenderSystem;

    protected _tasks: Task[] = [];
    protected _activeTaskIndex: number = 0;
    protected _currentSet: TaskSet = null;
    protected _expertMode = false;

    constructor(system: RenderSystem, commander: Commander)
    {
        super(commander);
        this.addEvents(TaskController.changeEvent);

        this.system = system;
        this.taskSet = "prep";
    }

    createActions(commander: Commander)
    {
        return {

        };
    }

    get taskSet() {
        return this._currentSet;
    }

    set taskSet(set: TaskSet) {
        if (set !== this._currentSet) {
            this._currentSet = set;
            const taskTypes = taskSets[set] as any;
            this._tasks = taskTypes.map(type => new type(this));
            this.emit(TaskController.changeEvent);
        }
    }

    get expertMode() {
        return this._expertMode;
    }

    set expertMode(state: boolean) {
        this._expertMode = state;
        this.emit(TaskController.changeEvent);
    }

    get activeTaskIndex() {
        return this._activeTaskIndex;
    }

    set activeTaskIndex(index: number) {
        if (index !== this._activeTaskIndex) {
            this._activeTaskIndex = index;
            this.emit(TaskController.changeEvent);
        }
    }

    getActiveTask() {
        return this._tasks[this._activeTaskIndex];
    }

    toggleExpertMode()
    {
        this.expertMode = !this.expertMode;
    }

    getTasks(): Readonly<Task[]>
    {
        return this._tasks;
    }
}