// TODO(@erictelkkala): convert into MongoDB driver from: https://deno.land/x/mongo@v0.31.1
import { DataTypes, Model } from '../utils/deps.ts';

export enum Categories {
	Electronics = 'Electronics',
	Home = 'Home',
	Clothing = 'Clothing',
	Toys = 'Toys',
	Books = 'Books',
	Sports = 'Sports',
	Tools = 'Tools',
	Other = 'Other',
}

export interface ItemModel {
	_id?: string;
	listing_title: string;
	listing_description: string;
	listing_price: number;
	listing_image: string;
	listing_category: Categories;
}

class Item extends Model {
	static table = 'items';
	static timestamps: true;
	static fields = {
		_id: { primaryKey: true },
		listing_title: { type: DataTypes.STRING, required: true },
		listing_description: { type: DataTypes.STRING, required: true },
		listing_price: {
			type: DataTypes.INTEGER,
			required: false,
			default: 0,
			min: [0, 'The price cannot be negative'],
			max: [1000000, 'The price cannot be more than 1 million'],
			listing_image: { type: DataTypes.STRING, required: true },
			listing_category: {
				type: DataTypes.ENUM,
				values: [
					'Electronics',
					'Home',
					'Clothing',
					'Toys',
					'Books',
					'Sports',
					'Tools',
					'Other',
				],
				message:
					'The category must be one of the following: Electronics, ome, Clothing, Toys, Books, Sports, Tools, Other',
				default: 'Other',
				required: true,
			},
		},
	};
}

export default Item;
