
object ElectromagneticMoat {

  def main(args: Array[String]) {

    val input: String = "0/2\n2/2\n2/3\n3/4\n3/5\n0/1\n10/1\n9/10"
    val longInput: String = "48/5\n25/10\n35/49\n34/41\n35/35\n47/35\n34/46\n47/23\n28/8\n27/21\n40/11\n22/50\n48/42\n38/17\n50/33\n13/13\n22/33\n17/29\n50/0\n20/47\n28/0\n42/4\n46/22\n19/35\n17/22\n33/37\n47/7\n35/20\n8/36\n24/34\n6/7\n7/43\n45/37\n21/31\n37/26\n16/5\n11/14\n7/23\n2/23\n3/25\n20/20\n18/20\n19/34\n25/46\n41/24\n0/33\n3/7\n49/38\n47/22\n44/15\n24/21\n10/35\n6/21\n14/50";

    val ports = longInput.linesIterator.map(lineDataToSet).toSeq

    val bridges = buildBridges(ports, Seq(), 0)

    /* Part 1 */
    val bridgesStrength = bridges.map(_.flatten.sum)
    println("MAX STRENGTH OF THE STRONGEST BRIDGE")
    println(bridgesStrength.max)

    /* Part 2 */
    val bridgesLengthMax = bridges.map(_.size).max
    val bridgesWithMaxLength = bridges.filter(x => x.size == bridgesLengthMax)
    val bridgesWithMaxLengthStrength = bridgesWithMaxLength.map(_.flatten.sum)
    println("MAX STRENGTH OF THE LONGEST BRIDGE")
    println(bridgesWithMaxLengthStrength.max)
  }

  def buildBridges(ports: Seq[Seq[Int]], partOfBridge: Seq[Seq[Int]], portType: Int): List[Seq[Seq[Int]]] = {

    ports.foldLeft(List[Seq[Seq[Int]]]())((acc, port) => {
      if(port.contains(portType)){
        val nextPortType = if(port.head == portType) port.last else port.head
        val remainingPorts = ports.filter(x => (x.head != port.head || x.last != port.last))

        if(remainingPorts.flatten.contains(nextPortType)) {
          acc ++ buildBridges(remainingPorts, (partOfBridge :+ port), nextPortType)
        } else {
          acc :+ (partOfBridge :+ port)
        }
      } else {
        acc
      }
    })
  }

  def lineDataToSet(line: String): Seq[Int] = {
    val Array(port1, port2) = line.split("/")
    Seq(port1.toInt, port2.toInt)
  }

}
