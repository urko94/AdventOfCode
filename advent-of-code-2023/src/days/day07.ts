import { readInput, readInputLines } from '../utils/input';
import { sum, sumBigInt } from '../utils/utils';

type HandCards = {
  cards: Map<string, number>;
  value: number;
  result: number;
};

type Hand = { cards: string; bid: number };

const cardOrderPart1 = '23456789TJQKA';
const cardOrderPart2 = 'J23456789TQKA'; // J is weakest when comparing individual cards

// Parse input
function parseInput(input: string): Hand[] {
  return input
    .trim()
    .split('\n')
    .map(line => {
      const [cards, bid] = line.split(' ');
      return { cards, bid: Number(bid) };
    });
}

// Count card frequencies
function countCards(cards: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const c of cards) counts.set(c, (counts.get(c) ?? 0) + 1);
  return counts;
}

// Get hand strength (part 1)
function handType(cards: string, jokers = false): number {
  const counts = countCards(cards);
  let groups = Array.from(counts.values()).sort((a, b) => b - a);

  if (jokers && counts.has('J') && counts.size > 1) {
    const jCount = counts.get('J')!;
    counts.delete('J');
    const maxKey = [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)!)[0];
    counts.set(maxKey, (counts.get(maxKey) ?? 0) + jCount);
    groups = Array.from(counts.values()).sort((a, b) => b - a);
  }

  if (groups[0] === 5) return 6; // five of a kind
  if (groups[0] === 4) return 5; // four of a kind
  if (groups[0] === 3 && groups[1] === 2) return 4; // full house
  if (groups[0] === 3) return 3; // three of a kind
  if (groups[0] === 2 && groups[1] === 2) return 2; // two pair
  if (groups[0] === 2) return 1; // one pair
  return 0; // high card
}

// Compare two hands
function compareHands(a: Hand, b: Hand, jokers = false): number {
  const typeA = handType(a.cards, jokers);
  const typeB = handType(b.cards, jokers);

  if (typeA !== typeB) return typeA - typeB;

  const order = jokers ? cardOrderPart2 : cardOrderPart1;
  for (let i = 0; i < 5; i++) {
    const diff = order.indexOf(a.cards[i]) - order.indexOf(b.cards[i]);
    if (diff !== 0) return diff;
  }
  return 0;
}

// Solve
function solve(hands: Hand[], jokers = false): number {
  const sorted = hands.slice().sort((a, b) => compareHands(a, b, jokers));
  // sorted.forEach(s => console.log(s));
  // console.log(sorted);
  return sorted.reduce((sum, hand, i) => sum + hand.bid * (i + 1), 0);
}

const cardsValue = (card: string | number) => {
  switch (card) {
    case 'A':
      return 13;
    case 'K':
      return 12;
    case 'Q':
      return 11;
    case 'J':
      return 10;
    case 'T':
      return 9;
    default:
      return Number(card) - 1;
  }
};

const parseCards = (cards: string): Map<string, number> => {
  const map = new Map<string, number>();
  cards.split('').forEach(c => {
    const card = c.trim();
    map.set(card, (map.get(card) ?? 0) + 1);
  });
  return map;
};

const calcResults = (player: HandCards) => {
  const keyValues: Record<number, number> = {};
  const result = Array.from(player.cards.keys())
    .sort((a, b) => cardsValue(a) - cardsValue(b))
    .map(c => {
      const cardNums = player.cards.get(c) ?? 0;
      if (cardNums in keyValues) {
        keyValues[cardNums] += 1;
      } else {
        keyValues[cardNums] = 1;
      }
      const numPow = cardNums === 1 ? 0 : cardNums;
      return Math.pow(16, keyValues[cardNums]) * cardsValue(c) * Math.pow(100, 2 * cardNums);
    });
  player.result = sum(result);
};

const cardsType = (cards: Map<string, number>) => {
  const counts = Array.from(cards.values()).sort((a, b) => b - a);
  if (counts[0] === 5) return 8; // Five of a Kind
  if (counts[0] === 4 || counts[1] === 4) return 7; // Four of a Kind
  if ((counts[0] === 3 && counts[1] === 2) || (counts[0] === 2 && counts[1] === 3)) return 6; // Full House
  if (counts.some(c => c === 3)) return 3; // Three of a Kind
  if (counts.filter(c => c === 2).length === 2) return 2; // Two Pair
  if (counts.some(c => c === 2)) return 1; // One Pair
  return 0; // High Card
};

export function day07(day: number, test: boolean) {
  const playersCards: HandCards[] = readInputLines(day, test).map(l => {
    const [cards, value] = l.split(' ');
    return { cards: parseCards(cards), value: parseInt(value), result: 0 };
  });
  // console.log(playersCards);

  // Part 1
  const groups = playersCards.reduce(
    (acc, player) => {
      const groupId = cardsType(player.cards);
      if (groupId in acc) {
        acc[groupId].push(player);
      } else {
        acc[groupId] = [player];
      }
      return acc;
    },
    {} as Record<number, HandCards[]>
  );

  Object.values(groups).forEach(players => players.forEach(p => calcResults(p)));
  Object.values(groups).forEach(players => players.sort((a, b) => Number(a.result - b.result)));

  const res1 = Object.values(groups)
    .flat()
    .map((p, i) => p.value * (i + 1));

  // Object.values(groups)
  //   .flat()
  //   .slice(900, 999)
  //   .forEach(p => console.log(p));

  const hands = parseInput(readInput(day, test));
  console.log('Part 1:', solve(hands, false));
  console.log('Part 2:', solve(hands, true));

  /**
   * 248499862
   * 248778952
   * 248884506
   * 248784337
   * 248785710
   * 248783337
   * 248778952
   * 248911355
   * 248782704
   * 248113761
   */
  // Part 2

  return {
    part1: sum(res1),
    part2: 0,
  };
}
