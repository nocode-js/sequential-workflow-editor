const ns = 'http://www.w3.org/2000/svg';

export class Icons {
	public static help =
		'M431-330q1-72 16.5-105t58.5-72q42-38 64.5-70.5T593-647q0-45-30-75t-84-30q-52 0-80 29.5T358-661l-84-37q22-59 74.5-100.5T479-840q100 0 154 55.5T687-651q0 48-20.5 87T601-482q-49 47-59 72t-11 80H431Zm48 250q-29 0-49.5-20.5T409-150q0-29 20.5-49.5T479-220q29 0 49.5 20.5T549-150q0 29-20.5 49.5T479-80Z';

	public static createSvg(icon: string, cls: string): SVGElement {
		const svg = document.createElementNS(ns, 'svg');
		svg.setAttribute('viewBox', '0 -960 960 960');
		svg.classList.add(cls);
		const path = document.createElementNS(ns, 'path');
		path.setAttribute('d', icon);
		svg.appendChild(path);
		return svg;
	}
}