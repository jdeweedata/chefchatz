# ChefChatz API Documentation

## Prerequisites
- Complete 4-userflow.md
- User flows and interactions defined
- Authentication system operational
- Database schema finalized
- Error handling strategy established

## Overview
This document details all API endpoints, request/response formats, and authentication requirements for the ChefChatz platform.

## Base URL
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api/v1';
```

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```typescript
headers: {
  'Authorization': `Bearer ${session.access_token}`,
  'Content-Type': 'application/json'
}
```

## Endpoints

### Authentication
```typescript
interface AuthEndpoints {
  '/auth/login': {
    POST: {
      body: { email: string; password: string };
      response: { user: User; session: Session };
    };
  };
  '/auth/register': {
    POST: {
      body: { email: string; password: string; username: string };
      response: { user: User; session: Session };
    };
  };
  '/auth/logout': {
    POST: {
      response: { success: boolean };
    };
  };
}
```

### User Management
```typescript
interface UserEndpoints {
  '/user/profile': {
    GET: {
      response: UserProfile;
    };
    PUT: {
      body: Partial<UserProfile>;
      response: UserProfile;
    };
  };
  '/user/preferences': {
    GET: {
      response: UserPreferences;
    };
    PUT: {
      body: Partial<UserPreferences>;
      response: UserPreferences;
    };
  };
}
```

### Chat & Recipe Generation
```typescript
interface ChatEndpoints {
  '/chat/conversation': {
    POST: {
      body: {
        message: string;
        context?: ConversationContext;
      };
      response: {
        reply: string;
        suggestions?: Recipe[];
        context: ConversationContext;
      };
    };
  };
  '/chat/recipe': {
    POST: {
      body: {
        ingredients?: string[];
        preferences?: UserPreferences;
        restrictions?: string[];
      };
      response: {
        recipe: Recipe;
        alternatives?: Ingredient[];
      };
    };
  };
}
```

### Recipe Management
```typescript
interface RecipeEndpoints {
  '/recipes': {
    GET: {
      query: {
        page?: number;
        limit?: number;
        filter?: RecipeFilter;
      };
      response: {
        recipes: Recipe[];
        total: number;
        hasMore: boolean;
      };
    };
    POST: {
      body: NewRecipe;
      response: Recipe;
    };
  };
  '/recipes/:id': {
    GET: {
      response: Recipe;
    };
    PUT: {
      body: Partial<Recipe>;
      response: Recipe;
    };
    DELETE: {
      response: { success: boolean };
    };
  };
}
```

## Rate Limiting
```typescript
interface RateLimits {
  '/api/chat/*': {
    window: '1m',
    max: 60
  };
  '/api/recipes/*': {
    window: '1m',
    max: 120
  };
}
```

## Error Responses
```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  status: number;
}

const ErrorCodes = {
  UNAUTHORIZED: 'auth/unauthorized',
  INVALID_INPUT: 'validation/invalid-input',
  NOT_FOUND: 'resource/not-found',
  RATE_LIMITED: 'quota/rate-limited',
  SERVER_ERROR: 'server/internal-error'
} as const;
```

## Versioning
- API version included in URL path (/api/v1/...)
- Breaking changes trigger version increment
- Deprecation notices provided 6 months in advance

## Integration Examples

### TypeScript Client
```typescript
class ChefChatzAPI {
  constructor(private baseUrl: string, private token?: string) {}

  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}/user/profile`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': this.token ? `Bearer ${this.token}` : '',
      'Content-Type': 'application/json'
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error);
    }
    return response.json();
  }
}
```

## Security Requirements
- All endpoints use HTTPS
- JWT tokens required for protected routes
- CORS configured for allowed origins
- Rate limiting enforced
- Input validation on all endpoints

## Implementation Verification
- [ ] All endpoints documented with request/response formats
- [ ] Authentication requirements specified for each endpoint
- [ ] Rate limiting rules implemented and tested
- [ ] Error responses standardized
- [ ] API versioning strategy documented
- [ ] Integration examples provided
- [ ] Security measures implemented
- [ ] CORS configuration tested
- [ ] Input validation rules defined
- [ ] Performance requirements met

## Completion Requirements
1. All API endpoints fully documented
2. Security measures implemented and tested
3. Rate limiting configured and verified
4. Integration examples provided and tested
5. Error handling standardized across endpoints

### Sign-off Checklist
- [ ] API documentation reviewed by tech lead
- [ ] Security measures approved by security team
- [ ] Rate limiting tested under load
- [ ] Integration examples verified by frontend team
- [ ] Error handling tested for all scenarios
- [ ] Performance requirements validated
- [ ] Documentation updated in Swagger/OpenAPI
- [ ] API versioning strategy approved
- [ ] CORS configuration verified
- [ ] Client SDK documentation complete

NO PROCEEDING until all items verified complete.
``` 