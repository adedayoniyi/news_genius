/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "platform.theverge.com",
            "dims.apnews.com",
            "images.axios.com",
            "image.cnbcfm.com",
            "npr.brightspotcdn.com",
            "s.yimg.com",
            "biztoc.com",
            "www.ft.com",
            "krebsonsecurity.com",
            "heise.cloudimg.io",
            "www.journaldugeek.com",
            "media.cnn.com",
            "ichef.bbci.co.uk",
            "assets.bwbx.io",
            "static.reuters.com",
            "images.wsj.net",
            "static01.nyt.com"
        ],
    },
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    experimental: {
        optimizeFonts: true,
        scrollRestoration: true,
    }
};

export default nextConfig;
