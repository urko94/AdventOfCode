package aoc25.day2

object GiftShop {

  case class Range(min: Long, max: Long)

  def main(args: Array[String]): Unit = {

    val input: String = "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,\n1698522-1698528,446443-446449,38593856-38593862,565653-565659,\n824824821-824824827,2121212118-2121212124"
    val longInput: String = "288352-412983,743179-799185,7298346751-7298403555,3269-7729,3939364590-3939433455,867092-900135,25259-67386,95107011-95138585,655569300-655755402,9372727140-9372846709,986003-1032361,69689-125217,417160-479391,642-1335,521359-592037,7456656494-7456690478,38956690-39035309,1-18,799312-861633,674384-733730,1684-2834,605744-666915,6534997-6766843,4659420-4693423,6161502941-6161738969,932668-985784,901838-922814,137371-216743,47446188-47487754,117-403,32-77,35299661-35411975,7778-14058,83706740-83939522"

    val ranges = longInput.linesIterator.flatMap(l => l.split(',').map(parseRange))
    val ranges2 = longInput.linesIterator.flatMap(l => l.split(',').map(parseRange))

    /*  Part 1  */
    val result1 = ranges.foldLeft(0.toLong)(findIds)
    print("Result 1: ")
    println(result1)


    /*  Part 2  */
    val result2 = ranges2.foldLeft(0.toLong)(findIds2)
    print("Result 2: ")
    println(result2)

  }

  private def parseRange(input: String): Range = {
    val Array(val1, val2) = input.split("-")
    Range(min = val1.toLong, max = val2.toLong)
  }

  private def findIds(sumIds: Long, range: Range): Long = {
    (range.min to range.max).foldLeft(sumIds) { (acc, i) =>
      if(isInvalidId(i.toString)) acc + i
      else acc
    }
  }
  private def isInvalidId(id: String): Boolean = {
    if (id.length < 2 || id.length % 2 == 1 ) return false

    val (val1, val2) = id.splitAt(id.length/2)
    if (val1 == val2) true
    else false
  }

  private def findIds2(sumIds: Long, range: Range): Long = {
    (range.min to range.max).foldLeft(sumIds) { (acc, i) =>
      if(isInvalidId2(i.toString)) acc + i
      else acc
    }
  }
  private def isInvalidId2(id: String): Boolean = {
    if (id.length < 2 ) return false

    for (i <- 1 to (id.length/2)) {
      for (j <- 0 to i) {
        val positions = findPositions(id, id.substring(j,i))
        if(positions.size * (i-j) == id.length && validPositions(positions, i-j)) {
          return true
        }
      }
    }
    false
  }

  private def validPositions(positions: Seq[Int], len: Int): Boolean =
    positions.sliding(2).forall {
      case Seq(a, b) => b - a == len
      case _ => true
    }

  private def findPositions(str: String, sub: String): Seq[Int] = {
    if (sub.isEmpty) Seq.empty
    else {
      def loop(from: Int): Seq[Int] = {
        val i = str.indexOf(sub, from)
        if (i == -1) Seq.empty
        else i +: loop(i + 1)
      }

      loop(0)
    }
  }
}
