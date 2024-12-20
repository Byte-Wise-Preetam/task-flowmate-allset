// components/SEO.jsx
import { Helmet } from 'react-helmet-async';

function SEO({ title, description, keywords, noindex }) {
  return (
    <Helmet>
      <title>{title ? `${title} | FlowMate` : 'Streamline team task management with FlowMate'}</title>
      
      <meta name="description" content={description} />
      
      {keywords && <meta name="keywords" content={keywords} />}
      
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

export default SEO;