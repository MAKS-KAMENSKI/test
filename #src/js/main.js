let bodyTag = document.getElementsByTagName('body')[0];
let burger = document.querySelector('#burger');
let mobileMenu = document.querySelector('.header__menu');
let header = document.querySelector('.header');


burger.onclick = function () {
	this.classList.toggle('is-active')
	mobileMenu.classList.toggle('is-active')
	header.classList.toggle('is-active')
	bodyTag.classList.toggle('lock')
}

function selectToggle() {
	let selectBody = this.parentElement;

	let others = document.querySelectorAll('.select.is-active');

	others.forEach((other) => {
		if (selectBody !== other) {
			other.classList.remove('is-active');
		}
	});

	selectBody.classList.toggle('is-active');

	let si = selectBody.querySelector('.select__body input');

	if (si && selectBody.classList.contains('is-active')) {
		si.value = '';
		si.focus();
	}
}

function selectChoose() {
	let text = this.innerText,
		select = this.closest('.select'),
		currentText = select.querySelector('.select__current'),
		input = select.querySelector('input');

	currentText.innerText = text;
	input.value = this.dataset.value;

	var eventChange = new Event('change');
	input.dispatchEvent(eventChange);

	select.classList.remove('is-active');
}

function selectSearching() {
	let selectBody = this.parentElement,
		currentValue = this.value;

	let currentItems = selectBody.querySelectorAll('.select__item');

	currentItems.forEach(element => {

		if (element.innerHTML.toUpperCase().indexOf(currentValue.toUpperCase()) >= 0) {
			element.style.display = 'block';
		} else {
			element.style.display = 'none';
		}
	});


}


let select = function () {

	let selectHeader = document.querySelectorAll('.select__header');
	let selectItem = document.querySelectorAll('.select__item');
	let selectSearch = document.querySelectorAll('.select input[type=search]');

	selectHeader.forEach(item => {
		if (!item.classList.contains('init-select')) {
			item.classList.add('init-select');
			item.addEventListener('click', selectToggle);
			let select = item.closest('.select');
			let selectInput = select.querySelector('input');

			if (selectInput.value) {
				let currentItem = select.querySelector(".select__item[data-value='" + selectInput.value + "']");
				if (currentItem) {
					item.querySelector('.select__current').innerText = currentItem.innerHTML;
				}
			}
		}
	});

	selectItem.forEach(item => {
		item.addEventListener('click', selectChoose);
	});

	selectSearch.forEach(searchItem => {
		searchItem.addEventListener('keyup', selectSearching);
	});


	document.body.onclick = function (e) {
		e = e || event;
		var target = e.target || e.srcElement;
		if (!target.classList.contains('select') && !target.closest('.select')) {
			document.querySelectorAll('.select').forEach(item => {
				item.classList.remove('is-active');
			});
		}
	};

};

select();


let range = document.querySelector('.range__input');
let rangeValue = document.querySelector('.range__value');

rangeValue.textContent = range.value;

range.oninput = function () {
	rangeValue.textContent = this.value;
}
