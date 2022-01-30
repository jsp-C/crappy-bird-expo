export function randomNegative(number) {
	return number * (Math.random() < 0.5 ? -1 : 1)
}
