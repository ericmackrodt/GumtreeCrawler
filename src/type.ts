export type GumtreeSearch = {
  url: string;
};

export type GumtreeAd = {
  id: string;
  title: string;
  price: string;
  location: string;
  url: string;
  garbage?: boolean;
  seen?: boolean;
  favorite?: boolean;
};
