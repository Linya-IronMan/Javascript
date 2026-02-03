// main.ts
import "reflect-metadata";
import { myContainer } from "./inversify/config";
import { TYPES, Warrior } from "./model/interfaces";

// 只需要问容器要“勇士”，容器会自动帮你 new 出 Katana 并塞进 Ninja 里
const ninja = myContainer.get<Warrior>(TYPES.Warrior);

console.log(ninja.fight()); // 输出: 使用武士刀攻击！
