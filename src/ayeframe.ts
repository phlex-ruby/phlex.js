import { morph } from "morphlex";

const Actions = new Map<string, (event: Event) => void>();

function error(): void {
	throw new Error("Target or node not found");
}

Actions.set("morph", ({ target, node }) => {
	if (target && node) {
		morph(target, node);
	} else {
		error();
	}
});

Actions.set("replace", ({ target, node }) => {
	if (target && node) {
		target.replaceWith(node);
	} else {
		error();
	}
});

Actions.set("append", ({ target, node }) => {
	if (target && node) {
		target.appendChild(node);
	} else {
		error();
	}
});

Actions.set("prepend", ({ target, node }) => {
	if (target && node) {
		target.prepend(node);
	} else {
		error();
	}
});

Actions.set("refresh", () => {
	fetch(document.location.href).then((response) => {
		if (response.ok) {
			response.text().then((text) => {
				morph(document.documentElement, text);
			});
		}
	});
});

Actions.set("remove", ({ target }) => {
	target?.remove();
});

Actions.set("navigate", ({ node }) => {
	if (node) morph(document.documentElement, node);
});

interface Event {
	readonly node: Element | null;
	readonly target: HTMLElement | null;
}

async function createEvent(href: string, targetId: string | undefined, fragment: string | undefined): Promise<Event> {
	const headers = new Headers();
	if (fragment) headers.append("X-Fragment", fragment);

	const event = await fetch(href, { headers }).then(async (response): Promise<Event> => {
		return await response.text().then((text): Event => {
			const template = document.createElement("template");
			template.innerHTML = text;
			const node = template.content.firstElementChild;
			const target = targetId ? document.getElementById(targetId) : null;

			return {
				target,
				node,
			};
		});
	});

	return event;
}

export function ayeFrame(): void {
	// document.addEventListener("submit", (event) => {
	// 	if (event.target instanceof HTMLFormElement) {
	// 		console.log("submitted a form");
	// 	}
	// });

	document.addEventListener("click", (event) => {
		const link = event.target;

		if (link instanceof HTMLAnchorElement) {
			if (event.metaKey || event.ctrlKey || event.shiftKey) return;

			if (link.ariaDisabled) {
				event.preventDefault();
				return;
			}

			const href = link.href;
			const action = link.dataset.action;
			const targetId = link.dataset.target;
			const fragment = link.dataset.fragment;

			if (action) {
				event.preventDefault();
				link.ariaDisabled = "true";

				createEvent(href, targetId, fragment).then((event) => {
					const actionMethod = Actions.get(action);
					if (actionMethod) actionMethod(event);

					link.ariaDisabled = null;
				});
			}
		}
	});
}
