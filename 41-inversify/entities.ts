// entities.ts

import { inject, injectable } from "inversify";
import { TYPES, Warrior, Weapon } from "./model/interfaces";

@injectable()
class Katana implements Weapon {
	public hit() {
		return "使用武士刀攻击";
	}
}

@injectable()
class Shuriken implements Weapon {
	public hit() {
		return "投掷手里剑";
	}
}

@injectable()
class Ninja implements Warrior {
	private _weapon: Weapon;
	constructor(@inject(TYPES.Weapon) weapon: Weapon) {
		this._weapon = weapon;
	}

	public fight() {
		return this._weapon.hit();
	}
}
export { Katana, Ninja, Shuriken };
