
object NoSuchThingAsTooMuch_1_func {

  def main(args: Array[String]) {

    val litersOfEggnog: Int = 150
    val input: String = "20\n15\n10\n5\n5"
    var longInput: String = "50\n44\n11\n49\n42\n46\n18\n32\n26\n40\n21\n7\n18\n43\n10\n47\n36\n24\n22\n40"

    val containers = longInput.linesIterator.map(_.toInt).toList.zipWithIndex.map(_.swap).toMap
    println(containers);
    println();

    val numOfCombinations = combineContainers(containers, List[Int](), litersOfEggnog, 999)
    println("RESULT")
    println(numOfCombinations.size);

  }

  def combineContainers(containers: Map[Int, Int], combination: List[Int], litersOfEggnog: Int, containerLimit: Int): Seq[List[Int]] = {

    containers.foldLeft(Seq[List[Int]]())((acc, element) => {
      if(combination.sum + element._2 == litersOfEggnog){
        acc :+ (combination :+ element._2)
      }
      else if(combination.sum + element._2 < litersOfEggnog && combination.size+1 < containerLimit){
        acc ++ combineContainers(containers.view.filterKeys(_ > element._1).toMap, (combination :+ element._2), litersOfEggnog, containerLimit)
      }
      else {
        acc
      }
    })
  }
}
