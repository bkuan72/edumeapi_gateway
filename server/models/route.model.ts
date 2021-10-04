/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { routes_schema, routes_schema_table } from '../../schemas/routes.schema';
import { RouteDTO } from '../../dtos/routes.DTO';
import { EntityModel } from './entity.model';
import { PropertyModel } from './property.model';

export class RouteModel extends EntityModel {
  properties: PropertyModel;
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = routes_schema_table;
    }
    this.requestDTO = RouteDTO;
    this.responseDTO = RouteDTO;
    this.schema = routes_schema;
  }

}