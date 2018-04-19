//the food list
var food_pickup = {};

// client food class
class Food {
	constructor(scene, id, type, startx, starty, value) {
		this.id = id;
		this.powerup = value;

		this.item = scene.add.image(startx, starty, "star");
		scene.physics.world.enable(this.item);
		this.item.par_obj = this; // Just to associate this id with the image
	}
};

// function called when new food is added at the server.
function onItemUpdate (data) {
	var new_food = new Food(this, data.id, data.type, data.x, data.y);
	food_pickup[data.id] = new_food;
	this.physics.add.collider(player.body, new_food.item, pickup_food, null, this);
}

// function called when food needs to be removed at the client.
function onItemRemove (data) {

	if (!(data.id in food_pickup))
		return;

	//destroy the phaser object
	food_pickup[data.id].item.destroy();

	delete food_pickup[data.id];
}
