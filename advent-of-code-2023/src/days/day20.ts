import { readInputLines } from '../utils/input';
import { lcm } from '../utils/utils';

// Direction of a pulse
enum PulseType {
  LOW = 'low',
  HIGH = 'high',
}

// Module types
enum ModuleType {
  BROADCASTER = 'broadcaster',
  FLIP_FLOP = '%',
  CONJUNCTION = '&',
  OUTPUT = 'output', // for rx or dummy sinks
}
// A pulse moving through the network
interface Pulse {
  sender: string;
  receiver: string;
  type: PulseType;
}

// Base structure for a module
interface Module {
  name: string;
  type: ModuleType;
  outputs: string[];
  // For specific module memory
  state?: boolean; // for flip-flops
  inputs?: string[]; // for conjunction modules
  memory?: Map<string, PulseType>; // remembers last pulse from each input
}
interface ModuleNetwork {
  modules: Map<string, Module>;
  queue: Pulse[];
  pulseCount: Record<PulseType, number>;
}

/**
 * Parses the raw text input into a network of modules.
 */
function parseModules(lines: string[]): Map<string, Module> {
  const modules = new Map<string, Module>();

  for (const line of lines) {
    const [left, right] = line.split(' -> ');
    const outputs = right.split(',').map(o => o.trim());

    if (left === 'broadcaster') {
      modules.set('broadcaster', {
        name: 'broadcaster',
        type: ModuleType.BROADCASTER,
        outputs,
      });
    } else {
      const type = left[0] as '%' | '&';
      const name = left.slice(1);
      modules.set(name, {
        name,
        type: type === '%' ? ModuleType.FLIP_FLOP : ModuleType.CONJUNCTION,
        outputs,
        state: false,
        memory: new Map<string, PulseType>(),
      });
    }
  }

  // Initialize conjunction inputs (reverse edges)
  for (const [name, module] of modules.entries()) {
    for (const dest of module.outputs) {
      const target = modules.get(dest);
      if (target && target.type === ModuleType.CONJUNCTION) {
        target.inputs ??= [];
        target.inputs.push(name);
        target.memory?.set(name, PulseType.LOW);
      }
    }
  }

  return modules;
}

function createNetwork(lines: string[]): ModuleNetwork {
  const modules = parseModules(lines);
  return {
    modules,
    queue: [],
    pulseCount: {
      [PulseType.LOW]: 0,
      [PulseType.HIGH]: 0,
    },
  };
}
function processPulse(network: ModuleNetwork, pulse: Pulse) {
  const { modules, queue, pulseCount } = network;
  const module = modules.get(pulse.receiver);

  // Count this pulse
  pulseCount[pulse.type]++;

  // If receiver doesn’t exist, ignore (like 'rx' or 'output')
  if (!module) return;

  switch (module.type) {
    // 🟢 Broadcaster just sends the same pulse to all outputs
    case ModuleType.BROADCASTER:
      for (const out of module.outputs) {
        queue.push({ sender: module.name, receiver: out, type: pulse.type });
      }
      break;

    // 🟣 Flip-flop toggles on LOW pulses
    case ModuleType.FLIP_FLOP:
      if (pulse.type === PulseType.HIGH) {
        // HIGH pulses ignored
        return;
      }
      // LOW pulse → toggle state
      module.state = !module.state;
      const newType = module.state ? PulseType.HIGH : PulseType.LOW;
      for (const out of module.outputs) {
        queue.push({ sender: module.name, receiver: out, type: newType });
      }
      break;

    // 🔵 Conjunction remembers last pulses from inputs
    case ModuleType.CONJUNCTION:
      if (!module.memory) return;
      module.memory.set(pulse.sender, pulse.type);

      // If all inputs are HIGH → send LOW, else HIGH
      const allHigh = [...module.memory.values()].every(t => t === PulseType.HIGH);
      const outType = allHigh ? PulseType.LOW : PulseType.HIGH;

      for (const out of module.outputs) {
        queue.push({ sender: module.name, receiver: out, type: outType });
      }
      break;

    default:
      break;
  }
}
function pressButton(network: ModuleNetwork): number {
  const { queue } = network;
  queue.push({ sender: 'button', receiver: 'broadcaster', type: PulseType.LOW });

  let count = 0;
  while (queue.length > 0) {
    const pulse = queue.shift()!;
    processPulse(network, pulse);
    count++;
  }
  return count;
}

function findRxLowOptimized(network: ModuleNetwork): number {
  // Find module that sends signal to 'rx'
  const rxInput = [...network.modules.values()].find(m => m.outputs.includes('rx'));
  if (!rxInput) throw new Error('No module sends to rx!');

  // Track the inputs to that module
  const inputs = [...rxInput.memory!.keys()];
  const seen: Record<string, number> = {};
  const periods: Record<string, number> = {};

  let press = 0;

  while (true) {
    press++;

    // Press the button
    const { queue } = network;
    queue.push({ sender: 'button', receiver: 'broadcaster', type: PulseType.LOW });

    // Process pulses
    while (queue.length > 0) {
      const pulse = queue.shift()!;
      processPulse(network, pulse);

      // If this pulse goes *into* the rxInput (the conjunction feeding rx)
      if (inputs.includes(pulse.sender) && pulse.type === PulseType.HIGH) {
        if (!seen[pulse.sender]) {
          seen[pulse.sender] = press;
        } else if (!periods[pulse.sender]) {
          periods[pulse.sender] = press - seen[pulse.sender];
        }
      }
    }

    // Once all periods known → stop
    if (Object.keys(periods).length === inputs.length) break;
  }

  const result = Object.values(periods).reduce((acc, p) => lcm(acc, p));
  return result;
}

export function day20(day: number, test: boolean) {
  const input = readInputLines(day, test);

  // Part 1
  const network = createNetwork(input);

  for (let i = 0; i < 1000; i++) {
    pressButton(network);
  }

  // Part 2
  const res2 = findRxLowOptimized(createNetwork(input));

  return {
    part1: network.pulseCount.low * network.pulseCount.high,
    part2: res2,
  };
}
