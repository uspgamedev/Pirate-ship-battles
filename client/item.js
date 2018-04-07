//the food list
var food_pickup = {};

// client food class
class Food {
	constructor(scene, id, type, startx, starty, value) {
		this.id = id;
		this.x = startx;
		this.y = starty;
		this.powerup = value;

		this.item = scene.add.image(startx, starty, "star")

		// TODO: Add collision
	}
};

// function called when new food is added in the server.
function onItemUpdate (data) {
	food_pickup[data.id] = new Food(this, data.id, data.type, data.x, data.y);
}

// function called when food needs to be removed in the client.
function onItemRemove (data) {

	if (!(data.id in food_pickup))
		return;

	//destroy the phaser object
	food_pickup[data.id].item.destroy(true,false);

	delete food_pickup[data.id];
}
