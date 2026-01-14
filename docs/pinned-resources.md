# Pinned Resources in Collections

This document describes the "Pinned Resources" feature in the frontend application.

## Feature Overview

Pinned resources allow specific items to be prioritized and displayed at the top of a collection. Regardless of the creation date or other sorting criteria of standard resources, pinned items will always appear first.

## Data Structure

The API endpoint for fetching collection resources (`GET /resources/collection/:collectionId`) includes a specific key for pinned resources in its response data.

```typescript
interface GetResourcesResponseData {
  // Pinned resources are returned separately from the main paginated list
  pinnedResources: {
    id: string; // The ID of the pin association
    order: number; // The display order (lower numbers first)
    resource: Resource; // The full resource object (Pin, PinGroup, etc.)
  }[];

  // Standard paginated resources
  resources: Resource[];

  // Pagination metadata for the standard resources
  pagination: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
```

## Frontend Behavior

### Rendering Order

The `ResourcesDisplay` component is responsible for rendering the list of resources. The rendering logic prioritizes pinned resources as follows:

1.  **Pinned Resources**: The application renders all items from the `pinnedResources` array first. They are displayed in the order defined by their `order` property (ascending).
2.  **Regular Resources**: Immediately following the pinned resources, the application renders the standard `resources` list.

### Infinite Scroll Interaction

The infinite scroll functionality applies to the `resources` array. Pinned resources are typically loaded with the initial fetch (first page). As the user scrolls down:

- Pinned resources remain at the top.
- Additional regular resources are loaded and appended to the bottom of the list.
