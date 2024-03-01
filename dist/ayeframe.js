import { morph } from "morphlex";
export function ayeFrame() {
	createFrame("morph", (targetNode, content) => {
		if (targetNode && content) morph(targetNode, content);
	});
	createFrame("replace", (targetNode, content) => {
		if (targetNode && content) targetNode.replaceWith(content);
	});
	createFrame("append", (targetNode, content) => {
		if (targetNode && content) targetNode.appendChild(content);
	});
	createFrame("prepend", (targetNode, content) => {
		if (targetNode && content) targetNode.prepend(content);
	});
	createFrame("remove", (targetNode) => {
		if (targetNode) targetNode.remove();
	});
}
function createFrame(name, action) {
	for (const frame of document.querySelectorAll("iframe")) frame.name === name && frame.remove();
	const frame = document.createElement("iframe");
	frame.name = name;
	frame.hidden = true;
	frame.loading = "lazy";
	frame.sandbox.add("allow-same-origin");
	frame.addEventListener("load", () => {
		const id = frame.contentWindow?.location?.hash;
		if (id) {
			action(document.querySelector(id), frame.contentDocument?.body?.firstChild);
		}
	});
	document.body.appendChild(frame);
}
//# sourceMappingURL=ayeframe.js.map
