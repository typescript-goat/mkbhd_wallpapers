type TColors =
  | "Black"
  | "Red"
  | "Green"
  | "Yellow"
  | "Blue"
  | "Magenta"
  | "Cyan"
  | "White";

type TASCIIColor = Readonly<Record<TColors, number>>;

const ASCIIColors: TASCIIColor = {
  Black: 30,
  Red: 31,
  Green: 32,
  Yellow: 33,
  Blue: 34,
  Magenta: 35,
  Cyan: 36,
  White: 37,
} as const;

export function logger(log: string, color: TColors = "White"): void {
  console.log(`\x1b[${ASCIIColors[color]}m%s\x1b[0m`, `${log}`);
}
