# Frontend Documentation

## Overview

The frontend application is built using React, TypeScript, and Vite, with Tailwind CSS for styling. It provides an interactive visualization dashboard for exploring Canadian vertebrate species at risk data.

## Project Structure

```
app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── services/      # API service functions
│   └── styles/        # Global styles and Tailwind config
├── public/            # Static assets
└── tests/            # Test files
```

## Key Components

### Visualization Components

1. **SpeciesMap**
   - Interactive map showing species distribution
   - Location: `src/components/SpeciesMap.tsx`
   - Props:
     - `data`: Species distribution data
     - `onRegionClick`: Callback for region selection

2. **TrendChart**
   - Line chart showing population trends
   - Location: `src/components/TrendChart.tsx`
   - Props:
     - `data`: Time series data
     - `species`: Selected species

3. **StatusTable**
   - Table showing conservation status
   - Location: `src/components/StatusTable.tsx`
   - Props:
     - `data`: Species status data
     - `onSort`: Sorting callback

## State Management

The application uses React Context for global state management:

```typescript
// src/context/AppContext.tsx
interface AppState {
  selectedSpecies: string | null;
  selectedRegion: string | null;
  timeRange: [Date, Date];
}

const AppContext = createContext<AppState>({...});
```

## API Integration

API calls are handled through service functions:

```typescript
// src/services/api.ts
export const fetchSpeciesData = async (params: QueryParams) => {
  const response = await fetch(`${API_URL}/species`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return response.json();
};
```

## Styling

The application uses Tailwind CSS for styling. Custom styles can be added in:

- `src/styles/globals.css`: Global styles
- `tailwind.config.js`: Tailwind configuration

## Development

### Adding New Components

1. Create a new component file in `src/components/`
2. Export the component:
```typescript
export const NewComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component implementation
};
```

### Running Tests

```bash
npm run test
# or
yarn test
```

### Building for Production

```bash
npm run build
# or
yarn build
```

## Best Practices

1. **Component Structure**
   - Keep components small and focused
   - Use TypeScript interfaces for props
   - Implement proper error handling

2. **Performance**
   - Use React.memo for expensive components
   - Implement proper loading states
   - Optimize re-renders

3. **Accessibility**
   - Use semantic HTML
   - Implement ARIA attributes
   - Ensure keyboard navigation

## Common Issues and Solutions

1. **Build Errors**
   - Clear the build cache: `npm run clean`
   - Check TypeScript errors: `npm run type-check`

2. **Performance Issues**
   - Use React DevTools to profile components
   - Implement code splitting for large components
   - Optimize image assets

3. **Styling Conflicts**
   - Use BEM naming convention
   - Leverage Tailwind's @apply directive
   - Keep styles modular

## Contributing

1. Follow the component structure
2. Write tests for new features
3. Update documentation
4. Follow the TypeScript guidelines 