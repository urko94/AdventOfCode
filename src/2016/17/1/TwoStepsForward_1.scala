import java.security.MessageDigest
import AdventOfCode.Location

object TwoStepsForward_1 {

  def main(args: Array[String]) {

    val gridText: String = "#########\n#S| | | #\n#-#-#-#-#\n# | | | #\n#-#-#-#-#\n# | | | #\n#-#-#-#-#\n# | | |  \n####### V"
    val passcode: String = "awrkjxxr"
    val passcode1: String = "ihgpwlah"
    val passcode2: String = "kglvqrro"
    val passcode3: String = "ulqzkmiv"
    val passcodeTest: String = "hijkl"

    val grid: Array[Array[Char]] = gridText.linesIterator.map(_.toCharArray).toArray
    printGrid(grid)

    val finishLocation = new Location(grid.size - 2, grid(0).size - 2)
    val allPaths = makeStep(grid, new Location(1, 1), finishLocation, passcode, "", Seq())
    println(allPaths.mkString("\n"))
    println()

    if(allPaths.size == 0){
      println("NO RESULT")
    }
    else {
      val shortestPath = allPaths.sortBy(x => x.size).head
      println("Shortest path:")
      println(shortestPath)
    }

  }

  def makeStep(grid: Array[Array[Char]], location: Location, finishLocation: Location, passcode: String, path: String, paths: Seq[String]): Seq[String] = {

    val directions = prepareLocations(grid, location, passcode)
    directions.keySet.foldLeft(paths)((paths, i) => {
      if (directions(i).isEqual(finishLocation)) {
        paths :+ (path + i)
      }
      else if (paths.size == 0 || path.size < paths.map(_.size).min) {
        makeStep(grid, directions(i), finishLocation, passcode + i, path + i, paths)
      }
      else {
        paths
      }
    })
  }

  def prepareLocations(grid: Array[Array[Char]], location: Location, passcode: String): Map[Char, Location] = {
    val directionsPermissions = validDirectionsOfPasscode(passcode)
    val directions = Seq('U', 'D', 'L', 'R')
    (0 to directions.size - 1).foldLeft(Map[Char, Location]())((acc, i) => {
      val yVal = (if (i < 2) 1 else 0) * (if (i % 2 == 0) -1 else 1)
      val xVal = (if (i < 2) 0 else 1) * (if (i % 2 == 0) -1 else 1)
      val y = location.y + 2 * yVal
      val x = location.x + 2 * xVal
      val locationInGrid = coordinatesInsideGrid(grid, y, x)

      if (directionsPermissions(i) && locationInGrid && grid(location.y + yVal)(location.x + xVal) != '#') {
        acc + (directions(i) -> new Location(y, x))
      }
      else {
        acc
      }
    })
  }

  def coordinatesInsideGrid(grid: Array[Array[Char]], y: Int, x: Int): Boolean = {
    (y >= 0 && y < grid.size && x >= 0 && x < grid(y).size)
  }

  def validDirectionsOfPasscode(passcode: String): Array[Boolean] = {
    val validCharacters = "bcdef"
    directionsOfPasscode(passcode).map(x => validCharacters.contains(x))
  }

  def directionsOfPasscode(passcode: String): Array[Char] = {
    md5(passcode).toCharArray.slice(0, 4)
  }

  def md5(text: String): String = {
    MessageDigest.getInstance("MD5").digest(text.getBytes()).map(0xFF & _).map {
      "%02x".format(_)
    }.foldLeft("") {
      _ + _
    }
  }

  def hash(str: String): String = {
    MessageDigest.getInstance("MD5").digest(str.getBytes).map("%02X".format(_)).mkString
  }

  def printGrid(map: Array[Array[Char]]): Unit = {
    map.foreach(x => {
      x.foreach(y =>
        print(s"$y ")
      )
      println()
    })
  }
}
