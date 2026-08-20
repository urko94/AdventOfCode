package aoc21.day02

import scala.io.Source

case class Position(horizontal: Long, depth: Long, aim: Long)

case class Action(direction: String, steps: Long)


object Dive {

  def main(args: Array[String]) {

    val inputText: Seq[Action] = Source.fromResource("day02-input.txt").getLines().map(x => {
      val Array(direction, length) = x.split(" ")
      Action(direction, length.toLong)
    }).toSeq

    val testInput: Seq[Action] = "forward 5\ndown 5\nforward 8\nup 3\ndown 8\nforward 2".linesIterator.map(x => {
      val Array(direction, steps) = x.split(" ")
      Action(direction, steps.toLong)
    }).toSeq

    val data = inputText

    val finalDestination = data.foldLeft(Position(0,0,0))((acc, action) => {
      action.direction match {
        case "forward" => Position(acc.horizontal + action.steps, acc.depth, acc.aim)
        case "down" => Position(acc.horizontal, acc.depth + action.steps, acc.aim)
        case "up" => Position(acc.horizontal, acc.depth - action.steps, acc.aim)
        case _ => acc
      }
    })
    println(finalDestination)

    println("Result1")
    println(finalDestination.horizontal * finalDestination.depth)


    val destination2 = data.foldLeft(Position(0,0,0))((acc, action) => {
      action.direction match {
        case "forward" => Position(acc.horizontal + action.steps, acc.depth + (acc.aim * action.steps), acc.aim)
        case "down" => Position(acc.horizontal, acc.depth, acc.aim + action.steps)
        case "up" => Position(acc.horizontal, acc.depth, acc.aim - action.steps)
        case _ => acc
      }
    })
    println(destination2)

    println("Result2")
    println(destination2.horizontal * destination2.depth)
  }
}
