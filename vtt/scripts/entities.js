class Entity {
    constructor(x, y) {
        this.cell = $(`.${x}_${y}`); // reference to current cell
        this.cell.addClass('entity');

        this.x = Number(x);
        this.y = Number(y);
        this.char = "@";
        this.prev = this.cell.text(); // get previous content of the cell
        this.unique_ID = ""; // future placeholder
        
        // cell.innerText = this.char; // override prev char
        this.cell.text(this.char); // override prev char

        entities.push(this); // insert self into entities array

        this.active = false;
    }

    move(dr, dc) {
        if (this.active) {
            let failsafe = 0;
            while (dr != 0 || dc != 0) { 
                /* this funky math loop moves 1 unit at a time until satisfied */
                this.move_to(this.x + (dr / (dr != 0 ? Math.abs(dr) : 1)), this.y + (dc / (dc != 0 ? Math.abs(dc) : 1)));
                if (dr != 0) dr -= (dr / Math.abs(dr));
                if (dc != 0) dc -= (dc / Math.abs(dc));
                
                if (failsafe++ > 100) {
                    console.error("Error: infinite loop in move()?");
                    break;
                }

            }
        }
    }

    move_to(x, y) {
        // check out of bounds
        x = Math.min(Math.max(x, 1), MAX_HEIGHT - 2);
        y = Math.min(Math.max(y, 1), MAX_WIDTH - 2);

        // TODO: check if cell already occupied
        if (!is_empty(x, y)) {
            // console.debug(`(${x}, ${y}) already occupied.`);
            return;
        }

        // clean up old cell
        this.cell.text(this.prev); // restore current cell's prev text
        this.cell.removeClass('entity');
        
        if (this.active) {
            this.cell.removeClass("focused");
        }

        // assign new cell
        this.cell = $("." + x + "_" + y); // get new address
        this.prev = this.cell.text();
        this.cell.text(this.char);
        this.cell.addClass('entity');
        
        if (this.active) {
            this.cell.addClass("focused");
        }

        this.x = Number(x);
        this.y = Number(y);
    }

    reveal() {
        // ensure Entity is visible in its current cell
        // console.debug("Entity revealed");
        this.cell = $(`.${this.x}_${this.y}`); // reference to current cell
        
        if (this.x == MAX_HEIGHT - 1 || this.y == MAX_WIDTH - 1) return; // don't reveal if overlaps with border

        this.cell.addClass('entity');
        this.cell.text(this.char);

        if (this.active) {
            this.cell.addClass("focused");
        }
    }

    destroy() {
        this.cell.text(this.prev);
        this.cell.removeClass('entity');
        
        // if (this.active) {
        this.cell.removeClass('focused');
        // }
        
        // entities.delete(get_entity_index(this));
        entities.splice(get_entity_index(this), 1);
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y); // call base class constructor
        this.char = "o";
        this.cell.addClass("player");
        this.reveal();
    }

    destroy() {
        super.destroy(); // call base class destructor
        this.cell.removeClass('player');
    }
}

class Wall extends Entity {
    constructor(x, y) {
        super(x, y);
        this.char = '█';
        this.cell.addClass('wall');
        this.reveal();
    }

    move(x, y) {
        return; // walls can't move, silly!
    }

    destroy() {
        super.destroy();
        this.cell.removeClass('wall');
    }
}

// function kill_entity(entity) {
//     if (typeof(entity) == Entity) {
//         entity.destroy();
//         console.debug(`Entity deleted. New Entities array: ${entities}`);
//     } else {
//         console.warn("Error: Input to kill_entity() not an entity.");
//     }
// }

function kill_entity_at_index(i) {
    entities[i].destroy();
    // console.debug(`Entity deleted. New Entities array:`);
    // console.debug(entities);
    entities.splice(i, 1); // remove entity from list
}

function kill_entity_at(x, y) {
    kill_entity_at_index(get_entity_index_for(x, y));
}

function get_entity_index(entity) {
    /* return the integer index of the entity in the entities array */
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].x == entity.x && entities[i].y == entity.y) {
            return i;
        }
    }
    return null; // if not found
}

function get_entity_for(x, y) {
    // console.log(entities);
    for (let i = 0; i < entities.length; i++) {
        // console.debug(`Comparing Ent(${entities[i].x}, ${entities[i].y}) to (${x}, ${y})`);
        if (entities[i].x == x && entities[i].y == y) {
            return entities[i];
        }
    }
    console.error(`No entity found for location (${x}, ${y})`)
    return null; // if not found
}

function get_entity_index_for(x, y) {
    console.log(entities);
    for (let i = 0; i < entities.length; i++) {
        // console.debug(`Comparing Ent(${entities[i].x}, ${entities[i].y}) to (${x}, ${y})`);
        if (entities[i].x == x && entities[i].y == y) {
            return i;
        }
    }
    console.error(`No entity found for location (${x}, ${y})`)
    return null; 
}

