
object ElectromagneticMoat {

  case class Component(port1: Int, port2: Int)

  def main(args: Array[String]) {
    val input: String = "0/2\n2/2\n2/3\n3/4\n3/5\n0/1\n10/1\n9/10"
    val longInput: String = "48/5\n25/10\n35/49\n34/41\n35/35\n47/35\n34/46\n47/23\n28/8\n27/21\n40/11\n22/50\n48/42\n38/17\n50/33\n13/13\n22/33\n17/29\n50/0\n20/47\n28/0\n42/4\n46/22\n19/35\n17/22\n33/37\n47/7\n35/20\n8/36\n24/34\n6/7\n7/43\n45/37\n21/31\n37/26\n16/5\n11/14\n7/23\n2/23\n3/25\n20/20\n18/20\n19/34\n25/46\n41/24\n0/33\n3/7\n49/38\n47/22\n44/15\n24/21\n10/35\n6/21\n14/50";

    val components:Seq[Component] = longInput.linesIterator.map(lineDataToSeqOfComponents).toSeq

    val bridges = buildBridges(components, Seq(), 0)

    /* Part 1 */
    val bridgesStrength = bridges.map(components => sumComponentsStrength(components))
    println("MAX STRENGTH OF THE STRONGEST BRIDGE")
    println(bridgesStrength.max)

    /* Part 2 */
    val bridgesLengthMax = bridges.map(_.size).max
    val bridgesWithMaxLength = bridges.filter(x => x.size == bridgesLengthMax)
    val bridgesWithMaxLengthStrength = bridgesWithMaxLength.map(components => sumComponentsStrength(components))
    println("MAX STRENGTH OF THE LONGEST BRIDGE")
    println(bridgesWithMaxLengthStrength.max)
  }

  def buildBridges(components: Seq[Component], partOfBridge: Seq[Component], portType: Int): Seq[Seq[Component]] = {

    components.foldLeft(Seq[Seq[Component]]())((acc, port) => {
      if(componentContainsPortType(port, portType)){
        val nextPortType = if(port.port1 == portType) port.port2 else port.port1
        val remainingPorts = components.filter(x => (x.port1 != port.port1 || x.port2 != port.port2))

        if(componentsContainsPortType(remainingPorts, nextPortType)) {
          acc ++ buildBridges(remainingPorts, (partOfBridge :+ port), nextPortType)
        } else {
          acc :+ (partOfBridge :+ port)
        }
      } else {
        acc
      }
    })
  }

  def sumComponentsStrength(components: Seq[Component]): Int = {
    components.map(component => (component.port1 + component.port2)).sum
  }

  def componentsContainsPortType(components: Seq[Component], port: Int): Boolean = {
    components.find(x => componentContainsPortType(x, port)).size > 0
  }

  def componentContainsPortType(component: Component, port: Int): Boolean = {
    (component.port1 == port || component.port2 == port)
  }

  def lineDataToSeqOfComponents(line: String): Component = {
    val Array(port1, port2) = line.split("/")
    Component(port1.toInt, port2.toInt)
  }
}
