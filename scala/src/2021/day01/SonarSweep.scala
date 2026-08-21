package aoc21.day01

import scala.io.Source

object SonarSweep {

  def main(args: Array[String]): Unit = {

    val inputReport: Array[Int] = Source.fromResource("day01-input.txt").getLines().map(Integer.parseInt).toArray[Int]

    val exampleReport: Array[Int] = Array(
      199,
      200,
      208,
      210,
      200,
      207,
      240,
      269,
      260,
      263,
    )

    val data = inputReport

    var result = 0
    for (i <- 1 to (data.length - 1) ) {
      if (data(i) > data(i-1)) {
        result += 1
      }
    }
    println(result)

    var result2 = 0
    for (i <- 4 to (data.length) ) {
      val seq1 = data.slice(i-4, i-1)
      val seq2 = data.slice(i-3, i)

      if (seq2.sum > seq1.sum) {
        result2 += 1
      }
    }
    println(result2)
  }
}
