

object NoSuchThingAsTooMuch_2 {

  def main(args: Array[String]) {

    val litersOfEggnog: Int = 150
    val input: String = "20\n15\n10\n5\n5"
    var longInput: String = "50\n44\n11\n49\n42\n46\n18\n32\n26\n40\n21\n7\n18\n43\n10\n47\n36\n24\n22\n40"

    val containers = longInput.linesIterator.map(_.toInt).toList.zipWithIndex.map(_.swap).toMap
    println(containers);
    println();

    val combinations = combineContainers(containers, List[Int](), litersOfEggnog, 999)
    val minCombination = combinations.map(_.size).min
    println(combinations)
    println(combinations.size)

    val combinationsWithLimit = combineContainers(containers, List[Int](), litersOfEggnog, minCombination)
    println(combinationsWithLimit)
    println(combinationsWithLimit.size)
  }

  def combineContainers(containers: Map[Int, Int], combination: List[Int], litersOfEggnog: Int, containerLimit: Int): Seq[List[Int]] = {

    var result = Seq[List[Int]]();
    for((key, container) <- containers) {
      if(combination.sum + container == litersOfEggnog){
        result = result :+ (combination :+ container)
      }
      else if(combination.sum + container < litersOfEggnog && combination.size+1 < containerLimit){
        result = result ++ combineContainers(containers.view.filterKeys(_ > key).toMap, (combination :+ container), litersOfEggnog, containerLimit)
      }
    }
    result
  }

}
