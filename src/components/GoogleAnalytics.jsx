import Script from 'next/script'

export default function GoogleAnalytics() {
    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-715XV3JGBX"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    
                    // Base configuration
                    gtag('config', 'G-715XV3JGBX', {
                        page_path: window.location.pathname,
                        custom_map: {
                            'dimension1': 'user_type',
                            'dimension2': 'client_type'
                        }
                    });

                    // Set up conversion tracking
                    gtag('set', {
                        'currency': 'USD',
                        'country': 'ET'
                    });

                    // Track user engagement time
                    let startTime = new Date();
                    window.addEventListener('beforeunload', () => {
                        const endTime = new Date();
                        const timeSpent = (endTime - startTime) / 1000;
                        gtag('event', 'user_engagement', {
                            'engagement_time': timeSpent
                        });
                    });
                `}
            </Script>
        </>
    )
} 