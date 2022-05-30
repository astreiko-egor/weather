export const parseUrl = (url: string) => {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params = {} as {
    [key: string]: string;
  };
  let match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }

  return params;
};
