import { schemaIfc } from '../modules/DbModule';
import DTOGenerator from '../modules/ModelGenerator';

export const routes_schema_table = 'routes';

export const routes_schema: schemaIfc[] = [
  {    fieldName: 'id',
    sqlType: 'BINARY(16) PRIMARY KEY',
    primaryKey: true,
    default: '',
    uuidProperty: true,
    excludeFromUpdate: true,
    description: 'unique record identifier'
  },
  {    fieldName: 'site_code',
  sqlType: 'VARCHAR(20)',
  size: 20,
  allowNull: false,
  default: '',
  excludeFromUpdate: true,
  trim: true,
  description: 'website identifier'
  },
  {    fieldName: 'status',
    sqlType: 'ENUM',
    size: 10,
    enum: ['OK',
        'DELETED'
        ],
    default: 'OK',
    description: 'Status of record'
  },
  {    fieldName: 'url',
  sqlType: 'VARCHAR',
  size: 256,
  allowNull: false,
  default: '',
  excludeFromUpdate: true,
  trim: true,
  description: 'route identifier url'
  },
  {
    fieldName: 'auth',
    sqlType: 'BOOLEAN',
    default: '0',
    excludeFromUpdate: false,
    description: 'authorization required'
  },
  {
    fieldName: 'license_check',
    sqlType: 'BOOLEAN',
    default: '0',
    excludeFromUpdate: false,
    description: 'license check required'
  },
  {
    fieldName: 'rate_limit',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: false,
    description: 'request rate limit'
  },
  {    fieldName: 'proxy_target',
  sqlType: 'VARCHAR',
  size: 256,
  allowNull: true,
  excludeFromUpdate: false,
  trim: true,
  description: 'proxy target'
  },
  {
    fieldName: 'proxy_change_origin',
    sqlType: 'INT',
    default: '0',
    excludeFromUpdate: false,
    description: 'change url origin'
  },
  {    fieldName: 'proxy_path_rewrite',
  sqlType: 'VARCHAR',
  size: 256,
  allowNull: true,
  excludeFromUpdate: false,
  trim: true,
  description: 'proxy path rewrite'
  },
  {    fieldName: 'lastUpdateUsec',
  sqlType: 'BIGINT',
  default: '0',
  excludeFromUpdate: true,
  description: 'last update timestamp'
  },
  {    fieldName: 'INDEX',
    sqlType: undefined,
    index: [
      {
        name: 'routes_url_idx',
        columns: ['site_code', 'url'],
        unique: true
      },
      {
        name: 'last_upd_usec_idx',
        columns: [ 'site_code', 'lastUpdateUsec'],
        unique: false
      }
    ]
  }
];

const routeSchemaModel = DTOGenerator.genSchemaModel(routes_schema);
export type RouteData = typeof routeSchemaModel;