import logger from '../utils/logger.ts';
import Item, { ItemModel } from './itemSchema.ts';

/**
 * @remarks - Can accept any type
 * @param err - Error to be printed
 */

function handleError(err: string) {
	logger.error(err);
}

/**
 * @param item - Item to be added
 * @returns An item document
 */
async function addItem(item: ItemModel) {
	const newItem = new Item;
	newItem.listing_title = item.listing_title;
	newItem.listing_description = item.listing_description;
	newItem.listing_image = item.listing_image;
	newItem.listing_category = item.listing_category;
	newItem.listing_price = item.listing_price;

	if (!newItem.listing_price) {
		newItem.listing_price = 0;
	}
	logger.info(`Adding item ${newItem}`);
	try {
		await newItem.save();
	} catch (e) {
		logger.error(e);
	}
	return newItem;
}

/**
 * @param id - _id of the item
 */
async function deleteItem(id: string) {
	try {
		await Item.deleteById(id);
	} catch (e) {
		return handleError(e);
	}
}

/**
 * @param id - _id of the item
 */
async function findOneItem(id: string) {
	return await Item.find(id)
}

/**
 * @returns Array of items
 */
async function getAllItems() {
	return await Item.all()
}

export { addItem, deleteItem, findOneItem, getAllItems };
