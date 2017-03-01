/**
 * Simple Typescript flUX implementation
 */
export module Stux {
    /**
     * signature for listener callbacks
     */
    interface Listener<P> {
        (params?: P): Promise<any> | void;
    }
    /**
     * interface for triggering actions and managing listeners
     */
    interface Action<P> {
        trigger(params?: P): Promise<any>;
        listen(listener: Listener<P>): ActionDeleter;
        remove(listener: Listener<P>): void;
    }
    /**
     * callback used to unregister a listener on an action
     */
    interface ActionDeleter {
        (): void;
    }
    /**
     * an action that behaves like a function (because it is), so you can
     * invoke it as action() instead of action.trigger(...)
     */
    interface ActionFunction<P> extends Action<P> {
        (params?: P): Promise<any>;
    }
    /**
     * create an action
     */
    function createAction<P>(): ActionFunction<P>;
    /**
     * create a new action that will fire when all of its component actions
     * have fired.  Once fired, it will reset itself and will fire again once
     * all component actions re-fire.
     */
    function joinActions(...actions: Action<any>[]): Action<any>;
    /**
     * A store of items
     */
    class Store<P> implements Action<P> {
        private action;
        constructor();
        trigger(params?: P): Promise<any>;
        listen(listener: Listener<P>): ActionDeleter;
        remove(listener: Listener<P>): void;
        listenTo<P2>(action: Action<P2>, callback: Listener<P2>): void;
        data(): P;
    }
    /**
    * mixin for React components
    * provides a mechanism to easily listen to actions and unlisten when component unmounts
    * Usage:
    *
    *    @Stux.Component
    *    class MyComponent {
    *
    *      // Stux.Component declarations
    *      linkState: <P>(store: Stux.Store<P>, state: string) => void;
    *      listenTo: <P>(action: Stux.Action<P>, callback: Stux.Listener<P>) => void;
    *
    *      constructor() {
    *        this.linkState(MyStore, "values");
    *      }
    *    }
    */
    function Component(target: Function): void;
}
