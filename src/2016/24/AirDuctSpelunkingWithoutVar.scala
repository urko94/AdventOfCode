import AdventOfCode.Location
import AdventOfCode.Path

object AirDuctSpelunkingWithoutVar {

  def main(args: Array[String]) {

    val input: String = "###########\n#0.1.....2#\n#.#######.#\n#4.......3#\n###########"
    val longInput: String = "#####################################################################################################################################################################################\n#.....#.#.....#.#.#...#.....#.#.#.#.....#3......#...........#.#.....#.....#.............#.#...#...#.....#...#.........#.#...............#.....#.....#.........................#.....#\n#.#.#.#.#.#.#.#.#.#.#.#.###.#.#.#.#.#.#####.#.#.#.#####.#.###.#.#.###.#.#####.###.#.#.#.#.#####.#.#.#.#####.#.#.#####.#.#.#####.###.#.#.###.###.###.#.###.#.###.###.#.#######.#######\n#.....#...#.#.....#...#.........#...........#.......#...#.#.....#.....#.#.#.......#...#.#...#...#...#.#...#...#.#...#.#.#.#.......#...#...#.....#.....#.....#...#...#.......#.#...#.#\n###.#####.#.#######.###.#.#.#.#.#.#####.#.#.#.#####.#.###.#.#####.#.#.#.#.#####.#.#.#.#.#.###.#.###.#.#####.#.#.#.#.###.#.#.#.###.#.#.#.#.###.#.#.###.#.#.#.#.#.#.#.#.#.#####.#.#.#.#\n#...#1......#.....#.#.#.#.....#.#.#.....#...#.#...#.......#...........#.............#...#.....#.......#.....#.....#.#.......#.#...#.#.#.#.......#...#.#...........#.#.....#...#.#...#\n#.#.###.#.###.#.#.#.#.#.#.#######.#.#.###.#.#.#.###.#####.###.#.#.#.#.#.###.#.#####.#.#.#####.#####.#.#.#.#.#.#.#.###.###.#.#####.#.#.#####.#.#.#.#.#.#.#.###.#####.###.#.#.#.#.###.#\n#.....#.#.....#.#...#.#.....#.#.#.#.........#.#.#.......#.#.#.......#...#...#...#.....#.#...#.......#.....#.......#...#.....#...#...#.......#...#.#.....#...#.#.....#.#...#.#...#...#\n#.#.#.#.#####.#.###.#.#.#.###.#.###.#.#.#####.#.#####.#.#.#.#.#####.#.#.#.###.#######.#.###.#.###.#.#.#.#.#.#.#####.###.#####.#.#.#.#.#####.#####.#.###.#.#.#.#.#.#.#.#####.###.#.###\n#...#.#...#.........#.#...#.#...#.....#.#.....#.......#.........#.....#.....#.........#.....#...#.#.#.#.....#.#.................#.#.#.......#.......#.......#...#...#.......#.#...#.#\n#.#.#.#.#.#.#.###.#.###.###.#.#.#.###.###.#.#.#.#.#.#.#########.#.###.#.#.#####.#.#.#.###.#######.#.###.#.#.#.#.#.#.#.###.#.#.###.#######.#.###.#.#.#.#.###.#.#.#.#####.###.#.#.###.#\n#...#.#.#.#.#...#...#...#.............#.....#.....#...#...#.#.....#...#...#.....#.#.....#...#...........#.#.#.#.......#...#.............#...#.#...#...........#...#2#...#.....#.#.#.#\n###.###.#.#####.#.#.#.#.#.#.#.#.#.#.###.###.#.#.#.###.###.#.#.#.#.#.#.###.###.#.#.#.#.###.#.#.#.###.#####.###.###.#.#.#.###.#######.###.###.#.#.#.#####.#####.###.#.#.#####.#.#.#.###\n#.......#...#...........#.......#...#.#.......#.....#.....#...#...#.#.........#.......#...#.#...#...........#.#...#.#...............#.#.#.....#.......#.#.#.#.....#.........#.#.#.#.#\n###.#.#.#.#.#.#.#####.###.#.#.#.#.#.#.#.#.#.#.#.#.#.#.#####.#.###.#.###.#.#.#.#########.###.#.###.#.###.#.#.#.#.#######.#####.###.#.#.#.#.#####.#####.#.#.#.#.#.#######.#.###.#.#.#.#\n#...#.....#.#.............#...#.#.....#.#...#.......#.........#...#...#.#...#...........#...#...........#...#...#.................#...#.#.#.....#.......#.#.#.......#...#...#...#...#\n###.#.#######.#.#.#.###.#.#.#.###.#.#.#.#.#.###.#####.#.###.#.#.#.###.#.#.#.#.#.#.#.###.#.#.#.#.#.#.#####.#.#####.#.#.#.#.#.#######.#.#.#.###.#.#.#.#.#.###.#.###.#########.###.#.#.#\n#.....#...#.....#.....#...#.........#.#...#.....#...#.................#...#.#.#.......#.....#...#.#.................#.#.#.........#.....#...#.#...#.....#.................#.#.....#.#\n#.#####.#.#.#####.###.#.#.#.###.###.#.#########.#.#######.###.###.#.#.#.#.#.#.#.###.#.#.#####.#.###.#.#########.#.###.###.#.###.###.#.#.#.#.#.###.#####.#.#.#######.#.###.#.#.###.###\n#0#...#.#...#...........#.#.............#.#.......#.....#.#.#.....#.#.#...#.....#.#.#.......#.#...#.................#.#.#.....#...#.#.........#.......#.#...#.......#.......#.....#.#\n#####.#.###.#.#.###.#####.###.#######.###.#.#.###.#.#.#.#.#.#.#.#.###.#.#.#.#.#.#.#.#.#####.###.#.#####.#.#.#.###.#.#.#.#########.#.#.#.###.#.#.###.#.#####.#.#.#.#.#.###.###.#.#.#.#\n#...#.#.....#.#.#...#.......#.#.#...#.........#.......#...#.#.....#.............#...........#...#.#.......#.#.....#.#...........#...#.........#.#...#.#.....#.......#...#.......#...#\n###.###.###.#.###.###.#.###.###.#.#.#.#########.#####.###.#######.#.###.#.#.#.###.#.#.#.#.#.#.#.#####.###.#.#.#.#.#.#.#####.###.#.#.###.#####.#.#.#####.#.#.###.#.#####.#.#.#.#.#.#.#\n#.......#...............#.....#...#...#.#...#.........#...........#.....#.....#.......#...#.....#.......#.#.#.#...#...............#.....#.....#...#.#...#...#.#.#.#.#.....#...#.#.#4#\n#.#.#.#.#.#####.###.#.#####.#.###.#.###.#.#.#.###.###.#.#####.#.#####.#.#######.#.#####.#.#######.#.###.#.#.#.###.###.###.#####.#.###.#.#.#.#####.#.#.#.###.#.#.###.###.#.#.#.#.#.###\n#...#...........#.......#...#.....#.#.......#.....#.........#.#.......#.#...#...#...........#.......#.....#...#...#...#.#...#.....#...#.........#...#...#.....#.....#...#...#...#...#\n###.#.###.#############.#.###.###.#.###.#.#.#.#.#.#.#.#.###.#####.#.#.#.#.#.#####.###.#.#.#.#.###.#.#.#.#.#.###.#.#.###.#.#.#.###.###.#.#.###.#.#.#.#.#.#.#####.#.#.#.#.#.#.###.#.###\n#...#.....#.#...#.#.#.#...........#.......#...#.....#...#...................#...#...#.#.#.#...#.......#...............#...#...#...#...#.#.#5#...#...#.#...#...#.#...#.#...#...#.#...#\n#.###.###.#.#.#.#.#.#.###.#.#######.#.#.#.###.#.#.#.#.#.#.###.#.###.###.#.#.#.#.#.###.#.#.#.#.#.###.#.#.###.#.#.###.#.#.#.#.#.#.#.#.#####.#.#.#######.#.#.#.#.#.#####.#.#######.#.#.#\n#.........#.#...#.#...#...#.............#.....#...#.#.#.#.#.#.....#.#...#.....#.#.#.........#.....#.........#.....#...........#...#.........#.....#...#.#.#.#...#...........#...#...#\n#.#.#.#######.#.#####.#.#.#.###.#.#######.#####.#.#.###.#.#.#.###.###.#.###.#.#.#.###.#.#.#.#####.#.###.#.#.#.#.#.#.#####.#.#.###.#.#.#.#.#####.###.#####.#.#.#.#.###.#.#.#####.#####\n#...#...............#.#.......#.......#.......#.........#.#.#.#...#...#...#.......#.#.....#.#...........#...#.#.#...........#.#...#.......#.........#...#...#.....#...#.#.....#.#...#\n###.#.#.#.#.#########.#.#.#.#.#.#####.#.#######.#.###.#.#.#.###.###.#.#.#.#.#.###.#.#.###.#.#####.#.###########.#.#.#####.#####.#####.#####.#.#.#.#.#.#.#####.#.#.#########.#.###.#.#\n#.#...#.....#.......#.....#...#.......#.#.#...#...#...#.........#...#...#.#...#.#.........#.#.......#.#.#...#...#.........#.#.........#.....#.#.#...#.......#.#.....#.......#.#.....#\n#.#.###.#.###.#.#.#.#.###.#########.#.#.#.#.#.#.###.#.#.#####.#.#.#####.#####.#.#.#########.#.#.#.###.#.#####.#.#.###.###.#.#.#.#.#.#####.###.#.###########.#.#.#.#.#.#######.#####.#\n#........7#.....#.#...#.#.#.#.........#...#.#...........#.....#.......#.........#.........#.....#.......#.#.......#.#.#...#...#.#.#....6#.#.........................#...#.#.......#.#\n#.###.#.###.###.###.#.#.###.###.#####.###.#.#.###.#####.###.#.###.#.#.#.#.#.#.#.#.#####.#.#.#####.#######.#.###.#.#.#####.#####.#.#.#.###.#.#.#.#.#####.#.#.###.#####.#.#.#.#.#.#.#.#\n#.#...#.#...#.#.....#.#.......#...#.....#...#...#...#...#.#.....#...#.#...#...#...#.#.............#.............#.#...#.............#.#.....#.....#.......#.#.#.#.........#...#...#.#\n#####################################################################################################################################################################################";

    val map: List[List[String]] = longInput.linesIterator.map(_.map(_.toString).toList).toList

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
    println("Time 1: " + (t1 - t0).toString + " miliseconds")

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
    }
    else {
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
      }
      else if ((locations.size > 1) && (acc.size == 0 || acc.min > (steps + pathLength))) {
        acc ++ allRoutes(locations.removed(locationId), paths, locationId, lastLocation, (steps + pathLength))
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

    if (calculatedPaths.size == 1 && calculatedPaths.head(toLocation.y)(toLocation.x).toCharArray.head.isDigit) {
      printMap(calculatedPaths.head)
      calculatedPaths.head(toLocation.y)(toLocation.x).toInt
    }
    else {
      Int.MaxValue
    }
  }

  def findAllPaths(map: List[List[String]], startLocation: Location, previousLocation: Location, fromLocation: Location, toLocation: Location, steps: Int): Seq[List[List[String]]] = {
    val neighborLocations = generateNeighborLocations(fromLocation, toLocation)

    val maps = neighborLocations.foldLeft(Seq(map))((acc, location) => {
      val neighborPoint: String = map(location.y)(location.x)
      val finishPointValue: Int = if (map(toLocation.y)(toLocation.x) == ".") Int.MaxValue else map(toLocation.y)(toLocation.x).toInt
      val remainingPath = Math.abs(toLocation.y - location.y) + Math.abs(toLocation.x - location.x)

      if (location.isEqual(toLocation)) {
        if (neighborPoint == "." || (steps + 1 < neighborPoint.toInt)) {
          acc :+ map.updated(location.y, map(location.y).updated(location.x, (steps + 1).toString))
        }
        else {
          acc
        }
      }
      else if (isNextLocationValid(previousLocation, location, neighborPoint) && ((remainingPath + steps + 1) < finishPointValue)) {
        if (neighborPoint == ".") {
          val mergedMap = mergeMaps(acc :+ map.updated(location.y, map(location.y).updated(location.x, (steps + 1).toString)))
          acc ++ findAllPaths(mergedMap.head, startLocation, fromLocation, location, toLocation, (steps + 1))
        } else if (neighborPoint.toCharArray.head.isDigit && (steps + 1 < neighborPoint.toInt)) {
          val mergedMap = mergeMaps(acc :+ map.updated(location.y, map(location.y).updated(location.x, (steps + 1).toString)))
          acc ++ findAllPaths(mergedMap.head, startLocation, fromLocation, location, toLocation, (steps + 1))
        } else
          acc
      }
      else {
        acc
      }
    })
    mergeMaps(maps)
  }

  def mergeMaps(maps: Seq[List[List[String]]]): Seq[List[List[String]]] = {
    if (maps.size == 2) {
      Seq(maps(1))
    }
    else if (maps.size > 2) {
      val mergedMap = (0 to (maps.head.size - 1)).map(i => {
        (0 to (maps.head(i).size - 1)).map(j => {
          if (maps.head(i)(j) == "#") {
            maps.head(i)(j)
          }
          else {
            (1 to (maps.size -1)).foldLeft(".")((acc, mapId) => {
              if (maps(mapId)(i)(j) == ".") {
                acc
              }
              else {
                val mapValue = maps(mapId)(i)(j).toInt
                val locationValue = if (acc == ".") Int.MaxValue else acc.toInt
                if (mapValue < locationValue) mapValue.toString else acc
              }
            })
          }
        }).toList
      }).toList
      Seq(mergedMap)
    }
    else {
      maps
    }
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

  def isNextLocationValid(previousLocation: Location, nextLocation: Location, point: String): Boolean = {
    !previousLocation.isEqual(nextLocation) && (point.toCharArray.head.isDigit || point == ".")
  }

  def removeLocationsFromMap(map: List[List[String]], locations: Map[Int, Location]): List[List[String]] = {
    map.map(row => {
      row.map(location => {
        if (location.toCharArray.head.isDigit) {
          "."
        }
        else {
          location
        }
      })
    })
  }

  def extractLocationsFromMap(map: List[List[String]]): Map[Int, Location] = {
    val mapWidth = map.head.size

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

  def printMap(map: List[List[String]]): Unit = {
    map.map(x => {
      x.map(y => {
        if (y.length == 1) {
          print(s" $y ")
        }
        else if (y.length == 2) {
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

