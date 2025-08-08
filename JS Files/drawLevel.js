const scale = 50;

//DRAWING THE BACKGROUND:

// 01:
class DOMDisplay
{
  constructor(parent, level)
  {
    this.dom = elt("div", {class: "game"}, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }
  clear()
  {
    this.dom.remove();
  }
}
//HELPER TO IBID:
function elt(name, attrs, ...children)
{
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs))
    dom.setAttribute(attr, attrs[attr]);
  for (let child of children)
    dom.appendChild(child);
  return dom;
}

// 02:
function drawGrid(level)
{
  return elt("table",
    {class: "background", style: `width: ${level.width * scale}px`},
    ...level.rows.map(row => elt("tr",
        {style: `height: ${scale}px`},
        ...row.map(type => elt("td", {class: type})))));
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//TAKING CARE OF LEVELS TALLER/WIDER THAN THE SCREEN:
DOMDisplay.prototype.scrollPlayerIntoView = function(state)
{
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 5;

  let left = this.dom.scrollLeft, right = left + width;
  let top = this.dom.scrollTop, bottom = top + height;

  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5)).times(scale);

  if (center.x < left + margin)
    this.dom.scrollLeft = center.x - margin;
  else if (center.x > right - margin)
    this.dom.scrollLeft = center.x + margin - width;
  if (center.y < top + margin)
    this.dom.scrollTop = center.y - margin;
  else if (center.y > bottom - margin)
    this.dom.scrollTop = center.y + margin - height;
};