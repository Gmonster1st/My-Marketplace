(function () {
	"use strict";

	function $(str) {
		if (str.charAt(0) === "#" && !str.includes(" ")) {
			return document.getElementById(str.substring(1));
		}
		return document.querySelector(str);
	}

	class View {
		constructor(pubSub) {
			this.pubSub = pubSub;
			this.active = { items: $("#active-listings") };
		}

		init() {
			this.bindEvents([
				{ id: "search-icon", event: "popSearch" },
				{ id: "cart-icon", event: "popMenu" },
				{ id: "newListing", event: "newListing" },
				{ id: "editList", event: "editList" },
				{ id: "backToMain", event: "backToMain" },
				{ id: "newListing", event: "newListing" },
			]);
			this.pubSub.subscribe("listUpdated", this.updateList.bind(this));
		}

		bindEvents(elementsArray) {
			var pubSub = this.pubSub;
			elementsArray.forEach(function (element) {
				$("#" + element.id).addEventListener("click", function () {
					pubSub.publish(element.event);
				});
			});

			function clickOnItemHandler(ev) {
				var item = ev.target;
				var parent = item.parentElement;
				if (parent.nodeName === "LI") {
					parent.setAttribute("data-selected", ""); // Only for debugging for the moment
					pubSub.publish("selectItem", parent.id);
				}
			}

			this.active.items.addEventListener("click", clickOnItemHandler);
			this.popItemsHandler("#float-menu", null, true);
			this.popItemsHandler("#float-search", "#search");
		}

		popItemsHandler(id, secondaryElement, mouseLeave) {
			$(id).addEventListener("transitionend", (event) => {
				if (secondaryElement) {
					$(secondaryElement).focus();
				} else {
					event.target.focus();
				}
			});

			if (mouseLeave) {
				$(id).addEventListener("mouseleave", () => {
					this.hidePopItem(id);
				});
			}

			$(id).addEventListener("focusout", () => {
				this.hidePopItem(id);
			});
		}

		updateList(listObject) {
			var list = this[listObject.listName];
			// var dialog = list.items.removeChild(list.dialog);
			list.items.innerHTML = "";
			listObject.listItems.forEach(function (itemText, index) {
				var item = this.element.cloneNode();
				item.setAttribute("id", index + "-" + listObject.listName);
				item.innerHTML = itemText;
				list.items.appendChild(item);
			}, this);
			list.items.appendChild(dialog);
		}

		clearSelectedItem() {
			var item = $("li[data-selected]");
			if (item) {
				item.removeAttribute("data-selected");
			}
		}

		showDefaultTab() {
			this.defaultTab.checked = true;
		}

		showEditTab(text) {
			$("textarea").value = text;
			$("#newOrEditTab").checked = true;
		}

		getListingData() {
			return {
				name: $("#name").value,
				email: $("#email").value,
				phoneNumber: $("#phone").value,
				itemDescription: $("#description").value,
				tags: this.getRenderedTags(),
			};
		}

		getRenderedTags() {
			let tags = [];
			let renderedItems = document.querySelectorAll(".rendered-item");
			renderedItems.forEach((element) => {
				tags.push(element.textContent);
			});
			return tags;
		}

		popMenu() {
			$("#float-menu").style.top = "5px";
		}

		popSearch() {
			$("#float-search").style.top = "55px";
		}

		hidePopItem(id) {
			$(id).style.top = "-500px";
		}

		changeElementValue(id, text) {
			$(id).value = text;
		}

		changeElementInnerHtml(id, text) {
			$(id).innerHTML = text;
		}

		unlockInputs() {
			document
				.querySelectorAll("[type='text']")
				.forEach((element) => (element.readOnly = false));
			$("#description").readOnly = false;
		}

		addTagInput() {
			let input = document.createElement("input");
			input.setAttribute("type", "text");
			input.setAttribute("id", "newTag");
			$("#tags span").appendChild(input);
			input.addEventListener("keydown", (event) => {
				if (event.key === "Enter") {
					addTag(input.value);
					input.value = "";
				}
				input.width = input.value.length.toString() + "em";
			});
			input.addEventListener("keyup", (event) => {
				input.style.width = (input.value.length * 8).toString() + "px";
			});
		}
	}

	function addTag(text) {
		let span = document.createElement("span");
		let a = document.createElement("a");
		let img = document.createElement("img");

		span.className = "rendered-item";
		span.textContent = text;
		a.className = "delete-tag";
		img.setAttribute("src", "./assets/Icons/Grey_close_x.svg");

		a.appendChild(img);
		span.appendChild(a);
		$("#tags span").insertBefore(span, $("#newTag"));
		console.log(span);
	}

	myApp.View = View;
})();
