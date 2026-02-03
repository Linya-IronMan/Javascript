import { Container } from "inversify";
import { TYPES, Warrior, Weapon } from "../model/interfaces";
import { Katana, Ninja, Shuriken } from "../entities";

const myContainer = new Container();

myContainer.bind<Weapon>(TYPES.Weapon).to(Shuriken);
myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja);

export { myContainer };
