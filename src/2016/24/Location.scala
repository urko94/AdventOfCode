package AdventOfCode

class Location(val coordinateY: Int, val coordinateX: Int) {
  var y: Int = coordinateY
  var x: Int = coordinateX

  override def toString(): String = {
    (this.getClass().getSimpleName() +"("+ this.y +", "+ this.x +")")
  }

  def isEqual(location: Location): Boolean = {
    this.y == location.y && this.x == location.x
  }
}
