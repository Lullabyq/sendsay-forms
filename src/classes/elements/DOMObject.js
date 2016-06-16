
export class DOMObject {

	constructor(data, parent) {
		this.data = data;
		this.parent = parent || null;
		if(parent && parent.general)
		 	this.general = this.extend({}, parent.general);
		this.initialize();
		this.render();

	}


	escapeHTML(html) {
		let escape = document.createElement('textarea');
	    escape.textContent = html;
	    return escape.innerHTML;
	}

	initialize() {

		this.template = '<div></div>';
		this.baseClass = 'sendsay-main';
		this.applicableStyles = {

		};
	}

	makeElement() {
		let div = document.createElement('div'),
			element = this.applySettings(this.makeSettings());
		div.innerHTML = element;
		return div.firstChild;
	}

	makeSettings() {
		let data = this.data,
			settings = {
				classes: this.makeClasses(),
				style: this.convertStyles(this.makeStyles())
			};
		return settings;
	}

	makeStyles() {
		let styleObj = this.applyStyles(this.applicableStyles);
		return styleObj;
	}

	applyStyles(mapping) {
		let styles = {},
			data = this.data.appearance || {},
			general = this.general && this.general.appearance || {};
	
		for(var key in mapping) {
			let val = mapping[key];
			if(data[val.param] !== undefined || general[val.param] != undefined) {
				styles[key] = (data[val.param] || general[val.param]) + (val.postfix ? val.postfix : '');
			} else if(val.default) {
				styles[key] = val.default;
			}
		}
		return styles;
	}

	convertStyles(toConvert) {
		let styleObj = toConvert,
			styleStr = '';

		for(var key in styleObj)
			styleStr += ' ' + key + ':' + styleObj[key] + ';';
		return styleStr;
	}

	makeClasses() {
		return this.baseClass;
	}

	applySettings(settings) {
		settings = settings || {};
		let string = this.template;
		let templateParams = string.match(new RegExp('\\[% *[a-zA-Z0-9\\-]* *%\\]', 'g')) || [];
		for(let i=0; i<templateParams.length; i++) {
			let param = templateParams[i];
			param = param.substring(2, param.length-2);
			let paramValue = settings[param.trim()] || '';
			string = string.replace(new RegExp('\\[%' + param + '%\\]', 'g'), paramValue);
		}
		return string;
	}

	build() {
		this.el = this.makeElement();
		this.el.core = this;
		return this.el;
	}

	render() {
		let oldEl = this.el;
		this.removeEvents();
		this.build();
		this.addEvents();
		if(oldEl && oldEl.parentNode)
			oldEl.parentNode.replaceChild(this.el, oldEl);
		this.afterRender();
	}

	afterRender() {

	}

	addEvents() {

	}

	addEvent(event, selector, callback) {
		this._eventAction(true, event, selector, callback);
	}

	removeEvents() {

	}

	removeEvent(event, selector, callback) {
		this._eventAction(false, event, selector, callback);
	}

	_eventAction(toAdd, event, selector, callback) {
		if(!this.el)
			return;
		if(callback === undefined && typeof selector === 'function') {
			callback = selector;
			selector = null;
		}
		let target = selector ? this.el.querySelector(selector) : this.el;
		if(target)
			toAdd ? target.addEventListener(event, callback) : target.removeEventListener(event, callback); 
	}

	trigger(eventName, data) {
		let event, extra = { extra : data };
		if(CustomEvent && typeof CustomEvent === 'function') {
			event = new CustomEvent(eventName, { detail: extra });
		} else {
			event = document.createEvent('HTMLEvents');
			event.initEvent(eventName, true, true);
			event.detail = extra;
		}

		this.el.dispatchEvent(event);
	}

	extend(dest, source) {
		dest = dest || {};
		source = source || {};
		for(let key in source) {
			if((dest[key] instanceof Object) && (source[key] instanceof Object))
				dest[key] = this.extend(dest[key], source[key]);
			else
				dest[key] = source[key];
		}
		return dest;
	}
}