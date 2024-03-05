interface Event {
	readonly targetNode: Element | null;
	readonly newNode: Element | null;
}
export declare function init(): void;
export declare function defineAction(name: string, action: (event: Event) => void): void;
export {};
