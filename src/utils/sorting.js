export const sortListingsData = (listings, sortField, sortDirection) => {
  // Create a shallow copy so we never accidentally mutate the original state
  return [...listings].sort((a, b) => {
    let valA, valB;
    let isEmptyA = false;
    let isEmptyB = false;

    // Normalize values based on the selected field
    switch (sortField) {
      case 'Price':
        valA = parseFloat(a.price);
        valB = parseFloat(b.price);
        isEmptyA = isNaN(valA);
        isEmptyB = isNaN(valB);
        break;
      case 'Title':
        valA = (a.title || '').toLowerCase().trim();
        valB = (b.title || '').toLowerCase().trim();
        isEmptyA = !valA;
        isEmptyB = !valB;
        break;
      case 'Subject':
        valA = (a.subject || '').toLowerCase().trim();
        valB = (b.subject || '').toLowerCase().trim();
        isEmptyA = !valA;
        isEmptyB = !valB;
        break;
      case 'Date':
      default:
        valA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
        valB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
        break;
    }

    // Always push empty fields to the bottom
    if (isEmptyA && !isEmptyB) return 1;
    if (!isEmptyA && isEmptyB) return -1;
    if (isEmptyA && isEmptyB) return 0;

    // Perform the final comparison
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};
