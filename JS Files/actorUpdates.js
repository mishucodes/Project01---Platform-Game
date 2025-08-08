Lava.prototype.update = function(time, state)
{
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "wall"))
    return new Lava(newPos, this.speed, this.reset);
  else if (this.reset)
    return new Lava(this.reset, this.speed, this.reset);
  else
    return new Lava(this.pos, this.speed.times(-1));
};


const wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.update = function(time)
{
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble);
};


const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.update = function(time, state, keys)
{
  let xSpeed = 0;
  if (keys.ArrowLeft)
    xSpeed -= playerXSpeed;
  if (keys.ArrowRight)
    xSpeed += playerXSpeed;
  let pos = this.pos;
  let movedX = pos.plus(new Vec(xSpeed * time, 0));
  if (!state.level.touches(movedX, this.size, "wall"))
    pos = movedX;

  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vec(0, ySpeed * time));
  if (!state.level.touches(movedY, this.size, "wall"))
    pos = movedY;
  else if (keys.ArrowUp && ySpeed > 0)
    ySpeed = -jumpSpeed;
  else
    ySpeed = 0;
  return new Player(pos, new Vec(xSpeed, ySpeed));
};