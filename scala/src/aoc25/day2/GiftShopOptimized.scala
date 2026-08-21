package aoc25.day2

object GiftShopOptimized {

  def main(args: Array[String]): Unit = {

    val input: String = "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,\n1698522-1698528,446443-446449,38593856-38593862,565653-565659,\n824824821-824824827,2121212118-2121212124"
    val longInput: String = "288352-412983,743179-799185,7298346751-7298403555,3269-7729,3939364590-3939433455,867092-900135,25259-67386,95107011-95138585,655569300-655755402,9372727140-9372846709,986003-1032361,69689-125217,417160-479391,642-1335,521359-592037,7456656494-7456690478,38956690-39035309,1-18,799312-861633,674384-733730,1684-2834,605744-666915,6534997-6766843,4659420-4693423,6161502941-6161738969,932668-985784,901838-922814,137371-216743,47446188-47487754,117-403,32-77,35299661-35411975,7778-14058,83706740-83939522"

    val ranges =
      longInput
        .linesIterator
        .flatMap(_.split(','))
        .map(parseRange)
        .toSeq

    val result1 = ranges.map(sumInvalidIds(_, isInvalidId)).sum
    val result2 = ranges.map(sumInvalidIds(_, isInvalidId2)).sum

    println(s"Result 1: $result1")
    println(s"Result 2: $result2")
  }

  private def parseRange(input: String): IdRange =
    val Array(min, max) = input.split('-')
    IdRange(min.toLong, max.toLong)

  private def sumInvalidIds(range: IdRange, isInvalid: String => Boolean): Long =
    (range.min to range.max)
      .filter(id => isInvalid(id.toString))
      .sum

  private def isInvalidId(id: String): Boolean =
    id.length >= 2 &&
      id.length % 2 == 0 &&
      id.take(id.length / 2) == id.drop(id.length / 2)

  private def isInvalidId2(id: String): Boolean =
    (1 to id.length / 2).exists { patternLength =>
      val repetitions = id.length / patternLength

      id.length % patternLength == 0 &&
        id == id.take(patternLength) * repetitions
    }

  case class IdRange(min: Long, max: Long)

}
