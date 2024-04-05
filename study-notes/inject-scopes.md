# Injection Scopes

Similar to Spring with dependency injections and other frameworks, here you also have scopes changes the "live" of your provider

## Types of Scopes

There are three types of scope, they are:

### DEFAULT
``A single instance of the provider is hared across the entire application. Nest cache the instance when application requests for the second time.``

### REQUEST
``A new instance of the provider is created exclusively for each incoming request``

### TRANSIENT
``Transient providers are not shared across consumers. Each consumer that injects a transient provider will receive a new, dedicated instance``

## How to use scopes?

It's really simple, you just need to include value to the scope, example:

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({
    scope: Scope.TRANSIENT
})

export class SongsService {
    ...
}
```

By doing it we will have a single service for each consumer.

### Unique cases

You can have unique cases, specially for controllers:

```typescript
@Controller({
    path: 'songs',
    scope: Scope.REQUEST
})
export class SongsController {}
```

By doing that it will create a controller for each request.