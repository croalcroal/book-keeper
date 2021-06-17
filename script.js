function el_by_id(s) {
	return document.getElementById(s);
}

const modal = el_by_id('modal');
const modalShow = el_by_id('show-modal');
const modalClose = el_by_id('close-modal');
const bookmarkForm = el_by_id('bookmark-form');
const websiteNameEl = el_by_id('website-name');
const websiteUrlEl = el_by_id('website-url');
const bookmarksContainer = el_by_id('bookmarks-container');

let bookmarks = [];

// show modal, focus on 1st input
function showModal() {
	modal.classList.add('show-modal');
	websiteNameEl.focus();
}

// Modal Event listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => { modal.classList.remove('show-modal') });
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate form
function validate(nameValue, urlValue) {
	const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
	const regex = new RegExp(expression);
	if (!nameValue || !urlValue) {
		alert('Please submit values for both fields.');
		return false;
	}
	if (!urlValue.match(regex)) {
		alert('Please provide a valid web address.');
		return false;
	}
	// Valid
	return true;
}

// build bookmarks DOM
function buildBookmarks() {
	bookmarksContainer.textContent = '';
	// build items
	bookmarks.forEach((bookmark) => {
		// remove all bookmark elements
		const { name, url } = bookmark;
		// item 
		const item = document.createElement('div');
		item.classList.add('item');
		// close icon
		const closeIcon = document.createElement('i');
		closeIcon.classList.add('fas', 'fa-times');
		closeIcon.setAttribute('title', 'Delete Bookmark');
		closeIcon.setAttribute('onClick', `deleteBookmark('${url}')`);
		// favicon / link
		const linkInfo = document.createElement('div');
		linkInfo.classList.add('name');
		//favicon
		const favicon = document.createElement('img');
		favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
		favicon.setAttribute('alt', 'favicon');
		const link = document.createElement('a');
		link.setAttribute('href', `${url}`);
		link.setAttribute('target', '_blank');
		link.textContent = name;

		// Append to bookmarks container
		linkInfo.append(favicon, link);
		item.append(closeIcon, linkInfo);
		bookmarksContainer.appendChild(item);

	});
}

// Fetch bookmarks
function fetchBookmarks(e) {
	// Get bookmarks from localstorage if avail
	if (localStorage.getItem('bookmarks')) {
		bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
	} else {
		// Create bookmarks array in localstorage
		bookmarks = [
			{
				name: 'test',
				url: 'https://www.google.com',
			}
		];
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	}
	buildBookmarks();
}

// Delete a bookmark
function deleteBookmark(url) {
	bookmarks.forEach((bookmark, i) => {
		if (bookmark.url === url) {
			bookmarks.splice(i, 1);
		}
	});
	// update bookmarks array in local storage/repopulate dom
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	fetchBookmarks();
}

// Handle data from form
function storeBookmark(e) {
	e.preventDefault();
	const nameValue = websiteNameEl.value;
	let urlValue = websiteUrlEl.value;
	// Add 'https://' if not there
	if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
		urlValue = `https://${urlValue}`;
	}
	// Validate
	if (!validate(nameValue, urlValue)) {
		return false;
	}
	// Set bookmark object, add to array
	const bookmark = {
		name: nameValue,
		url: urlValue,
	};
	bookmarks.push(bookmark);
	// Set bookmarks in localStorage, fetch, reset input fields
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

	fetchBookmarks();
	bookmarkForm.reset();
	websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// on load fetch bookmarks
fetchBookmarks();