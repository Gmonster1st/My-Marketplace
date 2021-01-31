(function () {
	"use strict";

	var ACTIVE_LISTINGS = "active-listings";
	// var COMPLETED = "completed";
	var LIST_NAMES = [ACTIVE_LISTINGS];

	/**
	 * Creates a new Model instance, attaches the pubSub reference
	 * and defines current and completed items arrays structure
	 *
	 * @constructor
	 * @param {object} pubSub - Reference to the pubSub object
	 */
	class Model {
		constructor(pubSub) {
			this.pubSub = pubSub;
			this[ACTIVE_LISTINGS] = [];
			// this[COMPLETED] = [];
		}

		/**
		 * Notifies view for a change in a list
		 *
		 * @param {string} listName - Name of list that was changed
		 */
		notify(listName) {
			this.pubSub.publish("listUpdated", {
				listName: listName,
				listItems: this[listName],
			});
		}

		/**
		 * Initialize model by loading items from localStorage
		 */
		init() {
			LIST_NAMES.forEach(function (listName) {
				var items = JSON.parse(localStorage.getItem(listName));
				if (items && items.length > 0) {
					this[listName] = items;
					this.notify(listName);
				}
			}, this);
		}

		/**
		 * Saves list contents to localStorage and notifies
		 *
		 * @param {string} listName - Name of list to be saved
		 */
		saveList(listName) {
			localStorage.setItem(listName, JSON.stringify(this[listName]));
			this.notify(listName);
		}

		/**
		 * Creates a new item.
		 * Item creation is only allowed in 'current' list
		 *
		 * @param {string} theText - Contents of new item
		 */
		createItem(theText) {
			var index = this[ACTIVE_LISTINGS].length;
			this[ACTIVE_LISTINGS].push("");
			this.setItemText(index, theText);
		}

		/**
		 * Swaps two items.
		 * Item swap is only allowed in 'current' list
		 *
		 * @param {number} index1 - First item index
		 * @param {number} index2 - Second item index
		 */
		swapItems(index1, index2) {
			var tmp = this[ACTIVE_LISTINGS][index1];
			this[ACTIVE_LISTINGS][index1] = this[CURRENT][index2];
			this[ACTIVE_LISTINGS][index2] = tmp;
			this.saveList(ACTIVE_LISTINGS);
		}

		/**
		 * Deletes an existing item
		 * Item deletion is only allowed in 'completed' list
		 *
		 * @param {number} index - Index number of item to be deleted
		 */
		deleteItem(index) {
			this[ACTIVE_LISTINGS].splice(index, 1);
			this.saveList(ACTIVE_LISTINGS);
		}

		// /**
		//  * Moves an item across lists
		//  *
		//  * @param {number} index - Index number of item to be moved
		//  * @param {isCurrent} boolean - True: item is current so move to completed,
		//  * False: item is completed so move to current
		//  */
		// switchItem(index, isCurrent) {
		// 	var fromList = isCurrent ? CURRENT : COMPLETED;
		// 	var toList = isCurrent ? COMPLETED : CURRENT;
		// 	this[toList].push(this[fromList].splice(index, 1)[0]);
		// 	this.saveList(CURRENT);
		// 	this.saveList(COMPLETED);
		// }

		/**
		 * Changes an item's contents
		 * Items' contents changes are only allowed in 'current' list
		 * Care is taken for special characters
		 *
		 * @param {number} index - Index number of item to be changed
		 * @param {string} theText - Text to be inserted as item's contents
		 */
		setItemText(index, theText) {
			this[ACTIVE_LISTINGS][index] = theText
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");
			this.saveList(ACTIVE_LISTINGS);
		}
		/**
		 * Reads an item's contents
		 * Items' contents reading is only allowed in 'current' list
		 * Care is taken for special characters
		 *
		 * @param {number} index - Index number of item to be read
		 * @returns {string}
		 */
		getItemText(index) {
			return this[ACTIVE_LISTINGS][index]
				.replace(/&amp;/g, "&")
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">")
				.replace(/&quot;/g, '"')
				.replace(/&#039;/g, "'");
		}
	}

	myApp.Model = Model;
})();
