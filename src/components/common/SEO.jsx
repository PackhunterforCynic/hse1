import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description = "Havilah Studio creates world-class commercial photography, cinematic ad videos, brand films, and high-impact digital media experiences.", 
  path = "", 
  image = "/icon.svg",
  keywords = "photography, digital media, ad video, commercial video production, creative media agency, cinematic films, digital experiences, Havilah, content creation, brand commercials, studio media, visual production, ad filming, professional photography, social advertising"
}) {
  // Ensure path starts with a slash if provided
  const formattedPath = path && !path.startsWith('/') ? `/${path}` : path;
  const url = `https://havilahpro.com${formattedPath}`;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
