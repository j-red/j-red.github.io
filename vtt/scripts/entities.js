'use strict';

class Entity {
    constructor(x, y, e = null) {
        if (!is_empty(x, y)) { // check if something already in this cell
            // console.log('cell occupied');
            // return false;
            throw `Cell Already Occupied Error`;
        }

        // this.cell = $(`.${x}_${y}`); // reference to current cell
        this.cell = $('#map').find(`.${x}_${y}`); // only look in map
        this.cell.addClass('entity');
        this.type = 'entity'; // entity, player, wall, etc...

        this.x = Number(x);
        this.y = Number(y);
        this.char = "%";
        this.prev = this.cell.text(); // get previous content of the cell
        this.unique_ID = ""; // future placeholder

        this.health = 1;
        
        this.cell.text(this.char); // override prev char

        entities.push(this); // insert self into entities array

        this.active = false;
        this.canFocus = true;

        return this;
    }

    toggle_focus() {
        if (!this.active && this.canFocus) {
            this.focus();
        } else {
            this.unfocus();
        }
    }

    focus() {
        if (this.canFocus) {
            this.active = true;
            this.cell.addClass("focused");
            // console.debug('added focus');

            focused_entities.push(this);
        }
    }

    unfocus() {
        this.active = false;
        this.cell.removeClass("focused");
        // console.debug('removed focus');

        if (this.canFocus) {
            for (let i in focused_entities) {
                if (this.equals(focused_entities[i])) {
                    focused_entities.splice(i, 1); // remove self from focused array
                }
            }
        }
    }

    async move(dr, dc) {
        if (this.active) {
            let failsafe = 0;
            while (dr != 0 || dc != 0) { 
                /* this funky math loop moves 1 unit at a time until satisfied */
                let target_x = this.x + (dr / (dr != 0 ? Math.abs(dr) : 1));
                let target_y = this.y + (dc / (dc != 0 ? Math.abs(dc) : 1));

                this.move_to(target_x, target_y);
                // new Promise(() => {this.move_to(target_x, target_y)});

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
        this.cell.removeClass(this.type);
        
        if (this.active) {
            this.cell.removeClass("focused");
        }

        // assign new cell
        this.cell = $("." + x + "_" + y); // get new address
        this.prev = this.cell.text();
        this.cell.text(this.char);
        this.cell.addClass('entity');
        this.cell.addClass(this.type);
        
        if (this.active) {
            this.cell.addClass("focused");
        }

        this.x = Number(x);
        this.y = Number(y);
    }

    reveal() {
        /* ensure Entity is visible in its current cell */
        this.cell = $('#map').find(`.${this.x}_${this.y}`) // reference current cell
        
        if (this.x > 0 && this.x < MAX_HEIGHT && this.y > 0 && this.y < MAX_WIDTH) {
            // only reveal if we don't overlap with border
            this.cell.addClass('entity');
            this.cell.addClass(this.type);
            this.cell.text(this.char);
            
            if (this.active) {
                this.cell.addClass("focused");
            }
        }
        return;
    }

    destroy() {
        this.cell.text(this.prev);
        this.cell.removeClass('entity');
        this.unfocus();
        this.active = false;

        this.cell.removeClass(this.type);
        
        entities.splice(get_entity_index(this), 1); // splice self out of entities list
    }

    equals(other) {
        return (this.x === other.x && this.y === other.y && this.type === other.type);
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        // let parent = super(x, y); // execute parent constructor
        // if (parent == false) {
        //     console.log('aborting player');
        //     return false; // abort if parent construction fails
        // } else {
        //     console.log("player OK: ");
        //     console.log(this);
        // }
            

        this.char = "o"; // o☺☻
        this.type = 'player';
        this.cell.addClass("player");
        this.cell.text(this.char);

        this.health = 3;

        // this.reveal();

        return this;
    }
}

class Wall extends Entity {
    constructor(x, y) {
        super(x, y); // call parent constructor
        // let parent = super(x, y); // execute parent constructor
        // if (parent == false) return false; // abort if parent construction fails

        this.char = '█';
        this.cell = $('#map').find(`.${x}_${y}`);
        this.type = 'wall';
        this.cell.addClass('wall');
        this.cell.text(this.char);
        // this.reveal();

        this.health = 10;
        this.canFocus = false;

        return this;
    }

    move(x, y) {
        return; // walls can't move, silly!
    }

    focus() {
        return; // do not allow focus on walls
    }

    toggle_focus() {
        return; // do not allow focus on walls
    }
}

class Wanderer extends Entity {
    constructor (x, y) {
        super(x, y);
                
        this.char = "@";
        this.type = 'wanderer';
        this.cell.addClass("wanderer");
        this.cell.text(this.char);
        this.canFocus = false;
        this.health = 2;
        
        this.wander(); // start wandering

        return this;
    }

    async move() {} // disallow default move

    async move_by(dr, dc) { // movement override
        let failsafe = 0;
        while (dr != 0 || dc != 0) { 
            /* this funky math loop moves 1 unit at a time until satisfied */
            this.move_to(this.x + (dr / (dr != 0 ? Math.abs(dr) : 1)), this.y + (dc / (dc != 0 ? Math.abs(dc) : 1)));
            if (dr != 0) dr -= (dr / Math.abs(dr));
            if (dc != 0) dc -= (dc / Math.abs(dc));
            
            if (failsafe++ > 100) {
                console.error("Infinite loop in Wanderer.move_by()");
                break;
            }

        }
    }

    wander() {
        this.wanderTime = (Math.random() * 1000 * 3) + 1000; // [1, 4] seconds between moves
        this.routine = setInterval(this._wander, this.wanderTime, this);
    }

    _wander(self) {
        // console.log("wandering...");
        // clearInterval(self.routine);

        // let wanderDir = Math.floor(Math.random() * 5); // 0 stay stationary, 1-4 movement dirs

        switch (Math.floor(Math.random() * 5)) {
            case 0:
                break; // do nothing
            case 1:
                // this.move_by(-1, 0);
                self.move_by(-1, 0);
                // console.log(self);
                break;
            case 2:
                // this.move_by(1, 0);
                self.move_by(1, 0);
                // console.log(self);
                break;
            case 3:
                // this.move_by(0, -1);
                self.move_by(0, -1);
                // console.log(self);
                break;
            case 4:
                // this.move_by(0, 1);
                self.move_by(0, 1);
                // console.log(self);
                break;
        }

        // this.routine = setTimeout(() => this.wander(), wanderTime);
        // this.wanderTime = (Math.random() * 1000 * 3) + 1000; // update time to next move
        // self.wander();
    }

    stopWandering() {
        // clearTimeout(this.routine);
        clearInterval(this.routine);
        this.routine = null;
    }

    destroy() {
        // clearTimeout(this.routine); // stop wandering
        clearInterval(this.routine); // stop wandering
        super.destroy(); // call parent destructor
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
    try {
        entities[i].destroy(); // removes self from entities list
        // console.log('Killed index ' + i);
    } catch {}
}

function kill_entity_at(x, y) {
    kill_entity_at_index(get_entity_index_for(x, y));
}

function get_entity_index(entity) {
    /* return the integer index of the entity in the entities array */
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].x === entity.x && entities[i].y === entity.y) {
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
    // console.error(`No entity found for location (${x}, ${y})`)
    return null; // if not found
}

function get_entity_index_for(x, y) {
    // console.log(entities);
    for (let i = 0; i < entities.length; i++) {
        // console.debug(`Comparing Ent(${entities[i].x}, ${entities[i].y}) to (${x}, ${y})`);
        if (entities[i].x == x && entities[i].y == y) {
            return i;
        }
    }
    // console.error(`No entity found for location (${x}, ${y})`)
    return null; 
}

function is_empty(x, y) {
    if (x == 0 || x == (MAX_HEIGHT - 1)) return false;
    if (y == 0 || y == (MAX_WIDTH - 1)) return false;

    // for (let i = 0; i < entities.length; i++) {
    //     if (entities[i].x == x && entities[i].y == y) {
    //         return false;
    //     }
    // }
    if (get_entity_for(x, y)) return false;
    
    /* TODO: check for walls, other obstacles, etc. as they are added */

    return true;
}

function from_json(dict) {
    /* create an entity (or derived type) from a JSON object */
    var new_entity;
    switch (dict['type']) {
        case 'wall':
            new_entity = new Wall(dict['x'], dict['y']);
            break;
        case 'player':
            new_entity = new Player(dict['x'], dict['y']);
            break;
        case 'entity':
            new_entity = new Entity(dict['x'], dict['y']);
            break;
        case 'wanderer':
            new_entity = new Wanderer(dict['x'], dict['y']);
            break;
        default:
            console.warn('Entity type ' + dict['type'] + ' not accounted for in Entity.from_json().')
            break;
    }

    let keys = Object.keys(dict);
    for (let i in keys) {
        // console.log(`setting this.${keys[i]} to ${dict[keys[i]]}`);
        new_entity[keys[i]] = dict[keys[i]]; // copy attributes (health, etc) from dict object
    }

    if (new_entity['active']) new_entity.focus(); // focus object if active


}

function kill_all_entities() {
    let ct = entities.length;
    for(let i = 0; i < ct; i++) {
        entities[0].destroy();
    }

    save_state(); // cache state after killing all entities
    return;
}