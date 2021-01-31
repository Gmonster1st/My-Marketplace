(function () {
	"use strict";

	var selectedItemIndex = -1;

	class Controller {
		constructor(model, view, pubSub) {
			this.model = model;
			this.view = view;
			this.pubSub = pubSub;
		}

		init() {
			this.view.init();
			this.model.init();
			this.bindEvents([
				{ name: "selectItem", handler: this.selectItem },
				{ name: "popMenu", handler: this.popMenu },
				{ name: "popSearch", handler: this.popSearch },
				{ name: "newListing", handler: this.newListing },
				{ name: "editList", handler: this.editList },
				{ name: "backToMain", handler: this.backToMain },
				// { name: "deselectItem", handler: this.clearSelectedItemIndex },
				// { name: "moveUp", handler: this.moveUp },
				// { name: "moveDown", handler: this.moveDown },
				// { name: "complete", handler: this.complete },
				// { name: "reactivate", handler: this.reactivate },
				// { name: "delete", handler: this.delete },
				{ name: "edit", handler: this.edit },
				{ name: "finishEdit", handler: this.finishEdit },
				{ name: "cancelEdit", handler: this.cancelEdit },
				// { name: "closeDialog", handler: this.closeDialog },
			]);
		}

		bindEvents(eventsArray) {
			eventsArray.forEach(function (event) {
				this.pubSub.subscribe(event.name, event.handler.bind(this));
			}, this);
		}

		clearSelectedItemIndex() {
			selectedItemIndex = -1;
		}

		selectItem(id) {
			this.loadPage()
				.then(() =>
					this.view.changeElementInnerHtml("header", "Details")
				)
				.then(() => {
					// For Testing
					this.view.changeElementValue("#name", "Test Name");
				})
				.finally();
			selectedItemIndex = parseInt(id);
		}

		popMenu() {
			this.view.popMenu();
		}

		popSearch() {
			this.view.popSearch();
		}

		newListing() {
			this.loadPage()
				.then(() => {
					this.view.changeElementInnerHtml("header", "New Listing");
				})
				.then(this.view.unlockInputs)
				.finally(this.view.addTagInput);
			this.view.hidePopItem("#float-menu");
		}

		editList() {}

		backToMain() {
			location.reload();
		}

		moveUp() {
			this.model.swapItems(selectedItemIndex - 1, selectedItemIndex);
			this.closeDialog();
		}

		moveDown() {
			this.model.swapItems(selectedItemIndex, selectedItemIndex + 1);
			this.closeDialog();
		}

		// complete() {
		// 	this.model.switchItem(selectedItemIndex, true);
		// 	this.closeDialog();
		// }
		// reactivate() {
		// 	this.model.switchItem(selectedItemIndex, false);
		// 	this.closeDialog();
		// }

		delete() {
			this.model.deleteItem(selectedItemIndex);
			this.closeDialog();
		}

		edit() {
			this.closeDialog(true);
			this.view.showEditTab(this.model.getItemText(selectedItemIndex));
		}

		finishEdit() {
			if (selectedItemIndex === -1) {
				this.model.createItem(this.view.getTextarea());
			} else {
				this.model.setItemText(
					selectedItemIndex,
					this.view.getTextarea()
				);
			}
			this.cancelEdit();
		}

		cancelEdit() {
			this.clearSelectedItemIndex();
			this.view.showDefaultTab();
		}

		closeDialog(keepSelected) {
			if (!keepSelected) {
				this.clearSelectedItemIndex();
			}
			this.view.clearSelectedItem();
		}

		loadPage() {
			return fetch("form.html")
				.then((response) => response.text())
				.then((data) => this.view.changeElementInnerHtml("main", data));
		}
	}

	myApp.Controller = Controller;
})();
