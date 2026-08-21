
object AirDuctSpelunking {

  case class Path(from: Int, to: Int, length: Int)

  case class Location(y: Int, x: Int)

  def equalLocations(previousLocation: Location, nextLocation: Location): Boolean = {
    previousLocation match {
      case Location(y, x) if (y == nextLocation.y && x == nextLocation.x) =>
        true
      case Location(_,_) =>
        false
    }
  }


  def main(args: Array[String]): Unit = {

    val input: String = "###########\n#0.1.....2#\n#.#######.#\n#4.......3#\n###########"
    val longInput: String = "#####################################################################################################################################################################################\n#.....#.#.....#.#.#...#.....#.#.#.#.....#3......#...........#.#.....#.....#.............#.#...#...#.....#...#.........#.#...............#.....#.....#.........................#.....#\n#.#.#.#.#.#.#.#.#.#.#.#.###.#.#.#.#.#.#####.#.#.#.#####.#.###.#.#.###.#.#####.###.#.#.#.#.#####.#.#.#.#####.#.#.#####.#.#.#####.###.#.#.###.###.###.#.###.#.###.###.#.#######.#######\n#.....#...#.#.....#...#.........#...........#.......#...#.#.....#.....#.#.#.......#...#.#...#...#...#.#...#...#.#...#.#.#.#.......#...#...#.....#.....#.....#...#...#.......#.#...#.#\n###.#####.#.#######.###.#.#.#.#.#.#####.#.#.#.#####.#.###.#.#####.#.#.#.#.#####.#.#.#.#.#.###.#.###.#.#####.#.#.#.#.###.#.#.#.###.#.#.#.#.###.#.#.###.#.#.#.#.#.#.#.#.#.#####.#.#.#.#\n#...#1......#.....#.#.#.#.....#.#.#.....#...#.#...#.......#...........#.............#...#.....#.......#.....#.....#.#.......#.#...#.#.#.#.......#...#.#...........#.#.....#...#.#...#\n#.#.###.#.###.#.#.#.#.#.#.#######.#.#.###.#.#.#.###.#####.###.#.#.#.#.#.###.#.#####.#.#.#####.#####.#.#.#.#.#.#.#.###.###.#.#####.#.#.#####.#.#.#.#.#.#.#.###.#####.###.#.#.#.#.###.#\n#.....#.#.....#.#...#.#.....#.#.#.#.........#.#.#.......#.#.#.......#...#...#...#.....#.#...#.......#.....#.......#...#.....#...#...#.......#...#.#.....#...#.#.....#.#...#.#...#...#\n#.#.#.#.#####.#.###.#.#.#.###.#.###.#.#.#####.#.#####.#.#.#.#.#####.#.#.#.###.#######.#.###.#.###.#.#.#.#.#.#.#####.###.#####.#.#.#.#.#####.#####.#.###.#.#.#.#.#.#.#.#####.###.#.###\n#...#.#...#.........#.#...#.#...#.....#.#.....#.......#.........#.....#.....#.........#.....#...#.#.#.#.....#.#.................#.#.#.......#.......#.......#...#...#.......#.#...#.#\n#.#.#.#.#.#.#.###.#.###.###.#.#.#.###.###.#.#.#.#.#.#.#########.#.###.#.#.#####.#.#.#.###.#######.#.###.#.#.#.#.#.#.#.###.#.#.###.#######.#.###.#.#.#.#.###.#.#.#.#####.###.#.#.###.#\n#...#.#.#.#.#...#...#...#.............#.....#.....#...#...#.#.....#...#...#.....#.#.....#...#...........#.#.#.#.......#...#.............#...#.#...#...........#...#2#...#.....#.#.#.#\n###.###.#.#####.#.#.#.#.#.#.#.#.#.#.###.###.#.#.#.###.###.#.#.#.#.#.#.###.###.#.#.#.#.###.#.#.#.###.#####.###.###.#.#.#.###.#######.###.###.#.#.#.#####.#####.###.#.#.#####.#.#.#.###\n#.......#...#...........#.......#...#.#.......#.....#.....#...#...#.#.........#.......#...#.#...#...........#.#...#.#...............#.#.#.....#.......#.#.#.#.....#.........#.#.#.#.#\n###.#.#.#.#.#.#.#####.###.#.#.#.#.#.#.#.#.#.#.#.#.#.#.#####.#.###.#.###.#.#.#.#########.###.#.###.#.###.#.#.#.#.#######.#####.###.#.#.#.#.#####.#####.#.#.#.#.#.#######.#.###.#.#.#.#\n#...#.....#.#.............#...#.#.....#.#...#.......#.........#...#...#.#...#...........#...#...........#...#...#.................#...#.#.#.....#.......#.#.#.......#...#...#...#...#\n###.#.#######.#.#.#.###.#.#.#.###.#.#.#.#.#.###.#####.#.###.#.#.#.###.#.#.#.#.#.#.#.###.#.#.#.#.#.#.#####.#.#####.#.#.#.#.#.#######.#.#.#.###.#.#.#.#.#.###.#.###.#########.###.#.#.#\n#.....#...#.....#.....#...#.........#.#...#.....#...#.................#...#.#.#.......#.....#...#.#.................#.#.#.........#.....#...#.#...#.....#.................#.#.....#.#\n#.#####.#.#.#####.###.#.#.#.###.###.#.#########.#.#######.###.###.#.#.#.#.#.#.#.###.#.#.#####.#.###.#.#########.#.###.###.#.###.###.#.#.#.#.#.###.#####.#.#.#######.#.###.#.#.###.###\n#0#...#.#...#...........#.#.............#.#.......#.....#.#.#.....#.#.#...#.....#.#.#.......#.#...#.................#.#.#.....#...#.#.........#.......#.#...#.......#.......#.....#.#\n#####.#.###.#.#.###.#####.###.#######.###.#.#.###.#.#.#.#.#.#.#.#.###.#.#.#.#.#.#.#.#.#####.###.#.#####.#.#.#.###.#.#.#.#########.#.#.#.###.#.#.###.#.#####.#.#.#.#.#.###.###.#.#.#.#\n#...#.#.....#.#.#...#.......#.#.#...#.........#.......#...#.#.....#.............#...........#...#.#.......#.#.....#.#...........#...#.........#.#...#.#.....#.......#...#.......#...#\n###.###.###.#.###.###.#.###.###.#.#.#.#########.#####.###.#######.#.###.#.#.#.###.#.#.#.#.#.#.#.#####.###.#.#.#.#.#.#.#####.###.#.#.###.#####.#.#.#####.#.#.###.#.#####.#.#.#.#.#.#.#\n#.......#...............#.....#...#...#.#...#.........#...........#.....#.....#.......#...#.....#.......#.#.#.#...#...............#.....#.....#...#.#...#...#.#.#.#.#.....#...#.#.#4#\n#.#.#.#.#.#####.###.#.#####.#.###.#.###.#.#.#.###.###.#.#####.#.#####.#.#######.#.#####.#.#######.#.###.#.#.#.###.###.###.#####.#.###.#.#.#.#####.#.#.#.###.#.#.###.###.#.#.#.#.#.###\n#...#...........#.......#...#.....#.#.......#.....#.........#.#.......#.#...#...#...........#.......#.....#...#...#...#.#...#.....#...#.........#...#...#.....#.....#...#...#...#...#\n###.#.###.#############.#.###.###.#.###.#.#.#.#.#.#.#.#.###.#####.#.#.#.#.#.#####.###.#.#.#.#.###.#.#.#.#.#.###.#.#.###.#.#.#.###.###.#.#.###.#.#.#.#.#.#.#####.#.#.#.#.#.#.###.#.###\n#...#.....#.#...#.#.#.#...........#.......#...#.....#...#...................#...#...#.#.#.#...#.......#...............#...#...#...#...#.#.#5#...#...#.#...#...#.#...#.#...#...#.#...#\n#.###.###.#.#.#.#.#.#.###.#.#######.#.#.#.###.#.#.#.#.#.#.###.#.###.###.#.#.#.#.#.###.#.#.#.#.#.###.#.#.###.#.#.###.#.#.#.#.#.#.#.#.#####.#.#.#######.#.#.#.#.#.#####.#.#######.#.#.#\n#.........#.#...#.#...#...#.............#.....#...#.#.#.#.#.#.....#.#...#.....#.#.#.........#.....#.........#.....#...........#...#.........#.....#...#.#.#.#...#...........#...#...#\n#.#.#.#######.#.#####.#.#.#.###.#.#######.#####.#.#.###.#.#.#.###.###.#.###.#.#.#.###.#.#.#.#####.#.###.#.#.#.#.#.#.#####.#.#.###.#.#.#.#.#####.###.#####.#.#.#.#.###.#.#.#####.#####\n#...#...............#.#.......#.......#.......#.........#.#.#.#...#...#...#.......#.#.....#.#...........#...#.#.#...........#.#...#.......#.........#...#...#.....#...#.#.....#.#...#\n###.#.#.#.#.#########.#.#.#.#.#.#####.#.#######.#.###.#.#.#.###.###.#.#.#.#.#.###.#.#.###.#.#####.#.###########.#.#.#####.#####.#####.#####.#.#.#.#.#.#.#####.#.#.#########.#.###.#.#\n#.#...#.....#.......#.....#...#.......#.#.#...#...#...#.........#...#...#.#...#.#.........#.#.......#.#.#...#...#.........#.#.........#.....#.#.#...#.......#.#.....#.......#.#.....#\n#.#.###.#.###.#.#.#.#.###.#########.#.#.#.#.#.#.###.#.#.#####.#.#.#####.#####.#.#.#########.#.#.#.###.#.#####.#.#.###.###.#.#.#.#.#.#####.###.#.###########.#.#.#.#.#.#######.#####.#\n#........7#.....#.#...#.#.#.#.........#...#.#...........#.....#.......#.........#.........#.....#.......#.#.......#.#.#...#...#.#.#....6#.#.........................#...#.#.......#.#\n#.###.#.###.###.###.#.#.###.###.#####.###.#.#.###.#####.###.#.###.#.#.#.#.#.#.#.#.#####.#.#.#####.#######.#.###.#.#.#####.#####.#.#.#.###.#.#.#.#.#####.#.#.###.#####.#.#.#.#.#.#.#.#\n#.#...#.#...#.#.....#.#.......#...#.....#...#...#...#...#.#.....#...#.#...#...#...#.#.............#.............#.#...#.............#.#.....#.....#.......#.#.#.#.........#...#...#.#\n#####################################################################################################################################################################################";

    val map: Array[Array[Int]] = longInput.linesIterator.map(_.map(x => {
      if (x == '#') -2
      else if (x == '.') -1
      else x.asDigit
    }).toArray).toArray

    val locations: Map[Int, Location] = extractLocationsFromMap(map)

    val mapWithoutLocations = removeLocationsFromMap(map, locations)

    /** Calculate all path lengths  */
    val paths: Seq[Path] = locations.keySet.map(i => {
      locations.keySet.filter(_ > i).map(j => {
        Path(i, j, shortestPath(mapWithoutLocations, locations(i), locations(j)))
      })
    }).toSeq.flatten

    /** Part 1 - Shortest route from location 0 **/
    val shortestRouteLengthSteps = shortestRouteLength(locations, paths, 0, -1)
    println("Shortest route")
    println(shortestRouteLengthSteps)


    /** Part 2 - Return to location 0 **/
    val shortestCircle = shortestRouteLength(locations, paths, 0, 0)
    println("Shortest route - return to 0")
    println(shortestCircle)

  }

  def shortestRouteLength(locations: Map[Int, Location], paths: Seq[Path], start: Int, finish: Int): Int = {
    val routes = allRoutes(locations.removed(start), paths, start, finish, 0)
    routes.min
  }

  def allRoutes(locations: Map[Int, Location], paths: Seq[Path], previousLocation: Int, lastLocation: Int, steps: Int): Seq[Int] = {
    locations.keys.foldLeft(Seq[Int]())((acc, locationId) => {
      val pathLength = lengthBetweenLocations(previousLocation, locationId, paths)
      if (locations.size == 1) {
        val lastStepLength = if (lastLocation >= 0) lengthBetweenLocations(locationId, lastLocation, paths) else 0
        acc :+ (steps + pathLength + lastStepLength)
      } else if ((locations.size > 1) && (acc.size == 0 || acc.min > (steps + pathLength))) {
        acc ++ allRoutes(locations.removed(locationId), paths, locationId, lastLocation, (steps + pathLength))
      } else {
        acc
      }
    })
  }

  def lengthBetweenLocations(location1: Int, location2: Int, paths: Seq[Path]): Int = {
    val path: Path = paths.filter(x => (x.from == location1 && x.to == location2) || (x.to == location1 && x.from == location2)).head
    path.length
  }

  def shortestPath(map: Array[Array[Int]], fromLocation: Location, toLocation: Location): Int = {
    // Set starting point and empty location - previous location
    val mapWithStartingPoint = map.map(_.clone)
    mapWithStartingPoint(fromLocation.y)(fromLocation.x) = 0
    val previousLocation = Location(-1, -1)

    val calculatedPaths = findAllPaths(mapWithStartingPoint, previousLocation, fromLocation, toLocation, 0)
    calculatedPaths(toLocation.y)(toLocation.x)
  }

  def findAllPaths(map: Array[Array[Int]], previousLocation: Location, fromLocation: Location, toLocation: Location, steps: Int): Array[Array[Int]] = {
    val neighborLocations = generateNeighborLocations(fromLocation, toLocation)

    neighborLocations.foldLeft(map)((acc, location) => {
      val neighborPoint: Int = map(location.y)(location.x)
      val finishPointValue: Int = if (map(toLocation.y)(toLocation.x) == -1) 1000 else map(toLocation.y)(toLocation.x)
      val remainingPath = Math.abs(toLocation.y - location.y) + Math.abs(toLocation.x - location.x)

      if (equalLocations(location, toLocation)) {
        if (neighborPoint == -1 || (steps + 1 < neighborPoint)) {
          map(location.y)(location.x) = steps + 1
          map
        } else {
          acc
        }
      } else if (isNextLocationValid(previousLocation, location, neighborPoint) && ((remainingPath + steps + 1) < finishPointValue)) {
        if (neighborPoint == -1 || (steps + 1 < neighborPoint)) {
          map(location.y)(location.x) = steps + 1
          findAllPaths(map, fromLocation, location, toLocation, (steps + 1))
        } else {
          acc
        }
      } else {
        acc
      }
    })
  }

  def generateNeighborLocations(location: Location, destinationLocation: Location): Seq[Location] = {

    val diffY = destinationLocation.y - location.y
    val diffX = destinationLocation.x - location.x

    val directionY = if (diffY != 0) diffY / Math.abs(diffY) else 1
    val directionX = if (diffX != 0) diffX / Math.abs(diffX) else 1

    val firstY = if (Math.abs(diffY) > Math.abs(diffX)) 1 else 0
    val firstX = if (Math.abs(diffY) > Math.abs(diffX)) 0 else 1

    Seq(
      Location(location.y + (firstY * directionY), location.x + (firstX * directionX)),
      Location(location.y + (firstX * directionY), location.x + (firstY * directionX)),
      Location(location.y - (firstX * directionY), location.x - (firstY * directionX)),
      Location(location.y - (firstY * directionY), location.x - (firstX * directionX)))
  }

  def isNextLocationValid(previousLocation: Location, nextLocation: Location, point: Int): Boolean = {
    !equalLocations(previousLocation, nextLocation) && (point > -2)
  }

  def removeLocationsFromMap(map: Array[Array[Int]], locations: Map[Int, Location]): Array[Array[Int]] = {
    map.map(row => {
      row.map(location => {
        if (location >= 0) {
          -1
        } else {
          location
        }
      })
    })
  }

  def extractLocationsFromMap(map: Array[Array[Int]]): Map[Int, Location] = {
    val mapWidth = map(0).size

    (0 to (map.flatten.size - 1)).map(i => {
      val y = (i / mapWidth)
      val x = (i % mapWidth)
      if (map(y)(x) >= 0) {
        map(y)(x) -> Location(y, x)
      } else {
        Integer.MIN_VALUE -> Location(0, 0)
      }
    }).toMap.filter(_._1 >= 0)
  }
}

