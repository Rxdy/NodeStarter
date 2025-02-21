import { v7 as uuidv7 } from "uuid";

class UUID{
  v7(): string{
    return uuidv7();
  };
}

export default new UUID();
