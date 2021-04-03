package AdventOfCode

class Path(val from: Int, val to: Int,  val length: Int) {
  var fromPoint: Int = from
  var toPoint: Int = to
  var pathLength: Int = length

  override def toString(): String = {
    (this.getClass().getSimpleName() +"("+ this.from +", "+ this.to +": "+ this.pathLength +")")
  }
}