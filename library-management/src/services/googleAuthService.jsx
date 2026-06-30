


export function handleGoogleToken(credential) {
  
  const fakeUser = {
  
  };

  const token = btoa(JSON.stringify(fakeUser));
  return { token };
}
