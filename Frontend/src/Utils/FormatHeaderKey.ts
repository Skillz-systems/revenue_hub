export default function formatHeaderKey(key: string, removeId: boolean = true): string {
    const result= key
      .split('_')
      .filter(word => !removeId || word !== 'id')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      console.log(result)
      console.log("key",key)
      return result
  }
  
  // Usage:
  const keys = ['id', 'name', 'cadastral_zone_id'];
  const formattedHeaders = keys.map(key => formatHeaderKey(key, true));
  console.log(formattedHeaders);
  // Output: ['Id', 'Name', 'Cadastral Zone']
  
  const formattedHeadersWithId = keys.map(key => formatHeaderKey(key, false));
  console.log(formattedHeadersWithId);
  // Output: ['Id', 'Name', 'Cadastral Zone Id']


