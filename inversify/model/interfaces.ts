export interface Weapon {
	hit(): string;
}

export interface Warrior {
	fight(): string;
}

export const TYPES = {
	Weapon: Symbol.for("Weapon"),
	Warrior: Symbol.for("Warrior"),
};
