export default function formatHeaderKey(key: string, removeId: boolean = true): string {
    const result= key
      .split('_')
      .filter(word => !removeId || word !== 'id')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
      return result
  }
  
  // Usage:
  const keys = ['id', 'name', 'cadastral_zone_id'];
  const formattedHeaders = keys.map(key => formatHeaderKey(key, true));

  // Output: ['Id', 'Name', 'Cadastral Zone']
  
  const formattedHeadersWithId = keys.map(key => formatHeaderKey(key, false));

  // Output: ['Id', 'Name', 'Cadastral Zone Id']


