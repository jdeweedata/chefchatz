# ChefChatz State Management

## Prerequisites
- Complete 7-deploy.md
- Application architecture finalized
- Component structure defined
- Data flow patterns established
- Performance requirements documented
- Cache strategy outlined

## Overview
This document outlines the state management patterns, data flow, and caching strategies used throughout the ChefChatz platform.

## State Management Architecture

### Global State
```typescript
// store/index.ts
import { create } from 'zustand';

interface GlobalState {
  user: User | null;
  preferences: UserPreferences;
  activeRecipe: Recipe | null;
  chatContext: ConversationContext;
  
  setUser: (user: User | null) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  setActiveRecipe: (recipe: Recipe | null) => void;
  updateChatContext: (context: Partial<ConversationContext>) => void;
}

export const useStore = create<GlobalState>((set) => ({
  user: null,
  preferences: defaultPreferences,
  activeRecipe: null,
  chatContext: {},
  
  setUser: (user) => set({ user }),
  updatePreferences: (prefs) => 
    set((state) => ({
      preferences: { ...state.preferences, ...prefs }
    })),
  setActiveRecipe: (recipe) => set({ activeRecipe: recipe }),
  updateChatContext: (context) =>
    set((state) => ({
      chatContext: { ...state.chatContext, ...context }
    }))
}));
```

### Server State
```typescript
// hooks/queries.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { useQuery, useMutation } from '@tanstack/react-query';

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const supabase = createServerComponentClient();
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
      return data;
    }
  });
}

export function useUpdateRecipe() {
  return useMutation({
    mutationFn: async (recipe: Recipe) => {
      const supabase = createServerComponentClient();
      const { data } = await supabase
        .from('recipes')
        .update(recipe)
        .eq('id', recipe.id)
        .single();
      return data;
    }
  });
}
```

### Local State
```typescript
// components/RecipeEditor.tsx
interface EditorState {
  title: string;
  ingredients: string[];
  instructions: string[];
  isDirty: boolean;
}

function RecipeEditor() {
  const [state, setState] = useState<EditorState>({
    title: '',
    ingredients: [],
    instructions: [],
    isDirty: false
  });

  const updateTitle = (title: string) => {
    setState(prev => ({
      ...prev,
      title,
      isDirty: true
    }));
  };
}
```

## Data Flow Patterns

### Unidirectional Data Flow
```typescript
interface DataFlow {
  action: {
    type: string;
    payload: any;
  };
  reducer: (state: State, action: Action) => State;
  effect: (state: State) => Promise<void>;
}
```

### State Updates
```typescript
// Example of coordinated state updates
const updateRecipe = async (recipe: Recipe) => {
  // Update optimistically
  setActiveRecipe(recipe);
  
  try {
    // Persist to backend
    await api.updateRecipe(recipe);
    
    // Update cache
    queryClient.setQueryData(['recipes', recipe.id], recipe);
  } catch (error) {
    // Rollback on failure
    setActiveRecipe(previousRecipe);
    showError('Failed to update recipe');
  }
};
```

## Caching Strategy

### Client-Side Cache
```typescript
// config/reactQuery.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
});
```

### Persistence Layer
```typescript
interface CacheConfig {
  localStorage: {
    preferences: true;
    recentRecipes: true;
    chatHistory: {
      maxItems: 50;
      expiry: '24h';
    };
  };
  sessionStorage: {
    formData: true;
    filters: true;
  };
}
```

## State Synchronization

### Real-time Updates
```typescript
// hooks/useRealtimeRecipe.ts
export function useRealtimeRecipe(id: string) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`recipe:${id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'recipes',
        filter: `id=eq.${id}`
      }, (payload) => {
        queryClient.setQueryData(['recipes', id], payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);
}
```

### Offline Support
```typescript
interface OfflineState {
  queue: {
    actions: Action[];
    sync: () => Promise<void>;
  };
  persistence: {
    strategy: 'indexedDB';
    maxSize: '50MB';
  };
}
```

## Performance Optimization

### State Splitting
```typescript
// Example of splitting state for performance
const useUIState = create<UIState>(() => ({
  sidebar: false,
  theme: 'light',
  modal: null
}));

const useDataState = create<DataState>(() => ({
  recipes: [],
  favorites: [],
  history: []
}));
```

### Selective Updates
```typescript
// components/RecipeList.tsx
const RecipeList = memo(function RecipeList({ 
  recipes,
  onSelect 
}: RecipeListProps) {
  return (
    <div>
      {recipes.map(recipe => (
        <RecipeItem
          key={recipe.id}
          recipe={recipe}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
});
```

## Error Handling

### State Recovery
```typescript
interface ErrorState {
  type: 'network' | 'validation' | 'server';
  message: string;
  retryCount: number;
  timestamp: number;
}

const handleError = (error: Error) => {
  setErrorState({
    type: getErrorType(error),
    message: error.message,
    retryCount: 0,
    timestamp: Date.now()
  });
};
```

## State Debugging

### Development Tools
```typescript
if (process.env.NODE_ENV === 'development') {
  // Enable state logging
  useStore.subscribe((state) => {
    console.log('State updated:', state);
  });

  // Enable React Query devtools
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
}
```

## Implementation Verification
- [ ] Global state management implemented
- [ ] Server state handling configured
- [ ] Local state patterns established
- [ ] Data flow documented
- [ ] Caching strategy implemented
- [ ] State synchronization working
- [ ] Offline support tested
- [ ] Performance optimizations verified
- [ ] Error handling tested
- [ ] Development tools configured

## Completion Requirements
1. State management architecture implemented
2. Caching strategy operational
3. Real-time updates functioning
4. Offline support verified
5. Performance requirements met

### Sign-off Checklist
- [ ] Global state patterns reviewed
- [ ] Server state handling approved
- [ ] Local state management verified
- [ ] Data flow patterns validated
- [ ] Caching strategy tested
- [ ] State synchronization confirmed
- [ ] Offline capabilities verified
- [ ] Performance metrics met
- [ ] Error recovery tested
- [ ] Documentation completed

NO PROCEEDING until all items verified complete. 