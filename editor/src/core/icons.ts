const ns = 'http://www.w3.org/2000/svg';

export class Icons {
	public static help =
		'M419-334q1-87 20.5-129t65.5-76q39-31 57.5-61.109T581-666q0-39-25.5-64.5T486-756q-46 0-75 26t-43 67l-120-52q27-74 87-120.5T485.756-882q109.228 0 168.236 62.148Q713-757.703 713-669q0 60-21 105.5T625-478q-46 40-57 65.5T557-334H419Zm66.788 282Q447-52 420-79t-27-65.496q0-38.495 26.92-65.5Q446.841-237 485.92-237 525-237 552-209.996q27 27.005 27 65.5Q579-106 551.788-79q-27.213 27-66 27Z';
	public static close = 'm249-183-66-66 231-231-231-231 66-66 231 231 231-231 66 66-231 231 231 231-66 66-231-231-231 231Z';
	public static add = 'M433-183v-250H183v-94h250v-250h94v250h250v94H527v250h-94Z';

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
