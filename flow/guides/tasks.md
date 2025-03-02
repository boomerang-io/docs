---
title: Developing Tasks
order: 10
---

# Writing Tasks

##

## Migrating from Workers to Tasks

### Upgrade to ESM

Upgrade the node implementation to ESM by changing the `type` in the `package.json` to `module`.

### Replace the old imports

```
const { log, utils } = require("@boomerang-io/worker-core");
```

becomes

```
import { log, params, results, result } from "@boomerang-io/task-core";
```

### Replace the property resolution

Change

```
  const taskProps = utils.resolveInputParameters();
  const { token, team, types } = taskProps;
```

to

```
  const { token, team, types } = params;
```

### Replace the result setting

Change

````

      utils.setOutputParameter("response", JSON.stringify(body));
      ```

      to

      ```
````
