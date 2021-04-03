import AdventOfCode.Location
import AdventOfCode.Path

object AirDuctSpelunking_1 {

  def main(args: Array[String]) {

    val input: String = "###########\n#0.1.....2#\n#.#######.#\n#4.......3#\n###########"
    val longInput: String = "#####################################################################################################################################################################################\n#.....#.#.....#.#.#...#.....#.#.#.#.....#3......#...........#.#.....#.....#.............#.#...#...#.....#...#.........#.#...............#.....#.....#.........................#.....#\n#.#.#.#.#.#.#.#.#.#.#.#.###.#.#.#.#.#.#####.#.#.#.#####.#.###.#.#.###.#.#####.###.#.#.#.#.#####.#.#.#.#####.#.#.#####.#.#.#####.###.#.#.###.###.###.#.###.#.###.###.#.#######.#######\n#.....#...#.#.....#...#.........#...........#.......#...#.#.....#.....#.#.#.......#...#.#...#...#...#.#...#...#.#...#.#.#.#.......#...#...#.....#.....#.....#...#...#.......#.#...#.#\n###.#####.#.#######.###.#.#.#.#.#.#####.#.#.#.#####.#.###.#.#####.#.#.#.#.#####.#.#.#.#.#.###.#.###.#.#####.#.#.#.#.###.#.#.#.###.#.#.#.#.###.#.#.###.#.#.#.#.#.#.#.#.#.#####.#.#.#.#\n#...#1......#.....#.#.#.#.....#.#.#.....#...#.#...#.......#...........#.............#...#.....#.......#.....#.....#.#.......#.#...#.#.#.#.......#...#.#...........#.#.....#...#.#...#\n#.#.###.#.###.#.#.#.#.#.#.#######.#.#.###.#.#.#.###.#####.###.#.#.#.#.#.###.#.#####.#.#.#####.#####.#.#.#.#.#.#.#.###.###.#.#####.#.#.#####.#.#.#.#.#.#.#.###.#####.###.#.#.#.#.###.#\n#.....#.#.....#.#...#.#.....#.#.#.#.........#.#.#.......#.#.#.......#...#...#...#.....#.#...#.......#.....#.......#...#.....#...#...#.......#...#.#.....#...#.#.....#.#...#.#...#...#\n#.#.#.#.#####.#.###.#.#.#.###.#.###.#.#.#####.#.#####.#.#.#.#.#####.#.#.#.###.#######.#.###.#.###.#.#.#.#.#.#.#####.###.#####.#.#.#.#.#####.#####.#.###.#.#.#.#.#.#.#.#####.###.#.###\n#...#.#...#.........#.#...#.#...#.....#.#.....#.......#.........#.....#.....#.........#.....#...#.#.#.#.....#.#.................#.#.#.......#.......#.......#...#...#.......#.#...#.#\n#.#.#.#.#.#.#.###.#.###.###.#.#.#.###.###.#.#.#.#.#.#.#########.#.###.#.#.#####.#.#.#.###.#######.#.###.#.#.#.#.#.#.#.###.#.#.###.#######.#.###.#.#.#.#.###.#.#.#.#####.###.#.#.###.#\n#...#.#.#.#.#...#...#...#.............#.....#.....#...#...#.#.....#...#...#.....#.#.....#...#...........#.#.#.#.......#...#.............#...#.#...#...........#...#2#...#.....#.#.#.#\n###.###.#.#####.#.#.#.#.#.#.#.#.#.#.###.###.#.#.#.###.###.#.#.#.#.#.#.###.###.#.#.#.#.###.#.#.#.###.#####.###.###.#.#.#.###.#######.###.###.#.#.#.#####.#####.###.#.#.#####.#.#.#.###\n#.......#...#...........#.......#...#.#.......#.....#.....#...#...#.#.........#.......#...#.#...#...........#.#...#.#...............#.#.#.....#.......#.#.#.#.....#.........#.#.#.#.#\n###.#.#.#.#.#.#.#####.###.#.#.#.#.#.#.#.#.#.#.#.#.#.#.#####.#.###.#.###.#.#.#.#########.###.#.###.#.###.#.#.#.#.#######.#####.###.#.#.#.#.#####.#####.#.#.#.#.#.#######.#.###.#.#.#.#\n#...#.....#.#.............#...#.#.....#.#...#.......#.........#...#...#.#...#...........#...#...........#...#...#.................#...#.#.#.....#.......#.#.#.......#...#...#...#...#\n###.#.#######.#.#.#.###.#.#.#.###.#.#.#.#.#.###.#####.#.###.#.#.#.###.#.#.#.#.#.#.#.###.#.#.#.#.#.#.#####.#.#####.#.#.#.#.#.#######.#.#.#.###.#.#.#.#.#.###.#.###.#########.###.#.#.#\n#.....#...#.....#.....#...#.........#.#...#.....#...#.................#...#.#.#.......#.....#...#.#.................#.#.#.........#.....#...#.#...#.....#.................#.#.....#.#\n#.#####.#.#.#####.###.#.#.#.###.###.#.#########.#.#######.###.###.#.#.#.#.#.#.#.###.#.#.#####.#.###.#.#########.#.###.###.#.###.###.#.#.#.#.#.###.#####.#.#.#######.#.###.#.#.###.###\n#0#...#.#...#...........#.#.............#.#.......#.....#.#.#.....#.#.#...#.....#.#.#.......#.#...#.................#.#.#.....#...#.#.........#.......#.#...#.......#.......#.....#.#\n#####.#.###.#.#.###.#####.###.#######.###.#.#.###.#.#.#.#.#.#.#.#.###.#.#.#.#.#.#.#.#.#####.###.#.#####.#.#.#.###.#.#.#.#########.#.#.#.###.#.#.###.#.#####.#.#.#.#.#.###.###.#.#.#.#\n#...#.#.....#.#.#...#.......#.#.#...#.........#.......#...#.#.....#.............#...........#...#.#.......#.#.....#.#...........#...#.........#.#...#.#.....#.......#...#.......#...#\n###.###.###.#.###.###.#.###.###.#.#.#.#########.#####.###.#######.#.###.#.#.#.###.#.#.#.#.#.#.#.#####.###.#.#.#.#.#.#.#####.###.#.#.###.#####.#.#.#####.#.#.###.#.#####.#.#.#.#.#.#.#\n#.......#...............#.....#...#...#.#...#.........#...........#.....#.....#.......#...#.....#.......#.#.#.#...#...............#.....#.....#...#.#...#...#.#.#.#.#.....#...#.#.#4#\n#.#.#.#.#.#####.###.#.#####.#.###.#.###.#.#.#.###.###.#.#####.#.#####.#.#######.#.#####.#.#######.#.###.#.#.#.###.###.###.#####.#.###.#.#.#.#####.#.#.#.###.#.#.###.###.#.#.#.#.#.###\n#...#...........#.......#...#.....#.#.......#.....#.........#.#.......#.#...#...#...........#.......#.....#...#...#...#.#...#.....#...#.........#...#...#.....#.....#...#...#...#...#\n###.#.###.#############.#.###.###.#.###.#.#.#.#.#.#.#.#.###.#####.#.#.#.#.#.#####.###.#.#.#.#.###.#.#.#.#.#.###.#.#.###.#.#.#.###.###.#.#.###.#.#.#.#.#.#.#####.#.#.#.#.#.#.###.#.###\n#...#.....#.#...#.#.#.#...........#.......#...#.....#...#...................#...#...#.#.#.#...#.......#...............#...#...#...#...#.#.#5#...#...#.#...#...#.#...#.#...#...#.#...#\n#.###.###.#.#.#.#.#.#.###.#.#######.#.#.#.###.#.#.#.#.#.#.###.#.###.###.#.#.#.#.#.###.#.#.#.#.#.###.#.#.###.#.#.###.#.#.#.#.#.#.#.#.#####.#.#.#######.#.#.#.#.#.#####.#.#######.#.#.#\n#.........#.#...#.#...#...#.............#.....#...#.#.#.#.#.#.....#.#...#.....#.#.#.........#.....#.........#.....#...........#...#.........#.....#...#.#.#.#...#...........#...#...#\n#.#.#.#######.#.#####.#.#.#.###.#.#######.#####.#.#.###.#.#.#.###.###.#.###.#.#.#.###.#.#.#.#####.#.###.#.#.#.#.#.#.#####.#.#.###.#.#.#.#.#####.###.#####.#.#.#.#.###.#.#.#####.#####\n#...#...............#.#.......#.......#.......#.........#.#.#.#...#...#...#.......#.#.....#.#...........#...#.#.#...........#.#...#.......#.........#...#...#.....#...#.#.....#.#...#\n###.#.#.#.#.#########.#.#.#.#.#.#####.#.#######.#.###.#.#.#.###.###.#.#.#.#.#.###.#.#.###.#.#####.#.###########.#.#.#####.#####.#####.#####.#.#.#.#.#.#.#####.#.#.#########.#.###.#.#\n#.#...#.....#.......#.....#...#.......#.#.#...#...#...#.........#...#...#.#...#.#.........#.#.......#.#.#...#...#.........#.#.........#.....#.#.#...#.......#.#.....#.......#.#.....#\n#.#.###.#.###.#.#.#.#.###.#########.#.#.#.#.#.#.###.#.#.#####.#.#.#####.#####.#.#.#########.#.#.#.###.#.#####.#.#.###.###.#.#.#.#.#.#####.###.#.###########.#.#.#.#.#.#######.#####.#\n#........7#.....#.#...#.#.#.#.........#...#.#...........#.....#.......#.........#.........#.....#.......#.#.......#.#.#...#...#.#.#....6#.#.........................#...#.#.......#.#\n#.###.#.###.###.###.#.#.###.###.#####.###.#.#.###.#####.###.#.###.#.#.#.#.#.#.#.#.#####.#.#.#####.#######.#.###.#.#.#####.#####.#.#.#.###.#.#.#.#.#####.#.#.###.#####.#.#.#.#.#.#.#.#\n#.#...#.#...#.#.....#.#.......#...#.....#...#...#...#...#.#.....#...#.#...#...#...#.#.............#.............#.#...#.............#.#.....#.....#.......#.#.#.#.........#...#...#.#\n#####################################################################################################################################################################################";

    val map: List[List[String]] = longInput.linesIterator.map(_.map(_.toString).toList).toList

    val locations: Map[Int, Location] = extractLocationsFromMap(map)
    println("Locations in map")
    println(locations)

    val mapWithoutLocations = removeLocationsFromMap(map, locations)

    val paths: Seq[Path] = locations.keySet.map(i => {
      locations.keySet.filter(_ > i).map(j => {
        new Path(i, j, shortestPath(mapWithoutLocations, locations(i), locations(j)))
      })
    }).toSeq.flatten
    println("Shortest paths between locations")
    println(paths)

    val shortestRouteSteps = makeShortestRoute(locations, paths, 0)
    println("Shortest route")
    println(shortestRouteSteps)

  }

  def makeShortestRoute(locations: Map[Int, Location], paths: Seq[Path], start: Int): Int = {
    if (locations.contains(start)) {
      val routes = allRoutes(locations.removed(start), paths, start, 0)
      routes.min
    }
    else {
      println("Start position is not on map")
      -1
    }
  }

  def allRoutes(locations: Map[Int, Location], paths: Seq[Path], previousLocation: Int, steps: Int): Seq[Int] = {

    locations.keys.foldLeft(Seq[Int]())((acc, locationId) => {
      val pathLength = lengthBetweenLocations(previousLocation, locationId, paths)
      if (locations.size == 1) {
        acc :+ (steps + pathLength)
      }
      else if ((locations.size > 1) && (acc.size == 0 || acc.min > (steps + pathLength))) {
          acc ++ allRoutes(locations.removed(locationId), paths, locationId, (steps + pathLength))
      }
      else {
        acc
      }
    })
  }

  def lengthBetweenLocations(location1: Int, location2: Int, paths: Seq[Path]): Int = {
    val path: Path = paths.filter(x => (x.fromPoint == location1 && x.toPoint == location2) || (x.toPoint == location1 && x.fromPoint == location2)).head
    path.pathLength
  }

  def shortestPath(map: List[List[String]], fromLocation: Location, toLocation: Location): Int = {
    val previousLocation = new Location(-1, -1)
    val calculatedPaths = findAllPaths(map.updated(fromLocation.y, map(fromLocation.y).updated(fromLocation.x, "0")), fromLocation, previousLocation, fromLocation, toLocation, 0)

    if(calculatedPaths(toLocation.y)(toLocation.x).toCharArray.head.isDigit) {
      calculatedPaths(toLocation.y)(toLocation.x).toInt
    }
    else {
      Int.MaxValue
    }
  }

  def findAllPaths(map: List[List[String]], startLocation: Location, previousLocation: Location, fromLocation: Location, toLocation: Location, steps: Int): List[List[String]] = {
    var newMap = map
    val neighborLocations = generateNeighborLocations(fromLocation, toLocation)
    val minPath = Math.abs(toLocation.y - startLocation.y) + Math.abs(toLocation.x - startLocation.x)

    neighborLocations.foldLeft(List[List[String]]())((acc, location) => {
      val neighborPoint: String = newMap(location.y)(location.x)
      val remainingPath = Math.abs(toLocation.y - location.y) + Math.abs(toLocation.x - location.x)

      if (location.isEqual(toLocation)) {
        if(neighborPoint == "." || (steps+1 < neighborPoint.toInt)){
          newMap = newMap.updated(location.y, newMap(location.y).updated(location.x, (steps+1).toString))
        }
      }
      else if(isNextLocationValid(previousLocation, location, neighborPoint) && ((remainingPath + steps + 1) < (4 * minPath))) {
        if (neighborPoint == ".") {
          newMap = findAllPaths(newMap.updated(location.y, newMap(location.y).updated(location.x, (steps+1).toString)), startLocation, fromLocation, location, toLocation, (steps + 1))
        }
        else if (neighborPoint.toCharArray.head.isDigit && (steps+1 < neighborPoint.toInt)) {
          newMap = findAllPaths(newMap.updated(location.y, newMap(location.y).updated(location.x, (steps+1).toString)), startLocation, fromLocation, location, toLocation, (steps + 1))
        }
      }
      newMap
    })
  }

  def generateNeighborLocations(location: Location, destinationLocation: Location): Seq[Location] = {

    val diffY = destinationLocation.y - location.y
    val diffX = destinationLocation.x - location.x

    val directionY = if(diffY != 0) diffY / Math.abs(diffY) else 1
    val directionX = if(diffX != 0) diffX / Math.abs(diffX) else 1

    val firstY = if(Math.abs(diffY) > Math.abs(diffX)) 1 else 0
    val firstX = if(Math.abs(diffY) > Math.abs(diffX)) 0 else 1

    Seq(
      new Location(location.y + (firstY * directionY), location.x + (firstX * directionX)),
      new Location(location.y + (firstX * directionY), location.x + (firstY* directionX)),
      new Location(location.y - (firstX * directionY), location.x - (firstY * directionX)),
      new Location(location.y - (firstY * directionY), location.x - (firstX * directionX)))
  }

  def isLocationInPath(location: Location, path: Seq[Location]): Boolean = {
    path.filter(x => x.isEqual(location)).size > 0
  }

  def isNextLocationEmpty(previousLocation: Location, nextLocation: Location, point: String): Boolean = {
    !previousLocation.isEqual(nextLocation) &&  point == "."
  }

  def isNextLocationNumber(previousLocation: Location, nextLocation: Location, point: String): Boolean = {
    !previousLocation.isEqual(nextLocation) && point.toCharArray.head.isDigit
  }

  def isNextLocationValid(previousLocation: Location, nextLocation: Location, point: String): Boolean = {
    !previousLocation.isEqual(nextLocation) && (point.toCharArray.head.isDigit || point == ".")
  }

  def removeLocationsFromMap(map: List[List[String]], locations: Map[Int, Location]): List[List[String]] = {
    map.map(row => {
      row.map(location => {
        if(location.toCharArray.head.isDigit) {
          "."
        }
        else {
          location
        }
      })
    })
  }

  def extractLocationsFromMap(map: List[List[String]]): Map[Int, Location] = {
    val mapWidth = map(0).size

    (0 to (map.flatten.size - 1)).map(i => {
      val y = (i / mapWidth)
      val x = (i % mapWidth)
      if (map(y)(x).toCharArray.head.isDigit) {
        Tuple2(map(y)(x).toCharArray.head.asDigit, new Location(y, x))
      }
      else {
        Tuple2(Integer.MIN_VALUE, new Location(0, 0))
      }
    }).toMap.filter(_._1 >= 0)
  }

  def printMap(map: List[List[String]]): Unit ={
    map.map(x => {
      x.map(y => {
        if(y.length == 1) {
          print(s" $y ")
        }
        else if(y.length == 2) {
          print(s" $y")
        }
        else {
          print(y)
        }
      })
      println()
    })
  }
}

