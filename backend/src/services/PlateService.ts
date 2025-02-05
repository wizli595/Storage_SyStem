import { Plate } from "@prisma/client";
import { BaseService } from "../core/BaseService";
import PlateRepository from "../repositories/PlateRepesitory";

class PlateService extends BaseService<Plate, PlateRepository> {
  constructor() {
    super(new PlateRepository());
  }
}

export default PlateService;
