import { Plate } from "@prisma/client";
import { BaseRepository } from "../core/BaseRepository";
import prismaCTL from "../models/prismaClient";

class PlateRepository extends BaseRepository<Plate> {
  constructor() {
    super(prismaCTL.plate);
  }
}

export default PlateRepository;
