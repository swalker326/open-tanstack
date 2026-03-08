export {
  and,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  like,
  lt,
  lte,
  or,
} from 'drizzle-orm';
export { createDb } from './database';

import * as schema from './schema';

export { userInsertSchema, userSelectSchema } from './zod';
// export type DBType = LibSQLDatabase<typeof schema> & {
//   $client: Client;
// };
export { schema };
