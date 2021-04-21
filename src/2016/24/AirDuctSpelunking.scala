import AdventOfCode.Location
import AdventOfCode.Path

object AirDuctSpelunking {

  def main(args: Array[String]) {

    val input: String = "###########\n#0.1.....2#\n#.#######.#\n#4.......3#\n###########"
    val longInput: String = "#####################################################################################################################################################################################\n#.....#.#.....#.#.#...#.....#.#.#.#.....#3......#...........#.#.....#.....#.............#.#...#...#.....#...#.........#.#...............#.....#.....#.........................#.....#\n#.#.#.#.#.#.#.#.#.#.#.#.###.#.#.#.#.#.#####.#.#.#.#####.#.###.#.#.###.#.#####.###.#.#.#.#.#####.#.#.#.#####.#.#.#####.#.#.#####.###.#.#.###.###.###.#.###.#.###.###.#.#######.#######\n#.....#...#.#.....#...#.........#...........#.......#...#.#.....#.....#.#.#.......#...#.#...#...#...#.#...#...#.#...#.#.#.#.......#...#...#.....#.....#.....#...#...#.......#.#...#.#\n###.#####.#.#######.###.#.#.#.#.#.#####.#.#.#.#####.#.###.#.#####.#.#.#.#.#####.#.#.#.#.#.###.#.###.#.#####.#.#.#.#.###.#.#.#.###.#.#.#.#.###.#.#.###.#.#.#.#.#.#.#.#.#.#####.#.#.#.#\n#...#1......#.....#.#.#.#.....#.#.#.....#...#.#...#.......#...........#.............#...#.....#.......#.....#.....#.#.......#.#...#.#.#.#.......#...#.#...........#.#.....#...#.#...#\n#.#.###.#.###.#.#.#.#.#.#.#######.#.#.###.#.#.#.###.#####.###.#.#.#.#.#.###.#.#####.#.#.#####.#####.#.#.#.#.#.#.#.###.###.#.#####.#.#.#####.#.#.#.#.#.#.#.###.#####.###.#.#.#.#.###.#\n#.....#.#.....#.#...#.#.....#.#.#.#.........#.#.#.......#.#.#.......#...#...#...#.....#.#...#.......#.....#.......#...#.....#...#...#.......#...#.#.....#...#.#.....#.#...#.#...#...#\n#.#.#.#.#####.#.###.#.#.#.###.#.###.#.#.#####.#.#####.#.#.#.#.#####.#.#.#.###.#######.#.###.#.###.#.#.#.#.#.#.#####.###.#####.#.#.#.#.#####.#####.#.###.#.#.#.#.#.#.#.#####.###.#.###\n#...#.#...#.........#.#...#.#...#.....#.#.....#.......#.........#.....#.....#.........#.....#...#.#.#.#.....#.#.................#.#.#.......#.......#.......#...#...#.......#.#...#.#\n#.#.#.#.#.#.#.###.#.###.###.#.#.#.###.###.#.#.#.#.#.#.#########.#.###.#.#.#####.#.#.#.###.#######.#.###.#.#.#.#.#.#.#.###.#.#.###.#######.#.###.#.#.#.#.###.#.#.#.#####.###.#.#.###.#\n#...#.#.#.#.#...#...#...#.............#.....#.....#...#...#.#.....#...#...#.....#.#.....#...#...........#.#.#.#.......#...#.............#...#.#...#...........#...#2#...#.....#.#.#.#\n###.###.#.#####.#.#.#.#.#.#.#.#.#.#.###.###.#.#.#.###.###.#.#.#.#.#.#.###.###.#.#.#.#.###.#.#.#.###.#####.###.###.#.#.#.###.#######.###.###.#.#.#.#####.#####.###.#.#.#####.#.#.#.###\n#.......#...#...........#.......#...#.#.......#.....#.....#...#...#.#.........#.......#...#.#...#...........#.#...#.#...............#.#.#.....#.......#.#.#.#.....#.........#.#.#.#.#\n###.#.#.#.#.#.#.#####.###.#.#.#.#.#.#.#.#.#.#.#.#.#.#.#####.#.###.#.###.#.#.#.#########.###.#.###.#.###.#.#.#.#.#######.#####.###.#.#.#.#.#####.#####.#.#.#.#.#.#######.#.###.#.#.#.#\n#...#.....#.#.............#...#.#.....#.#...#.......#.........#...#...#.#...#...........#...#...........#...#...#.................#...#.#.#.....#.......#.#.#.......#...#...#...#...#\n###.#.#######.#.#.#.###.#.#.#.###.#.#.#.#.#.###.#####.#.###.#.#.#.###.#.#.#.#.#.#.#.###.#.#.#.#.#.#.#####.#.#####.#.#.#.#.#.#######.#.#.#.###.#.#.#.#.#.###.#.###.#########.###.#.#.#\n#.....#...#.....#.....#...#.........#.#...#.....#...#.................#...#.#.#.......#.....#...#.#.................#.#.#.........#.....#...#.#...#.....#.................#.#.....#.#\n#.#####.#.#.#####.###.#.#.#.###.###.#.#########.#.#######.###.###.#.#.#.#.#.#.#.###.#.#.#####.#.###.#.#########.#.###.###.#.###.###.#.#.#.#.#.###.#####.#.#.#######.#.###.#.#.###.###\n#0#...#.#...#...........#.#.............#.#.......#.....#.#.#.....#.#.#...#.....#.#.#.......#.#...#.................#.#.#.....#...#.#.........#.......#.#...#.......#.......#.....#.#\n#####.#.###.#.#.###.#####.###.#######.###.#.#.###.#.#.#.#.#.#.#.#.###.#.#.#.#.#.#.#.#.#####.###.#.#####.#.#.#.###.#.#.#.#########.#.#.#.###.#.#.###.#.#####.#.#.#.#.#.###.###.#.#.#.#\n#...#.#.....#.#.#...#.......#.#.#...#.........#.......#...#.#.....#.............#...........#...#.#.......#.#.....#.#...........#...#.........#.#...#.#.....#.......#...#.......#...#\n###.###.###.#.###.###.#.###.###.#.#.#.#########.#####.###.#######.#.###.#.#.#.###.#.#.#.#.#.#.#.#####.###.#.#.#.#.#.#.#####.###.#.#.###.#####.#.#.#####.#.#.###.#.#####.#.#.#.#.#.#.#\n#.......#...............#.....#...#...#.#...#.........#...........#.....#.....#.......#...#.....#.......#.#.#.#...#...............#.....#.....#...#.#...#...#.#.#.#.#.....#...#.#.#4#\n#.#.#.#.#.#####.###.#.#####.#.###.#.###.#.#.#.###.###.#.#####.#.#####.#.#######.#.#####.#.#######.#.###.#.#.#.###.###.###.#####.#.###.#.#.#.#####.#.#.#.###.#.#.###.###.#.#.#.#.#.###\n#...#...........#.......#...#.....#.#.......#.....#.........#.#.......#.#...#...#...........#.......#.....#...#...#...#.#...#.....#...#.........#...#...#.....#.....#...#...#...#...#\n###.#.###.#############.#.###.###.#.###.#.#.#.#.#.#.#.#.###.#####.#.#.#.#.#.#####.###.#.#.#.#.###.#.#.#.#.#.###.#.#.###.#.#.#.###.###.#.#.###.#.#.#.#.#.#.#####.#.#.#.#.#.#.###.#.###\n#...#.....#.#...#.#.#.#...........#.......#...#.....#...#...................#...#...#.#.#.#...#.......#...............#...#...#...#...#.#.#5#...#...#.#...#...#.#...#.#...#...#.#...#\n#.###.###.#.#.#.#.#.#.###.#.#######.#.#.#.###.#.#.#.#.#.#.###.#.###.###.#.#.#.#.#.###.#.#.#.#.#.###.#.#.###.#.#.###.#.#.#.#.#.#.#.#.#####.#.#.#######.#.#.#.#.#.#####.#.#######.#.#.#\n#.........#.#...#.#...#...#.............#.....#...#.#.#.#.#.#.....#.#...#.....#.#.#.........#.....#.........#.....#...........#...#.........#.....#...#.#.#.#...#...........#...#...#\n#.#.#.#######.#.#####.#.#.#.###.#.#######.#####.#.#.###.#.#.#.###.###.#.###.#.#.#.###.#.#.#.#####.#.###.#.#.#.#.#.#.#####.#.#.###.#.#.#.#.#####.###.#####.#.#.#.#.###.#.#.#####.#####\n#...#...............#.#.......#.......#.......#.........#.#.#.#...#...#...#.......#.#.....#.#...........#...#.#.#...........#.#...#.......#.........#...#...#.....#...#.#.....#.#...#\n###.#.#.#.#.#########.#.#.#.#.#.#####.#.#######.#.###.#.#.#.###.###.#.#.#.#.#.###.#.#.###.#.#####.#.###########.#.#.#####.#####.#####.#####.#.#.#.#.#.#.#####.#.#.#########.#.###.#.#\n#.#...#.....#.......#.....#...#.......#.#.#...#...#...#.........#...#...#.#...#.#.........#.#.......#.#.#...#...#.........#.#.........#.....#.#.#...#.......#.#.....#.......#.#.....#\n#.#.###.#.###.#.#.#.#.###.#########.#.#.#.#.#.#.###.#.#.#####.#.#.#####.#####.#.#.#########.#.#.#.###.#.#####.#.#.###.###.#.#.#.#.#.#####.###.#.###########.#.#.#.#.#.#######.#####.#\n#........7#.....#.#...#.#.#.#.........#...#.#...........#.....#.......#.........#.........#.....#.......#.#.......#.#.#...#...#.#.#....6#.#.........................#...#.#.......#.#\n#.###.#.###.###.###.#.#.###.###.#####.###.#.#.###.#####.###.#.###.#.#.#.#.#.#.#.#.#####.#.#.#####.#######.#.###.#.#.#####.#####.#.#.#.###.#.#.#.#.#####.#.#.###.#####.#.#.#.#.#.#.#.#\n#.#...#.#...#.#.....#.#.......#...#.....#...#...#...#...#.#.....#...#.#...#...#...#.#.............#.............#.#...#.............#.#.....#.....#.......#.#.#.#.........#...#...#.#\n#####################################################################################################################################################################################";

    val map: Array[Array[Int]] = longInput.linesIterator.map(_.map(x => {
      if (x == '#') -2
      else if (x == '.') -1
      else x.asDigit
    }).toArray).toArray

    val locations: Map[Int, Location] = extractLocationsFromMap(map)
    println("Locations in map")
    println(locations)

    val mapWithoutLocations = removeLocationsFromMap(map, locations)
    val t0 = System.currentTimeMillis()

    val paths: Seq[Path] = locations.keySet.map(i => {
      locations.keySet.filter(_ > i).map(j => {
        new Path(i, j, shortestPath(mapWithoutLocations, locations(i), locations(j)))
      })
    }).toSeq.flatten
    println("Shortest paths between locations")
    println(paths)
    val t1 = System.currentTimeMillis()
    println("Time 1: "+ (t1 - t0).toString +" miliseconds")

    val shortestRouteSteps = makeShortestRoute(locations, paths, 0, -1)
    println("Shortest route")
    println(shortestRouteSteps)
    val t2 = System.currentTimeMillis()
    println("Time 2: " + (t2 - t1).toString + " miliseconds")

    /** Part 2 - Return to location 0 * */
    val shortestCircle = makeShortestRoute(locations, paths, 0, 0)
    println("Shortest route - return to 0")
    println(shortestCircle)
    val t3 = System.currentTimeMillis()
    println("Time 3: " + (t3 - t2).toString + " miliseconds")
    println("Total time: " + (t3 - t0).toString + " miliseconds")

  }

  def makeShortestRoute(locations: Map[Int, Location], paths: Seq[Path], start: Int, finish: Int): Int = {
    if (locations.contains(start)) {
      val routes = allRoutes(locations.removed(start), paths, start, finish, 0)
      routes.min
    } else {
      println("Start position is not on map")
      -1
    }
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
    val path: Path = paths.filter(x => (x.fromPoint == location1 && x.toPoint == location2) || (x.toPoint == location1 && x.fromPoint == location2)).head
    path.pathLength
  }

  def shortestPath(map: Array[Array[Int]], fromLocation: Location, toLocation: Location): Int = {
    // Set starting point and empty location - previous location
    val mapWithStartingPoint = map.map(_.clone)
    mapWithStartingPoint(fromLocation.y)(fromLocation.x) = 0
    val previousLocation = new Location(-1, -1)

    val calculatedPaths = findAllPaths(mapWithStartingPoint, previousLocation, fromLocation, toLocation, 0)
    calculatedPaths(toLocation.y)(toLocation.x)
  }

  def findAllPaths(map: Array[Array[Int]], previousLocation: Location, fromLocation: Location, toLocation: Location, steps: Int): Array[Array[Int]] = {
    val neighborLocations = generateNeighborLocations(fromLocation, toLocation)

    neighborLocations.foldLeft(map)((acc, location) => {
      val neighborPoint: Int = map(location.y)(location.x)
      val finishPointValue: Int = if (map(toLocation.y)(toLocation.x) == -1) 1000 else map(toLocation.y)(toLocation.x)
      val remainingPath = Math.abs(toLocation.y - location.y) + Math.abs(toLocation.x - location.x)

      if (location.isEqual(toLocation)) {
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
      new Location(location.y + (firstY * directionY), location.x + (firstX * directionX)),
      new Location(location.y + (firstX * directionY), location.x + (firstY * directionX)),
      new Location(location.y - (firstX * directionY), location.x - (firstY * directionX)),
      new Location(location.y - (firstY * directionY), location.x - (firstX * directionX)))
  }

  def isNextLocationValid(previousLocation: Location, nextLocation: Location, point: Int): Boolean = {
    !previousLocation.isEqual(nextLocation) && (point > -2)
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
        Tuple2(map(y)(x), new Location(y, x))
      } else {
        Tuple2(Integer.MIN_VALUE, new Location(0, 0))
      }
    }).toMap.filter(_._1 >= 0)
  }
}

