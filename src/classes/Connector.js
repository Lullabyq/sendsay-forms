export class Connector {

	constructor(url) {
		this.url = url;
	}


	promiseHandler(resolve, reject) {
		var self = this;
		this.request.onreadystatechange = function() {
			if(self.request.readyState == 4) {
				self.pending = false;
				var success = true;
				if(self.request.onReady)
					success = self.request.onReady.apply(self);
				if(self.request.status == 200 && success ) {
					resolve(self.data);
				} else {
					reject(false);
				}
			}
		}
		this.pending = true;
		this.request.send(this.params);
	}


	load() {
		if(this.pending)
			return;
		this.request = new XMLHttpRequest();
		this.request.open('GET', this.url, true);
		this.request.setRequestHeader('Content-Type', 'application/json');
		return (new Promise(this.promiseHandler.bind(this))).then(this.handleLoadSuccess.bind(this),
																	this.handleLoadFail.bind(this));
	}



	transformAnswer(json) {

		this.data = {
			endDialogMessage: 'Спасибо за заполнение формы!',
			elements: [
				{
					type: 'text',
					text: '<div style="font-size: 16px; padding-bottom: 10px; font-weight: bold;">Подписка на рассылку</div>'
				}
			]
		};

		this.data.active = json.state == '1' || false;
		if(json.fields) {
			let fields = json.fields;
			for(var key in fields) {
				let field = fields[key];
				if(field.type !== 'submit') {
					this.data.elements.push({
						type: field.type == 'text' ? 'field' : field.type,
						qid: field.name,
						name: field.name,
						label: field.label,
						subtype: field['data_type'],
						required: field.required == '1'
					});
				}
			}
			this.data.elements.push({
					type: 'button',
					text: 'Подписаться',
					align: 'justify'
				});
		}
		if(json.name)
			this.data.title = json.name;

	}

	submit(params) {
		if(this.pending)
			return;
		this.request = new XMLHttpRequest();
		this.request.open('POST', this.url , true);
		this.request.setRequestHeader('Content-Type', 'application/json');
		this.request.onReady = this.handleSubmitResult;

		this.params = JSON.stringify(params);


		return (new Promise(this.promiseHandler.bind(this)));
	}

	handleSubmitResult() {

		let el = document.createElement('div');
		el.innerHTML = this.request.responseText;
		let infoEls = el.querySelectorAll('#container div span');
		let info = {
					general: infoEls[0] && infoEls[0].innerHTML && infoEls[0].innerHTML.trim(),
					specific: infoEls[1] && infoEls[1].innerHTML && infoEls[1].innerHTML.trim()
				}
		if(!info.general || info.general === 'Благодарим за заполнение формы') {
			return true;
		} else {
			this.error =info;
			return false; 
		}

	}

	handleLoadSuccess() {

		var rawJson = this.request.responseText; 
		var json = JSON.parse(rawJson);
		this.transformAnswer(json);
	}

	handleLoadFail() {

	}
}