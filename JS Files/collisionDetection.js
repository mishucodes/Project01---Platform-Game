Level.prototype.touches = function(pos, size, type)
{
    let xStart = Math.floor(pos.x);
    let xEnd = Math.ceil(pos.x + size.x);
    let yStart = Math.floor(pos.y);
    let yEnd = Math.ceil(pos.y + size.y);

    for (let y = yStart; y < yEnd; y++)
    {
        for (let x = xStart; x < xEnd; x++)
        {
            let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
            let here = isOutside ? "wall" : this.rows[y][x];
            if (here == type)
                return true;
        }
    }
    return false;
};


State.prototype.update = function(time, keys)
{
    let actors = this.actors.map(actor => actor.update(time, this, keys));
    let newState = new State(this.level, actors, this.status);
    
    if (newState.status != "playing") return newState;
    let player = newState.player;
    if (this.level.touches(player.pos, player.size, "lava"))
        return new State(this.level, actors, "lost");
    
    for (let actor of actors)
        if (actor != player && overlap(actor, player))
            newState = actor.collide(newState);
    
    return newState;
};


function overlap(actor1, actor2)
{
    return actor1.pos.x + actor1.size.x > actor2.pos.x && actor1.pos.x < actor2.pos.x + actor2.size.x &&
            actor1.pos.y + actor1.size.y > actor2.pos.y && actor1.pos.y < actor2.pos.y + actor2.size.y;
}


Lava.prototype.collide = function(state)
{
    return new State(state.level, state.actors, "lost");
};

Coin.prototype.collide = function(state)
{
    let filtered = state.actors.filter(a => a != this);
    let status = state.status;
    if (!filtered.some(a => a.type == "coin"))
        status = "won";
    return new State(state.level, filtered, status);
};