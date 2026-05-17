import { useCMS } from "../hooks/useCMS";
import { useSEO } from "../hooks/useSEO";

const SEOHead = () => {
  const { cmsData, lang } = useCMS();
  useSEO(cmsData, lang);
  return null;
};

export default SEOHead;
